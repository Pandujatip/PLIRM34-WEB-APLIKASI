const loginForm = document.getElementById("login-form");
const signupButton = document.getElementById("signup-button");
const forgotPasswordButton = document.getElementById("forgot-password-button");
const loginScreen = document.getElementById("login-screen");
const workspace = document.getElementById("workspace");
const currentUser = document.getElementById("current-user");
const currentRole = document.getElementById("current-role");
const accessSummary = document.getElementById("access-summary");
const pageTitle = document.getElementById("page-title");
const refreshButton = document.getElementById("refresh-button");
const printButton = document.getElementById("print-button");
const logoutButton = document.getElementById("logout-button");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".panel-section");
const jumpButtons = document.querySelectorAll("[data-section-jump]");
const createToggleButtons = document.querySelectorAll("[data-create-target]");
const createPanels = document.querySelectorAll("[data-create-panel]");
const closePanelButtons = document.querySelectorAll("[data-close-panel]");
const serviceTabs = document.querySelectorAll(".service-tab");
const servicePanes = document.querySelectorAll(".service-pane");
const electricalSubtabs = document.querySelectorAll(".service-subtab");
const electricalPanes = document.querySelectorAll(".electrical-pane");
const editableBlocks = document.querySelectorAll("[data-editable-for]");
const lockedNotes = document.querySelectorAll("[data-locked-for]");
const forms = document.querySelectorAll(".input-form");
const negatifListForm = document.querySelector('[data-form-type="negatif-list"]');
const equipmentReferenceInput = negatifListForm?.querySelector('[name="equipment"]');
const equipmentReferenceResults = document.getElementById("equipment-reference-results");
const equipmentReferenceStatus = document.getElementById("equipment-reference-status");
const serviceDcsForm = document.querySelector('[data-form-type="service-dcs"]');
const serviceDcsEquipmentInput = document.getElementById("service-dcs-equipment-input");
const serviceDcsEquipmentResults = document.getElementById("service-dcs-equipment-results");
const serviceDcsEquipmentStatus = document.getElementById("service-dcs-equipment-status");
const serviceDcsEquipmentDescription = document.getElementById("service-dcs-equipment-description");
const carbonBrushEquipmentInput = document.getElementById("carbon-brush-equipment-name");
const carbonBrushEquipmentResults = document.getElementById("carbon-brush-equipment-results");
const carbonBrushEquipmentStatus = document.getElementById("carbon-brush-equipment-status");
const carbonBrushEquipmentMeta = document.getElementById("carbon-brush-equipment-meta");
const carbonBrushMeasurementGrid = document.getElementById("carbon-brush-measurement-grid");
const carbonBrushStats = document.getElementById("carbon-brush-stats");
const serviceElectricalCarbonBrushForm = document.querySelector('[data-form-type="service-motor-mv-carbon-brush"]');
const serviceElectricalRoomForm = document.querySelector('[data-form-type="service-electrical-room"]');
const serviceMccForm = document.querySelector('[data-form-type="service-mcc"]');
const serviceItemCache = new Map();
const electricalRoomNameInput = document.getElementById("electrical-room-name-input");
const electricalRoomReferenceListElement = document.getElementById("electrical-room-reference-list");
const electricalRoomReferenceHint = document.getElementById("electrical-room-reference-hint");
const serviceMccEquipmentInput = document.getElementById("service-mcc-equipment-input");
const serviceMccReferenceListElement = document.getElementById("service-mcc-reference-list");
const serviceMccReferenceHint = document.getElementById("service-mcc-reference-hint");
const serviceDetailModal = document.getElementById("service-detail-modal");
const serviceDetailClose = document.getElementById("service-detail-close");
const serviceDetailTitle = document.getElementById("service-detail-title");
const serviceDetailSubtitle = document.getElementById("service-detail-subtitle");
const serviceDetailContent = document.getElementById("service-detail-content");
const userManagementBody = document.getElementById("user-management-body");
const adminBackupButton = document.getElementById("admin-backup-button");
const adminExportButton = document.getElementById("admin-export-button");
const adminExportResource = document.getElementById("admin-export-resource");
const adminImportResource = document.getElementById("admin-import-resource");
const adminImportMode = document.getElementById("admin-import-mode");
const adminImportInput = document.getElementById("admin-import-input");
const adminImportButton = document.getElementById("admin-import-button");
const adminCarbonBrushUrl = document.getElementById("admin-carbon-brush-url");
const adminCarbonBrushMode = document.getElementById("admin-carbon-brush-mode");
const adminCarbonBrushImportButton = document.getElementById("admin-carbon-brush-import-button");
const adminRestoreInput = document.getElementById("admin-restore-input");
const adminRestoreButton = document.getElementById("admin-restore-button");
const adminAreaForm = document.getElementById("admin-area-form");
const adminCarbonBrushThresholdForm = document.getElementById("admin-carbon-brush-threshold-form");
const adminCarbonBrushThresholdHint = document.getElementById("admin-carbon-brush-threshold-hint");
const adminElectricalRoomThresholdForm = document.getElementById("admin-electrical-room-threshold-form");
const adminElectricalRoomThresholdHint = document.getElementById("admin-electrical-room-threshold-hint");
const adminElectricalRoomForm = document.getElementById("admin-electrical-room-form");
const adminEquipmentForm = document.getElementById("admin-equipment-form");
const adminTemplateForm = document.getElementById("admin-template-form");
const adminAreasBody = document.getElementById("admin-areas-body");
const adminElectricalRoomBody = document.getElementById("admin-electrical-room-body");
const adminEquipmentBody = document.getElementById("admin-equipment-body");
const adminTemplatesBody = document.getElementById("admin-templates-body");
const activityLogBody = document.getElementById("activity-log-body");
const searchActivityLog = document.getElementById("search-activity-log");
const filterActivityAction = document.getElementById("filter-activity-action");
const refreshActivityLogButton = document.getElementById("refresh-activity-log-button");
const negatifListBody = document.getElementById("negatif-list-body");
const sparepartBody = document.getElementById("sparepart-body");
const serviceCardList = document.getElementById("service-card-list");
const bomList = document.getElementById("bom-list");
const bomMotorList = document.getElementById("bom-motor-list");
const spbBody = document.getElementById("spb-body");
const dashboardNegatifPreview = document.getElementById("dashboard-negatif-preview");
const dashboardSpbPreview = document.getElementById("dashboard-spb-preview");
const dashboardServicePreview = document.getElementById("dashboard-service-preview");
const dashboardInspectionToday = document.getElementById("dashboard-inspection-today");
const dashboardInspectionTomorrow = document.getElementById("dashboard-inspection-tomorrow");
const statNegatif = document.getElementById("stat-negatif");
const statSpbBelumAda = document.getElementById("stat-spb-belum-ada");
const statService = document.getElementById("stat-service");
const metricSparepartTotal = document.getElementById("metric-sparepart-total");
const metricBomTotal = document.getElementById("metric-bom-total");
const metricServiceElectrical = document.getElementById("metric-service-electrical");
const metricSpbTotal = document.getElementById("metric-spb-total");
const playerAvatar = document.getElementById("player-avatar");
const hudLevelBadge = document.getElementById("hud-level-badge");
const hudRankBadge = document.getElementById("hud-rank-badge");
const hudXpFill = document.getElementById("hud-xp-fill");
const hudXpText = document.getElementById("hud-xp-text");
const hudPoints = document.getElementById("hud-points");
const sidebarStreakValue = document.getElementById("sidebar-streak-value");
const sidebarStreakNote = document.getElementById("sidebar-streak-note");
const achievementTitle = document.getElementById("achievement-title");
const achievementStatus = document.getElementById("achievement-status");
const achievementDesc = document.getElementById("achievement-desc");
const missionTitle = document.getElementById("mission-title");
const missionProgressFill = document.getElementById("mission-progress-fill");
const missionProgressText = document.getElementById("mission-progress-text");
const missionDesc = document.getElementById("mission-desc");
const streakTitle = document.getElementById("streak-title");
const streakReward = document.getElementById("streak-reward");
const streakDesc = document.getElementById("streak-desc");
const menuBadges = document.querySelectorAll("[data-menu-badge]");
const heroLevelTitle = document.getElementById("hero-level-title");
const heroNextLevel = document.getElementById("hero-next-level");
const heroProgressValue = document.getElementById("hero-progress-value");
const heroProgressFill = document.getElementById("hero-progress-fill");
const heroXpRing = document.getElementById("hero-xp-ring");
const heroXpPercent = document.getElementById("hero-xp-percent");
const heroXpCaption = document.getElementById("hero-xp-caption");
const heroRankName = document.getElementById("hero-rank-name");
const chartNegatif = document.getElementById("chart-negatif");
const chartService = document.getElementById("chart-service");
const chartSpb = document.getElementById("chart-spb");
const negatifListMobile = document.getElementById("negatif-list-mobile");
const spbMobile = document.getElementById("spb-mobile");
const sampleDataStatus = document.getElementById("sample-data-status");
const searchNegatifList = document.getElementById("search-negatif-list");
const filterNegatifPriority = document.getElementById("filter-negatif-priority");
const filterNegatifCause = document.getElementById("filter-negatif-cause");
const filterNegatifCategory = document.getElementById("filter-negatif-category");
const filterNegatifDateFrom = document.getElementById("filter-negatif-date-from");
const filterNegatifDateTo = document.getElementById("filter-negatif-date-to");
const searchSparepart = document.getElementById("search-sparepart");
const filterSparepartCondition = document.getElementById("filter-sparepart-condition");
const searchService = document.getElementById("search-service");
const filterServiceType = document.getElementById("filter-service-type");
const searchBom = document.getElementById("search-bom");
const filterBomArea = document.getElementById("filter-bom-area");
const bomTabs = document.querySelectorAll("[data-bom-tab]");
const bomPanes = document.querySelectorAll("[data-bom-pane]");
const searchSpb = document.getElementById("search-spb");
const filterSpbStatus = document.getElementById("filter-spb-status");
const exportButtons = document.querySelectorAll(".export-button");
const toastStack = document.getElementById("toast-stack");
const sidebar = document.querySelector(".sidebar");
const negatifTotalCount = document.getElementById("negatif-total-count");
const negatifHighCount = document.getElementById("negatif-high-count");
const negatifRawmillCount = document.getElementById("negatif-rawmill-count");
const negatifOvhCount = document.getElementById("negatif-ovh-count");
const negatifStatusChart = document.getElementById("negatif-status-chart");
const negatifAreaChart = document.getElementById("negatif-area-chart");
const negatifMarkChart = document.getElementById("negatif-mark-chart");
const EQUIPMENT_REFERENCE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRt_ysTFRHmKVY3-hlFDgBYex-BExU0cdFnuBaWOPqxKAo6mqavGhtZeKdTkvvFXsm-uvcOt2QVLHHC/pub?output=csv";
const DCS_EQUIPMENT_REFERENCE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4f9-NuVnXVz24mPVlXP_b7rEbVGbutbSnspudmS8qztvXBEMY-Jw6moGdWWNEAHkYS68ohM2jM1E_/pub?gid=1968615039&single=true&output=csv";
const DEFAULT_ELECTRICAL_ROOM_REFERENCES = ["ER17", "ER23C", "ER24"];
const CARBON_BRUSH_REFERENCE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfKUBfJ2IEybsMUaBoZnPeTgqCdPwuGnoXPtFuLfRzydveC6cBMYobCistT3GNdm2kS7xIKUgVkAVb/pub?output=csv";
const carbonBrushMeasurementRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const carbonBrushMeasurementColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const carbonBrushMeasurementKeys = carbonBrushMeasurementRows.flatMap((row) => carbonBrushMeasurementColumns.map((column) => `${row}${column}`));
let equipmentReferenceList = [];
let selectedEquipmentReference = "";
let dcsEquipmentReferenceItems = [];
let selectedDcsEquipmentReference = "";
let dcsEquipmentReferenceLoadedAt = 0;
let dcsEquipmentReferencePromise = null;
let carbonBrushEquipmentReferenceList = [];
let selectedCarbonBrushEquipmentReference = "";
const storageKeys = {
  session: "plirm34-session",
  users: "plirm34-users",
  lastSection: "plirm34-last-section",
  negatifList: "plirm34-negatif-list",
  sparepart: "plirm34-sparepart-list",
  service: "plirm34-service-list",
  bom: "plirm34-bom-list",
  bomMotor: "plirm34-bom-motor-list",
  spb: "plirm34-spb-list",
};
const resourceStorageKeys = new Set([
  storageKeys.negatifList,
  storageKeys.sparepart,
  storageKeys.service,
  storageKeys.bom,
  storageKeys.bomMotor,
  storageKeys.spb,
]);
const volatileStorage = new Map();

const apiResourceMap = {
  [storageKeys.negatifList]: "negatif-list",
  [storageKeys.sparepart]: "sparepart",
  [storageKeys.service]: "service",
  [storageKeys.bom]: "bom",
  [storageKeys.bomMotor]: "bom-motor",
  [storageKeys.spb]: "spb",
};

const backendState = {
  available: false,
  sessionActive: false,
  masters: {
    areas: [],
    inspectionTemplates: [],
    equipmentReferences: [],
    appSettings: [],
  },
};
const IDLE_LOGOUT_MS = 3 * 60 * 1000;
const IDLE_ACTIVITY_EVENTS = ["click", "keydown", "mousemove", "touchstart", "scroll"];

let activeRole = "admin";
let editingNegatifId = null;
let editingSparepartId = null;
let editingServiceId = null;
let editingBomId = null;
let editingBomMotorId = null;
let editingSpbId = null;
let activeServiceDetailItem = null;
let carbonBrushReplacementEditMode = false;
let carbonBrushReplacementDraft = [];
let activeBomPane = "general";
let dashboardInspectionSchedule = {
  calendarName: "PMS PLIRM34",
  timezone: "Asia/Jakarta",
  today: [],
  tomorrow: [],
};
let idleLogoutTimer = null;

const roleLabels = {
  admin: "Admin",
  organik: "Organik",
  team: "Team",
};

const roleAccessSummary = {
  admin: "Akses penuh seluruh modul",
  organik: "Lihat semua modul, edit negatif list",
  team: "Lihat semua modul, edit service",
};

const defaultAuthUsers = [
  { username: "admin.plirm34", password: "admin123", role: "admin" },
  { username: "organik.plirm34", password: "organik123", role: "organik" },
  { username: "team.plirm34", password: "team123", role: "team" },
];

const roleSections = {
  admin: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb", "user-management", "activity-log"],
  organik: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
  team: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
};

const roleEditable = {
  admin: ["negatif-list", "sparepart", "service", "bom", "spb", "user-management"],
  organik: ["negatif-list"],
  team: ["service"],
};

function parseCsvRow(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function detectEquipmentColumnIndex(headers) {
  const normalizedHeaders = headers.map((header) => header.toLowerCase().trim());
  const candidates = [
    "equipment",
    "nama equipment",
    "equipment name",
    "equipment tag",
    "tag equipment",
    "deskripsi equipment",
    "nama alat",
    "nama mesin",
    "tag",
    "description",
  ];

  const matchedIndex = normalizedHeaders.findIndex((header) => candidates.includes(header));
  return matchedIndex >= 0 ? matchedIndex : 0;
}

function updateEquipmentReferenceStatus(message, isError = false) {
  if (!equipmentReferenceStatus) {
    return;
  }

  equipmentReferenceStatus.textContent = message;
  equipmentReferenceStatus.style.color = isError ? "#ffb4b4" : "";
}

function updateCarbonBrushEquipmentStatus(message, isError = false) {
  if (!carbonBrushEquipmentStatus) {
    return;
  }

  carbonBrushEquipmentStatus.textContent = message;
  carbonBrushEquipmentStatus.style.color = isError ? "#ffb4b4" : "";
}

function hideEquipmentReferenceResults() {
  equipmentReferenceResults?.classList.add("hidden");
  if (equipmentReferenceResults) {
    equipmentReferenceResults.innerHTML = "";
  }
}

function hideCarbonBrushEquipmentResults() {
  carbonBrushEquipmentResults?.classList.add("hidden");
  if (carbonBrushEquipmentResults) {
    carbonBrushEquipmentResults.innerHTML = "";
  }
}

function setEquipmentReferenceValue(value) {
  if (!equipmentReferenceInput) {
    return;
  }

  equipmentReferenceInput.value = value;
  selectedEquipmentReference = value;
}

function updateDcsEquipmentReferenceStatus(message, isError = false) {
  if (!serviceDcsEquipmentStatus) {
    return;
  }
  serviceDcsEquipmentStatus.textContent = message;
  serviceDcsEquipmentStatus.classList.toggle("error-text", isError);
}

function setDcsEquipmentInputEnabled(isEnabled) {
  if (!serviceDcsEquipmentInput) {
    return;
  }
  serviceDcsEquipmentInput.disabled = !isEnabled;
  serviceDcsEquipmentInput.readOnly = false;
  if (isEnabled) {
    serviceDcsEquipmentInput.removeAttribute("disabled");
    serviceDcsEquipmentInput.removeAttribute("readonly");
  } else {
    serviceDcsEquipmentInput.setAttribute("disabled", "disabled");
  }
}

function setDcsEquipmentReferenceValue(value, description = "") {
  if (!serviceDcsEquipmentInput) {
    return;
  }

  serviceDcsEquipmentInput.value = value;
  if (serviceDcsEquipmentDescription) {
    serviceDcsEquipmentDescription.value = description;
  }
  selectedDcsEquipmentReference = value;
}

function hideDcsEquipmentResults() {
  serviceDcsEquipmentResults?.classList.add("hidden");
  if (serviceDcsEquipmentResults) {
    serviceDcsEquipmentResults.innerHTML = "";
  }
}

function normalizeDcsEquipmentCode(rawValue) {
  return String(rawValue || "")
    .split("\t")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function normalizeDcsEquipmentDescription(rawValue) {
  return String(rawValue || "")
    .trim()
    .replace(/^\(+|\)+$/g, "")
    .trim();
}

function findDcsEquipmentReference(value) {
  const normalizedValue = String(value || "").trim().toUpperCase();
  return dcsEquipmentReferenceItems.find((item) => item.equipmentName.toUpperCase() === normalizedValue) || null;
}

function setCarbonBrushEquipmentValue(value) {
  if (!carbonBrushEquipmentInput) {
    return;
  }

  carbonBrushEquipmentInput.value = value;
  selectedCarbonBrushEquipmentReference = value;
  updateCarbonBrushEquipmentMeta(value);
  updateCarbonBrushMeasurementColors();
}

function parseCarbonBrushEquipmentCode(equipmentName) {
  const match = String(equipmentName || "").trim().match(/^(\d{3}[A-Za-z0-9-]*)/);
  return match ? match[1] : "";
}

function getAppSetting(settingKey) {
  return backendState.masters.appSettings.find((item) => item.settingKey === settingKey)?.value || null;
}

function getElectricalRoomReferenceConfig() {
  const settings = getAppSetting("electrical_room_references") || {};
  return settings && typeof settings === "object" ? settings : {};
}

function getElectricalRoomThresholdConfig() {
  const settings = getAppSetting("electrical_room_thresholds") || {};
  return {
    batteryChargeLow: Number(settings.batteryChargeLow ?? 120),
    batteryChargeHigh: Number(settings.batteryChargeHigh ?? 130),
    batteryCellLow: Number(settings.batteryCellLow ?? 11.5),
    batteryCellHigh: Number(settings.batteryCellHigh ?? 12.8),
    transformerWindingLow: Number(settings.transformerWindingLow ?? 45),
    transformerWindingHigh: Number(settings.transformerWindingHigh ?? 85),
    transformerOilLow: Number(settings.transformerOilLow ?? 40),
    transformerOilHigh: Number(settings.transformerOilHigh ?? 70),
  };
}

function getElectricalRoomReferenceList() {
  const config = getElectricalRoomReferenceConfig();
  const sourceItems = Array.isArray(config.items) ? config.items : DEFAULT_ELECTRICAL_ROOM_REFERENCES;
  return [...new Set(sourceItems.map((item) => String(item || "").trim()).filter(Boolean))];
}

function renderElectricalRoomReferenceOptions() {
  if (!electricalRoomReferenceListElement) {
    return;
  }
  const items = getElectricalRoomReferenceList();
  electricalRoomReferenceListElement.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    electricalRoomReferenceListElement.append(option);
  });
  if (electricalRoomReferenceHint) {
    electricalRoomReferenceHint.textContent = items.length
      ? `Referensi aktif: ${items.join(", ")}.`
      : "Belum ada referensi room / panel. Tambahkan dari menu admin.";
  }
}

function getMccEquipmentReferenceList() {
  const serviceItems = getServiceItemsFromDom()
    .filter((item) => item.formType === "service-mcc")
    .map((item) => String(item.equipmentName || "").trim().toUpperCase())
    .filter(Boolean);
  return [...new Set(serviceItems)].sort((left, right) => left.localeCompare(right));
}

function renderMccReferenceOptions() {
  if (!serviceMccReferenceListElement) {
    return;
  }
  const items = getMccEquipmentReferenceList();
  serviceMccReferenceListElement.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    serviceMccReferenceListElement.append(option);
  });
  if (serviceMccReferenceHint) {
    serviceMccReferenceHint.textContent = items.length
      ? `Referensi MCC aktif: ${items.length} equipment dari data inspeksi/import.`
      : "Belum ada referensi MCC tersimpan. Setelah import data atau simpan inspeksi pertama, daftar akan muncul di sini.";
  }
}

function normalizeMccStatusValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return "OK";
  }
  if (["true", "ok", "baik", "bersih", "normal", "yes", "ya"].includes(normalized)) {
    return "OK";
  }
  if (["false", "not ok", "tidak", "kotor", "abnormal", "no"].includes(normalized)) {
    return "NOT OK";
  }
  return normalized.toUpperCase();
}

function buildMccDetailSummary(payload = {}) {
  return [
    `Fungsi: ${payload.testFunction || "-"}`,
    `Visual: ${payload.visualCondition || "-"}`,
    `Kebersihan: ${payload.partCleanliness || "-"}`,
  ].join(" | ");
}

function hydrateElectricalRoomThresholdForm() {
  if (!adminElectricalRoomThresholdForm) {
    return;
  }
  const threshold = getElectricalRoomThresholdConfig();
  adminElectricalRoomThresholdForm.elements.batteryChargeLow.value = threshold.batteryChargeLow;
  adminElectricalRoomThresholdForm.elements.batteryChargeHigh.value = threshold.batteryChargeHigh;
  adminElectricalRoomThresholdForm.elements.batteryCellLow.value = threshold.batteryCellLow;
  adminElectricalRoomThresholdForm.elements.batteryCellHigh.value = threshold.batteryCellHigh;
  adminElectricalRoomThresholdForm.elements.transformerWindingLow.value = threshold.transformerWindingLow;
  adminElectricalRoomThresholdForm.elements.transformerWindingHigh.value = threshold.transformerWindingHigh;
  adminElectricalRoomThresholdForm.elements.transformerOilLow.value = threshold.transformerOilLow;
  adminElectricalRoomThresholdForm.elements.transformerOilHigh.value = threshold.transformerOilHigh;
  if (adminElectricalRoomThresholdHint) {
    adminElectricalRoomThresholdHint.textContent = `Battery charge ${threshold.batteryChargeLow}-${threshold.batteryChargeHigh} VDC, battery cell ${threshold.batteryCellLow}-${threshold.batteryCellHigh} V, winding ${threshold.transformerWindingLow}-${threshold.transformerWindingHigh} C, oil ${threshold.transformerOilLow}-${threshold.transformerOilHigh} C.`;
  }
}

function getCarbonBrushThresholdConfig(equipmentName, explicitPlant = "") {
  const code = parseCarbonBrushEquipmentCode(equipmentName);
  const areaDigit = code[2] || (String(explicitPlant).match(/(\d)$/)?.[1] || "");
  const plantLabel = areaDigit === "4" ? "Tuban 4" : areaDigit === "3" ? "Tuban 3" : (explicitPlant || "-");
  const savedThresholds = getAppSetting("carbon_brush_thresholds") || {};
  const tuban3 = savedThresholds.tuban3 || {};
  const tuban4 = savedThresholds.tuban4 || {};
  const tuban3Low = Number(tuban3.low ?? 30);
  const tuban3High = Number(tuban3.high ?? 34);
  const tuban4Low = Number(tuban4.low ?? 35);
  const tuban4High = Number(tuban4.high ?? 38);

  if (!code && !explicitPlant) {
    return { plantLabel: "-", low: tuban3Low, high: tuban3High, legend: "-" };
  }

  if (plantLabel === "Tuban 4") {
    return { plantLabel, low: tuban4Low, high: tuban4High, legend: `Merah < ${tuban4Low} | Kuning ${tuban4Low}-${(tuban4High - 0.01).toFixed(2)} | Hijau >= ${tuban4High}` };
  }

  return { plantLabel: plantLabel === "-" ? "Tuban 3" : plantLabel, low: tuban3Low, high: tuban3High, legend: `Merah < ${tuban3Low} | Kuning ${tuban3Low}-${(tuban3High - 0.01).toFixed(2)} | Hijau >= ${tuban3High}` };
}

function decodeCarbonBrushEquipmentMeta(equipmentName, explicitPlant = "") {
  const code = parseCarbonBrushEquipmentCode(equipmentName);
  const locationMap = {
    "3": "Rawmill",
  };
  const categoryMap = {
    "4": "Equipment utama produksi",
  };
  const threshold = getCarbonBrushThresholdConfig(equipmentName, explicitPlant);

  return {
    code,
    location: locationMap[code[0]] || "-",
    category: categoryMap[code[1]] || "-",
    plant: threshold.plantLabel,
    thresholdLegend: threshold.legend,
    threshold,
  };
}

function updateCarbonBrushEquipmentMeta(equipmentName, explicitPlant = "") {
  if (!carbonBrushEquipmentMeta) {
    return;
  }

  const meta = decodeCarbonBrushEquipmentMeta(equipmentName, explicitPlant);
  carbonBrushEquipmentMeta.innerHTML = `
    <span class="summary-pill">Lokasi: ${meta.location}</span>
    <span class="summary-pill">Kategori: ${meta.category}</span>
    <span class="summary-pill">Plant: ${meta.plant}</span>
    <span class="summary-pill">Batas: ${meta.thresholdLegend}</span>
  `;
}

function renderEquipmentReferenceResults(query) {
  if (!equipmentReferenceInput || !equipmentReferenceResults) {
    return;
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    hideEquipmentReferenceResults();
    return;
  }

  const matches = equipmentReferenceList
    .filter((name) => name.toLowerCase().includes(trimmedQuery.toLowerCase()))
    .slice(0, 12);

  equipmentReferenceResults.innerHTML = "";

  if (!matches.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "typeahead-empty";
    emptyState.textContent = "Referensi equipment tidak ditemukan.";
    equipmentReferenceResults.append(emptyState);
    equipmentReferenceResults.classList.remove("hidden");
    return;
  }

  matches.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "typeahead-item";
    button.textContent = name;
    button.addEventListener("click", () => {
      setEquipmentReferenceValue(name);
      hideEquipmentReferenceResults();
      updateEquipmentReferenceStatus(`Equipment dipilih dari referensi resmi. Total referensi aktif: ${equipmentReferenceList.length} item.`);
    });
    equipmentReferenceResults.append(button);
  });

  equipmentReferenceResults.classList.remove("hidden");
}

function renderCarbonBrushEquipmentResults(query) {
  if (!carbonBrushEquipmentInput || !carbonBrushEquipmentResults) {
    return;
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    hideCarbonBrushEquipmentResults();
    return;
  }

  const matches = carbonBrushEquipmentReferenceList
    .filter((name) => name.toLowerCase().includes(trimmedQuery.toLowerCase()))
    .slice(0, 12);

  carbonBrushEquipmentResults.innerHTML = "";

  if (!matches.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "typeahead-empty";
    emptyState.textContent = "Equipment carbon brush tidak ditemukan.";
    carbonBrushEquipmentResults.append(emptyState);
    carbonBrushEquipmentResults.classList.remove("hidden");
    return;
  }

  matches.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "typeahead-item";
    button.textContent = name;
    button.addEventListener("click", () => {
      setCarbonBrushEquipmentValue(name);
      hideCarbonBrushEquipmentResults();
      updateCarbonBrushEquipmentStatus(`Equipment carbon brush dipilih dari referensi resmi. Total referensi aktif: ${carbonBrushEquipmentReferenceList.length} item.`);
    });
    carbonBrushEquipmentResults.append(button);
  });

  carbonBrushEquipmentResults.classList.remove("hidden");
}

function renderDcsEquipmentResults(query) {
  if (!serviceDcsEquipmentInput || !serviceDcsEquipmentResults) {
    return;
  }

  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    hideDcsEquipmentResults();
    return;
  }

  const matches = dcsEquipmentReferenceItems
    .filter((item) =>
      item.equipmentName.toLowerCase().includes(trimmedQuery)
      || item.description.toLowerCase().includes(trimmedQuery))
    .slice(0, 12);

  serviceDcsEquipmentResults.innerHTML = "";

  if (!matches.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "typeahead-empty";
    emptyState.textContent = "Referensi DCS tidak ditemukan.";
    serviceDcsEquipmentResults.append(emptyState);
    serviceDcsEquipmentResults.classList.remove("hidden");
    return;
  }

  matches.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "typeahead-item";
    button.innerHTML = `
      <strong>${escapeHtml(item.equipmentName)}</strong>
      <small>${escapeHtml(item.description || "-")}</small>
    `;
    button.addEventListener("click", () => {
      setDcsEquipmentReferenceValue(item.equipmentName, item.description);
      hideDcsEquipmentResults();
      updateDcsEquipmentReferenceStatus(`Referensi DCS aktif: ${dcsEquipmentReferenceItems.length} item.`);
    });
    serviceDcsEquipmentResults.append(button);
  });

  serviceDcsEquipmentResults.classList.remove("hidden");
}

async function loadEquipmentReference() {
  if (!equipmentReferenceInput) {
    return;
  }

  equipmentReferenceInput.disabled = true;
  updateEquipmentReferenceStatus("Memuat referensi equipment...");

  try {
    if (backendState.available && backendState.sessionActive) {
      const result = await loadMastersFromBackend("negatif-list");
      const references = Array.isArray(result?.equipmentReferences) ? result.equipmentReferences : [];
      equipmentReferenceList = [...new Set(
        references
          .map((item) => String(item.equipmentName || "").trim())
          .filter(Boolean),
      )].sort((left, right) => left.localeCompare(right, "id"));
      if (!equipmentReferenceList.length) {
        throw new Error("Referensi backend kosong");
      }
      equipmentReferenceInput.disabled = false;
      equipmentReferenceInput.placeholder = "Ketik minimal 1 huruf untuk mencari equipment";
      if (selectedEquipmentReference && equipmentReferenceList.includes(selectedEquipmentReference)) {
        equipmentReferenceInput.value = selectedEquipmentReference;
      } else {
        equipmentReferenceInput.value = "";
        selectedEquipmentReference = "";
      }
      updateEquipmentReferenceStatus(`Referensi equipment aktif: ${equipmentReferenceList.length} item dari master backend.`);
      return;
    }

    const response = await fetch(EQUIPMENT_REFERENCE_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const csvText = await response.text();
    const rows = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseCsvRow);

    if (rows.length === 0) {
      throw new Error("CSV kosong");
    }

    const headerRow = rows[0];
    const dataRows = rows.slice(1);
    const equipmentColumnIndex = detectEquipmentColumnIndex(headerRow);

    equipmentReferenceList = [...new Set(
      dataRows
        .map((row) => row[equipmentColumnIndex]?.trim() || "")
        .filter(Boolean),
    )].sort((left, right) => left.localeCompare(right, "id"));

    if (equipmentReferenceList.length === 0) {
      throw new Error("Kolom equipment tidak ditemukan atau tidak berisi data");
    }

    equipmentReferenceInput.disabled = false;
    equipmentReferenceInput.placeholder = "Ketik minimal 1 huruf untuk mencari equipment";
    if (selectedEquipmentReference && equipmentReferenceList.includes(selectedEquipmentReference)) {
      equipmentReferenceInput.value = selectedEquipmentReference;
    } else {
      equipmentReferenceInput.value = "";
      selectedEquipmentReference = "";
    }
    updateEquipmentReferenceStatus(`Referensi equipment aktif: ${equipmentReferenceList.length} item dari spreadsheet.`);
  } catch (error) {
    equipmentReferenceList = [];
    equipmentReferenceInput.disabled = true;
    equipmentReferenceInput.value = "";
    selectedEquipmentReference = "";
    hideEquipmentReferenceResults();
    updateEquipmentReferenceStatus("Gagal memuat referensi equipment. Form Negatif List dikunci sampai referensi berhasil dibaca.", true);
  }
}

