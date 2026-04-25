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
  dashboardCarbonBrushBannerViewport.innerHTML = alerts.map(({ item, worstPoint, status, displayStatus, predictionStatus, predictionQuality, rank }) => {
    const activeStatus = displayStatus || status;
    const countdownText = worstPoint.countdownDays !== null ? `${worstPoint.countdownDays} hari` : "prediksi belum siap";
    const statusBasisText = activeStatus.source === "prediction"
      ? "Prioritas ini berasal dari prediksi countdown dengan histori yang cukup; nilai aktual tetap menjadi acuan utama."
      : "Prioritas ini berasal dari nilai aktual terhadap threshold carbon brush.";
    return `
    <article class="carbon-brush-alert-slide ${activeStatus.className}" data-service-id="${escapeHtml(item.id || "")}" tabindex="0" aria-hidden="true">
      <div class="carbon-brush-alert-rank">#${rank}</div>
      <div class="carbon-brush-alert-copy">
        <div class="carbon-brush-alert-line">
          <span class="carbon-brush-alert-status ${activeStatus.className}">${escapeHtml(activeStatus.label)}</span>
          <span class="carbon-brush-alert-days">${escapeHtml(countdownText)}</span>
        </div>
        <strong>${escapeHtml(item.equipmentName || "-")}</strong>
        <p>Titik <strong>${escapeHtml(worstPoint.pointKey)}</strong> sekarang berada di <strong>${escapeHtml(worstPoint.currentValue ?? "-")} mm</strong> dengan limit <strong>${escapeHtml(worstPoint.thresholdLow)}</strong>. ${escapeHtml(statusBasisText)}</p>
        <div class="carbon-brush-alert-metrics">
          <span>Nilai sekarang ${escapeHtml(worstPoint.currentValue ?? "-")} mm</span>
          <span>Sisa ${escapeHtml(worstPoint.remainingMm !== null ? worstPoint.remainingMm.toFixed(2) : "-")} mm</span>
          <span>Prediksi ${escapeHtml(predictionStatus?.label || "Belum cukup histori")} | ${escapeHtml(predictionQuality?.label || "Belum cukup histori")}</span>
          <span>Median aus ${escapeHtml(worstPoint.medianWearRate !== null ? worstPoint.medianWearRate.toFixed(3) : "-")} mm/hari</span>
        </div>
      </div>
      <div class="carbon-brush-alert-action">
        <span>${escapeHtml(activeStatus.actionLabel)}</span>
        <small>${escapeHtml(predictionQuality?.note || "Countdown menunggu histori yang cukup.")}</small>
        <small>Klik untuk buka detail equipment</small>
      </div>
    </article>
  `;
  }).join("");
  showCarbonBrushAlertSlide(0);
  startCarbonBrushAlertRotation(alerts.length);
}
