function getCarbonBrushPointHistory(item, pointKey) {
  const targetEquipmentKey = normalizeCarbonBrushEquipmentForType(item.equipmentName || "");
  return getServiceItemsFromDom()
    .filter((entry) =>
      entry.formType === "service-motor-mv-carbon-brush"
      && normalizeCarbonBrushEquipmentForType(entry.equipmentName || "") === targetEquipmentKey)
    .map((entry) => {
      const payload = entry.payload || {};
      const inspectionDate = parseInspectionDateValue(payload.inspectionDate);
      const rawValue = String(payload.measurements?.[pointKey] || "").trim();
      const numericValue = parseCarbonBrushNumericValue(rawValue);
      const bucket = classifyCarbonBrushValue(rawValue, entry.equipmentName || "", payload.plant || "");
      const replacementValue = parseCarbonBrushNumericValue(payload.replacement);
      const replacedConfirmed = normalizeCarbonBrushReplacedPoints(payload.replacedPoints).includes(pointKey);
      return {
        id: entry.id,
        inspectionDate,
        inspectionDateLabel: formatInspectionDate(payload.inspectionDate),
        rawValue,
        numericValue,
        bucket,
        replacementValue,
        replacedConfirmed,
        pic: payload.pic || "-",
      };
    })
    .filter((entry) => entry.inspectionDate)
    .sort((left, right) => left.inspectionDate - right.inspectionDate);
}

function getCarbonBrushMeggerHistory(item) {
  const targetEquipmentKey = normalizeCarbonBrushEquipmentForType(item.equipmentName || "");
  return getServiceItemsFromDom()
    .filter((entry) =>
      entry.formType === "service-motor-mv-carbon-brush"
      && normalizeCarbonBrushEquipmentForType(entry.equipmentName || "") === targetEquipmentKey)
    .map((entry) => {
      const payload = entry.payload || {};
      const inspectionDate = parseInspectionDateValue(payload.inspectionDate);
      const rawValue = String(payload.megger || "").trim();
      const numericValue = parseCarbonBrushNumericValue(rawValue);
      return {
        id: entry.id,
        inspectionDate,
        inspectionDateLabel: formatInspectionDate(payload.inspectionDate),
        rawValue,
        numericValue,
        pic: payload.pic || "-",
      };
    })
    .filter((entry) => entry.inspectionDate)
    .sort((left, right) => left.inspectionDate - right.inspectionDate);
}

function getMedianValue(values) {
  const numericValues = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);
  if (!numericValues.length) {
    return null;
  }
  const middleIndex = Math.floor(numericValues.length / 2);
  if (numericValues.length % 2 === 1) {
    return numericValues[middleIndex];
  }
  return (numericValues[middleIndex - 1] + numericValues[middleIndex]) / 2;
}

function getCarbonBrushElapsedDaysSince(inspectionDate) {
  if (!(inspectionDate instanceof Date) || Number.isNaN(inspectionDate.getTime())) {
    return 0;
  }
  const startDate = new Date(inspectionDate.getFullYear(), inspectionDate.getMonth(), inspectionDate.getDate());
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const elapsedDays = getDaysBetweenDates(startDate, todayStart);
  return Math.max(0, elapsedDays || 0);
}

function classifyCarbonBrushPredictionQuality(recentIntervals) {
  if (!Array.isArray(recentIntervals) || recentIntervals.length < 3) {
    return {
      key: "insufficient",
      label: "Belum cukup histori",
      className: "is-monitor",
      note: "Butuh minimal 3 interval valid agar prediksi laju aus layak dipakai.",
    };
  }
  const gapDays = recentIntervals
    .map((entry) => Number(entry?.gapDays))
    .filter((value) => Number.isFinite(value) && value > 0);
  const wearRates = recentIntervals
    .map((entry) => Number(entry?.wearRatePerDay))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (gapDays.length < 3 || wearRates.length < 3) {
    return {
      key: "insufficient",
      label: "Belum cukup histori",
      className: "is-monitor",
      note: "Butuh minimal 3 interval valid agar prediksi laju aus layak dipakai.",
    };
  }

  const maxGap = Math.max(...gapDays);
  const minGap = Math.min(...gapDays);
  const gapSpread = maxGap - minGap;
  const maxWearRate = Math.max(...wearRates);
  const minWearRate = Math.min(...wearRates);
  const wearRatio = minWearRate > 0 ? maxWearRate / minWearRate : Number.POSITIVE_INFINITY;

  if (maxGap > 75 || gapSpread > 45 || wearRatio > 3.5) {
    return {
      key: "low",
      label: "Prediksi lemah",
      className: "is-critical",
      note: "Jarak histori terlalu panjang atau laju aus terlalu melonjak, jadi countdown perlu dibaca hati-hati.",
    };
  }
  if (maxGap > 45 || gapSpread > 28 || wearRatio > 2.25) {
    return {
      key: "medium",
      label: "Prediksi cukup",
      className: "is-prepare",
      note: "Countdown sudah bisa dibaca, tetapi histori masih cukup fluktuatif dan perlu verifikasi rutin.",
    };
  }
  return {
    key: "high",
    label: "Prediksi stabil",
    className: "is-monitor",
    note: "Laju aus 3 interval terakhir cukup rapat dan konsisten untuk dijadikan countdown operasional.",
  };
}

