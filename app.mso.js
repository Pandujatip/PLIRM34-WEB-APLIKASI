async function importLatestMsoMotorFile() {
  return apiRequest("/admin/import-mso-motor-latest", {
    method: "POST",
    body: {},
  });
}

async function uploadMsoMotorCsvFile(file) {
  if (!(file instanceof File)) {
    throw new Error("File CSV belum dipilih");
  }
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  const fileData = btoa(binary);
  return apiRequest("/admin/upload-mso-motor", {
    method: "POST",
    body: {
      fileName: file.name,
      fileData,
    },
  });
}

async function importMsoMotorScrapeItems(items, sourceName, options = {}) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("Data scrape MSO kosong.");
  }
  const safeSourceName = String(sourceName || "MSO Browser Sync").trim() || "MSO Browser Sync";
  const batchSize = Math.max(50, Number(options.batchSize || MSO_MOTOR_IMPORT_BATCH_SIZE));
  const totalBatches = Math.max(1, Math.ceil(items.length / batchSize));
  const handleProgress = typeof options.onProgress === "function" ? options.onProgress : null;
  const aggregate = {
    imported: 0,
    created: 0,
    updated: 0,
    mode: "append",
    totalBatches,
    sourceName: safeSourceName,
  };

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex += 1) {
    const offset = batchIndex * batchSize;
    const batchItems = items.slice(offset, offset + batchSize);
    if (handleProgress) {
      handleProgress({
        phase: "uploading",
        batchIndex: batchIndex + 1,
        totalBatches,
        batchSize: batchItems.length,
        importedSoFar: aggregate.imported,
        totalItems: items.length,
      });
    }
    const result = await apiRequest("/admin/import-mso-motor-scrape", {
      method: "POST",
      body: {
        items: batchItems,
        sourceName: safeSourceName,
        batchIndex: batchIndex + 1,
        batchTotal: totalBatches,
      },
    });
    aggregate.imported += Number(result.imported || batchItems.length);
    aggregate.created += Number(result.created || 0);
    aggregate.updated += Number(result.updated || 0);
  }

  return aggregate;
}

async function resetMsoMotorItems() {
  return apiRequest("/admin/reset-mso-motor", {
    method: "POST",
    body: {},
  });
}

function renderMsoMotorSyncSettings() {
  const settings = getAppSetting("mso_motor_sync") || {};
  if (adminMsoMotorDirectory instanceof HTMLInputElement) {
    adminMsoMotorDirectory.value = String(settings.directory || "/opt/plirm34/imports/mso-motor");
  }
  if (adminMsoMotorPattern instanceof HTMLInputElement) {
    adminMsoMotorPattern.value = String(settings.pattern || "mso-motor-inspections-*.csv");
  }
  if (adminMsoMotorStatus) {
    const lastImportedFile = String(settings.lastImportedFile || "").trim();
    const lastImportedCount = Number(settings.lastImportedCount || 0);
    const lastImportedAt = String(settings.lastImportedAt || "").trim();
    const lastUploadedFile = String(settings.lastUploadedFile || "").trim();
    const lastUploadedAt = String(settings.lastUploadedAt || "").trim();
    const lastUploadedSize = Number(settings.lastUploadedSize || 0);
    if (lastImportedFile) {
      adminMsoMotorStatus.textContent = `File import terakhir: ${lastImportedFile} | ${lastImportedCount} item | sinkron ${formatActivityLogDate(lastImportedAt)}`;
    } else if (lastUploadedFile) {
      adminMsoMotorStatus.textContent = `File upload terakhir: ${lastUploadedFile} | ${formatBytes(lastUploadedSize)} | upload ${formatActivityLogDate(lastUploadedAt)}`;
    } else {
      adminMsoMotorStatus.textContent = "Belum ada sinkronisasi MSO motor. Pilih CSV mingguan lalu upload langsung dari web atau letakkan file di folder server.";
    }
  }
}

function getMsoMotorSyncControls() {
  return [
    adminMsoMotorSaveButton,
    adminMsoMotorUploadButton,
    adminMsoMotorUploadImportButton,
    adminMsoMotorImportButton,
    adminMsoMotorResetButton,
    adminMsoMotorCopyScriptButton,
    adminMsoMotorCopyScrapeOnlyButton,
    adminMsoMotorImportJsonButton,
  ];
}