async function loadCarbonBrushEquipmentReference() {
  if (!carbonBrushEquipmentInput) {
    return;
  }

  carbonBrushEquipmentInput.disabled = true;
  updateCarbonBrushEquipmentStatus("Memuat referensi equipment carbon brush...");

  try {
    if (backendState.available && backendState.sessionActive) {
      const result = await loadMastersFromBackend("carbon-brush");
      const references = Array.isArray(result?.equipmentReferences) ? result.equipmentReferences : [];
      carbonBrushEquipmentReferenceList = [...new Set(
        references
          .map((item) => String(item.equipmentName || "").trim())
          .filter(Boolean),
      )].sort((left, right) => left.localeCompare(right, "id"));
      if (!carbonBrushEquipmentReferenceList.length) {
        throw new Error("Referensi carbon brush backend kosong");
      }
      carbonBrushEquipmentInput.disabled = false;
      carbonBrushEquipmentInput.placeholder = "Ketik kode equipment, misal 343RM1";
      if (selectedCarbonBrushEquipmentReference && carbonBrushEquipmentReferenceList.includes(selectedCarbonBrushEquipmentReference)) {
        carbonBrushEquipmentInput.value = selectedCarbonBrushEquipmentReference;
      } else {
        carbonBrushEquipmentInput.value = "";
        selectedCarbonBrushEquipmentReference = "";
      }
      updateCarbonBrushEquipmentStatus(`Referensi carbon brush aktif: ${carbonBrushEquipmentReferenceList.length} item dari master backend.`);
      return;
    }

    const response = await fetch(CARBON_BRUSH_REFERENCE_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const csvText = await response.text();
    const rows = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseCsvRow);

    if (rows.length === 0) {
      throw new Error("CSV kosong");
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const equipmentIndex = headers.findIndex((header) => header.toUpperCase() === "EQUIPMENT");
    if (equipmentIndex < 0) {
      throw new Error("Kolom EQUIPMENT tidak ditemukan");
    }

    carbonBrushEquipmentReferenceList = [...new Set(
      dataRows
        .map((row) => row[equipmentIndex]?.trim() || "")
        .filter(Boolean),
    )].sort((left, right) => left.localeCompare(right, "id"));

    if (!carbonBrushEquipmentReferenceList.length) {
      throw new Error("Data equipment carbon brush kosong");
    }

    carbonBrushEquipmentInput.disabled = false;
    carbonBrushEquipmentInput.placeholder = "Ketik kode equipment, misal 343RM1";
    if (selectedCarbonBrushEquipmentReference && carbonBrushEquipmentReferenceList.includes(selectedCarbonBrushEquipmentReference)) {
      carbonBrushEquipmentInput.value = selectedCarbonBrushEquipmentReference;
    } else {
      carbonBrushEquipmentInput.value = "";
      selectedCarbonBrushEquipmentReference = "";
    }
    updateCarbonBrushEquipmentStatus(`Referensi carbon brush aktif: ${carbonBrushEquipmentReferenceList.length} item dari spreadsheet.`);
  } catch {
    carbonBrushEquipmentReferenceList = [];
    carbonBrushEquipmentInput.disabled = true;
    carbonBrushEquipmentInput.value = "";
    selectedCarbonBrushEquipmentReference = "";
    hideCarbonBrushEquipmentResults();
    updateCarbonBrushEquipmentStatus("Gagal memuat referensi carbon brush. Form ini dikunci sampai referensi berhasil dibaca.", true);
  }
}

async function loadDcsEquipmentReference(options = {}) {
  if (!serviceDcsEquipmentInput) {
    return;
  }

  const force = Boolean(options.force);
  const cacheFresh = dcsEquipmentReferenceItems.length > 0 && (Date.now() - dcsEquipmentReferenceLoadedAt) < 300000;
  if (!force && cacheFresh) {
    setDcsEquipmentInputEnabled(true);
    updateDcsEquipmentReferenceStatus(`Referensi DCS aktif: ${dcsEquipmentReferenceItems.length} item.`);
    return dcsEquipmentReferenceItems;
  }

  if (!force && dcsEquipmentReferencePromise) {
    return dcsEquipmentReferencePromise;
  }

  setDcsEquipmentInputEnabled(false);
  updateDcsEquipmentReferenceStatus("Memuat referensi equipment DCS...");

  dcsEquipmentReferencePromise = (async () => {
    try {
      dcsEquipmentReferenceItems = [];

      if (backendState.available && backendState.sessionActive) {
        const result = await apiRequest("/masters?source_group=dcs-service");
        const references = Array.isArray(result?.equipmentReferences) ? result.equipmentReferences : [];
        dcsEquipmentReferenceItems = references
          .map((item) => ({
            equipmentName: String(item.equipmentName || "").trim(),
            description: String(item.metadata?.equipmentDescription || item.metadata?.description || "").trim(),
          }))
          .filter((item) => item.equipmentName);
      }

      if (!dcsEquipmentReferenceItems.length) {
        const response = await fetch(DCS_EQUIPMENT_REFERENCE_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map(parseCsvRow);

        dcsEquipmentReferenceItems = rows
          .slice(1)
          .map((row) => ({
            equipmentName: normalizeDcsEquipmentCode(row[0] || ""),
            description: normalizeDcsEquipmentDescription(row[1] || ""),
          }))
          .filter((item) => item.equipmentName)
          .filter((item, index, array) => array.findIndex((entry) => entry.equipmentName === item.equipmentName) === index)
          .sort((left, right) => left.equipmentName.localeCompare(right.equipmentName, "id"));
      }

      if (!dcsEquipmentReferenceItems.length) {
        throw new Error("Referensi DCS kosong");
      }

      dcsEquipmentReferenceLoadedAt = Date.now();
      setDcsEquipmentInputEnabled(true);
      serviceDcsEquipmentInput.placeholder = "Ketik kode equipment DCS, misal 776PLCA3";
      const currentReference = findDcsEquipmentReference(selectedDcsEquipmentReference || serviceDcsEquipmentInput.value);
      if (currentReference) {
        setDcsEquipmentReferenceValue(currentReference.equipmentName, currentReference.description);
      } else {
        setDcsEquipmentReferenceValue("", "");
        selectedDcsEquipmentReference = "";
      }
      updateDcsEquipmentReferenceStatus(`Referensi DCS aktif: ${dcsEquipmentReferenceItems.length} item.`);
      return dcsEquipmentReferenceItems;
    } catch (error) {
      dcsEquipmentReferenceItems = [];
      dcsEquipmentReferenceLoadedAt = 0;
      setDcsEquipmentInputEnabled(false);
      setDcsEquipmentReferenceValue("", "");
      selectedDcsEquipmentReference = "";
      hideDcsEquipmentResults();
      updateDcsEquipmentReferenceStatus("Gagal memuat referensi equipment DCS. Form DCS dikunci sampai referensi berhasil dibaca.", true);
      throw error;
    } finally {
      dcsEquipmentReferencePromise = null;
    }
  })();

  return dcsEquipmentReferencePromise;
}

function renderCarbonBrushMeasurementGrid() {
  if (!carbonBrushMeasurementGrid) {
    return;
  }

  const table = document.createElement("table");
  table.className = "carbon-brush-matrix-table";
  const header = `
    <thead>
      <tr>
        <th>Titik</th>
        ${carbonBrushMeasurementColumns.map((column) => `<th>${column}</th>`).join("")}
      </tr>
    </thead>
  `;
  const body = carbonBrushMeasurementRows.map((row) => `
    <tr>
      <td>${row}</td>
      ${carbonBrushMeasurementColumns.map((column) => {
        const key = `${row}${column}`;
        return `<td><input class="carbon-brush-input" type="text" inputmode="decimal" name="${key}" data-carbon-brush-measurement="${key}" placeholder="${key}"></td>`;
      }).join("")}
    </tr>
  `).join("");
  table.innerHTML = `${header}<tbody>${body}</tbody>`;
  carbonBrushMeasurementGrid.innerHTML = "";
  carbonBrushMeasurementGrid.append(table);
}

function parseCarbonBrushNumericValue(value) {
  const match = String(value || "").replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function classifyCarbonBrushValue(value, equipmentName, explicitPlant = "") {
  if (!equipmentName && !explicitPlant) {
    return "";
  }

  const numericValue = parseCarbonBrushNumericValue(value);
  if (numericValue === null) {
    return "";
  }

  const threshold = getCarbonBrushThresholdConfig(equipmentName, explicitPlant);
  if (numericValue < threshold.low) {
    return "low";
  }
  if (numericValue < threshold.high) {
    return "medium";
  }
  return "high";
}

function computeCarbonBrushStats(measurements, equipmentName, explicitPlant = "") {
  const stats = {
    low: 0,
    medium: 0,
    high: 0,
    empty: 0,
    min: null,
    attentionPoints: [],
  };

  carbonBrushMeasurementKeys.forEach((key) => {
    const rawValue = measurements[key] || "";
    const bucket = classifyCarbonBrushValue(rawValue, equipmentName, explicitPlant);
    const numericValue = parseCarbonBrushNumericValue(rawValue);

    if (!bucket) {
      stats.empty += 1;
      return;
    }

    stats[bucket] += 1;
    if (stats.min === null || (numericValue !== null && numericValue < stats.min)) {
      stats.min = numericValue;
    }
    if (bucket !== "high") {
      stats.attentionPoints.push(key);
    }
  });

  stats.attentionPoints = stats.attentionPoints.slice(0, 8);
  return stats;
}

function normalizeCarbonBrushReplacedPoints(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => String(item || "").trim())
    .filter((item) => carbonBrushMeasurementKeys.includes(item));
}

function updateCarbonBrushStatsDisplay(measurements, equipmentName, explicitPlant = "") {
  if (!carbonBrushStats) {
    return;
  }

  const stats = computeCarbonBrushStats(measurements, equipmentName, explicitPlant);
  carbonBrushStats.innerHTML = `
    <span class="summary-pill low">Merah: ${stats.low}</span>
    <span class="summary-pill medium">Kuning: ${stats.medium}</span>
    <span class="summary-pill high">Hijau: ${stats.high}</span>
    <span class="summary-pill">Kosong: ${stats.empty}</span>
    <span class="summary-pill">Terendah: ${stats.min === null ? "-" : stats.min}</span>
  `;
}

function collectCarbonBrushMeasurements(form) {
  return carbonBrushMeasurementKeys.reduce((result, key) => {
    result[key] = String(form.querySelector(`[name="${key}"]`)?.value || "").trim();
    return result;
  }, {});
}

function updateCarbonBrushMeasurementColors() {
  const equipmentName = carbonBrushEquipmentInput?.value || selectedCarbonBrushEquipmentReference || "";
  const measurements = {};

  document.querySelectorAll("[data-carbon-brush-measurement]").forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const bucket = classifyCarbonBrushValue(input.value, equipmentName);
    input.classList.remove("is-low", "is-medium", "is-high");
    if (bucket) {
      input.classList.add(`is-${bucket}`);
    }
    measurements[input.name] = input.value.trim();
  });

  updateCarbonBrushStatsDisplay(measurements, equipmentName);
}

function openSection(sectionName) {
  if (!roleSections[activeRole].includes(sectionName)) {
    return;
  }

  if (workspace) {
    workspace.dataset.activeSection = sectionName;
  }

  sections.forEach((section) => {
    section.classList.toggle("visible", section.dataset.panel === sectionName);
  });

  menuItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionName);
  });

  const activeItem = [...menuItems].find((item) => item.dataset.section === sectionName);
  if (activeItem) {
    pageTitle.textContent = activeItem.querySelector(".menu-item-main strong")?.textContent || activeItem.dataset.section || "Dashboard";
  }

  window.localStorage.setItem(storageKeys.lastSection, sectionName);
  if (sectionName === "activity-log") {
    void refreshActivityLogs();
  }

  if (window.matchMedia("(max-width: 900px)").matches) {
    sidebar?.classList.remove("menu-open");
  }
}

function applyRoleAccess(role) {
  activeRole = role;

  menuItems.forEach((item) => {
    const canAccess = roleSections[role].includes(item.dataset.section);
    item.classList.toggle("hidden", !canAccess);
  });

  editableBlocks.forEach((block) => {
    const allowedRoles = block.dataset.editableFor.split(",");
    const isAllowed = allowedRoles.includes(role);
    block.classList.toggle("hidden", !isAllowed);
  });

  lockedNotes.forEach((note) => {
    const sectionName = note.dataset.lockedFor;
    const canAccessSection = roleSections[role].includes(sectionName);
    const canEditSection = roleEditable[role].includes(sectionName);
    note.classList.toggle("hidden", !canAccessSection || canEditSection);
  });

  accessSummary.textContent = roleAccessSummary[role] || roleAccessSummary.admin;
  renderUserManagementTable();
}

function saveSession(username, role) {
  writeStorage(storageKeys.session, {
    username,
    role,
  });
}

function clearSession() {
  window.localStorage.removeItem(storageKeys.session);
  window.localStorage.removeItem(storageKeys.lastSection);
}

function stopIdleLogoutTimer() {
  if (idleLogoutTimer) {
    window.clearTimeout(idleLogoutTimer);
    idleLogoutTimer = null;
  }
}

async function performLogout(reason = "") {
  stopIdleLogoutTimer();
  if (backendState.available && backendState.sessionActive) {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout backend gagal:", error);
    }
    backendState.sessionActive = false;
  }
  workspace.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  loginForm.reset();
  activeRole = "admin";
  dashboardInspectionSchedule = {
    calendarName: "PMS PLIRM34",
    timezone: "Asia/Jakarta",
    today: [],
    tomorrow: [],
  };
  clearSession();
  if (reason) {
    showToast("Sesi Berakhir", reason);
  }
}

function resetIdleLogoutTimer() {
  stopIdleLogoutTimer();
  if (workspace.classList.contains("hidden")) {
    return;
  }
  idleLogoutTimer = window.setTimeout(() => {
    void performLogout("Tidak ada aktivitas selama 3 menit. Silakan login kembali.");
  }, IDLE_LOGOUT_MS);
}

function initializeIdleActivityTracking() {
  IDLE_ACTIVITY_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, () => {
      resetIdleLogoutTimer();
    }, { passive: true });
  });
}

function restoreSession() {
  const session = readStorage(storageKeys.session);
  if (!session || Array.isArray(session) || !session.username || !session.role) {
    return;
  }

  loginWithUser({
    username: session.username,
    role: session.role,
  });
  const lastSection = window.localStorage.getItem(storageKeys.lastSection) || "dashboard";
  openSection(lastSection);
}

function getPriorityTag(priority) {
  if (priority === "Tinggi") {
    return "tag-danger";
  }
  if (priority === "Sedang") {
    return "tag-warning";
  }
  return "tag-success";
}

function getServiceTag(type) {
  if (type === "Electrical") {
    return "tag-blue";
  }
  if (type === "Instrument") {
    return "tag-green";
  }
  return "tag-purple";
}

function openServicePane(tabName) {
  serviceTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.serviceTab === tabName);
  });
  servicePanes.forEach((pane) => {
    pane.classList.toggle("visible", pane.dataset.servicePane === tabName);
  });
  if (tabName === "dcs") {
    setDcsEquipmentInputEnabled(true);
    void loadDcsEquipmentReference();
  }
}

function openBomPane(tabName) {
  activeBomPane = tabName === "motor" ? "motor" : "general";
  bomTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.bomTab === activeBomPane);
  });
  bomPanes.forEach((pane) => {
    pane.classList.toggle("visible", pane.dataset.bomPane === activeBomPane);
  });
}

function placeCreatePanelNearToolbar(sectionName) {
  const section = document.querySelector(`.panel-section[data-panel="${sectionName}"]`);
  const panel = document.querySelector(`[data-create-panel="${sectionName}"]`);
  const toolbar = section?.querySelector(".toolbar");
  if (!section || !panel || !toolbar) {
    return;
  }
  if (toolbar.nextElementSibling !== panel) {
    toolbar.insertAdjacentElement("afterend", panel);
  }
}

function openCreatePanel(sectionName) {
  placeCreatePanelNearToolbar(sectionName);
  createPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.createPanel !== sectionName);
  });
  const panel = document.querySelector(`[data-create-panel="${sectionName}"]`);
  if (sectionName === "service" && servicePanes) {
    const activePane = [...servicePanes].find((pane) => pane.classList.contains("visible"));
    if (activePane?.dataset.servicePane === "dcs") {
      setDcsEquipmentInputEnabled(true);
      void loadDcsEquipmentReference();
    }
  }
  panel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeCreatePanel(sectionName) {
  createPanels.forEach((panel) => {
    if (!sectionName || panel.dataset.createPanel === sectionName) {
      panel.classList.add("hidden");
    }
  });
}

function closeAllCreatePanels() {
  closeCreatePanel("");
}

function getSectionNameByFormType(formType) {
  if (formType === "negatif-list") return "negatif-list";
  if (formType === "sparepart") return "sparepart";
  if (formType === "bom") return "bom";
  if (formType === "bom-motor") return "bom";
  if (formType === "spb") return "spb";
  if (String(formType || "").startsWith("service-")) return "service";
  return "";
}

function resetCreatePanelState(sectionName) {
  const panel = document.querySelector(`[data-create-panel="${sectionName}"]`);
  if (!panel) {
    return;
  }

  panel.querySelectorAll("form").forEach((form) => {
    form.reset();
    const note = form.querySelector(".submit-note");
    if (note) {
      note.textContent = "";
    }
  });

  if (sectionName === "negatif-list") {
    editingNegatifId = null;
    selectedEquipmentReference = "";
    hideEquipmentReferenceResults();
  }

  if (sectionName === "sparepart") {
    editingSparepartId = null;
  }

  if (sectionName === "service") {
    editingServiceId = null;
    selectedCarbonBrushEquipmentReference = "";
    updateCarbonBrushEquipmentMeta("");
    updateCarbonBrushMeasurementColors();
    openServicePane("electrical");
    openElectricalPane("electrical-room");
  }

  if (sectionName === "bom") {
    editingBomId = null;
    editingBomMotorId = null;
    openBomPane("general");
  }

  if (sectionName === "spb") {
    editingSpbId = null;
  }
}

function openElectricalPane(tabName) {
  electricalSubtabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.electricalTab === tabName);
  });
  electricalPanes.forEach((pane) => {
    pane.classList.toggle("visible", pane.dataset.electricalPane === tabName);
  });
}

function normalizeServiceItem(item) {
  if (item.formType) {
    return item;
  }

  if (item.type === "Electrical") {
    const match = item.detail.match(/Vibrasi DE (.*) \| Vibrasi NDE (.*)/);
    return {
      ...item,
      subtype: "Motor MV",
      formType: "service-motor-mv",
      payload: {
        vibrationDe: match?.[1] || "",
        vibrationNde: match?.[2] || "",
        windingTemperature: "",
        bearingCondition: "",
        motorCurrent: "",
      },
    };
  }

  if (item.type === "Instrument") {
    const match = item.detail.match(/Kondisi sensor: (.*) \| Foto: (.*)/);
    const photoCompatibility = buildFindingPhotoCompatibility(normalizeFindingPhotosPayload(item.payload || {
      findingPhotoName: match?.[2] || "",
      findingPhotoData: "",
    }));
    return {
      ...item,
      subtype: "Instrument",
      formType: "service-instrument",
      payload: {
        sensorCondition: match?.[1] || "",
        ...photoCompatibility,
      },
    };
  }

  const legacyDcsMatch = String(item.detail || "").match(/Fungsi: (.*) \| Kebersihan: (.*)/);
  return {
    ...item,
    subtype: "DCS",
    formType: "service-dcs",
    payload: normalizeDcsPayload(item.payload || {}, legacyDcsMatch),
  };
}

function normalizeSpbItem(item = {}) {
  return {
    id: item.id || createId("spb"),
    year: String(item.year || extractSpbYear(item) || "").trim() || String(new Date().getFullYear()),
    quarter: String(item.quarter || "").trim() || "-",
    spbType: String(item.spbType || item.requestType || "").trim() || "SPB",
    notificationNo: String(item.notificationNo || "").trim(),
    orderNo: String(item.orderNo || "").trim(),
    reservationNo: String(item.reservationNo || "").trim(),
    stockNo: String(item.stockNo || item.materialNo || "").trim(),
    materialDescription: String(item.materialDescription || "").trim(),
    qty: String(item.qty || "").trim(),
    mrp: String(item.mrp || item.requestSubtype || "").trim(),
    totalEce: String(item.totalEce || item.price || "").trim(),
    note: String(item.note || item.status || "").trim(),
    prNo: String(item.prNo || "").trim(),
    poNo: String(item.poNo || "").trim(),
    deliveryDate: String(item.deliveryDate || "").trim(),
  };
}

function normalizeDcsPayload(payload = {}, legacyDcsMatch = null) {
  const photoCompatibility = buildFindingPhotoCompatibility(normalizeFindingPhotosPayload(payload));
  return {
    inspectionDate: payload.inspectionDate || new Date().toISOString(),
    equipmentDescription: payload.equipmentDescription || "",
    plcPowerSupplyModule: payload.plcPowerSupplyModule || "",
    plcCommunicationModule: payload.plcCommunicationModule || "",
    plcProcessorModule: payload.plcProcessorModule || "",
    plcDigitalInputModule: payload.plcDigitalInputModule || "",
    plcDigitalOutputModule: payload.plcDigitalOutputModule || "",
    plcAnalogInputModule: payload.plcAnalogInputModule || "",
    plcAnalogOutputModule: payload.plcAnalogOutputModule || "",
    fiberOpticEthernetCommunication: payload.fiberOpticEthernetCommunication || "",
    groundingEeEa: payload.groundingEeEa || "",
    groundingEePe: payload.groundingEePe || "",
    groundingEaPe: payload.groundingEaPe || "",
    cableTermination: payload.cableTermination || "",
    upsOutput: payload.upsOutput || "",
    pdbOutput: payload.pdbOutput || "",
    roomAcCondition: payload.roomAcCondition || payload.equipmentFunction || legacyDcsMatch?.[1] || "",
    roomCleanliness: payload.roomCleanliness || payload.environmentCleanliness || legacyDcsMatch?.[2] || "",
    damagedPartReplacement: payload.damagedPartReplacement || "",
    adjustmentRepair: payload.adjustmentRepair || "",
    ...photoCompatibility,
  };
}

function buildDcsSummary(payload = {}) {
  const abnormalCount = [
    payload.plcPowerSupplyModule,
    payload.plcCommunicationModule,
    payload.plcProcessorModule,
    payload.plcDigitalInputModule,
    payload.plcDigitalOutputModule,
    payload.plcAnalogInputModule,
    payload.plcAnalogOutputModule,
    payload.fiberOpticEthernetCommunication,
    payload.cableTermination,
    payload.roomAcCondition,
    payload.roomCleanliness,
  ].filter((value) => isDcsTextAbnormal(value)).length;

  const groundingAlert = [
    payload.groundingEeEa,
    payload.groundingEePe,
    payload.groundingEaPe,
  ].filter((value) => isGroundingOutsideLimit(value)).length;

  const voltageAlert = [payload.upsOutput, payload.pdbOutput].filter((value) => isVoltageOutsideLimit(value, 195, 225)).length;
  return `Anomali ${abnormalCount + groundingAlert + voltageAlert} | Grounding ${groundingAlert} | UPS/PDB ${voltageAlert}`;
}

