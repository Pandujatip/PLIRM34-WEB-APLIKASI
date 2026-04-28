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
    return activeStatus.actionLabel || "Tidak ada titik lain dengan estimasi dekat dari titik utama.";
  }
  const pointText = planningPoints
    .map((point) => `${point.pointKey} (${point.countdownDays} hari)`)
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
  const visiblePoints = planningPoints.slice(0, 3);
  const overflowCount = Math.max(0, planningPoints.length - visiblePoints.length);
  return `
    <div class="carbon-brush-alert-companions">
      ${visiblePoints.map((point) => `
        <span class="carbon-brush-alert-companion-pill">
          <strong>${escapeHtml(point.pointKey)}</strong>
          <small>${escapeHtml(point.countdownDays)} hari</small>
        </span>
      `).join("")}
      ${overflowCount ? `<span class="carbon-brush-alert-companion-more">+${overflowCount} titik lain</span>` : ""}
    </div>
  `;
}

function renderCarbonBrushAlertBanner(serviceItems) {
  if (!dashboardCarbonBrushBanner || !dashboardCarbonBrushBannerViewport) {
    return;
  }
  const alerts = buildCarbonBrushAlertSummary(serviceItems);
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
    dashboardCarbonBrushBannerSummary.textContent = `Top ${alerts.length} prioritas carbon brush`;
  }
  dashboardCarbonBrushBannerViewport.innerHTML = alerts.map(({ item, status, displayStatus, predictionStatus, predictionQuality, planningPoints, rank, secondaryAlertPoints = [], companionPointCount = 0, totalAlertPointCount = 0, worstPoint }) => {
    const activeStatus = displayStatus || status;
    const countdownText = worstPoint.countdownDays !== null ? `${worstPoint.countdownDays} hari` : "prediksi belum siap";
    const actionText = getCarbonBrushPlanningActionText(activeStatus, planningPoints);
    const statusBasisText = activeStatus.source === "prediction"
      ? "Prioritas ini berasal dari prediksi countdown dengan histori yang cukup; nilai aktual tetap menjadi acuan utama."
      : "Prioritas ini berasal dari nilai aktual terhadap threshold carbon brush.";
    const secondarySummary = secondaryAlertPoints.length
      ? secondaryAlertPoints.map((point) => `${point.pointKey} ${point.currentValue ?? "-"} mm`).join(", ")
      : "Belum ada titik lain yang lebih dekat dari titik utama.";
    const companionSummaryText = companionPointCount > 0
      ? `${companionPointCount} titik lain juga masuk range planning.`
      : "Belum ada titik lain yang perlu disiapkan bersamaan.";
    return `
    <article class="carbon-brush-alert-slide ${activeStatus.className}" data-service-id="${escapeHtml(item.id || "")}" tabindex="0" aria-hidden="true">
      <div class="carbon-brush-alert-rank">#${rank}</div>
      <div class="carbon-brush-alert-copy">
        <div class="carbon-brush-alert-line">
          <span class="carbon-brush-alert-status ${activeStatus.className}">${escapeHtml(activeStatus.label)}</span>
          <span class="carbon-brush-alert-days">${escapeHtml(countdownText)}</span>
        </div>
        <strong>${escapeHtml(item.equipmentName || "-")}</strong>
        <p>Titik utama <strong>${escapeHtml(worstPoint.pointKey)}</strong> sekarang berada di <strong>${escapeHtml(worstPoint.currentValue ?? "-")} mm</strong> dengan limit <strong>${escapeHtml(worstPoint.thresholdLow)}</strong>. ${escapeHtml(statusBasisText)}</p>
        <div class="carbon-brush-alert-metrics">
          <span>Nilai sekarang ${escapeHtml(worstPoint.currentValue ?? "-")} mm</span>
          <span>Sisa saat inspeksi ${escapeHtml(worstPoint.remainingMm !== null ? worstPoint.remainingMm.toFixed(2) : "-")} mm</span>
          <span>Estimasi sisa hari ini ${escapeHtml(worstPoint.projectedRemainingMm !== null ? worstPoint.projectedRemainingMm.toFixed(2) : "-")} mm</span>
          <span>Hari berjalan ${escapeHtml(worstPoint.daysSinceLatestInspection ?? 0)} hari sejak inspeksi terakhir</span>
          <span>Prediksi ${escapeHtml(predictionStatus?.label || "Belum cukup histori")} | ${escapeHtml(predictionQuality?.label || "Belum cukup histori")}</span>
          <span>Median aus ${escapeHtml(worstPoint.medianWearRate !== null ? worstPoint.medianWearRate.toFixed(3) : "-")} mm/hari</span>
        </div>
        <div class="carbon-brush-alert-secondary">
          <div class="carbon-brush-alert-secondary-head">
            <span>Titik lain yang ikut perlu diperhatikan</span>
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
