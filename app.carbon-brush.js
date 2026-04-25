function getCarbonBrushPointHistory(item, pointKey) {
  return getServiceItemsFromDom()
    .filter((entry) =>
      entry.formType === "service-motor-mv-carbon-brush"
      && entry.equipmentName === item.equipmentName)
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
  return getServiceItemsFromDom()
    .filter((entry) =>
      entry.formType === "service-motor-mv-carbon-brush"
      && entry.equipmentName === item.equipmentName)
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
      actionLabel: "Siapkan window rawmill off sebelum titik turun ke merah",
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

function analyzeCarbonBrushPointWear(item, pointKey) {
  const history = getCarbonBrushPointHistory(item, pointKey).filter((entry) => entry.numericValue !== null);
  const threshold = getCarbonBrushThresholdConfig(item.equipmentName || "", item.payload?.plant || "");
  const currentValue = history[history.length - 1]?.numericValue ?? null;
  const remainingMm = currentValue === null ? null : currentValue - threshold.low;
  const actualStatus = classifyCarbonBrushActualStatus(currentValue, threshold.low, threshold.high);
  if (history.length < 4) {
    return {
      pointKey,
      history,
      validIntervals: [],
      recentIntervals: [],
      medianWearRate: null,
      currentValue,
      remainingMm,
      countdownDays: null,
      thresholdLow: threshold.low,
      thresholdHigh: threshold.high,
      hasEnoughHistory: false,
      currentBucket: currentValue === null ? "" : classifyCarbonBrushValue(String(currentValue), item.equipmentName || "", item.payload?.plant || ""),
      actualStatus,
      predictionQuality: classifyCarbonBrushPredictionQuality([]),
      predictionStatus: classifyCarbonBrushCountdownStatus(null),
    };
  }

  let currentCycleHistory = history.length ? [history[0]] : [];
  let currentCycleIntervals = [];
  for (let index = 1; index < history.length; index += 1) {
    const previous = history[index - 1];
    const current = history[index];
    const valueIncrease = current.numericValue - previous.numericValue;
    const valueRaised = valueIncrease >= 3;
    if (current.replacedConfirmed || valueRaised) {
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
  const latestCycleValue = currentCycleHistory[currentCycleHistory.length - 1]?.numericValue ?? history[history.length - 1]?.numericValue ?? null;
  const medianWearRate = recentIntervals.length >= 3 ? getMedianValue(recentIntervals.map((entry) => entry.wearRatePerDay)) : null;
  const latestRemainingMm = latestCycleValue === null ? null : latestCycleValue - threshold.low;
  const predictionQuality = classifyCarbonBrushPredictionQuality(recentIntervals);
  const countdownDays = latestRemainingMm === null
    ? null
    : latestRemainingMm <= 0
      ? 0
      : medianWearRate && medianWearRate > 0
        ? Math.max(0, Math.ceil(latestRemainingMm / medianWearRate))
        : null;
  const predictionStatus = classifyCarbonBrushCountdownStatus(countdownDays, predictionQuality.key);

  return {
    pointKey,
    history: currentCycleHistory,
    validIntervals: currentCycleIntervals,
    recentIntervals,
    medianWearRate,
    currentValue: latestCycleValue,
    remainingMm: latestRemainingMm,
    countdownDays,
    thresholdLow: threshold.low,
    thresholdHigh: threshold.high,
    hasEnoughHistory: recentIntervals.length >= 3,
    currentBucket: latestCycleValue === null ? "" : classifyCarbonBrushValue(String(latestCycleValue), item.equipmentName || "", item.payload?.plant || ""),
    actualStatus: classifyCarbonBrushActualStatus(latestCycleValue, threshold.low, threshold.high),
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
      actionLabel: "Siapkan permintaan service berikutnya",
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
      return {
        item,
        worstPoint,
        status: worstPoint.actualStatus,
        displayStatus: getCarbonBrushDisplayStatus(worstPoint),
        predictionStatus: worstPoint.predictionStatus,
        predictionQuality: worstPoint.predictionQuality,
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