function parseNumericValue(value) {
  const match = String(value || "").replace(",", ".").match(/-?\d+(\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : null;
}

function isVoltageOutsideLimit(value, lower, upper) {
  const numeric = parseNumericValue(value);
  if (numeric == null) {
    return false;
  }
  return numeric < lower || numeric > upper;
}

function isGroundingOutsideLimit(value) {
  const numeric = parseNumericValue(value);
  if (numeric == null) {
    return /abnormal|fault|tinggi|jelek|buruk|di atas/i.test(String(value || ""));
  }
  return numeric >= 2;
}

function hasMeaningfulDcsText(value) {
  return !/^(-|tidak ada|nihil|none|normal|ok)$/i.test(String(value || "").trim());
}

function isDcsTextAbnormal(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (/^(ok|normal|hijau normal|hijau|scaning normal|scanning normal|tidak kendor|bersih|dingin)$/i.test(normalized)) {
    return false;
  }
  if (normalized.includes("tidak kendor") || normalized.includes("tidak ada")) {
    return false;
  }
  return /rusak|abnormal|alarm|fault|trip|loss|putus|merah|kuning|panas|high|tinggi|low|rendah|dirty|kotor|longgar|kendor|gangguan|tidak dingin|tidak bersih|down/i.test(normalized);
}

function formatCarbonBrushPayloadLines(item) {
  const payload = item.payload || {};
  const meta = decodeCarbonBrushEquipmentMeta(item.equipmentName || "", payload.plant || "");
  const stats = payload.stats || computeCarbonBrushStats(payload.measurements || {}, item.equipmentName || "", payload.plant || "");
  const replacedPoints = normalizeCarbonBrushReplacedPoints(payload.replacedPoints);
  const photoSummary = buildFindingPhotoCompatibility(getInspectionPhotoEntries(payload)).findingPhotoName;
  return [
    ["Plant", payload.plant || meta.plant || "-"],
    ["Lokasi", payload.location || meta.location || "-"],
    ["Kategori", payload.category || meta.category || "-"],
    ["PIC", payload.pic || "-"],
    ["Merah", `${stats.low || 0} titik`],
    ["Kuning", `${stats.medium || 0} titik`],
    ["Hijau", `${stats.high || 0} titik`],
    ["Terendah", stats.min ?? "-"],
    ["Replacement", payload.replacement || "-"],
    ["Megger", payload.megger || "-"],
    ["Titik diganti", replacedPoints.length ? replacedPoints.join(", ") : "-"],
    ["Titik perhatian", stats.attentionPoints?.length ? stats.attentionPoints.join(", ") : "-"],
    ["Foto temuan", photoSummary],
  ];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeBomPhotoName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.split(/[\\/]/).pop() || "";
}

function buildBomPhotoPath(filename) {
  const normalized = normalizeBomPhotoName(filename);
  if (!normalized) return "";
  return `/bom-images/${encodeURIComponent(normalized)}`;
}

function buildBomMotorPhotoPath(filename) {
  const normalized = normalizeBomPhotoName(filename);
  if (!normalized) return "";
  return `/bom-motor-images/${encodeURIComponent(normalized)}`;
}

function renderBomImageTile(label, filename, tone) {
  const normalized = normalizeBomPhotoName(filename);
  const imageUrl = buildBomPhotoPath(normalized);
  const dataKey = tone === "primary" ? "item" : tone === "secondary" ? "nameplate" : "extra";
  return `
    <div class="image-placeholder ${tone}" data-bom-photo="${dataKey}" data-filename="${escapeHtml(normalized)}">
      <div class="bom-image-label">${escapeHtml(label)}</div>
      ${
        normalized
          ? `<img src="${imageUrl}" alt="${escapeHtml(label)} ${escapeHtml(normalized)}" loading="lazy" onerror="this.closest('.image-placeholder')?.classList.add('is-missing'); this.remove();">`
          : `<div class="bom-image-empty">Belum ada foto</div>`
      }
      <div class="bom-image-name">${escapeHtml(normalized || "-")}</div>
    </div>
  `;
}

function renderBomMotorImageTile(label, filename, tone) {
  const normalized = normalizeBomPhotoName(filename);
  const imageUrl = buildBomMotorPhotoPath(normalized);
  const dataKey = tone === "primary" ? "motor" : tone === "secondary" ? "nameplate" : "connection";
  return `
    <div class="image-placeholder ${tone}" data-bom-motor-photo="${dataKey}" data-filename="${escapeHtml(normalized)}">
      <div class="bom-image-label">${escapeHtml(label)}</div>
      ${
        normalized
          ? `<img src="${imageUrl}" alt="${escapeHtml(label)} ${escapeHtml(normalized)}" loading="lazy" onerror="this.closest('.image-placeholder')?.classList.add('is-missing'); this.remove();">`
          : `<div class="bom-image-empty">Belum ada foto</div>`
      }
      <div class="bom-image-name">${escapeHtml(normalized || "-")}</div>
    </div>
  `;
}

function buildDetailGridRows(rows) {
  return rows.map(([label, value]) => `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "-")}</strong>
    </div>
  `).join("");
}

function analyzeServiceItem(item) {
  const payload = item.payload || {};

  if (item.formType === "service-electrical-room") {
    const threshold = getElectricalRoomThresholdConfig();
    const notes = [];
    const batteryCells = [
      ["Battery 1", payload.battery1],
      ["Battery 2", payload.battery2],
      ["Battery 3", payload.battery3],
      ["Battery 4", payload.battery4],
      ["Battery 5", payload.battery5],
      ["Battery 6", payload.battery6],
      ["Battery 7", payload.battery7],
      ["Battery 8", payload.battery8],
      ["Battery 9", payload.battery9],
      ["Battery 10", payload.battery10],
    ];
    const lowCells = [];
    const highCells = [];

    if (payload.panelDoorCondition === "NOT OK") {
      notes.push("Pintu panel belum tertutup sesuai standar. Tutup dan amankan panel segera untuk mencegah paparan debu, sentuhan langsung, dan risiko flashover.");
    }
    if (payload.floorCleanliness === "Kotor") {
      notes.push("Kebersihan lantai room kurang baik. Housekeeping perlu dijadwalkan untuk menurunkan risiko kontaminasi dan trip.");
    }
    if (payload.roomTemperature === "Tidak dingin") {
      notes.push("Ruangan tidak dingin. Periksa AC/ventilasi, sirkulasi udara, dan sumber panas di dalam room karena temperatur ruang yang tinggi mempercepat penuaan komponen panel dan battery.");
    }

    const batteryCharge = parseCarbonBrushNumericValue(payload.batteryVdc);
    if (batteryCharge !== null) {
      if (batteryCharge < threshold.batteryChargeLow) {
        notes.push(`Battery charge ${batteryCharge} VDC berada di bawah batas minimum ${threshold.batteryChargeLow} VDC. Cek charger, suplai AC, setting float/equalize, dan kondisi battery bank.`);
      } else if (batteryCharge > threshold.batteryChargeHigh) {
        notes.push(`Battery charge ${batteryCharge} VDC berada di atas batas maksimum ${threshold.batteryChargeHigh} VDC. Evaluasi setting charger karena overcharge dapat mempercepat kerusakan battery.`);
      }
    }

    const batteryTotal = parseCarbonBrushNumericValue(payload.batteryTotalVdc);
    if (batteryTotal !== null) {
      if (batteryTotal < threshold.batteryChargeLow) {
        notes.push(`Total tegangan battery ${batteryTotal} VDC lebih rendah dari batas ${threshold.batteryChargeLow} VDC. Lakukan pengecekan battery bank secara menyeluruh.`);
      } else if (batteryTotal > threshold.batteryChargeHigh) {
        notes.push(`Total tegangan battery ${batteryTotal} VDC melebihi batas ${threshold.batteryChargeHigh} VDC. Pastikan sistem charging tidak terlalu tinggi.`);
      }
    }

    batteryCells.forEach(([label, rawValue]) => {
      const numericValue = parseCarbonBrushNumericValue(rawValue);
      if (numericValue === null) {
        return;
      }
      if (numericValue < threshold.batteryCellLow) {
        lowCells.push(`${label} (${numericValue} V)`);
      } else if (numericValue > threshold.batteryCellHigh) {
        highCells.push(`${label} (${numericValue} V)`);
      }
    });

    if (lowCells.length) {
      notes.push(`Ada cell battery di bawah batas ${threshold.batteryCellLow} V: ${lowCells.join(", ")}. Lakukan equalizing/tes battery dan siapkan penggantian jika tren drop berulang.`);
    }
    if (highCells.length) {
      notes.push(`Ada cell battery di atas batas ${threshold.batteryCellHigh} V: ${highCells.join(", ")}. Kondisi ini mengarah ke overcharge atau ketidakseimbangan cell dan perlu evaluasi setting charger.`);
    }

    const windingTemperature = parseCarbonBrushNumericValue(payload.transformerWindingTemperature);
    if (windingTemperature !== null) {
      if (windingTemperature < threshold.transformerWindingLow) {
        notes.push(`Temperature winding ${windingTemperature} C berada di bawah batas normal ${threshold.transformerWindingLow} C. Verifikasi kembali sensor/indikator suhu dan kondisi beban trafo.`);
      } else if (windingTemperature > threshold.transformerWindingHigh) {
        notes.push(`Temperature winding ${windingTemperature} C melebihi batas ${threshold.transformerWindingHigh} C. Cek beban trafo, pendinginan, ventilasi room, dan kondisi sirip/radiator.`);
      }
    }

    const oilTemperature = parseCarbonBrushNumericValue(payload.transformerOilTemperature);
    if (oilTemperature !== null) {
      if (oilTemperature < threshold.transformerOilLow) {
        notes.push(`Temperature oil ${oilTemperature} C berada di bawah batas normal ${threshold.transformerOilLow} C. Pastikan pembacaan instrumen valid dan sesuaikan dengan kondisi operasi trafo.`);
      } else if (oilTemperature > threshold.transformerOilHigh) {
        notes.push(`Temperature oil ${oilTemperature} C melebihi batas ${threshold.transformerOilHigh} C. Evaluasi beban, sistem pendingin, level oil, dan kebersihan radiator trafo.`);
      }
    }

    if ((payload.transformerOilLevel || "").trim() && !/normal|ok/i.test(payload.transformerOilLevel || "")) {
      notes.push(`Level oil trafo dilaporkan "${payload.transformerOilLevel}". Verifikasi level aktual pada sight glass karena level oil yang tidak normal mempengaruhi pendinginan dan isolasi.`);
    }
    if ((payload.transformerSilicaGel || "").trim() === "NOT OK") {
      notes.push("Silica gel trafo tidak dalam kondisi baik. Ganti atau regenerasi silica gel untuk menjaga kelembaban tidak masuk ke tangki trafo.");
    }
    return notes.length ? notes : ["Kondisi umum electrical room relatif aman berdasarkan isian inspeksi terakhir."];
  }

  if (item.formType === "service-motor-mv") {
    const notes = [];
    const vibrationDe = parseCarbonBrushNumericValue(payload.vibrationDe);
    const vibrationNde = parseCarbonBrushNumericValue(payload.vibrationNde);
    const windingTemperature = parseCarbonBrushNumericValue(payload.windingTemperature);
    if (vibrationDe !== null && vibrationDe >= 4) {
      notes.push("Vibrasi DE sudah tinggi. Perlu cek alignment, kondisi bearing, dan fondasi motor.");
    }
    if (vibrationNde !== null && vibrationNde >= 4) {
      notes.push("Vibrasi NDE tinggi. Siapkan pengecekan balancing dan inspeksi sisi non-drive.");
    }
    if (windingTemperature !== null && windingTemperature >= 80) {
      notes.push("Suhu winding mendekati/masuk zona tinggi. Evaluasi beban motor dan pendinginan.");
    }
    return notes.length ? notes : ["Parameter utama motor MV masih dalam batas aman dari data yang diinput."];
  }

  if (item.formType === "service-motor-mv-carbon-brush") {
    const stats = payload.stats || computeCarbonBrushStats(payload.measurements || {}, item.equipmentName || "", payload.plant || "");
    const threshold = getCarbonBrushThresholdConfig(item.equipmentName || "", payload.plant || "");
    const replacedPoints = normalizeCarbonBrushReplacedPoints(payload.replacedPoints);
    const notes = [];
    if (replacedPoints.length) {
      notes.push(`Penggantian terkonfirmasi pada titik: ${replacedPoints.join(", ")}.`);
    }
    if (stats.low > 0) {
      notes.push(`Ada ${stats.low} titik di zona merah. Titik ini sebaiknya diprioritaskan untuk penggantian/pemeriksaan carbon brush.`);
    }
    if (stats.medium > 0) {
      notes.push(`Ada ${stats.medium} titik di zona kuning. Jadwalkan monitoring lanjutan sebelum turun ke bawah batas ${threshold.low}.`);
    }
    if (stats.attentionPoints?.length) {
      notes.push(`Titik perhatian utama: ${stats.attentionPoints.join(", ")}.`);
    }
    if (!notes.length) {
      notes.push("Sebaran hasil carbon brush berada di zona aman. Lanjutkan monitoring periodik sesuai jadwal.");
    }
    return notes;
  }

  if (item.formType === "service-mcc") {
    const notes = [];
    if (normalizeMccStatusValue(payload.testFunction) !== "OK") {
      notes.push("Test fungsi MCC tidak OK. Lanjutkan pengecekan suplai, interlock, fuse/MCB, kontaktor, overload, dan jalur kontrol sebelum unit dikembalikan ke operasi.");
    }
    if (normalizeMccStatusValue(payload.visualCondition) !== "OK") {
      notes.push("Kondisi visual MCC tidak OK. Periksa indikasi panas, perubahan warna, terminal longgar, karat, debu, atau kerusakan fisik pada komponen panel.");
    }
    if (normalizeMccStatusValue(payload.partCleanliness) !== "OK") {
      notes.push("Kebersihan part belum baik. Lakukan cleaning terkontrol pada panel atau komponen MCC agar debu dan kontaminasi tidak memicu gangguan operasi.");
    }
    return notes.length ? notes : ["Kondisi MCC masih baik berdasarkan tiga poin inspeksi utama yang diinput."];
  }

  if (item.formType === "service-ehca") {
    const notes = [];
    if (/ganti|kotor|buruk/i.test(payload.filterCondition || "")) {
      notes.push("Kondisi filter sudah perlu tindakan. Siapkan penggantian agar kualitas fluida tetap terjaga.");
    }
    if (!/tidak ada|normal/i.test(payload.leakCondition || "")) {
      notes.push("Terindikasi kebocoran pada unit. Lokalisir titik bocor sebelum berkembang menjadi gangguan operasi.");
    }
    return notes.length ? notes : ["Unit EH/CA tidak menunjukkan anomali dominan dari isian inspeksi ini."];
  }

  if (item.formType === "service-instrument") {
    if (/rusak|drift|noise|gangguan/i.test(payload.sensorCondition || "")) {
      return ["Kondisi sensor menunjukkan anomali. Lanjutkan verifikasi loop, mounting, dan kalibrasi ulang bila diperlukan."];
    }
    return ["Kondisi sensor relatif stabil dari catatan inspeksi saat ini."];
  }

  if (item.formType === "service-dcs") {
    const payload = normalizeDcsPayload(item.payload || {});
    const notes = [];

    const plcChecks = [
      ["Power Supply Module", payload.plcPowerSupplyModule],
      ["Communication Module", payload.plcCommunicationModule],
      ["Processor Module", payload.plcProcessorModule],
      ["Digital Input Module", payload.plcDigitalInputModule],
      ["Digital Output Module", payload.plcDigitalOutputModule],
      ["Analog Input Module", payload.plcAnalogInputModule],
      ["Analog Output Module", payload.plcAnalogOutputModule],
    ].filter(([, value]) => isDcsTextAbnormal(value));

    if (plcChecks.length > 0) {
      notes.push(`PLC module perlu perhatian pada ${plcChecks.map(([label]) => label).join(", ")}. Lanjutkan pengecekan power, komunikasi, dan health module terkait.`);
    }

    if (isDcsTextAbnormal(payload.fiberOpticEthernetCommunication)) {
      notes.push("Komunikasi fiber optic atau ethernet terindikasi tidak normal. Cek link status, konektor, patch cord, dan kualitas komunikasi antar node.");
    }

    const groundingIssues = [
      ["EE-EA", payload.groundingEeEa],
      ["EE-PE", payload.groundingEePe],
      ["EA-PE", payload.groundingEaPe],
    ].filter(([, value]) => isGroundingOutsideLimit(value));

    if (groundingIssues.length > 0) {
      notes.push(`Nilai grounding melebihi batas pada ${groundingIssues.map(([label]) => label).join(", ")}. Periksa bonding, koneksi grounding, dan resistansi jalur pembumian.`);
    }

    if (/kendor|longgar|lepas|tidak kencang/i.test(payload.cableTermination || "") && !/tidak kendor/i.test(payload.cableTermination || "")) {
      notes.push("Cable termination terindikasi kurang kencang. Lakukan pengencangan ulang dan inspeksi hot spot pada terminal terkait.");
    }

    if (isVoltageOutsideLimit(payload.upsOutput, 195, 225)) {
      notes.push("Output UPS berada di luar standar 195-225 VAC. Validasi input, baterai, dan kesehatan modul UPS.");
    }

    if (isVoltageOutsideLimit(payload.pdbOutput, 195, 225)) {
      notes.push("Output PDB berada di luar standar 195-225 VAC. Periksa distribusi suplai dan kestabilan tegangan panel.");
    }

    if (/panas|tidak dingin|> ?25|2[6-9]\s*c|[3-9][0-9]\s*c/i.test(payload.roomAcCondition || "") && !/dingin|< ?25/i.test(payload.roomAcCondition || "")) {
      notes.push("Kondisi AC atau temperatur room belum ideal. Pastikan suhu ruang panel tetap dingin untuk menjaga keandalan perangkat DCS.");
    }

    if (!/bersih/i.test(payload.roomCleanliness || "")) {
      notes.push("Kebersihan room atau panel belum ideal. Housekeeping perlu ditingkatkan untuk mencegah debu dan gangguan perangkat.");
    }

    if (hasMeaningfulDcsText(payload.damagedPartReplacement)) {
      notes.push("Terdapat catatan part rusak atau penggantian part. Pastikan histori penggantian dan validasi fungsi setelah penggantian tercatat.");
    }

    if (hasMeaningfulDcsText(payload.adjustmentRepair)) {
      notes.push("Ada tindakan adjustment atau repair pada inspeksi ini. Pastikan hasil perbaikan diverifikasi kembali pada operasi normal.");
    }

    return notes.length ? notes : ["Kondisi DCS dari isian ini belum menunjukkan temuan kritis."];
  }

  return ["Analisa otomatis belum tersedia untuk form ini."];
}

function buildCarbonBrushMatrixHtml(measurements, equipmentName, explicitPlant = "", replacedPoints = []) {
  const head = `
    <thead>
      <tr>
        <th>Titik</th>
        ${carbonBrushMeasurementColumns.map((column) => `<th>${column}</th>`).join("")}
      </tr>
    </thead>
  `;

  const body = carbonBrushMeasurementRows.map((row) => `
    <tr>
      <td>${row}</td>
      ${carbonBrushMeasurementColumns.map((column) => {
        const key = `${row}${column}`;
        const value = measurements[key] || "-";
        const bucket = classifyCarbonBrushValue(value, equipmentName, explicitPlant);
        const className = bucket ? `is-${bucket}` : "";
        const replacedClass = replacedPoints.includes(key) ? "is-replaced" : "";
        return `<td><button class="carbon-brush-input carbon-brush-point ${className} ${replacedClass}" type="button" data-action="open-carbon-brush-point" data-point-key="${key}">${escapeHtml(value)}</button></td>`;
      }).join("")}
    </tr>
  `).join("");

  return `<div class="carbon-brush-matrix-wrap"><table class="carbon-brush-matrix-table">${head}<tbody>${body}</tbody></table></div>`;
}

function openServiceDetail(item) {
  if (!serviceDetailModal || !serviceDetailContent || !serviceDetailTitle || !serviceDetailSubtitle) {
    return;
  }

  const payload = item.payload || {};
  const infoRows = [
    ["Tipe", item.type || "-"],
    ["Sub menu", item.subtype || item.type || "-"],
    ["Equipment", item.equipmentName || "-"],
    ["Tanggal inspeksi", formatInspectionDate(payload.inspectionDate)],
  ];
  const rawRows = formatServicePayloadLines(item);
  const analysisRows = analyzeServiceItem(item);
  activeServiceDetailItem = item;
  carbonBrushReplacementEditMode = false;
  carbonBrushReplacementDraft = normalizeCarbonBrushReplacedPoints(item.payload?.replacedPoints);

  let rawHtml = `<div class="detail-grid">${buildDetailGridRows(rawRows)}</div>`;
  if (item.formType === "service-motor-mv-carbon-brush") {
    rawHtml = `
      <div class="detail-toolbar">
        <button class="table-action" type="button" data-action="toggle-carbon-brush-replacement-mode">Tandai Titik Diganti</button>
        <button class="table-action" type="button" data-action="save-carbon-brush-replacements">Simpan Titik Diganti</button>
      </div>
      <div class="detail-grid">${buildDetailGridRows(formatCarbonBrushPayloadLines(item))}</div>
      ${buildCarbonBrushMatrixHtml(payload.measurements || {}, item.equipmentName || "", payload.plant || "", carbonBrushReplacementDraft)}
      <div id="carbon-brush-point-trend-slot"></div>
    `;
  }

  const photoEntries = getInspectionPhotoEntries(payload);
  const photoHtml = photoEntries.length > 0
    ? `
      <section class="detail-card">
        <h4>Lampiran Foto</h4>
        <div class="detail-photo-grid">
          ${photoEntries.map((entry, index) => `
            <div class="detail-photo-item">
              <img class="detail-photo" src="${escapeHtml(entry.data || entry.url || "")}" alt="Lampiran inspeksi ${escapeHtml(item.equipmentName || "")} ${index + 1}">
              <span>${escapeHtml(entry.name || `Foto ${index + 1}`)}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : "";

  serviceDetailTitle.textContent = item.equipmentName || "Hasil inspeksi";
  serviceDetailSubtitle.textContent = `${item.subtype || item.type || "Service"} • data mentah dan analisa hasil inspeksi`;
  serviceDetailContent.innerHTML = `
    <section class="detail-card">
      <h4>Informasi Umum</h4>
      <div class="detail-grid">${buildDetailGridRows(infoRows)}</div>
    </section>
    <section class="detail-card">
      <h4>Deskripsi Temuan</h4>
      <div class="detail-analysis">
        <div class="detail-analysis-item">${escapeHtml(item.description || "-")}</div>
      </div>
    </section>
    <section class="detail-card">
      <h4>Hasil Inspeksi</h4>
      ${rawHtml}
    </section>
    <section class="detail-card">
      <h4>Analisa</h4>
      <div class="detail-analysis">
        ${analysisRows.map((entry) => `<div class="detail-analysis-item">${escapeHtml(entry)}</div>`).join("")}
      </div>
    </section>
    ${photoHtml}
  `;

  serviceDetailModal.classList.remove("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "false");
}

function getBomItemById(itemId) {
  if (!itemId) {
    return null;
  }
  return getBomItemsFromDom().find((item) => item.id === itemId) || null;
}

function renderBomDetailPhotoItem(label, filename) {
  const normalized = normalizeBomPhotoName(filename);
  const imageUrl = buildBomPhotoPath(normalized);
  return `
    <div class="detail-photo-item bom-detail-photo-item">
      <strong class="bom-detail-photo-label">${escapeHtml(label)}</strong>
      ${
        normalized
          ? `<img class="detail-photo bom-detail-photo" src="${imageUrl}" alt="${escapeHtml(label)} ${escapeHtml(normalized)}">`
          : `<div class="bom-detail-photo-empty">Belum ada foto</div>`
      }
      <span>${escapeHtml(normalized || "-")}</span>
    </div>
  `;
}

function openBomDetail(item) {
  if (!serviceDetailModal || !serviceDetailContent || !serviceDetailTitle || !serviceDetailSubtitle) {
    return;
  }

  const infoRows = [
    ["Equipment", item.equipment || "-"],
    ["Part", item.part || "-"],
    ["Jumlah", item.qty || "-"],
    ["Keterangan", item.note || "-"],
  ];

  serviceDetailTitle.textContent = item.part || item.equipment || "Detail BOM";
  serviceDetailSubtitle.textContent = `${item.equipment || "-"} • detail part BOM dan lampiran foto`;
  serviceDetailContent.innerHTML = `
    <section class="detail-card">
      <h4>Informasi Part</h4>
      <div class="detail-grid">${buildDetailGridRows(infoRows)}</div>
    </section>
    <section class="detail-card">
      <h4>Long Text</h4>
      <div class="detail-analysis">
        <div class="detail-analysis-item">${escapeHtml(item.longText || "-")}</div>
      </div>
    </section>
    <section class="detail-card">
      <h4>Foto Part</h4>
      <div class="detail-photo-grid bom-detail-photo-grid">
        ${renderBomDetailPhotoItem("Foto Barang", item.itemPhoto)}
        ${renderBomDetailPhotoItem("Foto Nameplate", item.nameplatePhoto)}
        ${renderBomDetailPhotoItem("Foto Lain", item.extraPhoto)}
      </div>
    </section>
  `;

  serviceDetailModal.classList.remove("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "false");
}

function renderBomMotorDetailPhotoItem(label, filename) {
  const normalized = normalizeBomPhotoName(filename);
  const imageUrl = buildBomMotorPhotoPath(normalized);
  return `
    <div class="detail-photo-item bom-detail-photo-item">
      <strong class="bom-detail-photo-label">${escapeHtml(label)}</strong>
      ${
        normalized
          ? `<img class="detail-photo bom-detail-photo" src="${imageUrl}" alt="${escapeHtml(label)} ${escapeHtml(normalized)}">`
          : `<div class="bom-detail-photo-empty">Belum ada foto</div>`
      }
      <span>${escapeHtml(normalized || "-")}</span>
    </div>
  `;
}

function openBomMotorDetail(item) {
  if (!serviceDetailModal || !serviceDetailContent || !serviceDetailTitle || !serviceDetailSubtitle) {
    return;
  }

  const infoRows = [
    ["Tanggal", item.inspectionDate || "-"],
    ["Equipment", item.equipment || "-"],
    ["Manufacture", item.manufacture || "-"],
    ["Power", item.power || "-"],
    ["Ampere", item.ampere || "-"],
    ["Voltage", item.voltage || "-"],
    ["Speed", item.speed || "-"],
    ["Frame", item.frame || "-"],
    ["Serial Nr.", item.serialNumber || "-"],
    ["Keterangan", item.note || "-"],
  ];

  serviceDetailTitle.textContent = item.equipment || "Detail BOM Motor";
  serviceDetailSubtitle.textContent = `${item.manufacture || "-"} • detail motor dan lampiran foto`;
  serviceDetailContent.innerHTML = `
    <section class="detail-card">
      <h4>Informasi Motor</h4>
      <div class="detail-grid">${buildDetailGridRows(infoRows)}</div>
    </section>
    <section class="detail-card">
      <h4>Long Text</h4>
      <div class="detail-analysis">
        <div class="detail-analysis-item">${escapeHtml(item.longText || "-")}</div>
      </div>
    </section>
    <section class="detail-card">
      <h4>Foto Motor</h4>
      <div class="detail-photo-grid bom-detail-photo-grid">
        ${renderBomMotorDetailPhotoItem("Foto Motor", item.motorPhoto)}
        ${renderBomMotorDetailPhotoItem("Foto Nameplate", item.nameplatePhoto)}
        ${renderBomMotorDetailPhotoItem("Foto Koneksi", item.connectionPhoto)}
      </div>
    </section>
  `;

  serviceDetailModal.classList.remove("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "false");
}

function openServiceGroupDetail(serviceType) {
  if (!serviceDetailModal || !serviceDetailContent || !serviceDetailTitle || !serviceDetailSubtitle) {
    return;
  }

  const items = getServiceItemsFromDom()
    .filter((item) => item.type === serviceType);

  serviceDetailTitle.textContent = `Detail ${serviceType}`;
  serviceDetailSubtitle.textContent = `Daftar penuh hasil inspeksi ${serviceType}. Klik item untuk membuka detail inspeksi.`;

  if (!items.length) {
    serviceDetailContent.innerHTML = `
      <section class="detail-card">
        <div class="detail-analysis">
          <div class="detail-analysis-item">Belum ada hasil inspeksi pada kolom ${escapeHtml(serviceType)}.</div>
        </div>
      </section>
    `;
  } else {
    serviceDetailContent.innerHTML = `
      <section class="detail-card">
        <h4>Daftar Hasil Inspeksi</h4>
        <div class="service-group-detail-list">
          ${items.map((item) => `
            <button class="service-group-detail-item" type="button" data-action="open-service-item-detail" data-id="${escapeHtml(item.id || "")}">
              <div>
                <strong>${escapeHtml(item.equipmentName || "-")}</strong>
                <span>${escapeHtml(item.subtype || item.type || "-")}</span>
              </div>
              <small>${escapeHtml(formatInspectionDate(item.payload?.inspectionDate))}</small>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  serviceDetailModal.classList.remove("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "false");
}

function closeServiceDetail() {
  if (!serviceDetailModal) {
    return;
  }
  activeServiceDetailItem = null;
  carbonBrushReplacementEditMode = false;
  carbonBrushReplacementDraft = [];
  serviceDetailModal.classList.add("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "true");
}

async function saveCarbonBrushReplacementSelection() {
  if (!activeServiceDetailItem || activeServiceDetailItem.formType !== "service-motor-mv-carbon-brush") {
    return;
  }

  const updatedItem = {
    ...activeServiceDetailItem,
    payload: {
      ...(activeServiceDetailItem.payload || {}),
      replacedPoints: [...carbonBrushReplacementDraft],
    },
  };
  const savedItem = await saveItemToBackend("service", updatedItem, true);
  const nextItems = getServiceItemsFromDom().map((entry) => (entry.id === savedItem.id ? savedItem : entry));
  renderServiceBoard(nextItems);
  persistServiceList();
  updateDashboardStats();
  applyServiceFilter();
  openServiceDetail(savedItem);
}

function setSubmitNote(form, message) {
  let note = form.querySelector(".submit-note");
  if (!note) {
    note = document.createElement("div");
    note.className = "submit-note";
    form.appendChild(note);
  }
  note.textContent = message;
}

function showToast(title, message) {
  if (!toastStack) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  toastStack.prepend(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

function formatServicePayloadLines(item) {
  const payload = item.payload || {};
  const photoSummary = buildFindingPhotoCompatibility(getInspectionPhotoEntries(payload)).findingPhotoName;

  if (item.formType === "service-electrical-room") {
    return [
      ["Kondisi pintu panel", payload.panelDoorCondition || "-"],
      ["Kebersihan lantai", payload.floorCleanliness || "-"],
      ["Temperature ruangan", payload.roomTemperature || "-"],
      ["Battery charge VDC", payload.batteryVdc || "-"],
      ["Battery charge Amper", payload.batteryAmpere || "-"],
      ["VDC battery total", payload.batteryTotalVdc || "-"],
      ["VDC battery 1", payload.battery1 || "-"],
      ["VDC battery 2", payload.battery2 || "-"],
      ["VDC battery 3", payload.battery3 || "-"],
      ["VDC battery 4", payload.battery4 || "-"],
      ["VDC battery 5", payload.battery5 || "-"],
      ["VDC battery 6", payload.battery6 || "-"],
      ["VDC battery 7", payload.battery7 || "-"],
      ["VDC battery 8", payload.battery8 || "-"],
      ["VDC battery 9", payload.battery9 || "-"],
      ["VDC battery 10", payload.battery10 || "-"],
      ["Equipment trafo", payload.transformerEquipment || "-"],
      ["Temperature winding", payload.transformerWindingTemperature || "-"],
      ["Temperature oil", payload.transformerOilTemperature || "-"],
      ["Level oil", payload.transformerOilLevel || "-"],
      ["Silica gel", payload.transformerSilicaGel || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  if (item.formType === "service-motor-mv") {
    return [
      ["Vibrasi DE", payload.vibrationDe || "-"],
      ["Vibrasi NDE", payload.vibrationNde || "-"],
      ["Suhu winding", payload.windingTemperature || "-"],
      ["Kondisi bearing", payload.bearingCondition || "-"],
      ["Arus motor", payload.motorCurrent || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  if (item.formType === "service-motor-mv-carbon-brush") {
    return formatCarbonBrushPayloadLines(item);
  }

  if (item.formType === "service-mcc") {
    return [
      ["Test fungsi", payload.testFunction || "-"],
      ["Visual", payload.visualCondition || "-"],
      ["Kebersihan part", payload.partCleanliness || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  if (item.formType === "service-ehca") {
    return [
      ["Tekanan sistem", payload.systemPressure || "-"],
      ["Level oli/media", payload.fluidLevel || "-"],
      ["Kondisi filter", payload.filterCondition || "-"],
      ["Kebocoran", payload.leakCondition || "-"],
      ["Kondisi unit", payload.unitCondition || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  if (item.formType === "service-instrument") {
    return [
      ["Kondisi sensor", payload.sensorCondition || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  if (item.formType === "service-dcs") {
    const payload = normalizeDcsPayload(item.payload || {});
    return [
      ["Deskripsi equipment", payload.equipmentDescription || "-"],
      ["PLC MODULE - Power Supply Module", payload.plcPowerSupplyModule || "-"],
      ["PLC MODULE - Communication Module", payload.plcCommunicationModule || "-"],
      ["PLC MODULE - Processor Module", payload.plcProcessorModule || "-"],
      ["PLC MODULE - Digital Input Module", payload.plcDigitalInputModule || "-"],
      ["PLC MODULE - Digital Output Module", payload.plcDigitalOutputModule || "-"],
      ["PLC MODULE - Analog Input Module", payload.plcAnalogInputModule || "-"],
      ["PLC MODULE - Analog Output Module", payload.plcAnalogOutputModule || "-"],
      ["Fiber optic & Ethernet communication", payload.fiberOpticEthernetCommunication || "-"],
      ["Grounding System - EE-EA", payload.groundingEeEa || "-"],
      ["Grounding System - EE-PE", payload.groundingEePe || "-"],
      ["Grounding System - EA-PE", payload.groundingEaPe || "-"],
      ["Cable Termination", payload.cableTermination || "-"],
      ["UPS", payload.upsOutput || "-"],
      ["PDB", payload.pdbOutput || "-"],
      ["Room & Panel - AC", payload.roomAcCondition || "-"],
      ["Room & Panel - Kebersihan", payload.roomCleanliness || "-"],
      ["Kondisi Rusak - Penggantian Part", payload.damagedPartReplacement || "-"],
      ["Terjadi Penyimpangan - Adjustment / Repair", payload.adjustmentRepair || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  return [["Detail", item.detail || "-"]];
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text || "-").split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
      return;
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : ["-"];
}

function formatInspectionDate(value) {
  if (!value) {
    return new Date().toLocaleDateString("id-ID");
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString("id-ID");
}

function parseInspectionDateValue(value) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDaysBetweenDates(startDate, endDate) {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return null;
  }
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.round(diffMs / 86400000);
}

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

function detectCarbonBrushReplacementEvents(history, thresholdHigh) {
  const events = [];
  history.forEach((entry, index) => {
    if (!entry.replacedConfirmed) {
      return;
    }
    const previous = index > 0 ? history[index - 1] : null;
    events.push({
      date: entry.inspectionDate,
      dateLabel: entry.inspectionDateLabel,
      daysSincePrevious: previous ? getDaysBetweenDates(previous.inspectionDate, entry.inspectionDate) : null,
      reason: "Penggantian dikonfirmasi user",
      confirmed: true,
    });
  });

  for (let index = 1; index < history.length; index += 1) {
    const previous = history[index - 1];
    const current = history[index];
    const replacementIncreased = (
      previous.replacementValue !== null
      && current.replacementValue !== null
      && current.replacementValue > previous.replacementValue
    );
    const recoveredFromRed = (
      previous.bucket === "low"
      && current.numericValue !== null
      && current.numericValue >= thresholdHigh
    );
    const largePositiveJump = (
      previous.numericValue !== null
      && current.numericValue !== null
      && current.numericValue - previous.numericValue >= 5
      && previous.bucket !== "high"
    );

    if (replacementIncreased || recoveredFromRed || largePositiveJump) {
      const duplicateConfirmed = events.some((event) => event.dateLabel === current.inspectionDateLabel);
      events.push({
        date: current.inspectionDate,
        dateLabel: current.inspectionDateLabel,
        daysSincePrevious: getDaysBetweenDates(previous.inspectionDate, current.inspectionDate),
        confirmed: duplicateConfirmed,
        reason: replacementIncreased
          ? "Counter replacement naik"
          : recoveredFromRed
            ? "Nilai pulih dari merah ke aman"
            : "Lonjakan nilai setelah titik perhatian",
      });
    }
  }
  return events
    .sort((left, right) => {
      if (!(left.date instanceof Date) || !(right.date instanceof Date)) {
        return 0;
      }
      return left.date - right.date;
    })
    .filter((event, index, array) => index === array.findIndex((candidate) =>
      candidate.dateLabel === event.dateLabel && candidate.reason === event.reason));
}

function buildCarbonBrushTrendSvg(history, threshold) {
  const width = 860;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 40, left: 44 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const numericPoints = history.filter((entry) => entry.numericValue !== null);
  if (!numericPoints.length) {
    return '<div class="trend-empty">Belum ada titik ukur numerik untuk ditampilkan.</div>';
  }

  const values = numericPoints.map((entry) => entry.numericValue);
  const minValue = Math.min(...values, threshold.low) - 2;
  const maxValue = Math.max(...values, threshold.high) + 2;
  const xStep = numericPoints.length > 1 ? chartWidth / (numericPoints.length - 1) : chartWidth / 2;
  const valueToY = (value) => padding.top + ((maxValue - value) / (maxValue - minValue || 1)) * chartHeight;
  const points = numericPoints.map((entry, index) => ({
    x: padding.left + (numericPoints.length > 1 ? index * xStep : chartWidth / 2),
    y: valueToY(entry.numericValue),
    value: entry.numericValue,
    label: entry.inspectionDateLabel,
    bucket: entry.bucket,
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const thresholdLowY = valueToY(threshold.low);
  const thresholdHighY = valueToY(threshold.high);

  return `
    <svg class="trend-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik tren titik carbon brush">
      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" rx="14" fill="rgba(255,255,255,0.02)"></rect>
      <line x1="${padding.left}" y1="${thresholdLowY}" x2="${width - padding.right}" y2="${thresholdLowY}" stroke="rgba(255,107,120,0.7)" stroke-dasharray="6 6"></line>
      <line x1="${padding.left}" y1="${thresholdHighY}" x2="${width - padding.right}" y2="${thresholdHighY}" stroke="rgba(115,224,169,0.7)" stroke-dasharray="6 6"></line>
      <polyline fill="none" stroke="rgba(124,199,255,0.95)" stroke-width="3" points="${polyline}"></polyline>
      ${points.map((point) => `
        <g>
          <circle cx="${point.x}" cy="${point.y}" r="5.5" class="trend-point ${point.bucket ? `is-${point.bucket}` : ""}"></circle>
          <text x="${point.x}" y="${height - 14}" text-anchor="middle" class="trend-axis-label">${escapeHtml(point.label)}</text>
        </g>
      `).join("")}
      <text x="${padding.left}" y="${thresholdLowY - 8}" class="trend-threshold low">Batas merah ${threshold.low}</text>
      <text x="${padding.left}" y="${thresholdHighY - 8}" class="trend-threshold high">Batas hijau ${threshold.high}</text>
    </svg>
  `;
}

function buildCarbonBrushTrendHtml(item, pointKey) {
  const payload = item.payload || {};
  const threshold = getCarbonBrushThresholdConfig(item.equipmentName || "", payload.plant || "");
  const history = getCarbonBrushPointHistory(item, pointKey);
  const redDates = history.filter((entry) => entry.bucket === "low");
  const events = detectCarbonBrushReplacementEvents(history, threshold.high);
  const confirmedReplacementDates = history
    .filter((entry) => entry.replacedConfirmed)
    .map((entry) => entry.inspectionDateLabel);
  const lastEvent = events.length ? events[events.length - 1] : null;

  return `
    <section class="detail-card carbon-brush-trend-card">
      <div class="detail-modal-head compact-trend-head">
        <div>
          <h4>Tren Titik ${escapeHtml(pointKey)} - ${escapeHtml(item.equipmentName || "-")}</h4>
          <p>Riwayat nilai titik ${escapeHtml(pointKey)} untuk melihat saat turun ke merah dan indikasi penggantian.</p>
        </div>
      </div>
      ${buildCarbonBrushTrendSvg(history, threshold)}
      <div class="detail-grid trend-summary-grid">
        ${buildDetailGridRows([
          ["Total histori", `${history.length} inspeksi`],
          ["Masuk merah", `${redDates.length} kali`],
          ["Tanggal merah", redDates.length ? redDates.map((entry) => entry.inspectionDateLabel).join(", ") : "-"],
          ["Ganti terkonfirmasi", confirmedReplacementDates.length ? `${confirmedReplacementDates.length} kali` : "0 kali"],
          ["Tanggal ganti", confirmedReplacementDates.length ? confirmedReplacementDates.join(", ") : "-"],
          ["Event penggantian", `${events.length} event`],
          ["Event terakhir", lastEvent ? lastEvent.dateLabel : "-"],
          ["Jarak event terakhir", lastEvent?.daysSincePrevious !== null ? `${lastEvent.daysSincePrevious} hari` : "-"],
        ])}
      </div>
      <div class="detail-analysis trend-event-list">
        ${(events.length ? events : [{ dateLabel: "-", daysSincePrevious: null, reason: "Belum ada indikasi penggantian dari histori yang tersimpan." }]).map((event) => `
          <div class="detail-analysis-item">
            <strong>${escapeHtml(event.dateLabel)}</strong>
            <span>${escapeHtml(event.reason)}${event.confirmed ? " | terkonfirmasi" : ""}${event.daysSincePrevious !== null ? ` | interval ${event.daysSincePrevious} hari` : ""}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

async function createServiceInspectionImage(item) {
  const payloadLines = formatServicePayloadLines(item);
  const payload = item.payload || {};
  const photoEntries = getInspectionPhotoEntries(payload);
  const photoImages = (await Promise.all(
    photoEntries.map(async (entry, index) => {
      const source = entry?.data || entry?.url || "";
      if (!source) {
        return null;
      }
      const image = await loadImageElement(source).catch(() => null);
      if (!image) {
        return null;
      }
      return {
        image,
        name: entry.name || `Foto ${index + 1}`,
      };
    }),
  )).filter(Boolean);
  const titleText = `HASIL INSPEKSI ${String(item.subtype || item.type || "SERVICE").toUpperCase()} - ${item.equipmentName || "-"}`;
  const inspectionDate = formatInspectionDate(payload.inspectionDate);
  const analysisLines = analyzeServiceItem(item);
  const headerLines = [
    ["Tipe inspeksi", item.type || "-"],
    ["Sub menu", item.subtype || item.type || "-"],
    ["Equipment", item.equipmentName || "-"],
    ["Tanggal inspeksi", inspectionDate],
  ];

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas tidak tersedia");
  }

  const width = 1800;
  const padding = 84;
  const contentWidth = width - (padding * 2);
  canvas.width = width;

  context.font = "34px Arial";
  const rowGap = 18;
  const sectionGap = 34;
  const titleLineHeight = 60;
  const bodyLineHeight = 42;
  const titleLines = wrapCanvasText(context, titleText, contentWidth);
  const isElectricalRoom = item.formType === "service-electrical-room";
  const isCarbonBrush = item.formType === "service-motor-mv-carbon-brush";
  const batteryChargeRows = [
    ["Battery charge VDC", payload.batteryVdc || "-"],
    ["Battery charge Amper", payload.batteryAmpere || "-"],
    ["VDC battery total", payload.batteryTotalVdc || "-"],
    ["VDC battery 1", payload.battery1 || "-"],
    ["VDC battery 2", payload.battery2 || "-"],
    ["VDC battery 3", payload.battery3 || "-"],
    ["VDC battery 4", payload.battery4 || "-"],
    ["VDC battery 5", payload.battery5 || "-"],
    ["VDC battery 6", payload.battery6 || "-"],
    ["VDC battery 7", payload.battery7 || "-"],
    ["VDC battery 8", payload.battery8 || "-"],
    ["VDC battery 9", payload.battery9 || "-"],
    ["VDC battery 10", payload.battery10 || "-"],
  ];
  const transformerRows = [
    ["Equipment trafo", payload.transformerEquipment || "-"],
    ["Temperature winding", payload.transformerWindingTemperature || "-"],
    ["Temperature oil", payload.transformerOilTemperature || "-"],
    ["Level oil", payload.transformerOilLevel || "-"],
    ["Silica gel", payload.transformerSilicaGel || "-"],
  ];
  const generalElectricalRows = [
    ["Kondisi pintu panel", payload.panelDoorCondition || "-"],
    ["Kebersihan lantai", payload.floorCleanliness || "-"],
    ["Temperature ruangan", payload.roomTemperature || "-"],
  ];
  const defaultLabelWidth = 500;
  const valueColumnGap = 34;

  let estimatedHeight = 220 + (titleLines.length * titleLineHeight);
  const measureRows = (rows, totalWidth = contentWidth, labelWidth = defaultLabelWidth) => {
    const safeLabelWidth = Math.min(labelWidth, Math.max(280, totalWidth * 0.44));
    const valueWidth = Math.max(220, totalWidth - safeLabelWidth - valueColumnGap);
    rows.forEach(([label, value]) => {
      const wrappedLabel = wrapCanvasText(context, label, safeLabelWidth - 8);
      const wrappedValue = wrapCanvasText(context, value, valueWidth);
      const lineCount = Math.max(wrappedLabel.length, wrappedValue.length);
      estimatedHeight += (lineCount * bodyLineHeight) + rowGap;
    });
  };

  measureRows(headerLines);
  estimatedHeight += 96;
  const descriptionLines = wrapCanvasText(context, item.description || "-", contentWidth);
  estimatedHeight += descriptionLines.length * bodyLineHeight;
  estimatedHeight += sectionGap + 60;
  estimatedHeight += sectionGap;
  if (isElectricalRoom) {
    measureRows(generalElectricalRows);
    estimatedHeight += 108;
    estimatedHeight += 6 * 48;
    estimatedHeight += 7 * 48;
    estimatedHeight += 54;
    measureRows(transformerRows);
    if (payload.findingPhotoName) {
      estimatedHeight += 58;
    }
  } else if (isCarbonBrush) {
    measureRows(formatCarbonBrushPayloadLines(item));
    estimatedHeight += 26 * 50;
  } else {
    measureRows(payloadLines);
  }
  analysisLines.forEach((entry) => {
    const wrapped = wrapCanvasText(context, entry, contentWidth - 36);
    estimatedHeight += (wrapped.length * 40) + 28;
  });
  if (photoImages.length > 0) {
    const photoColumns = photoImages.length === 1 ? 1 : 2;
    const photoCardWidth = (contentWidth - 44 - ((photoColumns - 1) * 18)) / photoColumns;
    const photoHeights = photoImages.map(({ image }) => {
      const ratio = Math.min(photoCardWidth / image.width, 320 / image.height, 1);
      return (image.height * ratio) + 48;
    });
    const photoRows = [];
    for (let index = 0; index < photoHeights.length; index += photoColumns) {
      photoRows.push(Math.max(...photoHeights.slice(index, index + photoColumns)));
    }
    estimatedHeight += sectionGap + photoRows.reduce((total, rowHeight) => total + rowHeight + 18, 0);
  }
  estimatedHeight += 80;

  canvas.height = estimatedHeight;

  context.fillStyle = "#0b1220";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const drawCardSection = (title, startY, drawer) => {
    const cardPaddingX = 30;
    const cardPaddingTop = 28;
    const titleHeight = 40;
    const innerWidth = contentWidth - (cardPaddingX * 2);
    const measuredHeight = drawer(null, startY + cardPaddingTop + titleHeight + 10, innerWidth, true);
    const cardHeight = measuredHeight - startY + 28;

    context.fillStyle = "rgba(255,255,255,0.035)";
    context.strokeStyle = "rgba(124, 199, 255, 0.16)";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(padding, startY, contentWidth, cardHeight, 22);
    context.fill();
    context.stroke();

    context.fillStyle = "#15b8a6";
    context.font = "700 30px Arial";
    context.fillText(title, padding + cardPaddingX, startY + cardPaddingTop + 8);

    return drawer(context, startY + cardPaddingTop + titleHeight + 10, innerWidth, false) + 28;
  };

  const drawRows = (rows, y, leftX = padding, totalWidth = contentWidth, labelWidth = defaultLabelWidth) => {
    const safeLabelWidth = Math.min(labelWidth, Math.max(280, totalWidth * 0.44));
    const valueX = leftX + safeLabelWidth + valueColumnGap;
    const valueWidth = Math.max(220, totalWidth - safeLabelWidth - valueColumnGap);
    rows.forEach(([label, value]) => {
      const wrappedLabel = wrapCanvasText(context, label, safeLabelWidth - 8);
      const wrappedValue = wrapCanvasText(context, value, valueWidth);
      const lineCount = Math.max(wrappedLabel.length, wrappedValue.length);

      context.fillStyle = "#7cc7ff";
      context.font = "700 28px Arial";
      wrappedLabel.forEach((line, index) => {
        context.fillText(line, leftX, y + (index * bodyLineHeight));
      });

      context.fillStyle = "#eef6ff";
      context.font = "28px Arial";
      wrappedValue.forEach((line, index) => {
        context.fillText(line, valueX, y + (index * bodyLineHeight));
      });
      y += (lineCount * bodyLineHeight) + rowGap;
    });
    return y;
  };

  const drawBatteryColumns = (rows, y, leftX = padding + 30, totalWidth = contentWidth - 60) => {
    const leftRows = rows.slice(0, Math.ceil(rows.length / 2));
    const rightRows = rows.slice(Math.ceil(rows.length / 2));
    const columnGap = 46;
    const columnWidth = (totalWidth - columnGap) / 2;
    const labelWidth = 250;
    const valueWidth = columnWidth - labelWidth;
    const rowHeight = 48;

    const drawColumn = (columnRows, x, startY) => {
      columnRows.forEach(([label, value], index) => {
        const rowY = startY + (index * rowHeight);
        context.fillStyle = "#7cc7ff";
        context.font = "700 24px Arial";
        context.fillText(label, x, rowY);
        context.fillStyle = "#eef6ff";
        context.font = "24px Arial";
        const wrapped = wrapCanvasText(context, value, valueWidth);
        wrapped.slice(0, 2).forEach((line, lineIndex) => {
          context.fillText(line, x + labelWidth, rowY + (lineIndex * 28));
        });
      });
      return startY + (columnRows.length * rowHeight);
    };

    const leftBottom = drawColumn(leftRows, leftX, y);
    const rightBottom = drawColumn(rightRows, leftX + columnWidth + columnGap, y);
    return Math.max(leftBottom, rightBottom);
  };

  const drawAnalysis = (entries, y, leftX = padding + 22, boxWidth = contentWidth - 44) => {
    entries.forEach((entry) => {
      const wrapped = wrapCanvasText(context, entry, boxWidth - 34);
      const itemHeight = (wrapped.length * 40) + 24;
      context.fillStyle = "rgba(124, 199, 255, 0.06)";
      context.strokeStyle = "rgba(124, 199, 255, 0.14)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.roundRect(leftX, y, boxWidth, itemHeight, 14);
      context.fill();
      context.stroke();

      context.fillStyle = "#eef6ff";
      context.font = "28px Arial";
      wrapped.forEach((line, index) => {
        context.fillText(line, leftX + 18, y + 32 + (index * 36));
      });
      y += itemHeight + 12;
    });
    return y;
  };

  const drawCarbonBrushMatrix = (measurements, equipmentName, explicitPlant, y, startX = padding + 30) => {
    const rowLabelWidth = 60;
    const cellWidth = 126;
    const cellHeight = 46;
    const tableWidth = rowLabelWidth + (cellWidth * carbonBrushMeasurementColumns.length);

    context.fillStyle = "rgba(124, 199, 255, 0.08)";
    context.font = "700 22px Arial";
    context.fillText("Titik", startX + 10, y + 28);
    carbonBrushMeasurementColumns.forEach((column, index) => {
      context.fillText(String(column), startX + rowLabelWidth + 20 + (index * cellWidth), y + 28);
    });
    y += 42;

    carbonBrushMeasurementRows.forEach((row) => {
      context.fillStyle = "rgba(255,255,255,0.03)";
      context.fillRect(startX, y, rowLabelWidth, cellHeight);
      context.fillStyle = "#eef6ff";
      context.font = "700 22px Arial";
      context.fillText(row, startX + 18, y + 30);

      carbonBrushMeasurementColumns.forEach((column, index) => {
        const key = `${row}${column}`;
        const value = measurements[key] || "-";
        const bucket = classifyCarbonBrushValue(value, equipmentName, explicitPlant);
        const fillMap = {
          low: "rgba(255, 107, 107, 0.18)",
          medium: "rgba(255, 194, 102, 0.18)",
          high: "rgba(50, 211, 153, 0.18)",
        };
        context.fillStyle = fillMap[bucket] || "rgba(255,255,255,0.03)";
        context.fillRect(startX + rowLabelWidth + (index * cellWidth), y, cellWidth, cellHeight);
        context.strokeStyle = "rgba(124, 199, 255, 0.12)";
        context.strokeRect(startX + rowLabelWidth + (index * cellWidth), y, cellWidth, cellHeight);
        context.fillStyle = "#eef6ff";
        context.font = "20px Arial";
        context.fillText(String(value), startX + rowLabelWidth + 12 + (index * cellWidth), y + 30);
      });
      y += cellHeight;
    });

    context.strokeStyle = "rgba(124, 199, 255, 0.12)";
    context.strokeRect(startX, y - (cellHeight * carbonBrushMeasurementRows.length), tableWidth, (cellHeight * carbonBrushMeasurementRows.length) + 36);
    return y;
  };

  let y = 86;
  context.textAlign = "center";
  context.fillStyle = "#eef6ff";
  context.font = "700 54px Arial";
  titleLines.forEach((line) => {
    context.fillText(line, width / 2, y);
    y += titleLineHeight;
  });

  context.fillStyle = "#9bb0c8";
  context.font = "30px Arial";
  context.fillText(`Tanggal inspeksi: ${inspectionDate}`, width / 2, y);
  context.textAlign = "left";

  y += sectionGap;
  y = drawCardSection("Informasi Umum", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    if (measuringOnly) {
      let currentY = cardY;
      headerLines.forEach(([, value]) => {
        const wrapped = wrapCanvasText(context, value, innerWidth - defaultLabelWidth - valueColumnGap);
        currentY += (wrapped.length * bodyLineHeight) + rowGap;
      });
      return currentY;
    }
    return drawRows(headerLines, cardY, padding + 30, innerWidth, 360);
  });

  y += sectionGap;
  y = drawCardSection("Deskripsi Temuan", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    const lines = wrapCanvasText(context, item.description || "-", innerWidth);
    if (measuringOnly) {
      return cardY + (lines.length * bodyLineHeight);
    }
    context.fillStyle = "#eef6ff";
    context.font = "28px Arial";
    lines.forEach((line) => {
      context.fillText(line, padding + 30, cardY);
      cardY += bodyLineHeight;
    });
    return cardY;
  });

  y += sectionGap;
  y = drawCardSection("Hasil Inspeksi", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    if (isElectricalRoom) {
      if (measuringOnly) {
        let currentY = cardY;
        generalElectricalRows.forEach(([label, value]) => {
          const wrappedLabel = wrapCanvasText(context, label, defaultLabelWidth - 8);
          const wrappedValue = wrapCanvasText(context, value, innerWidth - defaultLabelWidth - valueColumnGap);
          currentY += (Math.max(wrappedLabel.length, wrappedValue.length) * bodyLineHeight) + rowGap;
        });
        currentY += 64 + (Math.ceil(batteryChargeRows.length / 2) * 48) + 56 + (transformerRows.length * (bodyLineHeight + 6));
        if (payload.findingPhotoName) {
          currentY += bodyLineHeight + 12;
        }
        return currentY;
      }
      let currentY = drawRows(generalElectricalRows, cardY, padding + 30, innerWidth);
      currentY += 16;
      context.fillStyle = "#15b8a6";
      context.font = "700 28px Arial";
      context.fillText("Battery Charge", padding + 30, currentY);
      currentY += 42;
      currentY = drawBatteryColumns(batteryChargeRows, currentY, padding + 30, innerWidth);
      currentY += 26;
      context.fillStyle = "#15b8a6";
      context.font = "700 28px Arial";
      context.fillText("Transformator", padding + 30, currentY);
      currentY += 42;
      currentY = drawRows(transformerRows, currentY, padding + 30, innerWidth);
      if (payload.findingPhotoName) {
        currentY = drawRows([["Foto temuan", payload.findingPhotoName]], currentY + 12, padding + 30, innerWidth);
      }
      return currentY;
    }

    if (isCarbonBrush) {
      const summaryRows = formatCarbonBrushPayloadLines(item);
      if (measuringOnly) {
        let currentY = cardY;
        summaryRows.forEach(([label, value]) => {
          const wrappedLabel = wrapCanvasText(context, label, defaultLabelWidth - 8);
          const wrappedValue = wrapCanvasText(context, value, innerWidth - defaultLabelWidth - valueColumnGap);
          currentY += (Math.max(wrappedLabel.length, wrappedValue.length) * bodyLineHeight) + rowGap;
        });
        currentY += 44 + (carbonBrushMeasurementRows.length * 46) + 50;
        return currentY;
      }
      let currentY = drawRows(summaryRows, cardY, padding + 30, innerWidth);
      currentY += 24;
      currentY = drawCarbonBrushMatrix(payload.measurements || {}, item.equipmentName || "", payload.plant || "", currentY, padding + 30);
      return currentY;
    }

    if (measuringOnly) {
      let currentY = cardY;
      payloadLines.forEach(([label, value]) => {
        const wrappedLabel = wrapCanvasText(context, label, defaultLabelWidth - 8);
        const wrappedValue = wrapCanvasText(context, value, innerWidth - defaultLabelWidth - valueColumnGap);
        currentY += (Math.max(wrappedLabel.length, wrappedValue.length) * bodyLineHeight) + rowGap;
      });
      return currentY;
    }
    return drawRows(payloadLines, cardY, padding + 30, innerWidth);
  });

  y += sectionGap;
  y = drawCardSection("Analisa", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    if (measuringOnly) {
      let currentY = cardY;
      analysisLines.forEach((entry) => {
        const wrapped = wrapCanvasText(context, entry, innerWidth - 28);
        currentY += (wrapped.length * 40) + 24 + 12;
      });
      return currentY;
    }
    return drawAnalysis(analysisLines, cardY, padding + 30, innerWidth);
  });

  if (photoImages.length > 0) {
    y += sectionGap;
    y = drawCardSection("Lampiran Foto", y, (_ctx, cardY, innerWidth, measuringOnly) => {
      if (measuringOnly) {
        const columns = photoImages.length === 1 ? 1 : 2;
        const gap = 24;
        const photoBoxWidth = (innerWidth - ((columns - 1) * gap)) / columns;
        let currentY = cardY;
        for (let index = 0; index < photoImages.length; index += columns) {
          const rowItems = photoImages.slice(index, index + columns);
          const rowHeight = Math.max(...rowItems.map(({ image }) => {
            const ratio = Math.min(photoBoxWidth / image.width, 320 / image.height, 1);
            return (image.height * ratio) + 58;
          }));
          currentY += rowHeight + gap;
        }
        return currentY;
      }
      const columns = photoImages.length === 1 ? 1 : 2;
      const gap = 24;
      const photoBoxWidth = (innerWidth - ((columns - 1) * gap)) / columns;
      let currentY = cardY;

      for (let index = 0; index < photoImages.length; index += columns) {
        const rowItems = photoImages.slice(index, index + columns);
        const rowHeight = Math.max(...rowItems.map(({ image }) => {
          const ratio = Math.min(photoBoxWidth / image.width, 320 / image.height, 1);
          return (image.height * ratio) + 58;
        }));

        rowItems.forEach(({ image, name }, columnIndex) => {
          const ratio = Math.min(photoBoxWidth / image.width, 320 / image.height, 1);
          const drawWidth = image.width * ratio;
          const drawHeight = image.height * ratio;
          const drawX = padding + 30 + (columnIndex * (photoBoxWidth + gap));
          const imageX = drawX + ((photoBoxWidth - drawWidth) / 2);

          context.fillStyle = "rgba(255,255,255,0.03)";
          context.fillRect(drawX, currentY, photoBoxWidth, rowHeight - 8);
          context.drawImage(image, imageX, currentY, drawWidth, drawHeight);
          context.fillStyle = "#9bb0c8";
          context.font = "24px Arial";
          context.textAlign = "center";
          context.fillText(String(name || `Foto ${index + columnIndex + 1}`), drawX + (photoBoxWidth / 2), currentY + drawHeight + 34);
          context.textAlign = "left";
        });

        currentY += rowHeight + gap;
      }

      return currentY;
    });
  }

  y += 18;
  context.strokeStyle = "rgba(124, 199, 255, 0.24)";
  context.lineWidth = 2;
  context.strokeRect(padding / 2, padding / 2, width - padding, canvas.height - padding);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    throw new Error("Gagal membentuk image inspeksi");
  }

  return blob;
}

function buildServiceWhatsAppText(item) {
  return [
    "PLIRM34 - Hasil Inspeksi Service",
    `Tipe: ${item.type || "-"}`,
    `Sub menu: ${item.subtype || item.type || "-"}`,
    `Equipment: ${item.equipmentName || "-"}`,
    `Temuan: ${item.description || "-"}`,
    "",
    "Gambar ringkasan inspeksi sudah disiapkan dari aplikasi.",
  ].join("\n");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.readAsDataURL(file);
  });
}

function normalizeFindingPhotosPayload(payload = {}) {
  const existingItems = Array.isArray(payload.findingPhotos)
    ? payload.findingPhotos
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          name: String(entry.name || "").trim() || "foto",
          data: String(entry.data || "").trim(),
          url: String(entry.url || "").trim(),
        }))
        .filter((entry) => entry.data || entry.url)
    : [];

  if (existingItems.length > 0) {
    return existingItems;
  }

  if (payload.findingPhotoData) {
    return [{
      name: String(payload.findingPhotoName || "foto-temuan").trim() || "foto-temuan",
      data: String(payload.findingPhotoData || ""),
      url: String(payload.findingPhotoUrl || "").trim(),
    }];
  }

  if (payload.findingPhotoUrl) {
    return [{
      name: String(payload.findingPhotoName || "foto-temuan").trim() || "foto-temuan",
      data: "",
      url: String(payload.findingPhotoUrl || "").trim(),
    }];
  }

  return [];
}

function buildFindingPhotoCompatibility(photos = []) {
  const safePhotos = photos
    .filter((entry) => entry && (entry.data || entry.url))
    .map((entry) => ({
      name: String(entry.name || "").trim() || "foto",
      data: String(entry.data || "").trim(),
      url: String(entry.url || "").trim(),
    }));
  const firstPhoto = safePhotos[0] || null;
  return {
    findingPhotos: safePhotos,
    findingPhotoName: safePhotos.length > 0
      ? safePhotos.map((entry) => entry.name).join(", ")
      : "tidak ada file",
    findingPhotoData: firstPhoto?.data || "",
    findingPhotoUrl: firstPhoto?.url || "",
  };
}

async function getFindingPhotoPayload(formData, existingPayload = {}) {
  const photoFiles = formData.getAll("findingPhoto")
    .filter((photo) => photo && typeof photo === "object" && "name" in photo && photo.name && "size" in photo && photo.size > 0);

  if (photoFiles.length > 0) {
    const findingPhotos = await Promise.all(photoFiles.map(async (photo) => ({
      name: photo.name,
      data: await readFileAsDataUrl(photo),
    })));
    return buildFindingPhotoCompatibility(findingPhotos);
  }

  return buildFindingPhotoCompatibility(normalizeFindingPhotosPayload(existingPayload));
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gagal memuat image lampiran"));
    image.src = src;
  });
}

function getInspectionPhotoEntries(payload = {}) {
  return normalizeFindingPhotosPayload(payload);
}

async function sendServiceToWhatsApp(item) {
  const blob = await createServiceInspectionImage(item);
  const filename = `plirm34-${(item.subtype || item.type || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.png`;
  const file = new File([blob], filename, { type: "image/png" });
  const caption = buildServiceWhatsAppText(item);

  if (window.isSecureContext && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: `PLIRM34 - ${item.subtype || item.type}`,
      text: caption,
      files: [file],
    });
    return "shared";
  }

  const imageUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(caption);
    } catch {
      // Ignore clipboard failures and continue with fallback.
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  return "fallback";
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function readStorage(key) {
  if (volatileStorage.has(key)) {
    return volatileStorage.get(key);
  }
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  const shouldUseVolatileOnly = backendState.available
    && backendState.sessionActive
    && resourceStorageKeys.has(key);

  if (shouldUseVolatileOnly) {
    volatileStorage.set(key, value);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage cleanup failures.
    }
    return;
  }

  const snapshot = JSON.parse(JSON.stringify(value));
  volatileStorage.set(key, snapshot);
  try {
    window.localStorage.setItem(key, JSON.stringify(snapshot));
  } catch (error) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage cleanup failures.
    }
    if (!(error instanceof DOMException) || error.name !== "QuotaExceededError") {
      console.warn("Gagal menyimpan storage", key, error);
    }
  }
}

async function apiRequest(path, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    credentials: "same-origin",
    cache: "no-store",
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`/api${path}`, config);
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message = response.status === 413
      ? "Ukuran upload foto terlalu besar. Kurangi jumlah foto atau gunakan resolusi yang lebih kecil."
      : (payload.error || `HTTP ${response.status}`);
    throw new Error(message);
  }

  return payload;
}

async function detectBackendAvailability() {
  try {
    await apiRequest("/health");
    backendState.available = true;
    return true;
  } catch {
    backendState.available = false;
    backendState.sessionActive = false;
    return false;
  }
}

function getCachedPasswordForUser(username) {
  const storedUsers = readStorage(storageKeys.users);
  if (Array.isArray(storedUsers)) {
    const matched = storedUsers.find((user) => String(user.username || "").toLowerCase() === username.toLowerCase());
    if (matched?.password) {
      return matched.password;
    }
  }

  const defaultUser = defaultAuthUsers.find((user) => user.username.toLowerCase() === username.toLowerCase());
  return defaultUser?.password || "";
}

function cacheUsers(users) {
  if (!Array.isArray(users)) {
    return;
  }

  const normalizedUsers = users.map((user) => ({
    username: user.username,
    role: user.role,
    password: getCachedPasswordForUser(String(user.username || "")),
  }));

  writeStorage(storageKeys.users, normalizedUsers);
}

function cacheBootstrapData(data) {
  if (!data || typeof data !== "object") {
    return;
  }

  const stateEntries = [
    [storageKeys.negatifList, data.negatif_list],
    [storageKeys.sparepart, data.sparepart],
    [storageKeys.service, data.service],
    [storageKeys.bom, data.bom],
    [storageKeys.bomMotor, data.bom_motor],
    [storageKeys.spb, data.spb],
  ];

  stateEntries.forEach(([key, items]) => {
    writeStorage(key, Array.isArray(items) ? items : []);
  });
}

async function saveItemToBackend(resourceKey, item, isEditing = false) {
  if (!backendState.available || !backendState.sessionActive) {
    return item;
  }

  const path = isEditing
    ? `/items/${resourceKey}/${encodeURIComponent(item.id)}`
    : `/items/${resourceKey}`;
  const method = isEditing ? "PUT" : "POST";
  const result = await apiRequest(path, {
    method,
    body: { item },
  });
  return result.item || item;
}

async function deleteItemFromBackend(resourceKey, itemId) {
  if (!backendState.available || !backendState.sessionActive) {
    return true;
  }

  await apiRequest(`/items/${resourceKey}/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });
  return true;
}

async function fetchItemByIdFromBackend(resourceKey, itemId) {
  if (!backendState.available || !backendState.sessionActive || !itemId) {
    return null;
  }
  const result = await apiRequest(`/items/${resourceKey}/${encodeURIComponent(itemId)}`);
  return result.item || null;
}

async function fetchItemsFromBackend(resourceKey) {
  if (!backendState.available || !backendState.sessionActive) {
    return [];
  }
  const result = await apiRequest(`/items/${resourceKey}`);
  return Array.isArray(result.items) ? result.items : [];
}

function runPostLoginBackgroundTasks(role = "") {
  const tasks = [
    loadMastersFromBackend(),
  ];

  if (role === "admin") {
    tasks.push(refreshAdminMasters());
    tasks.push(refreshActivityLogs());
  }

  Promise.allSettled(tasks).then(() => {
    renderUserManagementTable();
  });
}

async function loadMastersFromBackend(sourceGroup = "") {
  if (!backendState.available || !backendState.sessionActive) {
    return null;
  }
  const suffix = sourceGroup ? `?source_group=${encodeURIComponent(sourceGroup)}` : "";
  const result = await apiRequest(`/masters${suffix}`);
  backendState.masters = {
    areas: Array.isArray(result.areas) ? result.areas : [],
    inspectionTemplates: Array.isArray(result.inspectionTemplates) ? result.inspectionTemplates : [],
    equipmentReferences: Array.isArray(result.equipmentReferences) ? result.equipmentReferences : [],
    appSettings: Array.isArray(result.appSettings) ? result.appSettings : [],
  };
  renderElectricalRoomReferenceOptions();
  return result;
}

async function fetchAdminMaster(resourceName) {
  const result = await apiRequest(`/admin/masters/${resourceName}`);
  return Array.isArray(result.items) ? result.items : [];
}

async function fetchActivityLogs(limit = 300) {
  const result = await apiRequest(`/admin/activity-logs?limit=${encodeURIComponent(limit)}`);
  return Array.isArray(result.items) ? result.items : [];
}

async function saveAdminMaster(resourceName, item) {
  const result = await apiRequest(`/admin/masters/${resourceName}`, {
    method: "POST",
    body: { item },
  });
  return result.item || item;
}

async function deleteAdminMaster(resourceName, identifier) {
  await apiRequest(`/admin/masters/${resourceName}/${encodeURIComponent(identifier)}`, {
    method: "DELETE",
  });
}

async function downloadAdminBackup() {
  const result = await apiRequest("/admin/backup");
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `plirm34-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function restoreAdminBackup(file) {
  const text = await file.text();
  const backup = JSON.parse(text);
  await apiRequest("/admin/restore", {
    method: "POST",
    body: { backup },
  });
}

async function downloadBackendExport(resourceName) {
  const response = await fetch(`/api/reports/export/${resourceName}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Export gagal (${response.status})`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${resourceName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importAdminCsv(resourceName, mode, file) {
  const csvText = await file.text();
  return apiRequest(`/admin/import/${resourceName}`, {
    method: "POST",
    body: {
      mode,
      csvText,
    },
  });
}

async function importCarbonBrushFromSource(sourceUrl, mode) {
  return apiRequest("/admin/import-carbon-brush", {
    method: "POST",
    body: {
      sourceUrl,
      mode,
    },
  });
}

function getStoredUsers() {
  const storedUsers = readStorage(storageKeys.users);
  if (Array.isArray(storedUsers) && storedUsers.length > 0) {
    return storedUsers;
  }
  writeStorage(storageKeys.users, defaultAuthUsers);
  return [...defaultAuthUsers];
}

function findUserByUsername(username) {
  return getStoredUsers().find((user) => user.username.toLowerCase() === username.toLowerCase());
}

function loginWithUser(user) {
  applyRoleAccess(user.role);
  currentUser.textContent = user.username;
  currentRole.textContent = roleLabels[user.role] || "Team";
  if (playerAvatar) {
    const initials = String(user.username || "PL")
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2) || "PL";
    playerAvatar.textContent = initials;
  }
  saveSession(user.username, user.role);
  loginScreen.classList.add("hidden");
  workspace.classList.remove("hidden");
  sidebar?.classList.remove("menu-open");
  renderUserManagementTable();
  openSection("dashboard");
  resetIdleLogoutTimer();
}

async function loadAllDataFromBackend() {
  const [negatifItems, sparepartItems, serviceItems, bomItems, bomMotorItems, spbItems] = await Promise.all([
    fetchItemsFromBackend("negatif-list"),
    fetchItemsFromBackend("sparepart"),
    fetchItemsFromBackend("service"),
    fetchItemsFromBackend("bom"),
    fetchItemsFromBackend("bom-motor"),
    fetchItemsFromBackend("spb"),
  ]);

  writeStorage(storageKeys.negatifList, negatifItems.map((item) => normalizeNegatifItem(item)));
  writeStorage(storageKeys.sparepart, sparepartItems);
  writeStorage(storageKeys.service, serviceItems.map((item) => normalizeServiceItem(item)));
  writeStorage(storageKeys.bom, bomItems);
  writeStorage(storageKeys.bomMotor, bomMotorItems);
  writeStorage(storageKeys.spb, spbItems.map((item) => normalizeSpbItem(item)));
  loadStoredData();
}

function hydrateBootstrapData(data = {}) {
  writeStorage(storageKeys.negatifList, Array.isArray(data.negatif_list) ? data.negatif_list.map((item) => normalizeNegatifItem(item)) : []);
  writeStorage(storageKeys.sparepart, Array.isArray(data.sparepart) ? data.sparepart : []);
  writeStorage(storageKeys.service, Array.isArray(data.service) ? data.service.map((item) => normalizeServiceItem(item)) : []);
  writeStorage(storageKeys.bom, Array.isArray(data.bom) ? data.bom : []);
  writeStorage(storageKeys.bomMotor, Array.isArray(data.bom_motor) ? data.bom_motor : []);
  writeStorage(storageKeys.spb, Array.isArray(data.spb) ? data.spb.map((item) => normalizeSpbItem(item)) : []);
  loadStoredData();
}

async function hydrateFromBackendAfterLogin() {
  const bootstrap = await apiRequest("/bootstrap");
  backendState.sessionActive = true;
  dashboardInspectionSchedule = {
    calendarName: bootstrap.calendar?.calendarName || "PMS PLIRM34",
    timezone: bootstrap.calendar?.timezone || "Asia/Jakarta",
    today: Array.isArray(bootstrap.calendar?.today) ? bootstrap.calendar.today : [],
    tomorrow: Array.isArray(bootstrap.calendar?.tomorrow) ? bootstrap.calendar.tomorrow : [],
  };
  if (Array.isArray(bootstrap.users) && bootstrap.users.length) {
    cacheUsers(bootstrap.users);
  }
  if (bootstrap.user) {
    loginWithUser(bootstrap.user);
  }
  hydrateBootstrapData(bootstrap.data || {});
  runPostLoginBackgroundTasks(bootstrap.user?.role || "");
}

async function restoreBackendSession() {
  try {
    const bootstrap = await apiRequest("/bootstrap");
    if (!bootstrap?.user) {
      return false;
    }

    backendState.sessionActive = true;
    dashboardInspectionSchedule = {
      calendarName: bootstrap.calendar?.calendarName || "PMS PLIRM34",
      timezone: bootstrap.calendar?.timezone || "Asia/Jakarta",
      today: Array.isArray(bootstrap.calendar?.today) ? bootstrap.calendar.today : [],
      tomorrow: Array.isArray(bootstrap.calendar?.tomorrow) ? bootstrap.calendar.tomorrow : [],
    };
    if (Array.isArray(bootstrap.users) && bootstrap.users.length) {
      cacheUsers(bootstrap.users);
    }
    loginWithUser(bootstrap.user);
    hydrateBootstrapData(bootstrap.data || {});
    runPostLoginBackgroundTasks(bootstrap.user?.role || "");
    const lastSection = window.localStorage.getItem(storageKeys.lastSection) || "dashboard";
    openSection(lastSection);
    return true;
  } catch {
    backendState.sessionActive = false;
    return false;
  }
}

async function initializeApplication() {
  const backendReady = await detectBackendAvailability();
  renderCarbonBrushMeasurementGrid();
  renderElectricalRoomReferenceOptions();
  openBomPane("general");
  ["negatif-list", "sparepart", "service", "bom", "spb"].forEach(placeCreatePanelNearToolbar);
  getStoredUsers();
  if (backendReady) {
    const restored = await restoreBackendSession();
    if (!restored) {
      loadStoredData();
    }
  } else {
    loadStoredData();
    restoreSession();
  }
  initializeIdleActivityTracking();

  await Promise.allSettled([
    loadEquipmentReference(),
    loadCarbonBrushEquipmentReference(),
  ]);

  if (sampleDataStatus) {
    sampleDataStatus.textContent = hasAnyStoredData()
      ? "Data operasional aktif dari database atau browser lokal."
      : "Belum ada data operasional. Mulai input data real melalui tiap menu.";
  }
}

function renderUserManagementTable() {
  if (!userManagementBody) {
    return;
  }

  const users = getStoredUsers();
  userManagementBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.dataset.username = user.username;
    row.innerHTML = `
      <td>${user.username}</td>
      <td><span class="tag tag-blue">${roleLabels[user.role] || user.role}</span></td>
      <td>
        <select class="user-role-select" data-username="${user.username}">
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
          <option value="organik" ${user.role === "organik" ? "selected" : ""}>Organik</option>
          <option value="team" ${user.role === "team" ? "selected" : ""}>Team</option>
        </select>
      </td>
      <td class="action-cell">
        <button class="table-action" data-action="save-user-role" type="button">Simpan Role</button>
      </td>
    `;
    userManagementBody.append(row);
  });
}

function renderAdminAreasTable(items) {
  if (!adminAreasBody) {
    return;
  }
  adminAreasBody.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.code = item.code;
    row.innerHTML = `
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.plant}</td>
      <td>${item.sort_order ?? item.sortOrder ?? ""}</td>
      <td class="action-cell">
        <button class="table-action danger" data-action="delete-area" type="button">Hapus</button>
      </td>
    `;
    adminAreasBody.append(row);
  });
}

function renderAdminElectricalRoomTable() {
  if (!adminElectricalRoomBody) {
    return;
  }
  const items = getElectricalRoomReferenceList();
  adminElectricalRoomBody.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.identifier = item;
    row.innerHTML = `
      <td>${item}</td>
      <td class="action-cell">
        <button class="table-action danger" data-action="delete-electrical-room-reference" type="button">Hapus</button>
      </td>
    `;
    adminElectricalRoomBody.append(row);
  });
}

function renderAdminEquipmentTable(items) {
  if (!adminEquipmentBody) {
    return;
  }
  adminEquipmentBody.innerHTML = "";
  items.slice(0, 200).forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.identifier = item.equipmentName;
    row.innerHTML = `
      <td>${item.sourceGroup}</td>
      <td>${item.equipmentCode || "-"}</td>
      <td>${item.equipmentName}</td>
      <td>${item.area || "-"}</td>
      <td>${item.plant || "-"}</td>
      <td class="action-cell">
        <button class="table-action danger" data-action="delete-equipment-master" type="button">Hapus</button>
      </td>
    `;
    adminEquipmentBody.append(row);
  });
}

function renderAdminTemplatesTable(items) {
  if (!adminTemplatesBody) {
    return;
  }
  adminTemplatesBody.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.identifier = `${item.moduleName}|${item.inspectionType}|${item.inspectionSubtype}`;
    row.innerHTML = `
      <td>${item.moduleName}</td>
      <td>${item.inspectionType}</td>
      <td>${item.inspectionSubtype}</td>
      <td>${item.title}</td>
      <td class="action-cell">
        <button class="table-action danger" data-action="delete-template" type="button">Hapus</button>
      </td>
    `;
    adminTemplatesBody.append(row);
  });
}

function formatActivityLogDate(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isSameCalendarDate(value, targetDate = new Date()) {
  if (!value) {
    return false;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.getFullYear() === targetDate.getFullYear()
    && date.getMonth() === targetDate.getMonth()
    && date.getDate() === targetDate.getDate();
}

function extractSpbYear(item) {
  if (item?.year) {
    const yearText = String(item.year);
    const directMatch = yearText.match(/\b(20\d{2})\b/);
    return directMatch ? directMatch[1] : yearText;
  }
  const text = [
    item.notificationNo,
    item.orderNo,
    item.reservationNo,
    item.materialDescription,
  ].map((value) => String(value || "")).join(" ");
  const match = text.match(/\b(20\d{2})\b/);
  return match ? match[1] : String(new Date().getFullYear());
}

function parseSpbAmount(value) {
  const digits = String(value || "").replace(/[^\d]/g, "");
  return Number(digits || "0");
}

function formatSpbAmount(value) {
  const numeric = parseSpbAmount(value);
  return numeric > 0 ? `Rp${numeric.toLocaleString("id-ID")}` : "-";
}

function formatCompactCurrency(value) {
  const numeric = Number(value || 0);
  if (numeric >= 1000000000) {
    return `Rp${(numeric / 1000000000).toFixed(1).replace(".0", "")} M`;
  }
  if (numeric >= 1000000) {
    return `Rp${Math.round(numeric / 1000000)} jt`;
  }
  return `Rp${numeric.toLocaleString("id-ID")}`;
}

function formatSpbChartAmount(value) {
  const numeric = Number(value || 0);
  if (numeric >= 1000000000) {
    return `${(numeric / 1000000000).toFixed(1).replace(".", ",").replace(",0", "")} M`;
  }
  if (numeric >= 1000000) {
    return `${Math.round(numeric / 1000000).toLocaleString("id-ID")} juta`;
  }
  return numeric.toLocaleString("id-ID");
}

function renderActivityLogTable(items) {
  if (!activityLogBody) {
    return;
  }
  activityLogBody.innerHTML = "";
  if (!items.length) {
    activityLogBody.innerHTML = `
      <tr>
        <td colspan="7">Belum ada log aktivitas.</td>
      </tr>
    `;
    return;
  }
  items.forEach((item) => {
    const row = document.createElement("tr");
    const detailText = item.detail && Object.keys(item.detail).length
      ? Object.entries(item.detail).map(([key, value]) => `${key}: ${value}`).join(" | ")
      : "-";
    row.innerHTML = `
      <td>${formatActivityLogDate(item.createdAt)}</td>
      <td>${item.actorUsername || "-"}</td>
      <td>${item.actorRole || "-"}</td>
      <td>${item.action || "-"}</td>
      <td>${item.resource || "-"}</td>
      <td>${item.targetLabel || item.targetId || "-"}</td>
      <td>${detailText}</td>
    `;
    activityLogBody.append(row);
  });
}

function applyActivityLogFilter() {
  if (!activityLogBody) {
    return;
  }
  const query = (searchActivityLog?.value || "").trim().toLowerCase();
  const action = filterActivityAction?.value || "semua";
  [...activityLogBody.querySelectorAll("tr")].forEach((row) => {
    const rowText = (row.textContent || "").toLowerCase();
    const rowAction = row.children[3]?.textContent.trim() || "";
    const matchesQuery = !query || rowText.includes(query);
    const matchesAction = action === "semua" || rowAction === action;
    row.hidden = !(matchesQuery && matchesAction);
  });
}

async function refreshActivityLogs() {
  if (!backendState.available || !backendState.sessionActive || activeRole !== "admin") {
    return;
  }
  try {
    const items = await fetchActivityLogs(300);
    renderActivityLogTable(items);
    applyActivityLogFilter();
  } catch (error) {
    console.error("Gagal memuat activity logs:", error);
  }
}

function hydrateCarbonBrushThresholdForm() {
  if (!adminCarbonBrushThresholdForm) {
    return;
  }
  const settings = getAppSetting("carbon_brush_thresholds") || {};
  const tuban3 = settings.tuban3 || {};
  const tuban4 = settings.tuban4 || {};
  adminCarbonBrushThresholdForm.elements.tuban3Low.value = tuban3.low ?? 30;
  adminCarbonBrushThresholdForm.elements.tuban3High.value = tuban3.high ?? 34;
  adminCarbonBrushThresholdForm.elements.tuban4Low.value = tuban4.low ?? 35;
  adminCarbonBrushThresholdForm.elements.tuban4High.value = tuban4.high ?? 38;
  if (adminCarbonBrushThresholdHint) {
    adminCarbonBrushThresholdHint.textContent = `Tuban 3: merah < ${adminCarbonBrushThresholdForm.elements.tuban3Low.value}, hijau >= ${adminCarbonBrushThresholdForm.elements.tuban3High.value}. Tuban 4: merah < ${adminCarbonBrushThresholdForm.elements.tuban4Low.value}, hijau >= ${adminCarbonBrushThresholdForm.elements.tuban4High.value}.`;
  }
}

async function refreshAdminMasters() {
  if (!backendState.available || !backendState.sessionActive || activeRole !== "admin") {
    return;
  }
  try {
    const [areas, equipmentReferences, templates] = await Promise.all([
      fetchAdminMaster("areas"),
      fetchAdminMaster("equipment-references"),
      fetchAdminMaster("inspection-templates"),
    ]);
    renderAdminAreasTable(areas);
    renderAdminElectricalRoomTable();
    renderAdminEquipmentTable(equipmentReferences);
    renderAdminTemplatesTable(templates);
    hydrateCarbonBrushThresholdForm();
    hydrateElectricalRoomThresholdForm();
    renderElectricalRoomReferenceOptions();
  } catch (error) {
    console.error("Gagal memuat master admin:", error);
  }
}

function getNegatifItemsFromDom() {
  return [...negatifListBody.querySelectorAll("tr")].map((row) => ({
    id: row.dataset.id,
    equipment: row.children[0].textContent.trim(),
    damageDescription: row.children[1].textContent.trim(),
    followUpPlan: row.children[2].textContent.trim(),
    foundDate: row.children[3].textContent.trim(),
    pendingMark: row.children[4].textContent.trim(),
    workStatus: row.children[5].textContent.trim(),
    category: row.children[6].textContent.trim(),
    area: row.children[7].textContent.trim(),
  }));
}

function getServiceItemsFromDom() {
  return [...serviceCardList.querySelectorAll(".service-list-item")].map((row) => ({
    ...(serviceItemCache.get(row.dataset.id || "") || {
      id: row.dataset.id,
      type: row.dataset.type,
      subtype: row.dataset.subtype || row.dataset.type,
      formType: row.dataset.formType || "",
      equipmentName: row.dataset.equipmentName || "",
      description: row.dataset.description || "",
      detail: row.dataset.detail || "",
      payload: {},
    }),
  }));
}

function getServiceItemById(itemId) {
  if (!itemId) {
    return null;
  }
  return serviceItemCache.get(itemId)
    || readStorage(storageKeys.service).find((item) => item.id === itemId)
    || null;
}

function updateStoredServiceItem(item) {
  if (!item?.id) {
    return;
  }
  serviceItemCache.set(item.id, item);
  const storedItems = readStorage(storageKeys.service);
  if (!Array.isArray(storedItems) || !storedItems.length) {
    return;
  }
  const nextItems = storedItems.map((entry) => (entry.id === item.id ? item : entry));
  writeStorage(storageKeys.service, nextItems);
}

async function resolveServiceItem(itemId) {
  const cachedItem = getServiceItemById(itemId);
  if (!backendState.available || !backendState.sessionActive || !itemId) {
    return cachedItem;
  }

  try {
    const fetchedItem = await fetchItemByIdFromBackend("service", itemId);
    if (!fetchedItem?.id) {
      return cachedItem;
    }
    const normalizedItem = normalizeServiceItem(fetchedItem);
    updateStoredServiceItem(normalizedItem);
    return normalizedItem;
  } catch {
    return cachedItem;
  }
}

function persistNegatifList() {
  const items = getNegatifItemsFromDom();
  writeStorage(storageKeys.negatifList, items);
}

function persistServiceList() {
  const items = getServiceItemsFromDom();
  writeStorage(storageKeys.service, items);
}

function persistSparepartList() {
  const items = getSparepartItemsFromDom();
  writeStorage(storageKeys.sparepart, items);
}

function persistBomList() {
  const items = getBomItemsFromDom();
  writeStorage(storageKeys.bom, items);
}

function persistBomMotorList() {
  const items = getBomMotorItemsFromDom();
  writeStorage(storageKeys.bomMotor, items);
}

function persistSpbList() {
  const items = getSpbItemsFromDom();
  writeStorage(storageKeys.spb, items);
}

function updateDashboardStats() {
  const negatifItems = getNegatifItemsFromDom();
  const sparepartItems = getSparepartItemsFromDom();
  const serviceItems = getServiceItemsFromDom();
  const bomItems = getBomItemsFromDom();
  const bomMotorItems = getBomMotorItemsFromDom();
  const spbItems = getSpbItemsFromDom();
  const today = new Date();
  const currentYear = String(today.getFullYear());
  const openNegatifItems = negatifItems.filter((item) => String(item.workStatus || "").toLowerCase() === "open");
  const todayServiceItems = serviceItems.filter((item) => isSameCalendarDate(item.payload?.inspectionDate, today));
  const currentYearSpbTotal = spbItems
    .filter((item) => extractSpbYear(item) === currentYear)
    .reduce((sum, item) => sum + parseSpbAmount(item.totalEce), 0);
  const electricalCount = serviceItems.filter((item) => item.type === "Electrical").length;
  const xpScore = (serviceItems.length * 18) + (sparepartItems.length * 7) + ((bomItems.length + bomMotorItems.length) * 5) + (openNegatifItems.length * 11);
  const level = Math.max(1, Math.floor(xpScore / 120) + 1);
  const currentLevelBase = (level - 1) * 120;
  const currentLevelXp = Math.max(0, xpScore - currentLevelBase);
  const xpTarget = 120;
  const xpPercent = Math.max(0, Math.min(100, Math.round((currentLevelXp / xpTarget) * 100)));
  const nextLevelXp = Math.max(0, xpTarget - currentLevelXp);
  const points = serviceItems.length * 15 + sparepartItems.length * 4 + (bomItems.length + bomMotorItems.length) * 3;
  const rankName = level >= 20
    ? "Diamond Operator"
    : level >= 15
      ? "Platinum Operator"
      : level >= 10
        ? "Gold Operator"
        : level >= 5
          ? "Silver Operator"
          : "Bronze Operator";
  const rankBadge = rankName.split(" ")[0].toUpperCase();
  const dailyProgress = Math.max(0, Math.min(100, Math.round(((todayServiceItems.length * 35) + (Math.max(0, 6 - openNegatifItems.length) * 8)) / 2)));
  const streakDays = getConsecutiveServiceStreak(serviceItems);
  const achievementUnlocked = streakDays >= 3 || todayServiceItems.length >= 3 || openNegatifItems.length === 0;
  const achievementLabel = openNegatifItems.length === 0
    ? "Zero Pending Hunter"
    : streakDays >= 3
      ? "Inspection Streak"
      : todayServiceItems.length >= 3
        ? "Field Runner"
        : "Locked Achievement";
  const achievementDescription = openNegatifItems.length === 0
    ? "Semua negatif list open berhasil dibersihkan dari dashboard."
    : streakDays >= 3
      ? `Streak inspeksi aktif ${streakDays} hari berturut-turut.`
      : todayServiceItems.length >= 3
        ? "Target inspeksi harian berhasil menembus 3 item atau lebih."
        : "Butuh streak inspeksi, service harian, atau zero pending untuk unlock.";
  const missionScore = Math.max(0, Math.min(100, Math.round(((todayServiceItems.length * 28) + ((sparepartItems.length > 0 ? 1 : 0) * 18) + ((openNegatifItems.length === 0 ? 1 : 0) * 24)) / 1.4)));
  const missionTargetText = openNegatifItems.length > 0
    ? `Kurangi ${openNegatifItems.length} pending open dan capai inspeksi harian stabil.`
    : "Pending open sudah aman, lanjut dorong inspeksi dan resource control.";
  const moduleScores = {
    dashboard: 100,
    "negatif-list": Math.max(0, 100 - (openNegatifItems.length * 8)),
    sparepart: Math.min(100, sparepartItems.length * 6),
    service: Math.min(100, serviceItems.length * 5 + todayServiceItems.length * 12),
    bom: Math.min(100, (bomItems.length + bomMotorItems.length) * 2),
    spb: Math.min(100, spbItems.length * 7),
    "user-management": 95,
    "activity-log": 92,
  };

  statNegatif.textContent = `${openNegatifItems.length} item`;
  statSpbBelumAda.textContent = formatCompactCurrency(currentYearSpbTotal);
  statService.textContent = `${todayServiceItems.length} item`;
  metricSparepartTotal.textContent = `${sparepartItems.length}`;
  metricBomTotal.textContent = `${bomItems.length + bomMotorItems.length} mesin`;
  metricServiceElectrical.textContent = `${electricalCount} temuan`;
  metricSpbTotal.textContent = formatCompactCurrency(currentYearSpbTotal);
  if (hudLevelBadge) hudLevelBadge.textContent = `LEVEL ${level}`;
  if (hudRankBadge) hudRankBadge.textContent = rankBadge;
  if (hudXpFill) hudXpFill.style.width = `${xpPercent}%`;
  if (hudXpText) hudXpText.textContent = `${currentLevelXp} / ${xpTarget} XP`;
  if (hudPoints) hudPoints.textContent = `${points}`;
  if (heroLevelTitle) heroLevelTitle.textContent = `LEVEL ${level}`;
  if (heroNextLevel) heroNextLevel.textContent = `Next level in ${nextLevelXp} XP`;
  if (heroProgressValue) heroProgressValue.textContent = `${dailyProgress}%`;
  if (heroProgressFill) heroProgressFill.style.width = `${dailyProgress}%`;
  if (heroXpPercent) heroXpPercent.textContent = `${xpPercent}%`;
  if (heroXpCaption) heroXpCaption.textContent = `${currentLevelXp} XP collected on this level`;
  if (heroRankName) heroRankName.textContent = rankName;
  if (heroXpRing) heroXpRing.style.setProperty("--xp-progress", `${xpPercent}%`);
  if (sidebarStreakValue) sidebarStreakValue.textContent = `${streakDays} hari`;
  if (sidebarStreakNote) sidebarStreakNote.textContent = streakDays > 0 ? `Chain inspeksi aktif ${streakDays} hari berturut-turut.` : "Belum ada chain inspeksi aktif.";
  if (achievementTitle) achievementTitle.textContent = achievementLabel;
  if (achievementStatus) achievementStatus.textContent = achievementUnlocked ? "Unlocked" : "Locked";
  if (achievementDesc) achievementDesc.textContent = achievementDescription;
  if (missionTitle) missionTitle.textContent = openNegatifItems.length > 0 ? "Reduce Pending Open" : "Maintain Clean Operations";
  if (missionProgressFill) missionProgressFill.style.width = `${missionScore}%`;
  if (missionProgressText) missionProgressText.textContent = `${missionScore}%`;
  if (missionDesc) missionDesc.textContent = missionTargetText;
  if (streakTitle) streakTitle.textContent = `${streakDays} hari`;
  if (streakReward) streakReward.textContent = `+${streakDays * 24} XP chain`;
  if (streakDesc) streakDesc.textContent = streakDays > 0 ? "Lanjutkan inspeksi harian tanpa putus untuk bonus rank." : "Mulai satu inspeksi hari ini untuk membangun streak baru.";
  menuBadges.forEach((badge) => {
    const section = badge.dataset.menuBadge || "";
    badge.textContent = section === "dashboard" ? rankBadge : getModuleRankLabel(moduleScores[section] || 0);
  });
  renderMiniCharts(negatifItems, serviceItems, spbItems);
  renderDashboardPreviews(negatifItems, serviceItems, spbItems);
  renderMobileCards(negatifItems, spbItems);
  renderNegatifModuleSummary(negatifItems);
  renderNegatifCharts(negatifItems);
}

function renderNegatifModuleSummary(negatifItems) {
  if (!negatifTotalCount) {
    return;
  }
  negatifTotalCount.textContent = `${negatifItems.length}`;
  negatifHighCount.textContent = `${negatifItems.filter((item) => item.workStatus === "Open").length}`;
  negatifRawmillCount.textContent = `${negatifItems.filter((item) => item.pendingMark === "Menunggu Rawmill service").length}`;
  negatifOvhCount.textContent = `${negatifItems.filter((item) => item.pendingMark === "Menunggu OVH").length}`;
}

function renderNegatifCharts(negatifItems) {
  renderChart(negatifStatusChart, [
    { label: "Open", value: negatifItems.filter((item) => item.workStatus === "Open").length },
    { label: "Close", value: negatifItems.filter((item) => item.workStatus === "Close").length },
  ]);

  renderChart(negatifAreaChart, [
    { label: "Tuban 3", value: negatifItems.filter((item) => item.area === "Tuban 3").length },
    { label: "Tuban 4", value: negatifItems.filter((item) => item.area === "Tuban 4").length },
    { label: "Tuban 34", value: negatifItems.filter((item) => item.area === "Tuban 34").length },
  ]);

  renderChart(negatifMarkChart, [
    { label: "Material", value: negatifItems.filter((item) => item.pendingMark === "Menunggu material").length },
    { label: "Rawmill", value: negatifItems.filter((item) => item.pendingMark === "Menunggu Rawmill service").length },
    { label: "OVH", value: negatifItems.filter((item) => item.pendingMark === "Menunggu OVH").length },
  ]);
}

function renderChart(container, rows, valueFormatter = (value) => String(value)) {
  if (!container) return;
  const maxValue = Math.max(...rows.map((row) => row.value), 1);
  container.innerHTML = "";
  rows.forEach((row) => {
    const node = document.createElement("div");
    node.className = "chart-row";
    node.innerHTML = `
      <span>${row.label}</span>
      <div class="chart-track">
        <div class="chart-fill" style="width:${(row.value / maxValue) * 100}%"></div>
      </div>
      <strong>${valueFormatter(row.value)}</strong>
    `;
    container.append(node);
  });
}

function renderMiniCharts(negatifItems, serviceItems, spbItems) {
  renderChart(chartNegatif, [
    { label: "Material", value: negatifItems.filter((item) => item.pendingMark === "Menunggu material" && item.workStatus === "Open").length },
    { label: "Rawmill", value: negatifItems.filter((item) => item.pendingMark === "Menunggu Rawmill service" && item.workStatus === "Open").length },
    { label: "OVH", value: negatifItems.filter((item) => item.pendingMark === "Menunggu OVH" && item.workStatus === "Open").length },
  ]);

  const today = new Date();
  renderChart(chartService, [
    { label: "Electrical", value: serviceItems.filter((item) => item.type === "Electrical" && isSameCalendarDate(item.payload?.inspectionDate, today)).length },
    { label: "Instrument", value: serviceItems.filter((item) => item.type === "Instrument" && isSameCalendarDate(item.payload?.inspectionDate, today)).length },
    { label: "DCS", value: serviceItems.filter((item) => item.type === "DCS" && isSameCalendarDate(item.payload?.inspectionDate, today)).length },
  ]);

  const yearlyTotals = [...spbItems.reduce((map, item) => {
    const year = extractSpbYear(item);
    map.set(year, (map.get(year) || 0) + parseSpbAmount(item.totalEce));
    return map;
  }, new Map()).entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .slice(-4)
    .map(([label, value]) => ({ label, value }));

  renderChart(chartSpb, yearlyTotals.length ? yearlyTotals : [
    { label: String(new Date().getFullYear()), value: 0 },
  ], formatSpbChartAmount);
}

function renderMobileCards(negatifItems, spbItems) {
  if (negatifListMobile) {
    negatifListMobile.innerHTML = "";
    negatifItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = "mobile-data-card";
      card.innerHTML = `
        <strong>${item.equipment}</strong>
        <div class="mobile-meta">
          <span>Kerusakan: ${item.damageDescription}</span>
          <span>Tindak lanjut: ${item.followUpPlan}</span>
          <span>Tanggal temuan: ${item.foundDate}</span>
          <span>Mark: ${item.pendingMark || "-"}</span>
          <span>Status: ${item.workStatus || "-"}</span>
          <span>Kategori: ${item.category}</span>
          <span>Area: ${item.area}</span>
        </div>
      `;
      negatifListMobile.append(card);
    });
  }

  if (spbMobile) {
    spbMobile.innerHTML = "";
    spbItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = "mobile-data-card";
      card.innerHTML = `
        <strong>${item.materialDescription}</strong>
        <div class="mobile-meta">
          <span>Tahun: ${item.year}</span>
          <span>Quarter: ${item.quarter}</span>
          <span>Type: ${item.spbType}</span>
          <span>No Order: ${item.orderNo}</span>
          <span>No Stock: ${item.stockNo}</span>
          <span>Qty: ${item.qty}</span>
          <span>Total ECE: ${formatSpbAmount(item.totalEce)}</span>
          <span>Keterangan: ${item.note || "-"}</span>
        </div>
      `;
      spbMobile.append(card);
    });
  }
}

function renderDashboardPreviews(negatifItems, serviceItems, spbItems) {
  if (dashboardNegatifPreview) {
    const previewItems = negatifItems
      .filter((item) => String(item.workStatus || "").toLowerCase() === "open")
      .slice(0, 5);
    dashboardNegatifPreview.innerHTML = "";
    if (!previewItems.length) {
      dashboardNegatifPreview.innerHTML = `<tr><td colspan="4">Tidak ada negatif list open.</td></tr>`;
    }
    previewItems.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.equipment}</td>
        <td>${item.pendingMark || "-"}</td>
        <td>${item.area}</td>
        <td>${item.category}</td>
      `;
      dashboardNegatifPreview.append(row);
    });
  }

  if (dashboardServicePreview) {
    const previewItems = serviceItems
      .filter((item) => isSameCalendarDate(item.payload?.inspectionDate, new Date()))
      .slice(0, 5);
    dashboardServicePreview.innerHTML = "";
    if (!previewItems.length) {
      dashboardServicePreview.innerHTML = `
        <article>
          <strong>Belum ada service hari ini</strong>
          <span>Hasil inspeksi hari berjalan akan tampil di sini</span>
          <small>Filter berdasarkan tanggal inspeksi</small>
        </article>
      `;
    }
    previewItems.forEach((item) => {
      const article = document.createElement("article");
      article.innerHTML = `
        <strong>${item.equipmentName}</strong>
        <span>${item.subtype || item.type}</span>
        <small>${formatInspectionDate(item.payload?.inspectionDate)}</small>
      `;
      dashboardServicePreview.append(article);
    });
  }

  if (dashboardSpbPreview) {
    const yearlyTotals = [...spbItems.reduce((map, item) => {
      const year = extractSpbYear(item);
      map.set(year, (map.get(year) || 0) + parseSpbAmount(item.totalEce));
      return map;
    }, new Map()).entries()].sort((left, right) => right[0].localeCompare(left[0])).slice(0, 5);
    dashboardSpbPreview.innerHTML = "";
    if (!yearlyTotals.length) {
      dashboardSpbPreview.innerHTML = `
        <article>
          <strong>Belum ada data SPB</strong>
          <span>Biaya ajuan tahunan akan tampil di sini</span>
          <small>Input data real melalui menu SPB</small>
        </article>
      `;
    }
    yearlyTotals.forEach(([year, total]) => {
      const article = document.createElement("article");
      article.innerHTML = `
        <strong>${year}</strong>
        <span>Total ajuan: ${formatCompactCurrency(total)}</span>
        <small>${spbItems.filter((item) => extractSpbYear(item) === year).length} item</small>
      `;
      dashboardSpbPreview.append(article);
    });
  }

  renderInspectionScheduleCard(
    dashboardInspectionToday,
    dashboardInspectionSchedule.today,
    "Belum ada jadwal inspeksi hari ini",
  );
  renderInspectionScheduleCard(
    dashboardInspectionTomorrow,
    dashboardInspectionSchedule.tomorrow,
    "Belum ada jadwal inspeksi besok",
  );
}

function renderInspectionScheduleCard(container, items, emptyTitle) {
  if (!container) {
    return;
  }

  const rows = Array.isArray(items) ? items.slice(0, 5) : [];
  container.innerHTML = "";
  if (!rows.length) {
    container.innerHTML = `
      <article>
        <strong>${emptyTitle}</strong>
        <span>Sinkron otomatis dari Google Calendar</span>
        <small>Kalender inspeksi PLIRM34</small>
      </article>
    `;
    return;
  }

  rows.forEach((item) => {
    const article = document.createElement("article");
    const detailParts = [item.timeLabel || (item.allDay ? "Seharian" : "-")];
    if (item.location) {
      detailParts.push(item.location);
    }
    article.className = "inspection-schedule-item";
    article.innerHTML = `
      <strong>${escapeHtml(item.summary || "Jadwal inspeksi")}</strong>
      <span>${escapeHtml(detailParts.join(" • "))}</span>
      <small>${escapeHtml(item.description || dashboardInspectionSchedule.calendarName || "Google Calendar")}</small>
    `;
    container.append(article);
  });
}

function matchesSearch(text, query) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

function getModuleRankLabel(score) {
  if (score >= 90) return "S";
  if (score >= 70) return "A";
  if (score >= 45) return "B";
  if (score >= 20) return "C";
  return "D";
}

function getConsecutiveServiceStreak(serviceItems) {
  const dates = [...new Set(
    serviceItems
      .map((item) => String(item.payload?.inspectionDate || "").slice(0, 10))
      .filter(Boolean),
  )].sort((left, right) => right.localeCompare(left));
  if (!dates.length) {
    return 0;
  }
  let streak = 1;
  let cursor = new Date(`${dates[0]}T00:00:00`);
  for (let index = 1; index < dates.length; index += 1) {
    const next = new Date(`${dates[index]}T00:00:00`);
    const diffDays = Math.round((cursor.getTime() - next.getTime()) / 86400000);
    if (diffDays === 1) {
      streak += 1;
      cursor = next;
      continue;
    }
    break;
  }
  return streak;
}

function getBomAreaFromEquipment(equipmentName) {
  const code = String(equipmentName || "").trim();
  const prefixMatch = code.match(/^(\d{3,})/);
  const prefix = prefixMatch ? prefixMatch[1] : code.replace(/\D/g, "");
  const areaDigit = prefix?.[2] || "";
  if (areaDigit === "3") {
    return "Tuban 3";
  }
  if (areaDigit === "4") {
    return "Tuban 4";
  }
  return "Tuban 34";
}

function applyNegatifListFilter() {
  const query = searchNegatifList?.value || "";
  const status = filterNegatifPriority?.value || "semua";
  const cause = filterNegatifCause?.value || "semua";
  const category = filterNegatifCategory?.value || "semua";
  const dateFrom = filterNegatifDateFrom?.value || "";
  const dateTo = filterNegatifDateTo?.value || "";
  [...negatifListBody.querySelectorAll("tr")].forEach((row) => {
    const rowText = row.textContent || "";
    const rowStatus = row.children[5]?.textContent.trim() || "";
    const rowCause = row.children[4]?.textContent.trim() || "";
    const rowCategory = row.children[6]?.textContent.trim() || "";
    const rowDate = row.children[3]?.textContent.trim() || "";
    const matchesQuery = !query || matchesSearch(rowText, query);
    const matchesStatus = status === "semua" || rowStatus === status;
    const matchesCause = cause === "semua" || rowCause === cause;
    const matchesCategory = category === "semua" || rowCategory === category;
    const matchesDateFrom = !dateFrom || rowDate >= dateFrom;
    const matchesDateTo = !dateTo || rowDate <= dateTo;
    row.hidden = !(matchesQuery && matchesStatus && matchesCause && matchesCategory && matchesDateFrom && matchesDateTo);
  });

  const visibleItems = [...negatifListBody.querySelectorAll("tr")]
    .filter((row) => !row.hidden)
    .map((row) => ({
      id: row.dataset.id,
      equipment: row.children[0]?.textContent.trim() || "",
      damageDescription: row.children[1]?.textContent.trim() || "",
      followUpPlan: row.children[2]?.textContent.trim() || "",
      foundDate: row.children[3]?.textContent.trim() || "",
      pendingMark: row.children[4]?.textContent.trim() || "",
      workStatus: row.children[5]?.textContent.trim() || "",
      category: row.children[6]?.textContent.trim() || "",
      area: row.children[7]?.textContent.trim() || "",
    }));

  renderNegatifModuleSummary(visibleItems);
  renderNegatifCharts(visibleItems);
}

function applySparepartFilter() {
  const query = searchSparepart?.value || "";
  const condition = filterSparepartCondition?.value || "semua";
  [...sparepartBody.querySelectorAll("tr")].forEach((row) => {
    const rowText = row.textContent || "";
    const rowCondition = row.children[5]?.textContent.trim() || "";
    const matchesQuery = !query || matchesSearch(rowText, query);
    const matchesCondition = condition === "semua" || rowCondition === condition;
    row.hidden = !(matchesQuery && matchesCondition);
  });
}

function applyServiceFilter() {
  const query = searchService?.value || "";
  const type = filterServiceType?.value || "semua";
  [...serviceCardList.querySelectorAll(".service-list-item")].forEach((card) => {
    const cardText = card.textContent || "";
    const cardType = card.dataset.type || "";
    const matchesQuery = !query || matchesSearch(cardText, query);
    const matchesType = type === "semua" || cardType === type;
    const isVisible = matchesQuery && matchesType;
    card.hidden = !isVisible;
    card.classList.toggle("is-filtered-out", !isVisible);
  });

  [...serviceCardList.querySelectorAll(".service-subgroup")].forEach((section) => {
    const visibleItems = [...section.querySelectorAll(".service-list-item")].filter((card) => !card.hidden);
    const emptyState = section.querySelector(".service-list-empty");
    section.classList.toggle("is-filtered-out", visibleItems.length === 0 && !emptyState);
    if (emptyState) {
      emptyState.classList.toggle("is-filtered-out", visibleItems.length > 0);
    }
    const countLabel = section.querySelector(".service-subgroup-head span");
    if (countLabel) {
      countLabel.textContent = `${visibleItems.length} item`;
    }
  });

  let visibleColumnCount = 0;
  [...serviceCardList.querySelectorAll(".service-column")].forEach((column) => {
    const groupKey = column.dataset.serviceGroup || "";
    const matchesType = type === "semua" || groupKey === type;
    const visibleItems = [...column.querySelectorAll(".service-list-item")].filter((card) => !card.hidden);
    const visibleSubgroups = [...column.querySelectorAll(".service-subgroup")].filter((section) => !section.classList.contains("is-filtered-out"));
    const shouldShow = matchesType && (visibleItems.length > 0 || visibleSubgroups.length > 0);
    column.classList.toggle("is-filtered-out", !shouldShow);
    if (shouldShow) {
      visibleColumnCount += 1;
    }
    const countLabel = column.querySelector(".service-column-title span");
    if (countLabel) {
      countLabel.textContent = `${visibleItems.length} item`;
    }
  });

  serviceCardList.classList.toggle("single-focus", visibleColumnCount <= 1);
}

function applyBomFilter() {
  const query = searchBom?.value || "";
  const area = filterBomArea?.value || "semua";
  [bomList, bomMotorList].forEach((list) => {
    [...(list?.querySelectorAll(".bom-card") || [])].forEach((card) => {
      const cardText = card.textContent || "";
      const cardArea = card.dataset.area || getBomAreaFromEquipment(card.dataset.equipment || "");
      const matchesQuery = !query || matchesSearch(cardText, query);
      const matchesArea = area === "semua" || cardArea === area;
      const isVisible = matchesQuery && matchesArea;
      card.hidden = !isVisible;
      card.classList.toggle("is-filtered-out", !isVisible);
    });
  });
}

function applySpbFilter() {
  const query = searchSpb?.value || "";
  const year = filterSpbStatus?.value || "semua";
  [...spbBody.querySelectorAll("tr")].forEach((row) => {
    const rowText = row.textContent || "";
    const rowYear = row.children[0]?.textContent.trim() || "";
    const matchesQuery = !query || matchesSearch(rowText, query);
    const matchesYear = year === "semua" || rowYear === year;
    row.hidden = !(matchesQuery && matchesYear);
  });
}

function resetFilters() {
  if (searchNegatifList) searchNegatifList.value = "";
  if (filterNegatifPriority) filterNegatifPriority.value = "semua";
  if (filterNegatifCause) filterNegatifCause.value = "semua";
  if (filterNegatifCategory) filterNegatifCategory.value = "semua";
  if (filterNegatifDateFrom) filterNegatifDateFrom.value = "";
  if (filterNegatifDateTo) filterNegatifDateTo.value = "";
  if (searchSparepart) searchSparepart.value = "";
  if (filterSparepartCondition) filterSparepartCondition.value = "semua";
  if (searchService) searchService.value = "";
  if (filterServiceType) filterServiceType.value = "semua";
  if (searchBom) searchBom.value = "";
  if (filterBomArea) filterBomArea.value = "semua";
  if (searchSpb) searchSpb.value = "";
  if (filterSpbStatus) filterSpbStatus.value = "semua";
}

function downloadCsv(filename, headers, rows) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getSparepartConditionTag(condition) {
  if (condition === "Ready") {
    return "tag-success";
  }
  if (condition === "Terbatas") {
    return "tag-warning";
  }
  return "tag-danger";
}

function getSpbStatusTag(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("barang datang")) return "tag-success";
  if (normalized.includes("tidak acc") || normalized.includes("material delete")) return "tag-danger";
  if (normalized.includes("n/a") || normalized.includes("rencana")) return "tag-warning";
  return "tag-neutral";
}

function normalizeNegatifItem(item) {
  if (item.equipment) {
    return item;
  }

  return {
    id: item.id || createId("negatif"),
    equipment: item.description || item.materialNo || "-",
    damageDescription: item.note || `Pekerjaan pending pada kategori ${item.category || "-"}.`,
    followUpPlan: item.pic ? `Tindak lanjut oleh ${item.pic}.` : "Menunggu tindak lanjut unit terkait.",
    foundDate: item.targetDate || "2026-04-18",
    pendingMark:
      item.pendingCause === "Service Rawmill"
        ? "Menunggu Rawmill service"
        : item.pendingCause === "OVH"
          ? "Menunggu OVH"
          : "Menunggu material",
    workStatus: item.workStatus === "Closed" ? "Close" : item.workStatus || "Open",
    category: item.category || "Electrical",
    area: "Tuban 34",
  };
}

function renderNegatifRow(item) {
  const row = document.createElement("tr");
  row.dataset.id = item.id;
  row.innerHTML = `
    <td>${item.equipment}</td>
    <td>${item.damageDescription}</td>
    <td>${item.followUpPlan}</td>
    <td>${item.foundDate}</td>
    <td>${item.pendingMark || "-"}</td>
    <td>${item.workStatus || "-"}</td>
    <td>${item.category}</td>
    <td>${item.area}</td>
    <td class="action-cell">
      <button class="table-action icon-action" data-action="edit-negatif" type="button" title="Edit" aria-label="Edit">&#9998;</button>
      <button class="table-action danger icon-action" data-action="delete-negatif" type="button" title="Hapus" aria-label="Hapus">&#128465;</button>
    </td>
  `;
  return row;
}

function renderServiceCard(item) {
  serviceItemCache.set(item.id, {
    ...item,
    payload: item.payload || {},
  });
  const card = document.createElement("article");
  card.className = "service-list-item";
  card.dataset.openable = "true";
  card.tabIndex = 0;
  card.dataset.id = item.id;
  card.dataset.type = item.type;
  card.dataset.subtype = item.subtype || item.type;
  card.dataset.formType = item.formType || "";
  card.dataset.equipmentName = item.equipmentName || "";
  card.dataset.description = item.description || "";
  card.dataset.detail = item.detail || "";

  const carbonBrushStatsPayload = item.formType === "service-motor-mv-carbon-brush"
    ? (item.payload?.stats || computeCarbonBrushStats(item.payload?.measurements || {}, item.equipmentName || "", item.payload?.plant || ""))
    : null;
  const inspectionDate = formatInspectionDate(item.payload?.inspectionDate);
  const summaryText = item.formType === "service-motor-mv-carbon-brush"
    ? `Merah ${carbonBrushStatsPayload?.low || 0} | Kuning ${carbonBrushStatsPayload?.medium || 0} | Hijau ${carbonBrushStatsPayload?.high || 0}`
    : (item.detail || "-");

  card.innerHTML = `
    <div class="service-list-main">
      <div class="service-list-top">
        <span class="tag ${getServiceTag(item.type)}">${item.subtype || item.type}</span>
        <small>${inspectionDate}</small>
      </div>
      <strong>${item.equipmentName}</strong>
      <div class="service-list-meta">
        <span>${summaryText}</span>
      </div>
    </div>
    <div class="service-list-actions">
      <button class="table-action compact" data-action="send-service" type="button">Kirim</button>
      <button class="table-action compact" data-action="edit-service" type="button">Edit</button>
      <button class="table-action compact danger" data-action="delete-service" type="button">Hapus</button>
    </div>
  `;
  return card;
}

function getSortedServiceItems(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left?.payload?.inspectionDate || left?.inspectionDate || 0).getTime() || 0;
    const rightTime = new Date(right?.payload?.inspectionDate || right?.inspectionDate || 0).getTime() || 0;
    return rightTime - leftTime;
  });
}

function renderServiceBoard(items) {
  if (!serviceCardList) {
    return;
  }

  const groups = [
    {
      key: "Electrical",
      title: "Electrical",
      sections: [
        { key: "service-electrical-room", title: "Electrical Room" },
        { key: "service-motor-mv", title: "Service Motor MV" },
        { key: "service-motor-mv-carbon-brush", title: "Motor MV (Carbon Brush)" },
        { key: "service-mcc", title: "MCC" },
        { key: "service-ehca", title: "EH/CA" },
      ],
    },
    { key: "Instrument", title: "Instrument" },
    { key: "DCS", title: "DCS" },
  ];

  serviceCardList.innerHTML = "";
  serviceItemCache.clear();

  groups.forEach((group) => {
    const column = document.createElement("section");
    column.className = "service-column";
    column.dataset.serviceGroup = group.key;
    const groupItems = items.filter((item) => item.type === group.key);
    const previewGroupItems = getSortedServiceItems(groupItems).slice(0, 5);
    column.innerHTML = `
      <div class="service-column-head">
        <div class="service-column-title">
          <strong>${group.title}</strong>
          <span>${groupItems.length} item</span>
        </div>
        <button class="table-action compact" data-action="detail-service-group" data-service-group="${group.key}" type="button">Detail</button>
      </div>
      <div class="service-list-body" data-service-type="${group.key}"></div>
    `;
    const body = column.querySelector(".service-list-body");

    if (group.key === "Electrical") {
      group.sections.forEach((section) => {
        const sectionItems = groupItems.filter((item) => (item.formType || "") === section.key);
        const previewSectionItems = getSortedServiceItems(sectionItems).slice(0, 5);
        const wrapper = document.createElement("section");
        wrapper.className = "service-subgroup";
        wrapper.dataset.sectionKey = section.key;
        wrapper.innerHTML = `
          <div class="service-subgroup-head">
            <strong>${section.title}</strong>
            <span>${sectionItems.length} item</span>
          </div>
        `;
        const sectionBody = document.createElement("div");
        sectionBody.className = "service-subgroup-body";
        if (previewSectionItems.length) {
          previewSectionItems.forEach((entry) => sectionBody.append(renderServiceCard(entry)));
        } else {
          const empty = document.createElement("div");
          empty.className = "service-list-empty";
          empty.textContent = "Belum ada hasil inspeksi.";
          sectionBody.append(empty);
        }
        wrapper.append(sectionBody);
        body.append(wrapper);
      });
    } else if (previewGroupItems.length) {
      previewGroupItems.forEach((entry) => body.append(renderServiceCard(entry)));
    } else {
      const empty = document.createElement("div");
      empty.className = "service-list-empty";
      empty.textContent = "Belum ada hasil inspeksi.";
      body.append(empty);
    }
    serviceCardList.append(column);
  });

  renderMccReferenceOptions();
}

function renderSparepartRow(item) {
  const row = document.createElement("tr");
  row.dataset.id = item.id;
  row.innerHTML = `
    <td>${item.code}</td>
    <td>${item.name}</td>
    <td>${item.category}</td>
    <td>${item.location}</td>
    <td>${item.qty}</td>
    <td><span class="tag ${getSparepartConditionTag(item.condition)}">${item.condition}</span></td>
    <td class="action-cell">
      <button class="table-action" data-action="edit-sparepart" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-sparepart" type="button">Hapus</button>
    </td>
  `;
  return row;
}

function renderBomCard(item) {
  const equipment = escapeHtml(item.equipment || "-");
  const part = escapeHtml(item.part || "-");
  const qty = escapeHtml(item.qty || "-");
  const note = escapeHtml(item.note || "-");
  const area = getBomAreaFromEquipment(item.equipment || "");
  const longText = item.longText ? `<div class="bom-long-text">${escapeHtml(item.longText)}</div>` : "";
  const card = document.createElement("article");
  card.className = "bom-card";
  card.dataset.id = item.id;
  card.dataset.equipment = item.equipment || "";
  card.dataset.area = area;
  card.dataset.openable = "true";
  card.tabIndex = 0;
  card.innerHTML = `
    <div class="bom-visual">
      ${renderBomImageTile("Foto Barang", item.itemPhoto, "primary")}
      ${renderBomImageTile("Foto Nameplate", item.nameplatePhoto, "secondary")}
      ${renderBomImageTile("Foto Lain", item.extraPhoto, "tertiary")}
    </div>
    <div class="bom-copy">
      <strong>${equipment}</strong>
      <p>${part}</p>
      <small data-value="${qty}">Jumlah: ${qty}</small>
      <span>Area: ${escapeHtml(area)}</span>
      <span>${note}</span>
      ${longText}
    </div>
    <div class="card-actions">
      <button class="table-action" data-action="edit-bom" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-bom" type="button">Hapus</button>
    </div>
  `;
  return card;
}

function renderBomMotorCard(item) {
  const equipment = escapeHtml(item.equipment || "-");
  const manufacture = escapeHtml(item.manufacture || "-");
  const area = getBomAreaFromEquipment(item.equipment || "");
  const specs = [
    item.power ? `${escapeHtml(item.power)} kW` : null,
    item.voltage ? `${escapeHtml(item.voltage)} V` : null,
    item.speed ? `${escapeHtml(item.speed)} rpm` : null,
  ].filter(Boolean).join(" • ") || "-";
  const frame = escapeHtml(item.frame || "-");
  const serialNumber = escapeHtml(item.serialNumber || "-");
  const note = escapeHtml(item.note || "-");
  const card = document.createElement("article");
  card.className = "bom-card bom-motor-card";
  card.dataset.id = item.id;
  card.dataset.inspectionDate = item.inspectionDate || "";
  card.dataset.equipment = item.equipment || "";
  card.dataset.area = area;
  card.dataset.manufacture = item.manufacture || "";
  card.dataset.power = item.power || "";
  card.dataset.ampere = item.ampere || "";
  card.dataset.voltage = item.voltage || "";
  card.dataset.speed = item.speed || "";
  card.dataset.frame = item.frame || "";
  card.dataset.serialNumber = item.serialNumber || "";
  card.dataset.note = item.note || "";
  card.dataset.longText = item.longText || "";
  card.dataset.openable = "true";
  card.tabIndex = 0;
  card.innerHTML = `
    <div class="bom-visual">
      ${renderBomMotorImageTile("Foto Motor", item.motorPhoto, "primary")}
      ${renderBomMotorImageTile("Foto Nameplate", item.nameplatePhoto, "secondary")}
      ${renderBomMotorImageTile("Foto Koneksi", item.connectionPhoto, "tertiary")}
    </div>
    <div class="bom-copy bom-motor-copy">
      <strong>${equipment}</strong>
      <p>${manufacture}</p>
      <small>${specs}</small>
      <span>Area: ${escapeHtml(area)}</span>
      <span>Frame: ${frame}</span>
      <span>Serial: ${serialNumber}</span>
      <span>${note}</span>
    </div>
    <div class="card-actions">
      <button class="table-action" data-action="edit-bom-motor" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-bom-motor" type="button">Hapus</button>
    </div>
  `;
  return card;
}

function renderSpbRow(item) {
  const normalizedItem = normalizeSpbItem(item);
  const row = document.createElement("tr");
  row.dataset.id = normalizedItem.id;
  row.innerHTML = `
    <td>${normalizedItem.year}</td>
    <td>${normalizedItem.quarter}</td>
    <td>${normalizedItem.spbType}</td>
    <td>${normalizedItem.notificationNo || "-"}</td>
    <td>${normalizedItem.orderNo || "-"}</td>
    <td>${normalizedItem.reservationNo || "-"}</td>
    <td>${normalizedItem.stockNo || "-"}</td>
    <td>${normalizedItem.materialDescription || "-"}</td>
    <td>${normalizedItem.qty || "-"}</td>
    <td>${normalizedItem.mrp || "-"}</td>
    <td>${formatSpbAmount(normalizedItem.totalEce)}</td>
    <td><span class="tag ${getSpbStatusTag(normalizedItem.note)}">${normalizedItem.note || "-"}</span></td>
    <td>${normalizedItem.prNo || "-"}</td>
    <td>${normalizedItem.poNo || "-"}</td>
    <td>${normalizedItem.deliveryDate || "-"}</td>
    <td class="action-cell">
      <button class="table-action icon-action" data-action="edit-spb" type="button" title="Edit" aria-label="Edit">&#9998;</button>
      <button class="table-action danger icon-action" data-action="delete-spb" type="button" title="Hapus" aria-label="Hapus">&#128465;</button>
    </td>
  `;
  return row;
}

function replaceBodyRows(target, items, renderer) {
  target.innerHTML = "";
  items.forEach((item) => {
    target.append(renderer(item));
  });
}

function replaceCardList(target, items, renderer) {
  target.innerHTML = "";
  items.forEach((item) => {
    target.append(renderer(item));
  });
}

function hasAnyStoredData() {
  return (
    readStorage(storageKeys.negatifList).length > 0 ||
    readStorage(storageKeys.sparepart).length > 0 ||
    readStorage(storageKeys.service).length > 0 ||
    readStorage(storageKeys.bom).length > 0 ||
    readStorage(storageKeys.bomMotor).length > 0 ||
    readStorage(storageKeys.spb).length > 0
  );
}

function appendNegatifListRow(item) {
  negatifListBody.prepend(renderNegatifRow(item));
  persistNegatifList();
  updateDashboardStats();
  applyNegatifListFilter();
}

function appendServiceCard(item) {
  const items = [item, ...getServiceItemsFromDom()];
  renderServiceBoard(items);
  persistServiceList();
  updateDashboardStats();
  applyServiceFilter();
}

function appendSparepartRow(item) {
  sparepartBody.prepend(renderSparepartRow(item));
  persistSparepartList();
  updateDashboardStats();
  applySparepartFilter();
}

function appendBomCard(item) {
  bomList.prepend(renderBomCard(item));
  persistBomList();
  updateDashboardStats();
  applyBomFilter();
}

function appendBomMotorCard(item) {
  bomMotorList?.prepend(renderBomMotorCard(item));
  persistBomMotorList();
  updateDashboardStats();
  applyBomFilter();
}

function appendSpbRow(item) {
  spbBody.prepend(renderSpbRow(item));
  persistSpbList();
  updateDashboardStats();
  applySpbFilter();
}

function getSparepartItemsFromDom() {
  return [...sparepartBody.querySelectorAll("tr")].map((row) => ({
    id: row.dataset.id,
    code: row.children[0].textContent,
    name: row.children[1].textContent,
    category: row.children[2].textContent,
    location: row.children[3].textContent,
    qty: row.children[4].textContent,
    condition: row.children[5].textContent.trim(),
  }));
}

function getBomItemsFromDom() {
  return [...bomList.querySelectorAll(".bom-card")].map((card) => ({
    id: card.dataset.id,
    equipment: card.querySelector(".bom-copy strong")?.textContent || "-",
    part: card.querySelector(".bom-copy p")?.textContent || "-",
    qty: card.querySelector(".bom-copy small")?.dataset.value || "-",
    note: card.querySelector(".bom-copy span")?.textContent || "-",
    longText: card.querySelector(".bom-long-text")?.textContent || "",
    itemPhoto: card.querySelector('[data-bom-photo="item"]')?.dataset.filename || "",
    nameplatePhoto: card.querySelector('[data-bom-photo="nameplate"]')?.dataset.filename || "",
    extraPhoto: card.querySelector('[data-bom-photo="extra"]')?.dataset.filename || "",
  }));
}

function getBomMotorItemsFromDom() {
  return [...(bomMotorList?.querySelectorAll(".bom-motor-card") || [])].map((card) => ({
    id: card.dataset.id,
    inspectionDate: card.dataset.inspectionDate || "",
    equipment: card.dataset.equipment || "",
    manufacture: card.dataset.manufacture || "",
    power: card.dataset.power || "",
    ampere: card.dataset.ampere || "",
    voltage: card.dataset.voltage || "",
    speed: card.dataset.speed || "",
    frame: card.dataset.frame || "",
    serialNumber: card.dataset.serialNumber || "",
    note: card.dataset.note || "",
    longText: card.dataset.longText || "",
    nameplatePhoto: card.querySelector('[data-bom-motor-photo="nameplate"]')?.dataset.filename || "",
    connectionPhoto: card.querySelector('[data-bom-motor-photo="connection"]')?.dataset.filename || "",
    motorPhoto: card.querySelector('[data-bom-motor-photo="motor"]')?.dataset.filename || "",
  }));
}

function getSpbItemsFromDom() {
  return [...spbBody.querySelectorAll("tr")].map((row) => ({
    id: row.dataset.id,
    year: row.children[0].textContent.trim(),
    quarter: row.children[1].textContent.trim(),
    spbType: row.children[2].textContent.trim(),
    notificationNo: row.children[3].textContent.trim(),
    orderNo: row.children[4].textContent.trim(),
    reservationNo: row.children[5].textContent.trim(),
    stockNo: row.children[6].textContent.trim(),
    materialDescription: row.children[7].textContent.trim(),
    qty: row.children[8].textContent.trim(),
    mrp: row.children[9].textContent.trim(),
    totalEce: row.children[10].textContent.trim(),
    note: row.children[11].textContent.trim(),
    prNo: row.children[12].textContent.trim(),
    poNo: row.children[13].textContent.trim(),
    deliveryDate: row.children[14].textContent.trim(),
  })).map((item) => normalizeSpbItem(item));
}

function loadStoredData() {
  const storedNegatif = readStorage(storageKeys.negatifList);
  if (storedNegatif.length) {
    negatifListBody.innerHTML = "";
    const normalizedNegatif = storedNegatif.map((item) => normalizeNegatifItem(item));
    normalizedNegatif.forEach((item) => {
      negatifListBody.append(renderNegatifRow(item));
    });
    writeStorage(storageKeys.negatifList, normalizedNegatif);
  } else {
    negatifListBody.innerHTML = "";
    persistNegatifList();
  }

  const storedSparepart = readStorage(storageKeys.sparepart);
  if (storedSparepart.length) {
    sparepartBody.innerHTML = "";
    storedSparepart.forEach((item) => {
      sparepartBody.append(renderSparepartRow(item));
    });
  } else {
    sparepartBody.innerHTML = "";
    persistSparepartList();
  }

  const storedService = readStorage(storageKeys.service);
  if (storedService.length) {
    const normalizedService = storedService.map((item) => normalizeServiceItem(item));
    renderServiceBoard(normalizedService);
    writeStorage(storageKeys.service, normalizedService);
  } else {
    renderServiceBoard([]);
    persistServiceList();
  }

  const storedBom = readStorage(storageKeys.bom);
  if (storedBom.length) {
    bomList.innerHTML = "";
    storedBom.forEach((item) => {
      bomList.append(renderBomCard(item));
    });
  } else {
    bomList.innerHTML = "";
    persistBomList();
  }

  const storedBomMotor = readStorage(storageKeys.bomMotor);
  if (storedBomMotor.length) {
    if (bomMotorList) {
      bomMotorList.innerHTML = "";
      storedBomMotor.forEach((item) => {
        bomMotorList.append(renderBomMotorCard(item));
      });
    }
  } else if (bomMotorList) {
    bomMotorList.innerHTML = "";
    persistBomMotorList();
  }

  const storedSpb = readStorage(storageKeys.spb);
  if (storedSpb.length) {
    spbBody.innerHTML = "";
    const normalizedSpb = storedSpb.map((item) => normalizeSpbItem(item));
    normalizedSpb.forEach((item) => {
      spbBody.append(renderSpbRow(item));
    });
    writeStorage(storageKeys.spb, normalizedSpb);
  } else {
    spbBody.innerHTML = "";
    persistSpbList();
  }

  updateDashboardStats();
  applyNegatifListFilter();
  applySparepartFilter();
  applyServiceFilter();
  applyBomFilter();
  applySpbFilter();
}

function hydrateNegatifForm(item) {
  const form = document.querySelector('[data-form-type="negatif-list"]');
  if (equipmentReferenceList.includes(item.equipment)) {
    setEquipmentReferenceValue(item.equipment);
    updateEquipmentReferenceStatus(`Referensi equipment aktif: ${equipmentReferenceList.length} item dari spreadsheet.`);
  } else {
    setEquipmentReferenceValue("");
    updateEquipmentReferenceStatus(`Equipment "${item.equipment}" tidak ada di referensi. Pilih ulang dari daftar resmi.`, true);
  }
  form.foundDate.value = item.foundDate;
  form.category.value = item.category;
  form.area.value = item.area;
  form.pendingMark.value = item.pendingMark || "Menunggu material";
  form.workStatus.value = item.workStatus || "Open";
  form.damageDescription.value = item.damageDescription || "";
  form.followUpPlan.value = item.followUpPlan || "";
  editingNegatifId = item.id;
  setSubmitNote(form, "Mode edit aktif untuk item negatif list.");
}

function hydrateServiceForm(item) {
  const form = document.querySelector(`[data-form-type="${item.formType}"]`);
  if (!form) {
    return;
  }

  if (item.type === "Electrical") {
    openServicePane("electrical");
    if (item.formType === "service-electrical-room") {
      openElectricalPane("electrical-room");
    }
    if (item.formType === "service-motor-mv") {
      openElectricalPane("motor-mv");
    }
    if (item.formType === "service-motor-mv-carbon-brush") {
      openElectricalPane("motor-mv-carbon-brush");
    }
    if (item.formType === "service-mcc") {
      openElectricalPane("mcc");
    }
    if (item.formType === "service-ehca") {
      openElectricalPane("ehca");
    }
  }

  if (item.type === "Instrument") {
    openServicePane("instrument");
  }

  if (item.type === "DCS") {
    openServicePane("dcs");
  }

  form.equipmentName.value = item.equipmentName;
  form.description.value = item.description;
  const payload = item.payload || {};

  if (item.formType === "service-electrical-room") {
    form.panelDoorCondition.value = payload.panelDoorCondition || "OK";
    form.floorCleanliness.value = payload.floorCleanliness || "Bersih";
    form.roomTemperature.value = payload.roomTemperature || "Dingin";
    form.batteryVdc.value = payload.batteryVdc || "";
    form.batteryAmpere.value = payload.batteryAmpere || "";
    form.batteryTotalVdc.value = payload.batteryTotalVdc || "";
    form.battery1.value = payload.battery1 || "";
    form.battery2.value = payload.battery2 || "";
    form.battery3.value = payload.battery3 || "";
    form.battery4.value = payload.battery4 || "";
    form.battery5.value = payload.battery5 || "";
    form.battery6.value = payload.battery6 || "";
    form.battery7.value = payload.battery7 || "";
    form.battery8.value = payload.battery8 || "";
    form.battery9.value = payload.battery9 || "";
    form.battery10.value = payload.battery10 || "";
    form.transformerEquipment.value = payload.transformerEquipment || "";
    form.transformerWindingTemperature.value = payload.transformerWindingTemperature || "";
    form.transformerOilTemperature.value = payload.transformerOilTemperature || "";
    form.transformerOilLevel.value = payload.transformerOilLevel || "";
    form.transformerSilicaGel.value = payload.transformerSilicaGel || "OK";
  }

  if (item.formType === "service-motor-mv") {
    form.vibrationDe.value = payload.vibrationDe || "";
    form.vibrationNde.value = payload.vibrationNde || "";
    form.windingTemperature.value = payload.windingTemperature || "";
    form.bearingCondition.value = payload.bearingCondition || "";
    form.motorCurrent.value = payload.motorCurrent || "";
  }

  if (item.formType === "service-motor-mv-carbon-brush") {
    selectedCarbonBrushEquipmentReference = item.equipmentName || "";
    form.replacement.value = payload.replacement || "";
    form.megger.value = payload.megger || "";
    form.pic.value = payload.pic || "";
    carbonBrushMeasurementKeys.forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = payload.measurements?.[key] || "";
      }
    });
    updateCarbonBrushEquipmentMeta(item.equipmentName || "", payload.plant || "");
    updateCarbonBrushMeasurementColors();
  }

  if (item.formType === "service-mcc") {
    form.inspectionDate.value = String(payload.inspectionDate || "").slice(0, 10);
    form.testFunction.value = normalizeMccStatusValue(payload.testFunction || "OK");
    form.visualCondition.value = normalizeMccStatusValue(payload.visualCondition || "OK");
    form.partCleanliness.value = normalizeMccStatusValue(payload.partCleanliness || "OK");
  }

  if (item.formType === "service-ehca") {
    form.systemPressure.value = payload.systemPressure || "";
    form.fluidLevel.value = payload.fluidLevel || "";
    form.filterCondition.value = payload.filterCondition || "";
    form.leakCondition.value = payload.leakCondition || "";
    form.unitCondition.value = payload.unitCondition || "";
  }

  if (item.formType === "service-instrument") {
    form.sensorCondition.value = payload.sensorCondition || "";
  }

  if (item.formType === "service-dcs") {
    const dcsPayload = normalizeDcsPayload(payload);
    selectedDcsEquipmentReference = item.equipmentName || "";
    form.equipmentDescription.value = dcsPayload.equipmentDescription || "";
    form.plcPowerSupplyModule.value = dcsPayload.plcPowerSupplyModule || "";
    form.plcCommunicationModule.value = dcsPayload.plcCommunicationModule || "";
    form.plcProcessorModule.value = dcsPayload.plcProcessorModule || "";
    form.plcDigitalInputModule.value = dcsPayload.plcDigitalInputModule || "";
    form.plcDigitalOutputModule.value = dcsPayload.plcDigitalOutputModule || "";
    form.plcAnalogInputModule.value = dcsPayload.plcAnalogInputModule || "";
    form.plcAnalogOutputModule.value = dcsPayload.plcAnalogOutputModule || "";
    form.fiberOpticEthernetCommunication.value = dcsPayload.fiberOpticEthernetCommunication || "";
    form.groundingEeEa.value = dcsPayload.groundingEeEa || "";
    form.groundingEePe.value = dcsPayload.groundingEePe || "";
    form.groundingEaPe.value = dcsPayload.groundingEaPe || "";
    form.cableTermination.value = dcsPayload.cableTermination || "";
    form.upsOutput.value = dcsPayload.upsOutput || "";
    form.pdbOutput.value = dcsPayload.pdbOutput || "";
    form.roomAcCondition.value = dcsPayload.roomAcCondition || "";
    form.roomCleanliness.value = dcsPayload.roomCleanliness || "";
    form.damagedPartReplacement.value = dcsPayload.damagedPartReplacement || "";
    form.adjustmentRepair.value = dcsPayload.adjustmentRepair || "";
  }

  editingServiceId = item.id;
  setSubmitNote(form, `Mode edit aktif untuk service ${item.subtype || item.type}.`);
}

function hydrateSparepartForm(item) {
  const form = document.querySelector('[data-form-type="sparepart"]');
  form.code.value = item.code;
  form.name.value = item.name;
  form.category.value = item.category;
  form.location.value = item.location;
  form.qty.value = item.qty;
  form.condition.value = item.condition;
  editingSparepartId = item.id;
  setSubmitNote(form, "Mode edit aktif untuk sparepart.");
}

function hydrateBomForm(item) {
  const form = document.querySelector('[data-form-type="bom"]');
  form.equipment.value = item.equipment || "";
  form.part.value = item.part || "";
  form.qty.value = item.qty || "";
  form.itemPhoto.value = item.itemPhoto || "";
  form.nameplatePhoto.value = item.nameplatePhoto || "";
  form.extraPhoto.value = item.extraPhoto || "";
  form.note.value = item.note || "";
  form.longText.value = item.longText || "";
  editingBomId = item.id;
  setSubmitNote(form, "Mode edit aktif untuk BOM.");
}

function hydrateBomMotorForm(item) {
  const form = document.querySelector('[data-form-type="bom-motor"]');
  form.inspectionDate.value = item.inspectionDate || "";
  form.equipment.value = item.equipment || "";
  form.manufacture.value = item.manufacture || "";
  form.power.value = item.power || "";
  form.ampere.value = item.ampere || "";
  form.voltage.value = item.voltage || "";
  form.speed.value = item.speed || "";
  form.frame.value = item.frame || "";
  form.serialNumber.value = item.serialNumber || "";
  form.nameplatePhoto.value = item.nameplatePhoto || "";
  form.connectionPhoto.value = item.connectionPhoto || "";
  form.motorPhoto.value = item.motorPhoto || "";
  form.note.value = item.note || "";
  form.longText.value = item.longText || "";
  editingBomMotorId = item.id;
  setSubmitNote(form, "Mode edit aktif untuk BOM Motor.");
}

function hydrateSpbForm(item) {
  const form = document.querySelector('[data-form-type="spb"]');
  const normalizedItem = normalizeSpbItem(item);
  form.year.value = normalizedItem.year;
  form.quarter.value = normalizedItem.quarter;
  form.spbType.value = normalizedItem.spbType;
  form.notificationNo.value = normalizedItem.notificationNo;
  form.orderNo.value = normalizedItem.orderNo;
  form.reservationNo.value = normalizedItem.reservationNo;
  form.stockNo.value = normalizedItem.stockNo;
  form.materialDescription.value = normalizedItem.materialDescription;
  form.qty.value = normalizedItem.qty;
  form.mrp.value = normalizedItem.mrp;
  form.totalEce.value = normalizedItem.totalEce;
  form.note.value = normalizedItem.note;
  form.prNo.value = normalizedItem.prNo;
  form.poNo.value = normalizedItem.poNo;
  form.deliveryDate.value = normalizedItem.deliveryDate;
  editingSpbId = normalizedItem.id;
  setSubmitNote(form, "Mode edit aktif untuk SPB.");
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "user.plirm34").trim();
    const password = String(formData.get("password") || "");

    if (backendState.available) {
      try {
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: { username, password },
        });
        loginWithUser(result.user);
        await hydrateFromBackendAfterLogin();
        showToast("Login Berhasil", `Masuk sebagai ${result.user.username} (${roleLabels[result.user.role]}).`);
      } catch (error) {
        showToast("Login Gagal", error.message || "Username atau password tidak cocok.");
      }
      return;
    }

    const matchedUser = findUserByUsername(username);
    if (!matchedUser || matchedUser.password !== password) {
      showToast("Login Gagal", "Username atau password tidak cocok.");
      return;
    }

    loginWithUser(matchedUser);
    showToast("Login Berhasil", `Masuk sebagai ${matchedUser.username} (${roleLabels[matchedUser.role]}).`);
  });
}

signupButton?.addEventListener("click", async () => {
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");
  const username = String(usernameField?.value || "").trim();
  const password = String(passwordField?.value || "");

  if (!username || !password) {
    showToast("Sign Up", "Isi username dan password terlebih dahulu.");
    return;
  }

  if (backendState.available) {
    try {
      const result = await apiRequest("/auth/signup", {
        method: "POST",
        body: { username, password },
      });
      const users = getStoredUsers().filter((user) => user.username.toLowerCase() !== username.toLowerCase());
      users.push({ username, password, role: result.user.role });
      writeStorage(storageKeys.users, users);
      loginWithUser({ username, password, role: result.user.role });
      await hydrateFromBackendAfterLogin();
      showToast("Sign Up Berhasil", "Akun baru dibuat dengan role Team.");
    } catch (error) {
      showToast("Sign Up", error.message || "Gagal membuat akun baru.");
    }
    return;
  }

  const existingUser = findUserByUsername(username);
  if (existingUser) {
    showToast("Sign Up", "Username sudah terdaftar. Gunakan username lain atau login.");
    return;
  }

  const users = getStoredUsers();
  const newUser = {
    username,
    password,
    role: "team",
  };
  users.push(newUser);
  writeStorage(storageKeys.users, users);
  loginWithUser(newUser);
  showToast("Sign Up Berhasil", "Akun baru dibuat dengan role Team.");
});

forgotPasswordButton?.addEventListener("click", () => {
  const username = String(document.getElementById("username")?.value || "").trim();
  if (backendState.available) {
    showToast("Lupa Password", `Reset password backend belum dibuat. Hubungi admin untuk reset akun ${username || "Anda"}.`);
    return;
  }
  if (!username) {
    showToast("Lupa Password", "Masukkan username terlebih dahulu untuk cek akun lokal.");
    return;
  }

  const user = findUserByUsername(username);
  if (!user) {
    showToast("Lupa Password", "Username belum terdaftar di penyimpanan lokal aplikasi.");
    return;
  }

  showToast("Lupa Password", `Reset backend belum tersedia. Untuk prototype ini, akun ${user.username} tersimpan lokal dan perlu diubah manual.`);
});

userManagementBody?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.dataset.action !== "save-user-role") {
    return;
  }

  const row = target.closest("tr");
  if (!row) {
    return;
  }

  const username = row.dataset.username || "";
  const roleSelect = row.querySelector(".user-role-select");
  if (!(roleSelect instanceof HTMLSelectElement) || !username) {
    return;
  }

  const nextRole = roleSelect.value;
  if (backendState.available) {
    try {
      const result = await apiRequest(`/users/${encodeURIComponent(username)}/role`, {
        method: "PUT",
        body: { role: nextRole },
      });
      cacheUsers(result.users);
      renderUserManagementTable();

      const session = readStorage(storageKeys.session);
      if (session && !Array.isArray(session) && session.username === username) {
        saveSession(session.username, nextRole);
        applyRoleAccess(nextRole);
        currentRole.textContent = roleLabels[nextRole] || nextRole;
        if (nextRole !== "admin") {
          openSection("dashboard");
          showToast("Manajemen User", `Role akun aktif berubah menjadi ${roleLabels[nextRole]}. Akses admin ditutup.`);
          return;
        }
      }

      showToast("Manajemen User", `Role ${username} berhasil diubah menjadi ${roleLabels[nextRole]}.`);
    } catch (error) {
      showToast("Manajemen User", error.message || "Gagal mengubah role user.");
      renderUserManagementTable();
    }
    return;
  }

  const users = getStoredUsers();
  const updatedUsers = users.map((user) => (
    user.username === username
      ? { ...user, role: nextRole }
      : user
  ));

  writeStorage(storageKeys.users, updatedUsers);
  renderUserManagementTable();

  const session = readStorage(storageKeys.session);
  if (session && !Array.isArray(session) && session.username === username) {
    saveSession(session.username, nextRole);
    applyRoleAccess(nextRole);
    currentRole.textContent = roleLabels[nextRole] || nextRole;
    if (nextRole !== "admin") {
      openSection("dashboard");
      showToast("Manajemen User", `Role akun aktif berubah menjadi ${roleLabels[nextRole]}. Akses admin ditutup.`);
      return;
    }
  }

  showToast("Manajemen User", `Role ${username} berhasil diubah menjadi ${roleLabels[nextRole]}.`);
});

adminBackupButton?.addEventListener("click", async () => {
  try {
    await downloadAdminBackup();
    showToast("Admin Tools", "Backup database berhasil diunduh.");
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal membuat backup.");
  }
});

adminExportButton?.addEventListener("click", async () => {
  const resourceName = adminExportResource?.value || "negatif-list";
  try {
    await downloadBackendExport(resourceName);
    showToast("Admin Tools", `Export ${resourceName} berhasil diunduh.`);
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal export laporan.");
  }
});

adminImportButton?.addEventListener("click", async () => {
  const file = adminImportInput?.files?.[0];
  if (!file) {
    showToast("Admin Tools", "Pilih file CSV terlebih dahulu.");
    return;
  }
  const resourceName = adminImportResource?.value || "negatif-list";
  const mode = adminImportMode?.value || "replace";
  try {
    const result = await importAdminCsv(resourceName, mode, file);
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    if (activeRole === "admin") {
      await refreshAdminMasters();
    }
    adminImportInput.value = "";
    showToast("Admin Tools", `Import ${resourceName} selesai: ${result.imported || 0} baris (${mode}).`);
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal import CSV.");
  }
});

adminCarbonBrushImportButton?.addEventListener("click", async () => {
  const sourceUrl = String(adminCarbonBrushUrl?.value || "").trim();
  const mode = adminCarbonBrushMode?.value || "append";
  if (!sourceUrl) {
    showToast("Admin Tools", "Link Carbon Brush wajib diisi.");
    return;
  }
  try {
    const result = await importCarbonBrushFromSource(sourceUrl, mode);
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    showToast("Admin Tools", `Import Carbon Brush selesai: ${result.imported || 0} item (${mode}).`);
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal import Carbon Brush dari link.");
  }
});

adminRestoreButton?.addEventListener("click", async () => {
  const file = adminRestoreInput?.files?.[0];
  if (!file) {
    showToast("Admin Tools", "Pilih file backup JSON terlebih dahulu.");
    return;
  }
  try {
    await restoreAdminBackup(file);
    await hydrateFromBackendAfterLogin();
    await refreshAdminMasters();
    showToast("Admin Tools", "Restore backup berhasil.");
    adminRestoreInput.value = "";
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal restore backup.");
  }
});

adminAreaForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminAreaForm);
  try {
    await saveAdminMaster("areas", {
      code: String(formData.get("code") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      plant: String(formData.get("plant") || "").trim(),
      sortOrder: Number(formData.get("sortOrder") || 0),
    });
    adminAreaForm.reset();
    await refreshAdminMasters();
    showToast("Master Area", "Area berhasil disimpan.");
  } catch (error) {
    showToast("Master Area", error.message || "Gagal menyimpan area.");
  }
});

adminCarbonBrushThresholdForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminCarbonBrushThresholdForm);
  const value = {
    tuban3: {
      low: Number(formData.get("tuban3Low") || 30),
      high: Number(formData.get("tuban3High") || 34),
    },
    tuban4: {
      low: Number(formData.get("tuban4Low") || 35),
      high: Number(formData.get("tuban4High") || 38),
    },
  };
  try {
    await saveAdminMaster("app-settings", {
      settingKey: "carbon_brush_thresholds",
      value,
    });
    await loadMastersFromBackend();
    hydrateCarbonBrushThresholdForm();
    updateCarbonBrushEquipmentMeta(carbonBrushEquipmentInput?.value || selectedCarbonBrushEquipmentReference || "");
    if (serviceElectricalCarbonBrushForm) {
      updateCarbonBrushStatsDisplay(
        collectCarbonBrushMeasurements(serviceElectricalCarbonBrushForm),
        carbonBrushEquipmentInput?.value || selectedCarbonBrushEquipmentReference || "",
      );
    }
    showToast("Admin Tools", "Threshold Carbon Brush berhasil diperbarui.");
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal menyimpan threshold Carbon Brush.");
  }
});

adminElectricalRoomThresholdForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminElectricalRoomThresholdForm);
  const value = {
    batteryChargeLow: Number(formData.get("batteryChargeLow") || 120),
    batteryChargeHigh: Number(formData.get("batteryChargeHigh") || 130),
    batteryCellLow: Number(formData.get("batteryCellLow") || 11.5),
    batteryCellHigh: Number(formData.get("batteryCellHigh") || 12.8),
    transformerWindingLow: Number(formData.get("transformerWindingLow") || 45),
    transformerWindingHigh: Number(formData.get("transformerWindingHigh") || 85),
    transformerOilLow: Number(formData.get("transformerOilLow") || 40),
    transformerOilHigh: Number(formData.get("transformerOilHigh") || 70),
  };
  try {
    await saveAdminMaster("app-settings", {
      settingKey: "electrical_room_thresholds",
      value,
    });
    await loadMastersFromBackend();
    hydrateElectricalRoomThresholdForm();
    showToast("Admin Tools", "Threshold Electrical Room berhasil diperbarui.");
  } catch (error) {
    showToast("Admin Tools", error.message || "Gagal menyimpan threshold Electrical Room.");
  }
});

adminElectricalRoomForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminElectricalRoomForm);
  const roomName = String(formData.get("roomName") || "").trim().toUpperCase();
  if (!roomName) {
    showToast("Master Electrical Room", "Nama room / panel wajib diisi.");
    return;
  }

  const nextItems = [...new Set([...getElectricalRoomReferenceList(), roomName])];
  try {
    await saveAdminMaster("app-settings", {
      settingKey: "electrical_room_references",
      value: { items: nextItems },
    });
    adminElectricalRoomForm.reset();
    await loadMastersFromBackend();
    renderElectricalRoomReferenceOptions();
    renderAdminElectricalRoomTable();
    showToast("Master Electrical Room", "Referensi room / panel berhasil disimpan.");
  } catch (error) {
    showToast("Master Electrical Room", error.message || "Gagal menyimpan referensi room / panel.");
  }
});

adminEquipmentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminEquipmentForm);
  try {
    await saveAdminMaster("equipment-references", {
      sourceGroup: String(formData.get("sourceGroup") || "").trim(),
      equipmentCode: String(formData.get("equipmentCode") || "").trim(),
      equipmentName: String(formData.get("equipmentName") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      area: String(formData.get("area") || "").trim(),
      plant: String(formData.get("plant") || "").trim(),
    });
    adminEquipmentForm.reset();
    await refreshAdminMasters();
    await Promise.allSettled([
      loadEquipmentReference(),
      loadCarbonBrushEquipmentReference(),
    ]);
    showToast("Master Equipment", "Equipment reference berhasil disimpan.");
  } catch (error) {
    showToast("Master Equipment", error.message || "Gagal menyimpan equipment reference.");
  }
});

adminTemplateForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(adminTemplateForm);
  try {
    const definition = JSON.parse(String(formData.get("definition") || "{}"));
    await saveAdminMaster("inspection-templates", {
      moduleName: String(formData.get("moduleName") || "").trim(),
      inspectionType: String(formData.get("inspectionType") || "").trim(),
      inspectionSubtype: String(formData.get("inspectionSubtype") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      definition,
    });
    adminTemplateForm.reset();
    await refreshAdminMasters();
    showToast("Master Template", "Inspection template berhasil disimpan.");
  } catch (error) {
    showToast("Master Template", error.message || "Gagal menyimpan inspection template.");
  }
});

adminAreasBody?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.dataset.action !== "delete-area") {
    return;
  }
  const row = target.closest("tr");
  const code = row?.dataset.code || "";
  try {
    await deleteAdminMaster("areas", code);
    await refreshAdminMasters();
    showToast("Master Area", "Area berhasil dihapus.");
  } catch (error) {
    showToast("Master Area", error.message || "Gagal menghapus area.");
  }
});

adminEquipmentBody?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.dataset.action !== "delete-equipment-master") {
    return;
  }
  const row = target.closest("tr");
  const identifier = row?.dataset.identifier || "";
  try {
    await deleteAdminMaster("equipment-references", identifier);
    await refreshAdminMasters();
    await Promise.allSettled([
      loadEquipmentReference(),
      loadCarbonBrushEquipmentReference(),
    ]);
    showToast("Master Equipment", "Equipment reference berhasil dihapus.");
  } catch (error) {
    showToast("Master Equipment", error.message || "Gagal menghapus equipment reference.");
  }
});

adminTemplatesBody?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.dataset.action !== "delete-template") {
    return;
  }
  const row = target.closest("tr");
  const identifier = row?.dataset.identifier || "";
  try {
    await deleteAdminMaster("inspection-templates", identifier);
    await refreshAdminMasters();
    showToast("Master Template", "Inspection template berhasil dihapus.");
  } catch (error) {
    showToast("Master Template", error.message || "Gagal menghapus template.");
  }
});

adminElectricalRoomBody?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.dataset.action !== "delete-electrical-room-reference") {
    return;
  }
  const row = target.closest("tr");
  const identifier = String(row?.dataset.identifier || "").trim();
  if (!identifier) {
    return;
  }
  const nextItems = getElectricalRoomReferenceList().filter((item) => item !== identifier);
  try {
    await saveAdminMaster("app-settings", {
      settingKey: "electrical_room_references",
      value: { items: nextItems },
    });
    await loadMastersFromBackend();
    renderElectricalRoomReferenceOptions();
    renderAdminElectricalRoomTable();
    showToast("Master Electrical Room", "Referensi room / panel berhasil dihapus.");
  } catch (error) {
    showToast("Master Electrical Room", error.message || "Gagal menghapus referensi room / panel.");
  }
});

searchActivityLog?.addEventListener("input", applyActivityLogFilter);
filterActivityAction?.addEventListener("change", applyActivityLogFilter);
refreshActivityLogButton?.addEventListener("click", async () => {
  await refreshActivityLogs();
  showToast("Log Aktivitas", "Log aktivitas berhasil diperbarui.");
});

void initializeApplication();

equipmentReferenceInput?.addEventListener("input", () => {
  const query = equipmentReferenceInput.value;
  selectedEquipmentReference = equipmentReferenceList.includes(query) ? query : "";
  renderEquipmentReferenceResults(query);
});

equipmentReferenceInput?.addEventListener("focus", () => {
  if (equipmentReferenceInput.value.trim()) {
    renderEquipmentReferenceResults(equipmentReferenceInput.value);
  }
});

equipmentReferenceInput?.addEventListener("blur", () => {
  window.setTimeout(() => {
    hideEquipmentReferenceResults();
    const currentValue = equipmentReferenceInput.value.trim();
    if (!currentValue) {
      selectedEquipmentReference = "";
      return;
    }
    if (!equipmentReferenceList.includes(currentValue)) {
      selectedEquipmentReference = "";
      updateEquipmentReferenceStatus("Pilih equipment dari hasil referensi yang muncul di bawah field.", true);
    } else {
      selectedEquipmentReference = currentValue;
      updateEquipmentReferenceStatus(`Equipment dipilih dari referensi resmi. Total referensi aktif: ${equipmentReferenceList.length} item.`);
    }
  }, 120);
});

serviceDcsEquipmentInput?.addEventListener("input", () => {
  const query = serviceDcsEquipmentInput.value.trim();
  selectedDcsEquipmentReference = findDcsEquipmentReference(query)?.equipmentName || "";
  if (serviceDcsEquipmentDescription && selectedDcsEquipmentReference !== query) {
    serviceDcsEquipmentDescription.value = "";
  }
  renderDcsEquipmentResults(query);
});

serviceDcsEquipmentInput?.addEventListener("focus", () => {
  setDcsEquipmentInputEnabled(true);
  if (serviceDcsEquipmentInput.value.trim()) {
    renderDcsEquipmentResults(serviceDcsEquipmentInput.value);
  }
});

serviceDcsEquipmentInput?.addEventListener("click", () => {
  setDcsEquipmentInputEnabled(true);
  serviceDcsEquipmentInput.focus();
});

serviceDcsEquipmentInput?.addEventListener("blur", () => {
  window.setTimeout(() => {
    hideDcsEquipmentResults();
    const currentValue = String(serviceDcsEquipmentInput.value || "").trim();
    if (!currentValue) {
      selectedDcsEquipmentReference = "";
      if (serviceDcsEquipmentDescription) {
        serviceDcsEquipmentDescription.value = "";
      }
      return;
    }
    const matchedReference = findDcsEquipmentReference(currentValue);
    if (!matchedReference) {
      selectedDcsEquipmentReference = "";
      if (serviceDcsEquipmentDescription) {
        serviceDcsEquipmentDescription.value = "";
      }
      updateDcsEquipmentReferenceStatus("Pilih equipment DCS dari hasil referensi yang muncul di bawah field.", true);
    } else {
      setDcsEquipmentReferenceValue(matchedReference.equipmentName, matchedReference.description);
      updateDcsEquipmentReferenceStatus(`Referensi DCS aktif: ${dcsEquipmentReferenceItems.length} item.`);
    }
  }, 120);
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Node)) {
    return;
  }
  if (negatifListForm && !negatifListForm.contains(event.target)) {
    hideEquipmentReferenceResults();
  }
  if (serviceDcsForm && !serviceDcsForm.contains(event.target)) {
    hideDcsEquipmentResults();
  }
});

serviceTabs.forEach((button) => {
  button.addEventListener("click", () => {
    openServicePane(button.dataset.serviceTab);
  });
});

electricalSubtabs.forEach((button) => {
  button.addEventListener("click", () => {
    openElectricalPane(button.dataset.electricalTab);
  });
});

carbonBrushEquipmentInput?.addEventListener("input", (event) => {
  const query = event.target.value.trim();
  selectedCarbonBrushEquipmentReference = carbonBrushEquipmentReferenceList.includes(query) ? query : "";
  updateCarbonBrushEquipmentMeta(query);
  renderCarbonBrushEquipmentResults(query);
  updateCarbonBrushMeasurementColors();
});

carbonBrushEquipmentInput?.addEventListener("focus", () => {
  renderCarbonBrushEquipmentResults(carbonBrushEquipmentInput.value);
});

carbonBrushEquipmentInput?.addEventListener("blur", () => {
  window.setTimeout(() => {
    const currentValue = carbonBrushEquipmentInput.value.trim();
    if (!currentValue) {
      selectedCarbonBrushEquipmentReference = "";
      updateCarbonBrushEquipmentMeta("");
      hideCarbonBrushEquipmentResults();
      return;
    }

    if (!carbonBrushEquipmentReferenceList.includes(currentValue)) {
      selectedCarbonBrushEquipmentReference = "";
      updateCarbonBrushEquipmentStatus("Pilih equipment carbon brush dari referensi resmi.", true);
    } else {
      selectedCarbonBrushEquipmentReference = currentValue;
      updateCarbonBrushEquipmentStatus(`Equipment carbon brush dipilih dari referensi resmi. Total referensi aktif: ${carbonBrushEquipmentReferenceList.length} item.`);
    }
    hideCarbonBrushEquipmentResults();
  }, 140);
});

electricalRoomNameInput?.addEventListener("blur", () => {
  electricalRoomNameInput.value = String(electricalRoomNameInput.value || "").trim().toUpperCase();
});

serviceMccEquipmentInput?.addEventListener("blur", () => {
  serviceMccEquipmentInput.value = String(serviceMccEquipmentInput.value || "").trim().toUpperCase();
});

document.addEventListener("input", (event) => {
  if (event.target instanceof HTMLElement && event.target.matches("[data-carbon-brush-measurement]")) {
    updateCarbonBrushMeasurementColors();
  }
});

serviceDetailClose?.addEventListener("click", closeServiceDetail);

serviceDetailModal?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeDetail === "true") {
    closeServiceDetail();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && serviceDetailModal && !serviceDetailModal.classList.contains("hidden")) {
    closeServiceDetail();
  }
});

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    openSection(item.dataset.section);
    closeAllCreatePanels();
  });
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openSection(button.dataset.sectionJump);
    closeAllCreatePanels();
    if (window.matchMedia("(max-width: 900px)").matches) {
      sidebar?.classList.remove("menu-open");
    }
  });
});

createToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sectionName = button.dataset.createTarget || "";
    if (!sectionName) {
      return;
    }
    resetCreatePanelState(sectionName);
    openCreatePanel(sectionName);
  });
});

closePanelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeCreatePanel(button.dataset.closePanel || "");
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formType = form.dataset.formType;
    const formData = new FormData(form);

    try {

    if (formType === "negatif-list") {
      const selectedEquipment = String(formData.get("equipment") || "").trim();
      if (!selectedEquipment || selectedEquipment !== selectedEquipmentReference || !equipmentReferenceList.includes(selectedEquipment)) {
        setSubmitNote(form, "Equipment wajib dipilih dari referensi spreadsheet yang tersedia.");
        showToast("Negatif List", "Pilih equipment dari daftar referensi resmi.");
        return;
      }

      const item = {
        id: editingNegatifId || createId("negatif"),
        equipment: selectedEquipment,
        damageDescription: String(formData.get("damageDescription") || "-"),
        followUpPlan: String(formData.get("followUpPlan") || "-"),
        foundDate: String(formData.get("foundDate") || "-"),
        pendingMark: String(formData.get("pendingMark") || "Menunggu material"),
        workStatus: String(formData.get("workStatus") || "Open"),
        category: String(formData.get("category") || "-"),
        area: String(formData.get("area") || "-"),
      };
      const savedItem = await saveItemToBackend("negatif-list", item, Boolean(editingNegatifId));
      if (editingNegatifId) {
        const existing = negatifListBody.querySelector(`tr[data-id="${editingNegatifId}"]`);
        if (existing) {
          existing.replaceWith(renderNegatifRow(savedItem));
        }
        setSubmitNote(form, "Negatif list berhasil diperbarui.");
        showToast("Negatif List", "Data berhasil diperbarui.");
        editingNegatifId = null;
      } else {
        appendNegatifListRow(savedItem);
        setSubmitNote(form, "Negatif list baru berhasil ditambahkan ke tabel frontend.");
        showToast("Negatif List", "Item baru berhasil ditambahkan.");
      }
      persistNegatifList();
      updateDashboardStats();
      applyNegatifListFilter();
    }

    if (formType === "service-electrical-room") {
      const selectedRoomName = String(formData.get("equipmentName") || "").trim().toUpperCase();
      const roomReferences = getElectricalRoomReferenceList();
      if (!selectedRoomName || !roomReferences.includes(selectedRoomName)) {
        setSubmitNote(form, "Nama room / panel wajib dipilih dari referensi master admin.");
        showToast("Electrical Room", "Pilih nama room / panel dari referensi yang tersedia.");
        return;
      }
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const item = {
        id: editingServiceId || createId("service"),
        type: "Electrical",
        subtype: "Electrical Room",
        formType: "service-electrical-room",
        equipmentName: selectedRoomName,
        description: String(formData.get("description") || "-"),
        detail: `Pintu panel: ${String(formData.get("panelDoorCondition") || "-")} | Lantai: ${String(formData.get("floorCleanliness") || "-")} | Temperature: ${String(formData.get("roomTemperature") || "-")}`,
          payload: {
            inspectionDate: existingPayload.inspectionDate || new Date().toISOString(),
            panelDoorCondition: String(formData.get("panelDoorCondition") || "OK"),
            floorCleanliness: String(formData.get("floorCleanliness") || "Bersih"),
            roomTemperature: String(formData.get("roomTemperature") || "Dingin"),
            batteryVdc: String(formData.get("batteryVdc") || ""),
            batteryAmpere: String(formData.get("batteryAmpere") || ""),
          batteryTotalVdc: String(formData.get("batteryTotalVdc") || ""),
          battery1: String(formData.get("battery1") || ""),
          battery2: String(formData.get("battery2") || ""),
          battery3: String(formData.get("battery3") || ""),
          battery4: String(formData.get("battery4") || ""),
          battery5: String(formData.get("battery5") || ""),
          battery6: String(formData.get("battery6") || ""),
          battery7: String(formData.get("battery7") || ""),
          battery8: String(formData.get("battery8") || ""),
          battery9: String(formData.get("battery9") || ""),
          battery10: String(formData.get("battery10") || ""),
            transformerEquipment: String(formData.get("transformerEquipment") || ""),
            transformerWindingTemperature: String(formData.get("transformerWindingTemperature") || ""),
            transformerOilTemperature: String(formData.get("transformerOilTemperature") || ""),
            transformerOilLevel: String(formData.get("transformerOilLevel") || ""),
            transformerSilicaGel: String(formData.get("transformerSilicaGel") || "OK"),
            ...photoPayload,
        },
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Electrical Room berhasil diperbarui.");
        showToast("Electrical Room", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi Electrical Room berhasil ditambahkan.");
        showToast("Electrical Room", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-motor-mv") {
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const item = {
        id: editingServiceId || createId("service"),
        type: "Electrical",
          subtype: "Motor MV",
          formType: "service-motor-mv",
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
          detail: `Vibrasi DE: ${String(formData.get("vibrationDe") || "-")} | Vibrasi NDE: ${String(formData.get("vibrationNde") || "-")} | Arus: ${String(formData.get("motorCurrent") || "-")}`,
          payload: {
            inspectionDate: editingServiceId
              ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload?.inspectionDate || new Date().toISOString()
              : new Date().toISOString(),
            vibrationDe: String(formData.get("vibrationDe") || ""),
            vibrationNde: String(formData.get("vibrationNde") || ""),
            windingTemperature: String(formData.get("windingTemperature") || ""),
            bearingCondition: String(formData.get("bearingCondition") || ""),
            motorCurrent: String(formData.get("motorCurrent") || ""),
            ...photoPayload,
        },
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Motor MV berhasil diperbarui.");
        showToast("Motor MV", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi Motor MV berhasil ditambahkan.");
        showToast("Motor MV", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-motor-mv-carbon-brush") {
      const selectedEquipment = String(formData.get("equipmentName") || "").trim();
      if (!selectedEquipment || selectedEquipment !== selectedCarbonBrushEquipmentReference || !carbonBrushEquipmentReferenceList.includes(selectedEquipment)) {
        setSubmitNote(form, "Pilih equipment carbon brush dari referensi resmi terlebih dahulu.");
        showToast("Carbon Brush", "Equipment harus dipilih dari referensi resmi.");
        return;
      }

      const measurements = collectCarbonBrushMeasurements(form);
      const meta = decodeCarbonBrushEquipmentMeta(selectedEquipment);
      const stats = computeCarbonBrushStats(measurements, selectedEquipment, meta.plant);
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const item = {
        id: editingServiceId || createId("service"),
        type: "Electrical",
        subtype: "Motor MV (Carbon Brush)",
        formType: "service-motor-mv-carbon-brush",
        equipmentName: selectedEquipment,
        description: String(formData.get("description") || "-"),
        detail: `Merah: ${stats.low} | Kuning: ${stats.medium} | Hijau: ${stats.high} | Terendah: ${stats.min ?? "-"}`,
        payload: {
          inspectionDate: existingPayload.inspectionDate || new Date().toISOString(),
          plant: meta.plant,
          location: meta.location,
          category: meta.category,
          replacement: String(formData.get("replacement") || ""),
          megger: String(formData.get("megger") || ""),
          pic: String(formData.get("pic") || ""),
          measurements,
          stats: {
            low: stats.low,
            medium: stats.medium,
            high: stats.high,
            empty: stats.empty,
            min: stats.min,
            attentionPoints: stats.attentionPoints,
          },
          ...photoPayload,
        },
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));

      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Motor MV Carbon Brush berhasil diperbarui.");
        showToast("Carbon Brush", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi Motor MV Carbon Brush berhasil ditambahkan.");
        showToast("Carbon Brush", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-mcc") {
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const inspectionDateValue = String(formData.get("inspectionDate") || "").trim();
      const item = {
        id: editingServiceId || createId("service"),
        type: "Electrical",
        subtype: "MCC",
        formType: "service-mcc",
        equipmentName: String(formData.get("equipmentName") || "-").trim().toUpperCase() || "-",
        description: String(formData.get("description") || "-").trim() || "-",
        detail: buildMccDetailSummary({
          testFunction: normalizeMccStatusValue(formData.get("testFunction")),
          visualCondition: normalizeMccStatusValue(formData.get("visualCondition")),
          partCleanliness: normalizeMccStatusValue(formData.get("partCleanliness")),
        }),
        payload: {
          inspectionDate: inspectionDateValue
            ? new Date(`${inspectionDateValue}T00:00:00`).toISOString()
            : existingPayload.inspectionDate || new Date().toISOString(),
          testFunction: normalizeMccStatusValue(formData.get("testFunction")),
          visualCondition: normalizeMccStatusValue(formData.get("visualCondition")),
          partCleanliness: normalizeMccStatusValue(formData.get("partCleanliness")),
          ...photoPayload,
        },
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "MCC berhasil diperbarui.");
        showToast("MCC", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi MCC berhasil ditambahkan.");
        showToast("MCC", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-ehca") {
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const item = {
          id: editingServiceId || createId("service"),
          type: "Electrical",
          subtype: "EH/CA",
          formType: "service-ehca",
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
          detail: `Pressure: ${String(formData.get("systemPressure") || "-")} | Filter: ${String(formData.get("filterCondition") || "-")} | Leakage: ${String(formData.get("leakCondition") || "-")}`,
          payload: {
            inspectionDate: editingServiceId
              ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload?.inspectionDate || new Date().toISOString()
              : new Date().toISOString(),
            systemPressure: String(formData.get("systemPressure") || ""),
            fluidLevel: String(formData.get("fluidLevel") || ""),
            filterCondition: String(formData.get("filterCondition") || ""),
            leakCondition: String(formData.get("leakCondition") || ""),
            unitCondition: String(formData.get("unitCondition") || ""),
            ...photoPayload,
        },
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "EH/CA berhasil diperbarui.");
        showToast("EH/CA", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi EH/CA berhasil ditambahkan.");
        showToast("EH/CA", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-instrument") {
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const item = {
        id: editingServiceId || createId("service"),
        type: "Instrument",
        subtype: "Instrument",
        formType: "service-instrument",
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
          detail: `Kondisi sensor: ${String(formData.get("sensorCondition") || "-")} | Foto: ${photoPayload.findingPhotoName}`,
          payload: {
            inspectionDate: existingPayload.inspectionDate || new Date().toISOString(),
            sensorCondition: String(formData.get("sensorCondition") || ""),
            ...photoPayload,
          },
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Service instrument berhasil diperbarui.");
        showToast("Service Instrument", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Service instrument berhasil ditambahkan ke daftar service.");
        showToast("Service Instrument", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-dcs") {
        const selectedEquipment = String(formData.get("equipmentName") || "").trim();
        const matchedDcsReference = findDcsEquipmentReference(selectedEquipment);
        if (!matchedDcsReference || selectedEquipment !== selectedDcsEquipmentReference) {
          setSubmitNote(form, "Pilih equipment DCS dari referensi resmi yang muncul di bawah field.", true);
          updateDcsEquipmentReferenceStatus("Pilih equipment DCS dari referensi resmi yang muncul di bawah field.", true);
          return;
        }
        if (serviceDcsEquipmentDescription && !serviceDcsEquipmentDescription.value.trim()) {
          serviceDcsEquipmentDescription.value = matchedDcsReference.description || "";
        }
        const existingPayload = editingServiceId
          ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
          : {};
        const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
        const payload = normalizeDcsPayload({
          inspectionDate: existingPayload.inspectionDate || new Date().toISOString(),
          equipmentDescription: String(formData.get("equipmentDescription") || ""),
          plcPowerSupplyModule: String(formData.get("plcPowerSupplyModule") || ""),
          plcCommunicationModule: String(formData.get("plcCommunicationModule") || ""),
          plcProcessorModule: String(formData.get("plcProcessorModule") || ""),
          plcDigitalInputModule: String(formData.get("plcDigitalInputModule") || ""),
          plcDigitalOutputModule: String(formData.get("plcDigitalOutputModule") || ""),
          plcAnalogInputModule: String(formData.get("plcAnalogInputModule") || ""),
          plcAnalogOutputModule: String(formData.get("plcAnalogOutputModule") || ""),
          fiberOpticEthernetCommunication: String(formData.get("fiberOpticEthernetCommunication") || ""),
          groundingEeEa: String(formData.get("groundingEeEa") || ""),
          groundingEePe: String(formData.get("groundingEePe") || ""),
          groundingEaPe: String(formData.get("groundingEaPe") || ""),
          cableTermination: String(formData.get("cableTermination") || ""),
          upsOutput: String(formData.get("upsOutput") || ""),
          pdbOutput: String(formData.get("pdbOutput") || ""),
          roomAcCondition: String(formData.get("roomAcCondition") || ""),
          roomCleanliness: String(formData.get("roomCleanliness") || ""),
          damagedPartReplacement: String(formData.get("damagedPartReplacement") || ""),
          adjustmentRepair: String(formData.get("adjustmentRepair") || ""),
          ...photoPayload,
        });

        const item = {
          id: editingServiceId || createId("service"),
          type: "DCS",
          subtype: "DCS",
          formType: "service-dcs",
          equipmentName: String(formData.get("equipmentName") || "-"),
          description: String(formData.get("description") || "-"),
          detail: buildDcsSummary(payload),
          payload,
        };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Service DCS berhasil diperbarui.");
        showToast("Service DCS", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Service DCS berhasil ditambahkan ke daftar service.");
        showToast("Service DCS", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "sparepart") {
      const item = {
        id: editingSparepartId || createId("sparepart"),
        code: String(formData.get("code") || "-"),
        name: String(formData.get("name") || "-"),
        category: String(formData.get("category") || "-"),
        location: String(formData.get("location") || "-"),
        qty: String(formData.get("qty") || "0"),
        condition: String(formData.get("condition") || "Ready"),
      };
      const savedItem = await saveItemToBackend("sparepart", item, Boolean(editingSparepartId));
      if (editingSparepartId) {
        const existing = sparepartBody.querySelector(`tr[data-id="${editingSparepartId}"]`);
        if (existing) existing.replaceWith(renderSparepartRow(savedItem));
        setSubmitNote(form, "Sparepart berhasil diperbarui.");
        showToast("Sparepart", "Data berhasil diperbarui.");
        editingSparepartId = null;
        persistSparepartList();
        updateDashboardStats();
        applySparepartFilter();
      } else {
        appendSparepartRow(savedItem);
        setSubmitNote(form, "Sparepart berhasil ditambahkan.");
        showToast("Sparepart", "Item baru berhasil ditambahkan.");
      }
    }

    if (formType === "bom") {
      const item = {
        id: editingBomId || createId("bom"),
        equipment: String(formData.get("equipment") || "-").trim() || "-",
        part: String(formData.get("part") || "-").trim() || "-",
        qty: String(formData.get("qty") || "-").trim() || "-",
        itemPhoto: String(formData.get("itemPhoto") || "").trim(),
        nameplatePhoto: String(formData.get("nameplatePhoto") || "").trim(),
        extraPhoto: String(formData.get("extraPhoto") || "").trim(),
        note: String(formData.get("note") || "-").trim() || "-",
        longText: String(formData.get("longText") || "").trim(),
      };
      const savedItem = await saveItemToBackend("bom", item, Boolean(editingBomId));
      if (editingBomId) {
        const existing = bomList.querySelector(`[data-id="${editingBomId}"]`);
        if (existing) existing.replaceWith(renderBomCard(savedItem));
        setSubmitNote(form, "BOM berhasil diperbarui.");
        showToast("BOM", "Data berhasil diperbarui.");
        editingBomId = null;
        persistBomList();
        updateDashboardStats();
        applyBomFilter();
      } else {
        appendBomCard(savedItem);
        setSubmitNote(form, "BOM berhasil ditambahkan.");
        showToast("BOM", "Item baru berhasil ditambahkan.");
      }
    }

    if (formType === "bom-motor") {
      const item = {
        id: editingBomMotorId || createId("bom-motor"),
        inspectionDate: String(formData.get("inspectionDate") || "").trim(),
        equipment: String(formData.get("equipment") || "-").trim() || "-",
        manufacture: String(formData.get("manufacture") || "-").trim() || "-",
        power: String(formData.get("power") || "").trim(),
        ampere: String(formData.get("ampere") || "").trim(),
        voltage: String(formData.get("voltage") || "").trim(),
        speed: String(formData.get("speed") || "").trim(),
        frame: String(formData.get("frame") || "").trim(),
        serialNumber: String(formData.get("serialNumber") || "").trim(),
        nameplatePhoto: String(formData.get("nameplatePhoto") || "").trim(),
        connectionPhoto: String(formData.get("connectionPhoto") || "").trim(),
        motorPhoto: String(formData.get("motorPhoto") || "").trim(),
        note: String(formData.get("note") || "-").trim() || "-",
        longText: String(formData.get("longText") || "").trim(),
      };
      const savedItem = await saveItemToBackend("bom-motor", item, Boolean(editingBomMotorId));
      if (editingBomMotorId) {
        const existing = bomMotorList?.querySelector(`[data-id="${editingBomMotorId}"]`);
        if (existing) existing.replaceWith(renderBomMotorCard(savedItem));
        setSubmitNote(form, "BOM Motor berhasil diperbarui.");
        showToast("BOM Motor", "Data berhasil diperbarui.");
        editingBomMotorId = null;
        persistBomMotorList();
        updateDashboardStats();
        applyBomFilter();
      } else {
        appendBomMotorCard(savedItem);
        setSubmitNote(form, "BOM Motor berhasil ditambahkan.");
        showToast("BOM Motor", "Item baru berhasil ditambahkan.");
      }
    }

    if (formType === "spb") {
      const item = normalizeSpbItem({
        id: editingSpbId || createId("spb"),
        year: String(formData.get("year") || ""),
        quarter: String(formData.get("quarter") || ""),
        spbType: String(formData.get("spbType") || ""),
        notificationNo: String(formData.get("notificationNo") || ""),
        orderNo: String(formData.get("orderNo") || ""),
        reservationNo: String(formData.get("reservationNo") || ""),
        stockNo: String(formData.get("stockNo") || ""),
        materialDescription: String(formData.get("materialDescription") || ""),
        qty: String(formData.get("qty") || ""),
        mrp: String(formData.get("mrp") || ""),
        totalEce: String(formData.get("totalEce") || ""),
        note: String(formData.get("note") || ""),
        prNo: String(formData.get("prNo") || ""),
        poNo: String(formData.get("poNo") || ""),
        deliveryDate: String(formData.get("deliveryDate") || ""),
      });
      const savedItem = await saveItemToBackend("spb", item, Boolean(editingSpbId));
      if (editingSpbId) {
        const existing = spbBody.querySelector(`tr[data-id="${editingSpbId}"]`);
        if (existing) existing.replaceWith(renderSpbRow(savedItem));
        setSubmitNote(form, "SPB berhasil diperbarui.");
        showToast("SPB", "Data berhasil diperbarui.");
        editingSpbId = null;
        persistSpbList();
        updateDashboardStats();
        applySpbFilter();
      } else {
        appendSpbRow(savedItem);
        setSubmitNote(form, "SPB berhasil ditambahkan.");
        showToast("SPB", "Item baru berhasil ditambahkan.");
      }
    }

    const formSectionName = getSectionNameByFormType(formType);
    if (formSectionName) {
      closeCreatePanel(formSectionName);
    }

    form.reset();
    if (formType === "service-motor-mv-carbon-brush") {
      selectedCarbonBrushEquipmentReference = "";
      updateCarbonBrushEquipmentMeta("");
      updateCarbonBrushMeasurementColors();
    }
    } catch (error) {
      console.error(`Gagal menyimpan form ${formType}:`, error);
      setSubmitNote(form, `Gagal menyimpan data: ${error.message || "terjadi kesalahan"}`);
      showToast("Simpan Gagal", error.message || "Terjadi kesalahan saat menyimpan data.");
    }
  });
});

negatifListBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const row = target.closest("tr");
  if (!row) {
    return;
  }

  if (target.dataset.action === "delete-negatif") {
    try {
      await deleteItemFromBackend("negatif-list", row.dataset.id || "");
      row.remove();
      persistNegatifList();
      updateDashboardStats();
      applyNegatifListFilter();
      showToast("Negatif List", "Item berhasil dihapus.");
    } catch (error) {
      showToast("Negatif List", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "edit-negatif") {
    hydrateNegatifForm({
      id: row.dataset.id,
      equipment: row.children[0].textContent,
      damageDescription: row.children[1].textContent,
      followUpPlan: row.children[2].textContent,
      foundDate: row.children[3].textContent.trim(),
      pendingMark: row.children[4].textContent.trim(),
      workStatus: row.children[5].textContent.trim(),
      category: row.children[6].textContent.trim(),
      area: row.children[7].textContent.trim(),
    });
    openSection("negatif-list");
    openCreatePanel("negatif-list");
  }
});

sparepartBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const row = target.closest("tr");
  if (!row) return;

  if (target.dataset.action === "delete-sparepart") {
    try {
      await deleteItemFromBackend("sparepart", row.dataset.id || "");
      row.remove();
      persistSparepartList();
      updateDashboardStats();
      applySparepartFilter();
      showToast("Sparepart", "Item berhasil dihapus.");
    } catch (error) {
      showToast("Sparepart", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "edit-sparepart") {
    hydrateSparepartForm({
      id: row.dataset.id,
      code: row.children[0].textContent,
      name: row.children[1].textContent,
      category: row.children[2].textContent,
      location: row.children[3].textContent,
      qty: row.children[4].textContent,
      condition: row.children[5].textContent.trim(),
    });
    openSection("sparepart");
    openCreatePanel("sparepart");
  }
});

serviceCardList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const groupButton = target.closest('[data-action="detail-service-group"]');
  if (groupButton instanceof HTMLElement) {
    openServiceGroupDetail(groupButton.dataset.serviceGroup || "Service");
    return;
  }
  const card = target.closest(".service-list-item");
  if (!card) {
    return;
  }

  const item = await resolveServiceItem(card.dataset.id || "");
  if (!item?.id) {
    return;
  }

  if (!target.closest("[data-action]")) {
    openServiceDetail(item);
    return;
  }

  if (target.dataset.action === "delete-service") {
    try {
      await deleteItemFromBackend("service", card.dataset.id || "");
      renderServiceBoard(getServiceItemsFromDom().filter((entry) => entry.id !== card.dataset.id));
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
      showToast("Service", "Item berhasil dihapus.");
    } catch (error) {
      showToast("Service", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "send-service") {
    showToast("Service", "Menyiapkan image inspeksi untuk dikirim...");
    sendServiceToWhatsApp(item)
      .then((result) => {
        if (result === "shared") {
          showToast("WhatsApp", "Image inspeksi siap dibagikan ke WhatsApp.");
          return;
        }
        showToast("WhatsApp", "Mode lokal HTTP tidak bisa melampirkan image otomatis ke WhatsApp. Gambar diunduh, caption disiapkan, dan WhatsApp dibuka dengan teks.");
      })
      .catch(() => {
        showToast("WhatsApp", "Gagal menyiapkan image inspeksi.");
      });
  }

  if (target.dataset.action === "edit-service") {
    hydrateServiceForm(item);
    openSection("service");
    openCreatePanel("service");
  }
});

serviceCardList.addEventListener("keydown", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !(event.key === "Enter" || event.key === " ")) {
    return;
  }

  const card = target.closest(".service-list-item");
  if (!card || target.closest("[data-action]")) {
    return;
  }

  event.preventDefault();
  const item = await resolveServiceItem(card.dataset.id || "");
  if (item) {
    openServiceDetail(item);
  }
});

serviceDetailContent?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const toggleReplacementButton = target.closest('[data-action="toggle-carbon-brush-replacement-mode"]');
  if (toggleReplacementButton instanceof HTMLElement && activeServiceDetailItem?.formType === "service-motor-mv-carbon-brush") {
    carbonBrushReplacementEditMode = !carbonBrushReplacementEditMode;
    showToast("Carbon Brush", carbonBrushReplacementEditMode ? "Mode tandai titik diganti aktif." : "Mode tandai titik diganti dimatikan.");
    return;
  }
  const saveReplacementButton = target.closest('[data-action="save-carbon-brush-replacements"]');
  if (saveReplacementButton instanceof HTMLElement && activeServiceDetailItem?.formType === "service-motor-mv-carbon-brush") {
    saveCarbonBrushReplacementSelection()
      .then(() => {
        showToast("Carbon Brush", "Titik penggantian berhasil disimpan.");
      })
      .catch((error) => {
        showToast("Carbon Brush", error.message || "Gagal menyimpan titik penggantian.");
      });
    return;
  }
  const pointButton = target.closest('[data-action="open-carbon-brush-point"]');
  if (pointButton instanceof HTMLElement && activeServiceDetailItem?.formType === "service-motor-mv-carbon-brush") {
    if (carbonBrushReplacementEditMode) {
      const pointKey = pointButton.dataset.pointKey || "";
      if (!pointKey) {
        return;
      }
      if (carbonBrushReplacementDraft.includes(pointKey)) {
        carbonBrushReplacementDraft = carbonBrushReplacementDraft.filter((item) => item !== pointKey);
        pointButton.classList.remove("is-replaced");
      } else {
        carbonBrushReplacementDraft = [...carbonBrushReplacementDraft, pointKey];
        pointButton.classList.add("is-replaced");
      }
      return;
    }
    const slot = serviceDetailContent.querySelector("#carbon-brush-point-trend-slot");
    if (slot) {
      slot.innerHTML = buildCarbonBrushTrendHtml(activeServiceDetailItem, pointButton.dataset.pointKey || "");
      slot.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }
  const button = target.closest('[data-action="open-service-item-detail"]');
  if (!(button instanceof HTMLElement)) {
    return;
  }
  const item = getServiceItemsFromDom().find((entry) => entry.id === button.dataset.id);
  if (item) {
    openServiceDetail(item);
  }
});

bomList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const card = target.closest(".bom-card");
  if (!card) return;

  if (!target.closest("[data-action]")) {
    const item = getBomItemById(card.dataset.id || "");
    if (item) {
      openBomDetail(item);
    }
    return;
  }

  if (target.dataset.action === "delete-bom") {
    try {
      await deleteItemFromBackend("bom", card.dataset.id || "");
      card.remove();
      persistBomList();
      updateDashboardStats();
      applyBomFilter();
      showToast("BOM", "Item berhasil dihapus.");
    } catch (error) {
      showToast("BOM", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "edit-bom") {
    hydrateBomForm({
      id: card.dataset.id,
      equipment: card.querySelector(".bom-copy strong")?.textContent || "",
      part: card.querySelector(".bom-copy p")?.textContent || "",
      qty: card.querySelector(".bom-copy small")?.dataset.value || "",
      note: card.querySelector(".bom-copy span")?.textContent || "",
      longText: card.querySelector(".bom-long-text")?.textContent || "",
      itemPhoto: card.querySelector('[data-bom-photo="item"]')?.dataset.filename || "",
      nameplatePhoto: card.querySelector('[data-bom-photo="nameplate"]')?.dataset.filename || "",
      extraPhoto: card.querySelector('[data-bom-photo="extra"]')?.dataset.filename || "",
    });
    openSection("bom");
    openCreatePanel("bom");
  }
});

bomList.addEventListener("keydown", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !(event.key === "Enter" || event.key === " ")) {
    return;
  }
  const card = target.closest(".bom-card");
  if (!card || target.closest("[data-action]")) {
    return;
  }
  event.preventDefault();
  const item = getBomItemById(card.dataset.id || "");
  if (item) {
    openBomDetail(item);
  }
});

bomMotorList?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const card = target.closest(".bom-motor-card");
  if (!card) return;

  if (!target.closest("[data-action]")) {
    const item = getBomMotorItemsFromDom().find((entry) => entry.id === (card.dataset.id || ""));
    if (item) {
      openBomMotorDetail(item);
    }
    return;
  }

  if (target.dataset.action === "delete-bom-motor") {
    try {
      await deleteItemFromBackend("bom-motor", card.dataset.id || "");
      card.remove();
      persistBomMotorList();
      updateDashboardStats();
      applyBomFilter();
      showToast("BOM Motor", "Item berhasil dihapus.");
    } catch (error) {
      showToast("BOM Motor", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "edit-bom-motor") {
    hydrateBomMotorForm({
      id: card.dataset.id,
      inspectionDate: card.dataset.inspectionDate || "",
      equipment: card.dataset.equipment || "",
      manufacture: card.dataset.manufacture || "",
      power: card.dataset.power || "",
      ampere: card.dataset.ampere || "",
      voltage: card.dataset.voltage || "",
      speed: card.dataset.speed || "",
      frame: card.dataset.frame || "",
      serialNumber: card.dataset.serialNumber || "",
      note: card.dataset.note || "",
      longText: card.dataset.longText || "",
      nameplatePhoto: card.querySelector('[data-bom-motor-photo="nameplate"]')?.dataset.filename || "",
      connectionPhoto: card.querySelector('[data-bom-motor-photo="connection"]')?.dataset.filename || "",
      motorPhoto: card.querySelector('[data-bom-motor-photo="motor"]')?.dataset.filename || "",
    });
    openSection("bom");
    openBomPane("motor");
    openCreatePanel("bom");
  }
});

bomMotorList?.addEventListener("keydown", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !(event.key === "Enter" || event.key === " ")) {
    return;
  }
  const card = target.closest(".bom-motor-card");
  if (!card || target.closest("[data-action]")) {
    return;
  }
  event.preventDefault();
  const item = getBomMotorItemsFromDom().find((entry) => entry.id === (card.dataset.id || ""));
  if (item) {
    openBomMotorDetail(item);
  }
});

spbBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const row = target.closest("tr");
  if (!row) return;

  if (target.dataset.action === "delete-spb") {
    try {
      await deleteItemFromBackend("spb", row.dataset.id || "");
      row.remove();
      persistSpbList();
      updateDashboardStats();
      applySpbFilter();
      showToast("SPB", "Item berhasil dihapus.");
    } catch (error) {
      showToast("SPB", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "edit-spb") {
    hydrateSpbForm({
      id: row.dataset.id,
      year: row.children[0].textContent.trim(),
      quarter: row.children[1].textContent.trim(),
      spbType: row.children[2].textContent.trim(),
      notificationNo: row.children[3].textContent.trim(),
      orderNo: row.children[4].textContent.trim(),
      reservationNo: row.children[5].textContent.trim(),
      stockNo: row.children[6].textContent.trim(),
      materialDescription: row.children[7].textContent.trim(),
      qty: row.children[8].textContent.trim(),
      mrp: row.children[9].textContent.trim(),
      totalEce: row.children[10].textContent.trim(),
      note: row.children[11].textContent.trim(),
      prNo: row.children[12].textContent.trim(),
      poNo: row.children[13].textContent.trim(),
      deliveryDate: row.children[14].textContent.trim(),
    });
    openSection("spb");
    openCreatePanel("spb");
  }
});

searchNegatifList?.addEventListener("input", applyNegatifListFilter);
filterNegatifPriority?.addEventListener("change", applyNegatifListFilter);
filterNegatifCause?.addEventListener("change", applyNegatifListFilter);
filterNegatifCategory?.addEventListener("change", applyNegatifListFilter);
filterNegatifDateFrom?.addEventListener("change", applyNegatifListFilter);
filterNegatifDateTo?.addEventListener("change", applyNegatifListFilter);
searchSparepart?.addEventListener("input", applySparepartFilter);
filterSparepartCondition?.addEventListener("change", applySparepartFilter);
searchService?.addEventListener("input", applyServiceFilter);
filterServiceType?.addEventListener("change", applyServiceFilter);
searchBom?.addEventListener("input", applyBomFilter);
filterBomArea?.addEventListener("change", applyBomFilter);
bomTabs.forEach((button) => {
  button.addEventListener("click", () => {
    openBomPane(button.dataset.bomTab || "general");
    applyBomFilter();
  });
});
searchSpb?.addEventListener("input", applySpbFilter);
filterSpbStatus?.addEventListener("change", applySpbFilter);

exportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const exportType = button.dataset.export;

    if (exportType === "negatif-list") {
      const items = getNegatifItemsFromDom();
      downloadCsv(
        "negatif-list.csv",
        ["Equipment", "Deskripsi Kerusakan", "Rencana Tindak Lanjut", "Tanggal Temuan", "Mark", "Status", "Kategori", "Area"],
        items.map((item) => [
          item.equipment,
          item.damageDescription,
          item.followUpPlan,
          item.foundDate,
          item.pendingMark,
          item.workStatus,
          item.category,
          item.area,
        ]),
      );
      showToast("Export", "Negatif List berhasil diexport ke CSV.");
    }

    if (exportType === "sparepart") {
      const items = getSparepartItemsFromDom();
      downloadCsv("sparepart.csv", ["Kode", "Nama", "Kategori", "Lokasi", "Qty", "Kondisi"], items.map((item) => [item.code, item.name, item.category, item.location, item.qty, item.condition]));
      showToast("Export", "Sparepart berhasil diexport ke CSV.");
    }

      if (exportType === "service") {
        const items = getServiceItemsFromDom();
        downloadCsv("service.csv", ["Tipe", "Sub Menu", "Equipment", "Deskripsi", "Detail"], items.map((item) => [item.type, item.subtype, item.equipmentName, item.description, item.detail]));
        showToast("Export", "Service berhasil diexport ke CSV.");
      }

    if (exportType === "bom") {
      if (activeBomPane === "motor") {
        const items = getBomMotorItemsFromDom();
        downloadCsv(
          "bom-motor.csv",
          ["Tanggal", "Equipment", "Manufacture", "Power", "Ampere", "Voltage", "Speed", "Frame", "Serial Nr.", "Keterangan", "Long Text", "Foto Nameplate", "Foto Koneksi", "Foto Motor"],
          items.map((item) => [item.inspectionDate, item.equipment, item.manufacture, item.power, item.ampere, item.voltage, item.speed, item.frame, item.serialNumber, item.note, item.longText, item.nameplatePhoto, item.connectionPhoto, item.motorPhoto]),
        );
        showToast("Export", "BOM Motor berhasil diexport ke CSV.");
      } else {
        const items = getBomItemsFromDom();
        downloadCsv(
          "bom.csv",
          ["Equipment", "Part", "Jumlah", "Keterangan", "Long Text", "Foto Barang", "Foto Nameplate", "Foto Lain"],
          items.map((item) => [item.equipment, item.part, item.qty, item.note, item.longText, item.itemPhoto, item.nameplatePhoto, item.extraPhoto]),
        );
        showToast("Export", "BOM berhasil diexport ke CSV.");
      }
    }

    if (exportType === "spb") {
      const items = getSpbItemsFromDom();
      downloadCsv("spb.csv", ["ID", "TAHUN", "QUARTER", "TYPE", "NOTIF", "ORDER", "RESERVASI", "NO STOCK", "DESKRIPSI MATERIAL", "QTY", "MRP", "TOTAL ECE", "KETERANGAN", "PR", "PO", "DELIV DATE"], items.map((item) => [item.id, item.year, item.quarter, item.spbType, item.notificationNo, item.orderNo, item.reservationNo, item.stockNo, item.materialDescription, item.qty, item.mrp, item.totalEce, item.note, item.prNo, item.poNo, item.deliveryDate]));
      showToast("Export", "SPB berhasil diexport ke CSV.");
    }
  });
});

if (printButton) {
  printButton.addEventListener("click", () => {
    showToast("Cetak Laporan", "Membuka mode cetak browser untuk laporan PLIRM34.");
    window.print();
  });
}

if (refreshButton) {
  refreshButton.addEventListener("click", async () => {
    try {
      if (backendState.available && backendState.sessionActive) {
        const activeSection = [...sections].find((section) => section.classList.contains("visible"))?.dataset.panel || "dashboard";
        await hydrateFromBackendAfterLogin();
        openSection(activeSection);
      } else {
        loadStoredData();
      }
      resetIdleLogoutTimer();
      showToast("Refresh Tampilan", "Data berhasil disegarkan tanpa logout.");
    } catch (error) {
      showToast("Refresh Tampilan", error.message || "Gagal menyegarkan data.");
    }
  });
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    sidebar?.classList.toggle("menu-open");
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await performLogout();
  });
}
