function syncCarbonBrushAlertBannerDots(activeIndex, totalItems) {
  if (!dashboardCarbonBrushBannerDots) {
    return;
  }
  dashboardCarbonBrushBannerDots.innerHTML = Array.from({ length: totalItems }, (_, index) => `
    <button class="carbon-brush-alert-dot ${index === activeIndex ? "is-active" : ""}" type="button" data-carbon-brush-alert-dot="${index}" aria-label="Tampilkan alert ${index + 1}"></button>
  `).join("");
}

function showCarbonBrushAlertSlide(activeIndex) {
  if (!dashboardCarbonBrushBannerViewport) {
    return;
  }
  const slides = [...dashboardCarbonBrushBannerViewport.querySelectorAll(".carbon-brush-alert-slide")];
  if (!slides.length) {
    return;
  }
  const normalizedIndex = ((activeIndex % slides.length) + slides.length) % slides.length;
  dashboardCarbonBrushAlertIndex = normalizedIndex;
  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === normalizedIndex);
    slide.setAttribute("aria-hidden", index === normalizedIndex ? "false" : "true");
  });
  syncCarbonBrushAlertBannerDots(normalizedIndex, slides.length);
}

function startCarbonBrushAlertRotation(totalItems) {
  if (dashboardCarbonBrushAlertTimer) {
    window.clearInterval(dashboardCarbonBrushAlertTimer);
    dashboardCarbonBrushAlertTimer = null;
  }
  if (totalItems <= 1) {
    return;
  }
  dashboardCarbonBrushAlertTimer = window.setInterval(() => {
    showCarbonBrushAlertSlide(dashboardCarbonBrushAlertIndex + 1);
  }, 4200);
}

function getCarbonBrushPlanningActionText(activeStatus, planningPoints) {
  if (!Array.isArray(planningPoints) || !planningPoints.length) {
    return activeStatus.actionLabel || "Belum ada titik lain yang perlu diganti bersamaan pada service terdekat.";
  }
  const pointText = planningPoints
    .map((point) => `${point.pointKey} (${point.currentValue ?? "-"} mm)`)
    .join(", ");
  return `Persiapkan sparepart dan sekalian ganti titik: ${pointText}`;
}

function renderCarbonBrushCompanionPoints(planningPoints) {
  if (!Array.isArray(planningPoints) || !planningPoints.length) {
    return `
      <div class="carbon-brush-alert-companions is-empty">
        <span class="carbon-brush-alert-companion-empty">Belum ada titik pendamping yang masuk range planning.</span>
      </div>
    `;
  }
  const visiblePoints = planningPoints.slice(0, 5);
  const overflowCount = Math.max(0, planningPoints.length - visiblePoints.length);
  return `
    <div class="carbon-brush-alert-companions">
      ${visiblePoints.map((point) => `
        <span class="carbon-brush-alert-companion-pill">
          <strong>${escapeHtml(point.pointKey)}</strong>
          <small>${escapeHtml(point.currentValue ?? "-")} mm${point.countdownDays !== null ? ` | ${escapeHtml(point.countdownDays)} hari` : " | histori kurang"}</small>
        </span>
      `).join("")}
      ${overflowCount ? `<span class="carbon-brush-alert-companion-more">+${overflowCount} titik lain</span>` : ""}
    </div>
  `;
}

function parseCarbonBrushBannerNumericValue(value) {
  const normalized = String(value || "").trim().replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  return Number(normalized);
}

function getCarbonBrushBannerReplacedPoints(item) {
  const rawPoints = item?.payload?.replacedPoints;
  const points = typeof normalizeCarbonBrushReplacedPoints === "function"
    ? normalizeCarbonBrushReplacedPoints(rawPoints)
    : Array.isArray(rawPoints)
      ? rawPoints
      : String(rawPoints || "").split(/[;,\s]+/);
  return new Set(points.map((point) => String(point || "").trim().toUpperCase()).filter(Boolean));
}