function classifyCarbonBrushActualStatus(currentValue, thresholdLow, thresholdHigh) {
  if (currentValue === null) {
    return {
      label: "Belum ada angka",
      className: "is-monitor",
      actionLabel: "Lengkapi pengukuran aktual titik ini",
      severity: 0,
    };
  }
  if (currentValue < thresholdLow) {
    return {
      label: "Melewati limit",
      className: "is-critical",
      actionLabel: "Titik ini sudah prioritas aktual untuk rawmill off",
      severity: 3,
    };
  }
  if (currentValue < thresholdHigh) {
    return {
      label: "Dekat limit",
      className: "is-prepare",
      actionLabel: "Persiapkan sparepart berdasarkan titik yang masuk range planning",
      severity: 2,
    };
  }
  return {
    label: "Masih aman",
    className: "is-monitor",
    actionLabel: "Tetap monitor sambil lihat arah countdown",
    severity: 0,
  };
}

function isCarbonBrushPredictionUsable(analysis) {
  const qualityKey = analysis?.predictionQuality?.key || "insufficient";
  return qualityKey === "high" || qualityKey === "medium";
}

function getCarbonBrushAlertPriority(analysis) {
  if (analysis?.latestReplacedConfirmed) {
    return {
      actualSeverity: 0,
      predictionSeverity: 0,
      hasAlert: false,
    };
  }
  const actualSeverity = analysis?.actualStatus?.severity ?? 0;
  const predictionSeverity = isCarbonBrushPredictionUsable(analysis)
    ? (analysis?.predictionStatus?.severity ?? 0)
    : 0;
  return {
    actualSeverity,
    predictionSeverity,
    hasAlert: actualSeverity > 0 || predictionSeverity > 0,
  };
}

function getCarbonBrushDisplayStatus(analysis) {
  const priority = getCarbonBrushAlertPriority(analysis);
  if (priority.actualSeverity > 0) {
    return {
      ...(analysis.actualStatus || {}),
      source: "actual",
      sourceLabel: "Aktual",
    };
  }
  if (priority.predictionSeverity > 0) {
    return {
      ...(analysis.predictionStatus || {}),
      label: `Prediksi ${analysis.predictionStatus?.label || "Monitor"}`,
      source: "prediction",
      sourceLabel: "Prediksi",
    };
  }
  return {
    ...(analysis.actualStatus || {}),
    source: "monitor",
    sourceLabel: "Monitor",
  };
}

function getCarbonBrushCycleResetReason(previous, current, threshold) {
  if (current?.replacedConfirmed) {
    return "Titik ditandai diganti";
  }
  if (!previous || previous.numericValue === null || current?.numericValue === null) {
    return "";
  }

  const valueIncrease = current.numericValue - previous.numericValue;

  if (valueIncrease >= 3) {
    return "Indikasi nilai titik naik setelah penggantian";
  }
  return "";
}