let msoMotorProgressTimer = null;
let msoMotorProgressStartedAt = 0;
let msoMotorProgressMessage = "";
let msoMotorProgressDetailText = "";

function formatElapsedSeconds(milliseconds) {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  if (totalSeconds < 60) {
    return `${totalSeconds} detik`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} menit ${seconds} detik`;
}

function setMsoMotorControlsBusy(isBusy) {
  getMsoMotorSyncControls().forEach((control) => {
    if (control instanceof HTMLButtonElement) {
      control.disabled = Boolean(isBusy);
    }
  });
  if (adminMsoMotorJsonInput instanceof HTMLInputElement) {
    adminMsoMotorJsonInput.disabled = Boolean(isBusy);
  }
}

function renderMsoMotorProgress() {
  if (!(adminMsoMotorProgress instanceof HTMLElement)) {
    return;
  }
  const elapsedLabel = msoMotorProgressStartedAt ? formatElapsedSeconds(Date.now() - msoMotorProgressStartedAt) : "0 detik";
  if (adminMsoMotorProgressTitle) {
    adminMsoMotorProgressTitle.textContent = msoMotorProgressMessage || "Memproses sinkronisasi MSO Motor...";
  }
  if (adminMsoMotorProgressDetail) {
    const detailParts = [msoMotorProgressDetailText, `Durasi proses: ${elapsedLabel}`].filter(Boolean);
    adminMsoMotorProgressDetail.textContent = detailParts.join(" | ");
  }
}

function showMsoMotorProgress(message, detail = "") {
  if (!(adminMsoMotorProgress instanceof HTMLElement)) {
    return;
  }
  msoMotorProgressStartedAt = Date.now();
  msoMotorProgressMessage = String(message || "Memproses sinkronisasi MSO Motor...");
  msoMotorProgressDetailText = String(detail || "").trim();
  adminMsoMotorProgress.classList.remove("hidden", "is-success", "is-error");
  adminMsoMotorProgress.classList.add("is-busy");
  if (adminMsoMotorProgressBadge) {
    adminMsoMotorProgressBadge.textContent = "Berjalan";
  }
  setMsoMotorControlsBusy(true);
  if (msoMotorProgressTimer) {
    window.clearInterval(msoMotorProgressTimer);
  }
  renderMsoMotorProgress();
  msoMotorProgressTimer = window.setInterval(renderMsoMotorProgress, 1000);
}

function updateMsoMotorProgress(message, detail = "") {
  if (!(adminMsoMotorProgress instanceof HTMLElement)) {
    return;
  }
  if (!msoMotorProgressStartedAt) {
    msoMotorProgressStartedAt = Date.now();
  }
  msoMotorProgressMessage = String(message || msoMotorProgressMessage || "Memproses sinkronisasi MSO Motor...");
  msoMotorProgressDetailText = String(detail || "").trim();
  adminMsoMotorProgress.classList.remove("hidden", "is-success", "is-error");
  adminMsoMotorProgress.classList.add("is-busy");
  if (adminMsoMotorProgressBadge) {
    adminMsoMotorProgressBadge.textContent = "Berjalan";
  }
  renderMsoMotorProgress();
}

function finishMsoMotorProgress(message, detail = "", tone = "success") {
  if (!(adminMsoMotorProgress instanceof HTMLElement)) {
    return;
  }
  if (msoMotorProgressTimer) {
    window.clearInterval(msoMotorProgressTimer);
    msoMotorProgressTimer = null;
  }
  msoMotorProgressMessage = String(message || "Sinkronisasi selesai");
  msoMotorProgressDetailText = String(detail || "").trim();
  adminMsoMotorProgress.classList.remove("hidden", "is-busy", "is-success", "is-error");
  adminMsoMotorProgress.classList.add(tone === "error" ? "is-error" : "is-success");
  if (adminMsoMotorProgressBadge) {
    adminMsoMotorProgressBadge.textContent = tone === "error" ? "Gagal" : "Selesai";
  }
  renderMsoMotorProgress();
  setMsoMotorControlsBusy(false);
  msoMotorProgressStartedAt = 0;
}