function buildCarbonBrushBannerFallbackSummary(serviceItems) {
  const latestByEquipment = new Map();
  (Array.isArray(serviceItems) ? serviceItems : [])
    .filter((item) => item?.formType === "service-motor-mv-carbon-brush")
    .forEach((item) => {
      const equipmentName = String(item.equipmentName || "").trim();
      if (!equipmentName) {
        return;
      }
      const currentTime = new Date(item.payload?.inspectionDate || 0).getTime() || 0;
      const existing = latestByEquipment.get(equipmentName.toUpperCase());
      const existingTime = new Date(existing?.payload?.inspectionDate || 0).getTime() || 0;
      if (!existing || currentTime >= existingTime) {
        latestByEquipment.set(equipmentName.toUpperCase(), item);
      }
    });

  return [...latestByEquipment.values()]
    .map((item) => {
      const threshold = typeof getCarbonBrushThresholdConfig === "function"
        ? getCarbonBrushThresholdConfig(item.equipmentName || "", item.payload?.plant || "")
        : { low: 30, high: 34, plantLabel: "-", legend: "Merah < 30 | Hijau >= 34" };
      const measurements = item.payload?.measurements && typeof item.payload.measurements === "object"
        ? item.payload.measurements
        : {};
      const replacedPoints = getCarbonBrushBannerReplacedPoints(item);
      const points = Object.entries(measurements)
        .filter(([pointKey]) => !replacedPoints.has(String(pointKey || "").trim().toUpperCase()))
        .map(([pointKey, rawValue]) => ({
          pointKey,
          currentValue: parseCarbonBrushBannerNumericValue(rawValue),
        }))
        .filter((point) => point.currentValue !== null)
        .sort((left, right) => {
          if (left.currentValue !== right.currentValue) {
            return left.currentValue - right.currentValue;
          }
          return left.pointKey.localeCompare(right.pointKey, "id", { numeric: true });
        });
      const worstPoint = points[0];
      if (!worstPoint) {
        return null;
      }
      const remainingMm = worstPoint.currentValue - threshold.low;
      const status = worstPoint.currentValue < threshold.low
        ? { label: "Melewati limit", className: "is-critical", actionLabel: "Prioritaskan rawmill off terdekat" }
        : worstPoint.currentValue < threshold.high
          ? { label: "Dekat limit", className: "is-prepare", actionLabel: "Persiapkan sparepart dan jadwal penggantian" }
          : { label: "Monitor", className: "is-monitor", actionLabel: "Lanjutkan monitoring periodik" };
      return {
        item,
        threshold,
        worstPoint: {
          ...worstPoint,
          remainingMm,
          projectedRemainingMm: remainingMm,
          countdownDays: null,
          daysSinceLatestInspection: 0,
          thresholdLow: threshold.low,
          thresholdHigh: threshold.high,
          thresholdPlantLabel: threshold.plantLabel,
          thresholdLegend: threshold.legend,
          medianWearRate: null,
        },
        status,
        displayStatus: status,
        predictionStatus: { label: "Belum cukup histori" },
        predictionQuality: { label: "Fallback data", note: "Banner memakai measurement terbaru karena perhitungan prediksi tidak tersedia." },
        planningPoints: [],
        secondaryAlertPoints: points.slice(1, 6).map((point) => ({ ...point, countdownDays: null })),
        totalAlertPointCount: Math.max(0, points.length - 1),
        companionPointCount: 0,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftTime = new Date(left?.item?.payload?.inspectionDate || 0).getTime() || 0;
      const rightTime = new Date(right?.item?.payload?.inspectionDate || 0).getTime() || 0;
      return rightTime - leftTime;
    })
    .slice(0, 5)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function normalizeCarbonBrushBackendStatus(status = {}) {
  const key = String(status.key || status.label || "").toLowerCase();
  const className = key.includes("critical") || key.includes("melewati")
    ? "is-critical"
    : key.includes("urgent")
      ? "is-urgent"
      : key.includes("prepare") || key.includes("dekat")
        ? "is-prepare"
        : "is-monitor";
  return {
    ...status,
    className: status.className || className,
    label: status.label || "Monitor",
    actionLabel: status.actionLabel || "Lanjutkan monitoring periodik",
  };
}

function normalizeCarbonBrushBackendAlerts(alertItems) {
  if (!Array.isArray(alertItems) || !alertItems.length) {
    return [];
  }
  return alertItems
    .map((alert, index) => {
      if (!alert || typeof alert !== "object") {
        return null;
      }
      const worstPointSource = alert.worstPoint && typeof alert.worstPoint === "object" ? alert.worstPoint : {};
      const threshold = {
        low: alert.thresholdLow ?? worstPointSource.thresholdLow,
        high: alert.thresholdHigh ?? worstPointSource.thresholdHigh,
        plantLabel: alert.thresholdPlantLabel || alert.thresholdPlant || worstPointSource.thresholdPlantLabel || worstPointSource.thresholdPlant || "-",
        legend: alert.thresholdLegend || worstPointSource.thresholdLegend || "",
      };
      const worstPoint = {
        ...worstPointSource,
        pointKey: alert.pointKey || worstPointSource.pointKey || "-",
        currentValue: alert.currentValue ?? alert.lastMeasurementMm ?? worstPointSource.currentValue ?? null,
        remainingMm: alert.remainingMm ?? worstPointSource.remainingMm ?? null,
        projectedRemainingMm: alert.projectedRemainingMm ?? worstPointSource.projectedRemainingMm ?? null,
        countdownDays: alert.countdownDays ?? worstPointSource.countdownDays ?? null,
        daysSinceLatestInspection: alert.daysSinceLatestInspection ?? worstPointSource.daysSinceLatestInspection ?? 0,
        thresholdLow: threshold.low,
        thresholdHigh: threshold.high,
        thresholdPlantLabel: threshold.plantLabel,
        thresholdLegend: threshold.legend,
        medianWearRate: alert.medianWearRate ?? alert.medianWearRateMmPerDay ?? worstPointSource.medianWearRate ?? null,
      };
      return {
        item: {
          id: alert.serviceId || "",
          equipmentName: alert.equipment || "-",
          payload: {
            inspectionDate: alert.lastInspectionDate || "",
            plant: threshold.plantLabel,
          },
        },
        threshold,
        worstPoint,
        status: normalizeCarbonBrushBackendStatus(alert.status || alert.actualStatus || {}),
        displayStatus: normalizeCarbonBrushBackendStatus(alert.displayStatus || alert.status || alert.actualStatus || {}),
        predictionStatus: normalizeCarbonBrushBackendStatus(alert.predictionStatus || {}),
        predictionQuality: alert.predictionQuality || { label: "Belum cukup histori" },
        planningPoints: Array.isArray(alert.secondaryPoints) ? alert.secondaryPoints : [],
        secondaryAlertPoints: Array.isArray(alert.secondaryAlertPoints)
          ? alert.secondaryAlertPoints
          : Array.isArray(alert.secondaryPoints)
            ? alert.secondaryPoints
            : [],
        totalAlertPointCount: Number(alert.totalAlertPointCount || 0),
        companionPointCount: Number(alert.companionPointCount || 0),
        rank: index + 1,
      };
    })
    .filter(Boolean);
}

function getCarbonBrushDashboardAlerts(serviceItems) {
  const backendAlerts = normalizeCarbonBrushBackendAlerts(window.plirm34CarbonBrushDashboardAlerts);
  if (backendAlerts.length) {
    return backendAlerts;
  }
  const fallbackAlerts = buildCarbonBrushBannerFallbackSummary(serviceItems);
  try {
    const detailedAlerts = typeof buildCarbonBrushAlertSummary === "function"
      ? buildCarbonBrushAlertSummary(serviceItems)
      : [];
    return Array.isArray(detailedAlerts) && detailedAlerts.length ? detailedAlerts : fallbackAlerts;
  } catch (error) {
    console.error("Gagal menghitung Carbon Brush Early Warning:", error);
    return fallbackAlerts;
  }
}

function formatCarbonBrushAlertNumber(value, digits = 2) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "-";
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(digits) : "-";
}

function renderCarbonBrushAlertBanner(serviceItems) {
  if (!dashboardCarbonBrushBanner || !dashboardCarbonBrushBannerViewport) {
    return;
  }
  const alerts = getCarbonBrushDashboardAlerts(serviceItems);
  if (!alerts.length) {
    dashboardCarbonBrushBanner.classList.add("hidden");
    dashboardCarbonBrushBannerViewport.innerHTML = "";
    if (dashboardCarbonBrushBannerDots) {
      dashboardCarbonBrushBannerDots.innerHTML = "";
    }
    if (dashboardCarbonBrushAlertTimer) {
      window.clearInterval(dashboardCarbonBrushAlertTimer);
      dashboardCarbonBrushAlertTimer = null;
    }
    return;
  }

  dashboardCarbonBrushBanner.classList.remove("hidden");
  if (dashboardCarbonBrushBannerSummary) {
    dashboardCarbonBrushBannerSummary.textContent = `${alerts.length} equipment inspeksi terbaru`;
  }
  dashboardCarbonBrushBannerViewport.innerHTML = alerts.map(({ item, threshold, status, displayStatus, predictionStatus, predictionQuality, planningPoints, rank, secondaryAlertPoints = [], companionPointCount = 0, totalAlertPointCount = 0, worstPoint }) => {
    const activeStatus = displayStatus || status || { label: "Monitor", className: "is-monitor", actionLabel: "Lanjutkan monitoring periodik" };
    const countdownText = worstPoint.countdownDays != null ? `${worstPoint.countdownDays} hari` : "histori kurang";
    const actionText = getCarbonBrushPlanningActionText(activeStatus, planningPoints);
    const thresholdPlantLabel = worstPoint.thresholdPlantLabel || threshold?.plantLabel || item.payload?.plant || "-";
    const thresholdLegend = worstPoint.thresholdLegend || threshold?.legend || `Merah < ${worstPoint.thresholdLow} | Hijau >= ${worstPoint.thresholdHigh}`;
    const statusBasisText = "Urutan banner memakai ketebalan aktual titik terbaru. Countdown dipakai sebagai indikator tambahan, bukan dasar ranking utama.";
    const secondarySummary = secondaryAlertPoints.length
      ? secondaryAlertPoints.map((point) => `${point.pointKey} ${point.currentValue ?? "-"} mm${point.countdownDays !== null ? ` (${point.countdownDays} hari)` : ""}`).join(", ")
      : "Belum ada titik lain yang lebih dekat dari titik utama.";
    const companionSummaryText = companionPointCount > 0
      ? `${companionPointCount} titik berikutnya layak dipertimbangkan untuk diganti sekalian.`
      : "Belum ada titik pendamping yang perlu disiapkan bersamaan.";
    return `
    <article class="carbon-brush-alert-slide ${activeStatus.className}" data-service-id="${escapeHtml(item.id || "")}" tabindex="0" aria-hidden="true">
      <div class="carbon-brush-alert-rank">#${rank}</div>
      <div class="carbon-brush-alert-copy">
        <div class="carbon-brush-alert-line">
          <span class="carbon-brush-alert-status ${activeStatus.className}">${escapeHtml(activeStatus.label)}</span>
          <span class="carbon-brush-alert-days">${escapeHtml(countdownText)}</span>
        </div>
        <strong>${escapeHtml(item.equipmentName || "-")}</strong>
        <p>Titik utama <strong>${escapeHtml(worstPoint.pointKey)}</strong> sekarang berada di <strong>${escapeHtml(worstPoint.currentValue ?? "-")} mm</strong>. Area threshold <strong>${escapeHtml(thresholdPlantLabel)}</strong>, limit merah <strong>&lt; ${escapeHtml(worstPoint.thresholdLow)} mm</strong>. ${escapeHtml(statusBasisText)}</p>
        <div class="carbon-brush-alert-metrics">
          <span>${escapeHtml(thresholdLegend)}</span>
          <span>Nilai sekarang ${escapeHtml(worstPoint.currentValue ?? "-")} mm</span>
          <span>Sisa saat inspeksi ${escapeHtml(formatCarbonBrushAlertNumber(worstPoint.remainingMm, 2))} mm</span>
          <span>Estimasi sisa hari ini ${escapeHtml(formatCarbonBrushAlertNumber(worstPoint.projectedRemainingMm, 2))} mm</span>
          <span>Hari berjalan ${escapeHtml(worstPoint.daysSinceLatestInspection ?? 0)} hari sejak inspeksi terakhir</span>
          <span>Prediksi ${escapeHtml(predictionStatus?.label || "Belum cukup histori")} | ${escapeHtml(predictionQuality?.label || "Belum cukup histori")}</span>
          <span>Median aus ${escapeHtml(formatCarbonBrushAlertNumber(worstPoint.medianWearRate, 3))} mm/hari</span>
        </div>
        <div class="carbon-brush-alert-secondary">
          <div class="carbon-brush-alert-secondary-head">
            <span>Titik lain untuk service yang sama</span>
            <strong>${escapeHtml(totalAlertPointCount)}</strong>
          </div>
          <p>${escapeHtml(secondarySummary)}</p>
        </div>
      </div>
      <div class="carbon-brush-alert-action">
        <div class="carbon-brush-alert-action-panel">
          <strong>Titik pendamping untuk planning</strong>
          <p>${escapeHtml(companionSummaryText)}</p>
          ${renderCarbonBrushCompanionPoints(planningPoints)}
        </div>
        <span>${escapeHtml(actionText)}</span>
        <small>${escapeHtml(predictionQuality?.note || "Countdown menunggu histori yang cukup.")}</small>
        <small>Klik untuk buka detail equipment</small>
      </div>
    </article>
  `;
  }).join("");
  showCarbonBrushAlertSlide(0);
  startCarbonBrushAlertRotation(alerts.length);
}