function analyzeCarbonBrushPointWear(item, pointKey) {
  const history = getCarbonBrushPointHistory(item, pointKey).filter((entry) => entry.numericValue !== null);
  const threshold = getCarbonBrushThresholdConfig(item.equipmentName || "", item.payload?.plant || "");
  const currentRawValue = String(item.payload?.measurements?.[pointKey] || "").trim();
  const currentValue = parseCarbonBrushNumericValue(currentRawValue);
  const latestReplacedConfirmed = normalizeCarbonBrushReplacedPoints(item.payload?.replacedPoints).includes(pointKey);
  const remainingMm = currentValue === null ? null : currentValue - threshold.low;
  const actualStatus = latestReplacedConfirmed
    ? {
      label: "Sudah ditandai diganti",
      className: "is-monitor",
      actionLabel: "Alert titik ini direset dari inspeksi terbaru",
      severity: 0,
    }
    : classifyCarbonBrushActualStatus(currentValue, threshold.low, threshold.high);
  if (history.length < 4) {
    return {
      pointKey,
      history,
      validIntervals: [],
      recentIntervals: [],
      cycleResetEvents: [],
      medianWearRate: null,
      currentValue,
      remainingMm,
      countdownDays: null,
      thresholdLow: threshold.low,
      thresholdHigh: threshold.high,
      hasEnoughHistory: false,
      latestReplacedConfirmed,
      currentBucket: currentValue === null ? "" : classifyCarbonBrushValue(String(currentValue), item.equipmentName || "", item.payload?.plant || ""),
      actualStatus,
      predictionQuality: classifyCarbonBrushPredictionQuality([]),
      predictionStatus: classifyCarbonBrushCountdownStatus(null),
    };
  }

  let currentCycleHistory = history.length ? [history[0]] : [];
  let currentCycleIntervals = [];
  let cycleResetEvents = [];
  for (let index = 1; index < history.length; index += 1) {
    const previous = history[index - 1];
    const current = history[index];
    const resetReason = getCarbonBrushCycleResetReason(previous, current, threshold);
    if (resetReason) {
      cycleResetEvents.push({
        date: current.inspectionDate,
        dateLabel: current.inspectionDateLabel,
        pointKey,
        previousValue: previous.numericValue,
        currentValue: current.numericValue,
        increase: current.numericValue - previous.numericValue,
        confirmed: Boolean(current.replacedConfirmed),
        reason: resetReason,
      });
      currentCycleHistory = [current];
      currentCycleIntervals = [];
      continue;
    }
    const gapDays = getDaysBetweenDates(previous.inspectionDate, current.inspectionDate);
    const wearMm = previous.numericValue - current.numericValue;
    currentCycleHistory.push(current);
    if (!gapDays || gapDays <= 0 || wearMm <= 0) {
      continue;
    }
    currentCycleIntervals.push({
      from: previous,
      to: current,
      gapDays,
      wearMm,
      wearRatePerDay: wearMm / gapDays,
    });
  }

  const recentIntervals = currentCycleIntervals.slice(-3);
  const latestCycleValue = currentValue;
  const medianWearRate = recentIntervals.length >= 3 ? getMedianValue(recentIntervals.map((entry) => entry.wearRatePerDay)) : null;
  const latestRemainingMm = latestCycleValue === null ? null : latestCycleValue - threshold.low;
  const latestInspectionDate = history[history.length - 1]?.inspectionDate || null;
  const daysSinceLatestInspection = getCarbonBrushElapsedDaysSince(latestInspectionDate);
  const predictionQuality = classifyCarbonBrushPredictionQuality(recentIntervals);
  const baselineCountdownDays = latestReplacedConfirmed || latestRemainingMm === null
    ? null
    : latestRemainingMm <= 0
      ? 0
      : medianWearRate && medianWearRate > 0
        ? Math.max(0, Math.ceil(latestRemainingMm / medianWearRate))
        : null;
  const countdownDays = baselineCountdownDays === null
    ? null
    : Math.max(0, baselineCountdownDays - daysSinceLatestInspection);
  const projectedRemainingMm = medianWearRate && latestRemainingMm !== null
    ? Math.max(0, latestRemainingMm - (medianWearRate * daysSinceLatestInspection))
    : latestRemainingMm;
  const predictionStatus = classifyCarbonBrushCountdownStatus(countdownDays, predictionQuality.key);

  return {
    pointKey,
    history: currentCycleHistory,
    validIntervals: currentCycleIntervals,
    recentIntervals,
    cycleResetEvents,
    medianWearRate,
    currentValue: latestCycleValue,
    remainingMm: latestRemainingMm,
    projectedRemainingMm,
    baselineCountdownDays,
    countdownDays,
    daysSinceLatestInspection,
    latestInspectionDate,
    thresholdLow: threshold.low,
    thresholdHigh: threshold.high,
    hasEnoughHistory: recentIntervals.length >= 3,
    latestReplacedConfirmed,
    currentBucket: latestCycleValue === null ? "" : classifyCarbonBrushValue(String(latestCycleValue), item.equipmentName || "", item.payload?.plant || ""),
    actualStatus,
    predictionQuality,
    predictionStatus,
  };
}

function classifyCarbonBrushCountdownStatus(countdownDays, qualityKey = "insufficient") {
  const config = getCarbonBrushAlertConfig();
  if (countdownDays === null || qualityKey === "insufficient") {
    return {
      label: "Belum cukup histori",
      className: "is-monitor",
      actionLabel: "Lengkapi histori titik",
      severity: 0,
    };
  }
  if (countdownDays <= config.criticalDays) {
    return {
      label: "Critical",
      className: "is-critical",
      actionLabel: "Prioritaskan rawmill off terdekat",
      severity: 3,
    };
  }
  if (countdownDays <= config.urgentDays) {
    return {
      label: "Urgent",
      className: "is-urgent",
      actionLabel: "Koordinasikan window off mulai sekarang",
      severity: 2,
    };
  }
  if (countdownDays <= config.prepareDays) {
    return {
      label: "Prepare",
      className: "is-prepare",
      actionLabel: "Persiapkan sparepart berdasarkan titik yang masuk range planning",
      severity: 1,
    };
  }
  return {
    label: "Monitor",
    className: "is-monitor",
    actionLabel: "Lanjutkan monitoring periodik",
    severity: 0,
  };
}

function buildCarbonBrushAlertSummary(serviceItems) {
  const latestByEquipment = new Map();
  serviceItems
    .filter((item) => item.formType === "service-motor-mv-carbon-brush")
    .forEach((item) => {
      const key = String(item.equipmentName || "").trim().toUpperCase();
      if (!key) {
        return;
      }
      const currentTime = new Date(item.payload?.inspectionDate || 0).getTime() || 0;
      const existing = latestByEquipment.get(key);
      const existingTime = new Date(existing?.payload?.inspectionDate || 0).getTime() || 0;
      if (!existing || currentTime >= existingTime) {
        latestByEquipment.set(key, item);
      }
    });

  return [...latestByEquipment.values()]
    .map((item) => {
      const pointAnalyses = carbonBrushMeasurementKeys
        .map((pointKey) => analyzeCarbonBrushPointWear(item, pointKey))
        .filter((analysis) => analysis.currentValue !== null);
      if (!pointAnalyses.length) {
        return null;
      }
      const alertPointAnalyses = pointAnalyses.filter((analysis) => getCarbonBrushAlertPriority(analysis).hasAlert);
      if (!alertPointAnalyses.length) {
        return null;
      }
      const worstPoint = [...alertPointAnalyses].sort((left, right) => {
        const leftPriority = getCarbonBrushAlertPriority(left);
        const rightPriority = getCarbonBrushAlertPriority(right);
        if (rightPriority.actualSeverity !== leftPriority.actualSeverity) {
          return rightPriority.actualSeverity - leftPriority.actualSeverity;
        }
        if (rightPriority.predictionSeverity !== leftPriority.predictionSeverity) {
          return rightPriority.predictionSeverity - leftPriority.predictionSeverity;
        }
        if ((left.remainingMm ?? Number.MAX_SAFE_INTEGER) !== (right.remainingMm ?? Number.MAX_SAFE_INTEGER)) {
          return (left.remainingMm ?? Number.MAX_SAFE_INTEGER) - (right.remainingMm ?? Number.MAX_SAFE_INTEGER);
        }
        return (left.countdownDays ?? Number.MAX_SAFE_INTEGER) - (right.countdownDays ?? Number.MAX_SAFE_INTEGER);
      })[0];
      const planningBaseDays = worstPoint.countdownDays !== null ? worstPoint.countdownDays : 0;
      const planningPoints = pointAnalyses
        .filter((analysis) =>
          analysis.pointKey !== worstPoint.pointKey
          && !analysis.latestReplacedConfirmed
          && analysis.countdownDays !== null
          && analysis.countdownDays >= planningBaseDays
          && analysis.countdownDays <= planningBaseDays + 30
          && isCarbonBrushPredictionUsable(analysis))
        .sort((left, right) => {
          if ((left.countdownDays ?? Number.MAX_SAFE_INTEGER) !== (right.countdownDays ?? Number.MAX_SAFE_INTEGER)) {
            return (left.countdownDays ?? Number.MAX_SAFE_INTEGER) - (right.countdownDays ?? Number.MAX_SAFE_INTEGER);
          }
          return String(left.pointKey || "").localeCompare(String(right.pointKey || ""));
        })
        .slice(0, 8);
      return {
        item,
        worstPoint,
        status: worstPoint.actualStatus,
        displayStatus: getCarbonBrushDisplayStatus(worstPoint),
        predictionStatus: worstPoint.predictionStatus,
        predictionQuality: worstPoint.predictionQuality,
        planningPoints,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftPriority = getCarbonBrushAlertPriority(left.worstPoint);
      const rightPriority = getCarbonBrushAlertPriority(right.worstPoint);
      if (rightPriority.actualSeverity !== leftPriority.actualSeverity) {
        return rightPriority.actualSeverity - leftPriority.actualSeverity;
      }
      if (rightPriority.predictionSeverity !== leftPriority.predictionSeverity) {
        return rightPriority.predictionSeverity - leftPriority.predictionSeverity;
      }
      if ((left.worstPoint.remainingMm ?? Number.MAX_SAFE_INTEGER) !== (right.worstPoint.remainingMm ?? Number.MAX_SAFE_INTEGER)) {
        return (left.worstPoint.remainingMm ?? Number.MAX_SAFE_INTEGER) - (right.worstPoint.remainingMm ?? Number.MAX_SAFE_INTEGER);
      }
      return (left.worstPoint.countdownDays ?? Number.MAX_SAFE_INTEGER) - (right.worstPoint.countdownDays ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, 5)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
