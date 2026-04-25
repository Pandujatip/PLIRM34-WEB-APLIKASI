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
const instrumentSubtabs = document.querySelectorAll(".instrument-subtab");
const instrumentPanes = document.querySelectorAll(".instrument-pane");
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
const carbonBrushTypeHelp = document.getElementById("carbon-brush-type-help");
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
const cemsEquipmentReferenceListElement = document.getElementById("cems-equipment-reference-list");
const cemsReferenceHint = document.getElementById("cems-reference-hint");
const opacityEquipmentReferenceListElement = document.getElementById("opacity-equipment-reference-list");
const opacityReferenceHint = document.getElementById("opacity-reference-hint");
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
const adminMsoMotorDirectory = document.getElementById("admin-mso-motor-directory");
const adminMsoMotorPattern = document.getElementById("admin-mso-motor-pattern");
const adminMsoMotorUploadInput = document.getElementById("admin-mso-motor-upload-input");
const adminMsoMotorSaveButton = document.getElementById("admin-mso-motor-save-button");
const adminMsoMotorUploadButton = document.getElementById("admin-mso-motor-upload-button");
const adminMsoMotorUploadImportButton = document.getElementById("admin-mso-motor-upload-import-button");
const adminMsoMotorImportButton = document.getElementById("admin-mso-motor-import-button");
const adminMsoMotorResetButton = document.getElementById("admin-mso-motor-reset-button");
const adminMsoMotorStartDate = document.getElementById("admin-mso-motor-start-date");
const adminMsoMotorCopyScriptButton = document.getElementById("admin-mso-motor-copy-script-button");
const adminMsoMotorCopyScrapeOnlyButton = document.getElementById("admin-mso-motor-copy-scrape-only-button");
const adminMsoMotorJsonInput = document.getElementById("admin-mso-motor-json-input");
const adminMsoMotorImportJsonButton = document.getElementById("admin-mso-motor-import-json-button");
const adminMsoMotorProgress = document.getElementById("admin-mso-motor-progress");
const adminMsoMotorProgressTitle = document.getElementById("admin-mso-motor-progress-title");
const adminMsoMotorProgressBadge = document.getElementById("admin-mso-motor-progress-badge");
const adminMsoMotorProgressDetail = document.getElementById("admin-mso-motor-progress-detail");
const adminMsoMotorStatus = document.getElementById("admin-mso-motor-status");
const adminRestoreInput = document.getElementById("admin-restore-input");
const adminRestoreButton = document.getElementById("admin-restore-button");
const adminAreaForm = document.getElementById("admin-area-form");
const adminCarbonBrushThresholdForm = document.getElementById("admin-carbon-brush-threshold-form");
const adminCarbonBrushThresholdHint = document.getElementById("admin-carbon-brush-threshold-hint");
const adminElectricalRoomThresholdForm = document.getElementById("admin-electrical-room-threshold-form");
const adminElectricalRoomThresholdHint = document.getElementById("admin-electrical-room-threshold-hint");
const adminElectricalRoomForm = document.getElementById("admin-electrical-room-form");
const adminEquipmentForm = document.getElementById("admin-equipment-form");
const adminEquipmentCancelEditButton = document.getElementById("admin-equipment-cancel-edit");
const searchAdminEquipment = document.getElementById("search-admin-equipment");
const filterAdminEquipmentSource = document.getElementById("filter-admin-equipment-source");
const resetAdminEquipmentFilterButton = document.getElementById("reset-admin-equipment-filter");
const adminEquipmentFilterSummary = document.getElementById("admin-equipment-filter-summary");
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
const isMsoBridgeMode = new URLSearchParams(window.location.search).get("mso_bridge") === "1";
const dashboardServicePreview = document.getElementById("dashboard-service-preview");
const dashboardMsoWatchlistPreview = document.getElementById("dashboard-mso-watchlist-preview");
const dashboardInspectionToday = document.getElementById("dashboard-inspection-today");
const dashboardInspectionTomorrow = document.getElementById("dashboard-inspection-tomorrow");
const dashboardInspectionHistory = document.getElementById("dashboard-inspection-history");
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
const dashboardSlideshow = document.getElementById("dashboard-slideshow");
const dashboardSlideshowImage = document.getElementById("dashboard-slideshow-image");
const dashboardSlideshowTitle = document.getElementById("dashboard-slideshow-title");
const dashboardSlideshowDots = document.getElementById("dashboard-slideshow-dots");
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
const DASHBOARD_SLIDESHOW_FILENAMES = [
  "WhatsApp Image 2026-04-20 at 13.37.17.jpeg",
  "WhatsApp Image 2026-04-20 at 13.37.18 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.37.18.jpeg",
  "WhatsApp Image 2026-04-20 at 13.37.19.jpeg",
  "WhatsApp Image 2026-04-20 at 13.37.21.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.15 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.15.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.16 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.16 (2).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.16.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.17 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.17 (2).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.17.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.18 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.18 (2).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.18.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.19 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.19.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.20 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.20 (2).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.20 (3).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.20.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.21.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.22.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.23.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.24 (1).jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.24.jpeg",
  "WhatsApp Image 2026-04-20 at 13.38.25.jpeg",
];
const carbonBrushMeasurementRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const carbonBrushMeasurementColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const carbonBrushMeasurementKeys = carbonBrushMeasurementRows.flatMap((row) => carbonBrushMeasurementColumns.map((column) => `${row}${column}`));
const carbonBrushTypeReferences = [
  {
    sapNo: "SI00028389",
    name: "RC53 50X32X25",
    use: "344RM01M01 - ABB",
  },
  {
    sapNo: "SI00028389",
    name: "RC53 50X32X25",
    use: "344FN03M01 - ABB",
  },
  {
    sapNo: "SI00005550",
    name: "RC73/MR7 50X32X25",
    use: "343RM1M01 - SIEMENS",
  },
  {
    sapNo: "SI00005550",
    name: "RC73/MR7 50X32X25",
    use: "343FN4M01 - SIEMENS",
  },
  {
    sapNo: "SI00005550",
    name: "RC73/MR7 50X32X25",
    use: "343FN5M01 - SIEMENS",
  },
  {
    sapNo: "SI00028394",
    name: "RC67 50X32X25",
    use: "344RM01M01",
  },
  {
    sapNo: "SI00005549",
    name: "RC73 50X32X20",
    use: "343RM1M01 - ABB",
  },
];
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
let activeServiceGroupDetailType = "";
let activeServiceDetailItem = null;
let carbonBrushReplacementEditMode = false;
let carbonBrushReplacementDraft = [];
let activeBomPane = "general";
let dashboardInspectionSchedule = {
  calendarName: "PMS PLIRM34",
  timezone: "Asia/Jakarta",
  today: [],
  tomorrow: [],
  history: [],
};
let dashboardSlideshowIndex = 0;
let dashboardSlideshowTimer = null;
let idleLogoutTimer = null;

const roleLabels = {
  admin: "Admin",
  organik: "Organik",
  team: "Team",
};

const roleAccessSummary = {
  admin: "Akses penuh seluruh modul",
  organik: "Lihat semua menu kecuali log dan manajemen user, input/edit negatif list dan service",
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
  organik: ["negatif-list", "service"],
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

function getMasterEquipmentReferences(sourceGroups = []) {
  const groups = Array.isArray(sourceGroups) ? sourceGroups : [sourceGroups];
  const normalizedGroups = groups.map((item) => String(item || "").trim()).filter(Boolean);
  const references = Array.isArray(backendState.masters.equipmentReferences)
    ? backendState.masters.equipmentReferences
    : [];
  return references.filter((item) => {
    if (!normalizedGroups.length) {
      return true;
    }
    return normalizedGroups.includes(String(item.sourceGroup || "").trim());
  });
}

function getMasterEquipmentNames(sourceGroups = []) {
  return [...new Set(
    getMasterEquipmentReferences(sourceGroups)
      .map((item) => String(item.equipmentName || "").trim())
      .filter(Boolean),
  )].sort((left, right) => left.localeCompare(right, "id"));
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
  const masterItems = getMasterEquipmentNames("electrical-room");
  if (masterItems.length) {
    return masterItems;
  }
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
  const masterItems = getMasterEquipmentNames("service-mcc");
  if (masterItems.length) {
    return masterItems;
  }
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

function getCemsEquipmentReferenceList() {
  return getMasterEquipmentNames("cems-service");
}

function renderCemsReferenceOptions() {
  if (!cemsEquipmentReferenceListElement) {
    return;
  }
  const items = getCemsEquipmentReferenceList();
  cemsEquipmentReferenceListElement.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    cemsEquipmentReferenceListElement.append(option);
  });
  if (cemsReferenceHint) {
    cemsReferenceHint.textContent = items.length
      ? `Referensi CEMS aktif: ${items.length} equipment dari Master Equipment.`
      : "Belum ada referensi CEMS. Tambahkan dari Master Equipment dengan source group cems-service.";
  }
}

function getOpacityEquipmentReferenceList() {
  return getMasterEquipmentNames("opacity-service");
}

function renderOpacityReferenceOptions() {
  if (!opacityEquipmentReferenceListElement) {
    return;
  }
  const items = getOpacityEquipmentReferenceList();
  opacityEquipmentReferenceListElement.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    opacityEquipmentReferenceListElement.append(option);
  });
  if (opacityReferenceHint) {
    opacityReferenceHint.textContent = items.length
      ? `Referensi Opacity aktif: ${items.length} equipment dari Master Equipment.`
      : "Belum ada referensi Opacity Meter. Tambahkan dari Master Equipment dengan source group opacity-service.";
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

function normalizeCarbonBrushEquipmentForType(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, "");
}

function getCarbonBrushEquipmentMatchKeys(value) {
  const normalized = normalizeCarbonBrushEquipmentForType(value);
  if (!normalized) {
    return [];
  }
  const keys = new Set([normalized]);
  const equipmentCode = normalized.match(/\d{3}[A-Z]+\d+(?:M\d+)?/)?.[0] || "";
  if (equipmentCode) {
    keys.add(equipmentCode);
    const baseCode = equipmentCode.match(/\d{3}[A-Z]+\d+/)?.[0] || "";
    if (baseCode) {
      keys.add(baseCode);
    }
  }
  return [...keys].filter(Boolean);
}

function getCarbonBrushTypeMatches(equipmentName) {
  const equipmentKeys = getCarbonBrushEquipmentMatchKeys(equipmentName);
  if (!equipmentKeys.length) {
    return [];
  }

  return carbonBrushTypeReferences.filter((reference) => {
    const normalizedUseItems = String(reference.use || "")
      .split(/,|\bdan\b/i)
      .flatMap((item) => getCarbonBrushEquipmentMatchKeys(item.split("-")[0]))
      .filter(Boolean);
    return normalizedUseItems.some((item) => equipmentKeys.some((key) => item === key || key.startsWith(item) || item.startsWith(key)));
  });
}

function renderCarbonBrushTypeSummary(equipmentName) {
  const matches = getCarbonBrushTypeMatches(equipmentName);
  if (!equipmentName) {
    return '<span class="summary-pill">Type CB: pilih equipment</span>';
  }
  if (!matches.length) {
    return '<span class="summary-pill warning">Type CB: belum ada referensi</span>';
  }

  return matches.map((item) => `
    <span class="summary-pill cb-type">Type CB: ${escapeHtml(item.name)} | ${escapeHtml(item.sapNo)} | ${escapeHtml(item.use)}</span>
  `).join("");
}

function updateCarbonBrushTypeHelp(equipmentName) {
  const typeHelpElement = carbonBrushTypeHelp || document.getElementById("carbon-brush-type-help");
  if (!typeHelpElement) {
    return;
  }
  const matches = getCarbonBrushTypeMatches(equipmentName);
  if (!equipmentName) {
    typeHelpElement.className = "carbon-brush-type-help";
    typeHelpElement.textContent = "Pilih equipment untuk menampilkan jenis/type carbon brush.";
    return;
  }
  if (!matches.length) {
    typeHelpElement.className = "carbon-brush-type-help is-warning";
    typeHelpElement.textContent = `Belum ada referensi type carbon brush untuk ${equipmentName}.`;
    return;
  }
  typeHelpElement.className = "carbon-brush-type-help is-active";
  typeHelpElement.innerHTML = `
    <strong>Type Carbon Brush untuk ${escapeHtml(equipmentName)}</strong>
    ${matches.map((item) => `
      <span>${escapeHtml(item.name)} | ${escapeHtml(item.sapNo)} | ${escapeHtml(item.use)}</span>
    `).join("")}
  `;
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
    ${renderCarbonBrushTypeSummary(equipmentName)}
  `;
  updateCarbonBrushTypeHelp(equipmentName);
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
      const result = await apiRequest("/masters?source_group=negatif-list");
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

    throw new Error("Backend master equipment belum aktif");
  } catch (error) {
    equipmentReferenceList = [];
    equipmentReferenceInput.disabled = true;
    equipmentReferenceInput.value = "";
    selectedEquipmentReference = "";
    hideEquipmentReferenceResults();
    updateEquipmentReferenceStatus("Gagal memuat referensi equipment dari Master Equipment. Tambahkan source group negatif-list di menu admin.", true);
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
      const result = await apiRequest("/masters?source_group=carbon-brush");
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

    throw new Error("Backend master equipment belum aktif");
  } catch {
    carbonBrushEquipmentReferenceList = [];
    carbonBrushEquipmentInput.disabled = true;
    carbonBrushEquipmentInput.value = "";
    selectedCarbonBrushEquipmentReference = "";
    hideCarbonBrushEquipmentResults();
    updateCarbonBrushEquipmentStatus("Gagal memuat referensi carbon brush dari Master Equipment. Tambahkan source group carbon-brush di menu admin.", true);
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
        throw new Error("Referensi DCS kosong di Master Equipment");
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
      updateDcsEquipmentReferenceStatus("Gagal memuat referensi DCS dari Master Equipment. Tambahkan source group dcs-service di menu admin.", true);
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
    history: [],
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
    if (serviceElectricalCarbonBrushForm?.inspectionDate) {
      serviceElectricalCarbonBrushForm.inspectionDate.value = new Date().toISOString().slice(0, 10);
    }
    updateCarbonBrushEquipmentMeta("");
    updateCarbonBrushMeasurementColors();
    openServicePane("electrical");
    openElectricalPane("electrical-room");
    openInstrumentPane("instrument-basic");
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

function openInstrumentPane(tabName) {
  instrumentSubtabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.instrumentTab === tabName);
  });
  instrumentPanes.forEach((pane) => {
    pane.classList.toggle("visible", pane.dataset.instrumentPane === tabName);
  });
}

function normalizeServiceItem(item) {
  const payload = item?.payload && typeof item.payload === "object" ? item.payload : {};
  const isMsoMotorItem = String(payload.source || "").toUpperCase() === "MSO";
  if (item.formType === "service-motor-mv" && isMsoMotorItem) {
    return {
      ...item,
      subtype: "Motor MSO",
      formType: "service-motor-mso",
      payload,
    };
  }
  if (item.formType === "service-motor-mso") {
    return {
      ...item,
      subtype: "Motor MSO",
      payload,
    };
  }
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

function buildCarbonBrushPayloadDetailHtml(item) {
  const payload = item.payload || {};
  const meta = decodeCarbonBrushEquipmentMeta(item.equipmentName || "", payload.plant || "");
  const stats = payload.stats || computeCarbonBrushStats(payload.measurements || {}, item.equipmentName || "", payload.plant || "");
  const replacedPoints = normalizeCarbonBrushReplacedPoints(payload.replacedPoints);
  const photoSummary = buildFindingPhotoCompatibility(getInspectionPhotoEntries(payload)).findingPhotoName;
  const meggerValue = String(payload.megger || "-").trim() || "-";
  const rows = [
    ["Plant", escapeHtml(payload.plant || meta.plant || "-")],
    ["Lokasi", escapeHtml(payload.location || meta.location || "-")],
    ["Kategori", escapeHtml(payload.category || meta.category || "-")],
    ["PIC", escapeHtml(payload.pic || "-")],
    ["Merah", escapeHtml(`${stats.low || 0} titik`)],
    ["Kuning", escapeHtml(`${stats.medium || 0} titik`)],
    ["Hijau", escapeHtml(`${stats.high || 0} titik`)],
    ["Terendah", escapeHtml(stats.min ?? "-")],
    ["Replacement", escapeHtml(payload.replacement || "-")],
    ["Megger", `<button class="detail-item-action" type="button" data-action="open-carbon-brush-megger-trend">${escapeHtml(meggerValue)} <span>Lihat chart</span></button>`],
    ["Titik diganti", escapeHtml(replacedPoints.length ? replacedPoints.join(", ") : "-")],
    ["Titik perhatian", escapeHtml(stats.attentionPoints?.length ? stats.attentionPoints.join(", ") : "-")],
    ["Foto temuan", escapeHtml(photoSummary)],
  ];

  return rows.map(([label, value]) => `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
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

function shouldHideInspectionDetailValue(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "0" || normalized === "0.0" || normalized === "0.00";
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

  if (item.formType === "service-motor-mv" || item.formType === "service-motor-mso") {
    const notes = [];
    if ((payload.source || "").toUpperCase() === "MSO") {
      const temperatureDs = parseCarbonBrushNumericValue(payload.temperaturDs);
      const temperatureNds = parseCarbonBrushNumericValue(payload.temperaturNds);
      if ((payload.condition || "").toUpperCase() === "BAD") {
        notes.push("MSO menandai kondisi motor sebagai BAD. Prioritaskan review hasil inspeksi dan tindak lanjut lapangan.");
      }
      if (temperatureDs !== null && temperatureDs >= 60) {
        notes.push(`Temperature DS ${temperatureDs} C sudah tinggi. Cek beban, pendinginan, dan kondisi bearing sisi drive.`);
      }
      if (temperatureNds !== null && temperatureNds >= 60) {
        notes.push(`Temperature NDS ${temperatureNds} C sudah tinggi. Periksa ventilasi motor dan kondisi sisi non-drive.`);
      }
      return notes.length ? notes : ["Data motor dari MSO masih menunjukkan kondisi umum aman berdasarkan hasil inspeksi terbaru."];
    }
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

  if (item.formType === "service-cems") {
    const notes = [];
    const parameterAlerts = [
      ["O₂", payload.o2Status, payload.o2Value, payload.o2Unit],
      ["CO", payload.coStatus, payload.coValue, payload.coUnit],
      ["NOx", payload.noxStatus, payload.noxValue, payload.noxUnit],
      ["SO₂", payload.so2Status, payload.so2Value, payload.so2Unit],
      ["Dust / PM", payload.dustStatus, payload.dustValue, payload.dustUnit],
      ["Flow", payload.flowStatus, payload.flowValue, payload.flowUnit],
      ["Temperature", payload.temperatureStatus, payload.temperatureValue, payload.temperatureUnit],
      ["Pressure", payload.pressureStatus, payload.pressureValue, payload.pressureUnit],
    ].filter(([, status]) => normalizeCemsStatusValue(status) === "NG");

    if (parameterAlerts.length) {
      notes.push(`Parameter CEMS yang berstatus NG: ${parameterAlerts.map(([label, , value, unit]) => `${label} (${value || "-"} ${unit || ""})`.trim()).join(", ")}.`);
    }

    const checklistAlerts = [
      ["Analyzer Power ON", payload.analyzerPower],
      ["Status Analyzer Normal", payload.analyzerStatus],
      ["Alarm Aktif", payload.analyzerAlarm],
      ["Response Time Normal", payload.analyzerResponseTime],
      ["Span Drift", payload.analyzerSpanDrift],
      ["Zero Drift", payload.analyzerZeroDrift],
      ["Probe Bersih", payload.samplingProbe],
      ["Filter Tidak Tersumbat", payload.samplingFilter],
      ["Heated Line Berfungsi", payload.samplingHeatedLine],
      ["Sample Pump Normal", payload.samplingPump],
      ["Flow Sample Stabil", payload.samplingFlow],
      ["Tabung Gas Tersedia", payload.calibrationCylinder],
      ["Tekanan Gas Cukup", payload.calibrationPressure],
      ["Regulator Normal", payload.calibrationRegulator],
      ["Auto Calibration Jalan", payload.calibrationAuto],
      ["Jadwal Kalibrasi Sesuai", payload.calibrationSchedule],
      ["Data ke DAS / SCADA", payload.dataDasScada],
      ["Data Logger Normal", payload.dataLogger],
      ["Tidak Ada Data Loss", payload.dataLoss],
      ["Sinkronisasi Waktu", payload.timeSync],
      ["Power Supply Stabil", payload.supportPowerSupply],
      ["UPS Normal", payload.supportUps],
      ["AC Panel Berfungsi", payload.supportAcPanel],
      ["Shelter Bersih", payload.supportShelter],
    ].filter(([, status]) => normalizeCemsStatusValue(status) === "NG");

    if (checklistAlerts.length) {
      notes.push(`Checklist sistem yang perlu tindakan: ${checklistAlerts.map(([label]) => label).join(", ")}.`);
    }

    if (String(payload.findingIssue || "").trim()) {
      notes.push(`Temuan utama: ${payload.findingIssue}.`);
    }
    if (String(payload.possibleCause || "").trim()) {
      notes.push(`Kemungkinan penyebab: ${payload.possibleCause}.`);
    }
    if (String(payload.emissionImpact || "").trim()) {
      notes.push(`Dampak ke emisi/compliance: ${payload.emissionImpact}.`);
    }
    if ((payload.urgencyLevel || "") === "High") {
      notes.push("Level urgensi tinggi. Perlu tindak lanjut prioritas karena berpotensi mengganggu validitas monitoring emisi atau compliance.");
    } else if ((payload.urgencyLevel || "") === "Medium") {
      notes.push("Level urgensi menengah. Jadwalkan tindak lanjut teknis pada window terdekat agar deviasi tidak berkembang.");
    }

    return notes.length ? notes : ["Kondisi umum CEMS masih baik berdasarkan parameter, checklist sistem, dan catatan inspeksi terakhir."];
  }

  if (item.formType === "service-opacity-meter") {
    const notes = [];
    const parameterAlerts = [
      ["Opacity", payload.opacityStatus, payload.opacityValue, payload.opacityUnit],
      ["Transmittance", payload.transmittanceStatus, payload.transmittanceValue, payload.transmittanceUnit],
      ["Alarm Status", payload.alarmStatusCondition, payload.alarmStatusValue, payload.alarmStatusUnit],
    ].filter(([, status]) => normalizeOpacityStatusValue(status) === "NG");

    if (parameterAlerts.length) {
      notes.push(`Parameter opacity meter yang berstatus NG: ${parameterAlerts.map(([label, , value, unit]) => `${label} (${value || "-"} ${unit || ""})`.trim()).join(", ")}.`);
    }

    const checklistAlerts = [
      ["Housing Bersih", payload.visualHousingClean],
      ["Mounting Kuat", payload.visualMounting],
      ["Alignment Transmitter / Receiver", payload.visualAlignment],
      ["Tidak Ada Vibrasi Berlebih", payload.visualVibration],
      ["Tidak Ada Kondensasi", payload.visualCondensation],
      ["Lens Bersih", payload.opticLens],
      ["Reflector Bersih", payload.opticReflector],
      ["Tidak Ada Debu / Deposit", payload.opticDeposit],
      ["Sinyal Stabil", payload.opticSignal],
      ["Light Intensity Normal", payload.opticLightIntensity],
      ["Air Purge Aktif", payload.purgeActive],
      ["Tekanan Udara Cukup", payload.purgePressure],
      ["Flow Udara Stabil", payload.purgeFlow],
      ["Filter Udara Bersih", payload.purgeFilter],
      ["Power Supply Normal", payload.electricalPowerSupply],
      ["Output ke PLC / DCS", payload.electricalOutput],
      ["Kabel & Koneksi Aman", payload.electricalCable],
      ["Tidak Ada Noise Signal", payload.electricalNoise],
      ["Zero Check", payload.zeroCheckStatus],
      ["Span Check", payload.spanCheckStatus],
      ["Drift", payload.driftStatus],
    ].filter(([, status]) => normalizeOpacityStatusValue(status) === "NG");

    if (checklistAlerts.length) {
      notes.push(`Checklist opacity meter yang perlu tindakan: ${checklistAlerts.map(([label]) => label).join(", ")}.`);
    }

    if (String(payload.findingIssue || "").trim()) {
      notes.push(`Masalah ditemukan: ${payload.findingIssue}.`);
    }
    if (String(payload.possibleCause || "").trim()) {
      notes.push(`Analisa penyebab: ${payload.possibleCause}.`);
    }
    if (String(payload.readingImpact || "").trim()) {
      notes.push(`Dampak ke pembacaan opacity: ${payload.readingImpact}.`);
    }

    const recommendations = [
      payload.recommendationCleaning ? "Cleaning" : "",
      payload.recommendationRealignment ? "Re-alignment" : "",
      payload.recommendationCalibration ? "Kalibrasi" : "",
      payload.recommendationSparePart ? "Penggantian Spare Part" : "",
      payload.recommendationOther || "",
    ].filter(Boolean);
    if (recommendations.length) {
      notes.push(`Rekomendasi tindak lanjut: ${recommendations.join(", ")}.`);
    }

    return notes.length ? notes : ["Kondisi umum opacity meter masih baik berdasarkan parameter, checklist, dan catatan inspeksi terakhir."];
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

function parseMsoMotorNumeric(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = String(value).replace(",", ".").trim();
  if (!normalized) {
    return null;
  }
  const numeric = Number.parseFloat(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

const MSO_MOTOR_INSPECTION_STANDARD_DAYS = 21;

function getMsoMotorHistory(item) {
  return getServiceItemsFromDom()
    .filter((entry) =>
      entry.formType === "service-motor-mso"
      && String(entry.equipmentName || "").trim().toUpperCase() === String(item.equipmentName || "").trim().toUpperCase())
    .sort((left, right) => {
      const leftTime = new Date(left?.payload?.inspectionDate || 0).getTime() || 0;
      const rightTime = new Date(right?.payload?.inspectionDate || 0).getTime() || 0;
      return leftTime - rightTime;
    });
}

const msoMotorVibrationChannelDefinitions = [
  { key: "vibrasiDsVert", label: "DS Vert", side: "DS", axis: "Vert" },
  { key: "vibrasiDsHor", label: "DS Hor", side: "DS", axis: "Hor" },
  { key: "vibrasiDsAxial", label: "DS Axial", side: "DS", axis: "Axial" },
  { key: "vibrasiNdsVert", label: "NDS Vert", side: "NDS", axis: "Vert" },
  { key: "vibrasiNdsHor", label: "NDS Hor", side: "NDS", axis: "Hor" },
  { key: "vibrasiNdsAxial", label: "NDS Axial", side: "NDS", axis: "Axial" },
];

function classifyMsoMotorVibrationValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (value >= 4.5) {
    return "critical";
  }
  if (value >= 2.8) {
    return "watch";
  }
  return "normal";
}

function getMsoMotorVibrationChannelEntries(payload = {}, phase = "before") {
  const suffix = phase === "after" ? "After" : "Before";
  return msoMotorVibrationChannelDefinitions
    .map((channel) => {
      const value = parseMsoMotorNumeric(payload[`${channel.key}${suffix}`]);
      return {
        ...channel,
        phase,
        value,
        bucket: classifyMsoMotorVibrationValue(value),
      };
    })
    .filter((entry) => entry.value !== null);
}

function getMsoMotorVibrationValues(payload = {}, phase = "before") {
  return getMsoMotorVibrationChannelEntries(payload, phase).map((entry) => entry.value);
}

function getMsoMotorMaxVibration(payload = {}, phase = "before") {
  const values = getMsoMotorVibrationValues(payload, phase);
  return values.length ? Math.max(...values) : null;
}

function getMsoMotorDominantVibrationChannel(payload = {}, phase = "before") {
  const entries = getMsoMotorVibrationChannelEntries(payload, phase);
  if (!entries.length) {
    return null;
  }
  return [...entries].sort((left, right) => right.value - left.value)[0];
}

function getMsoMotorVibrationDiagnostics(payload = {}) {
  const beforeEntries = getMsoMotorVibrationChannelEntries(payload, "before");
  const afterEntries = getMsoMotorVibrationChannelEntries(payload, "after");
  const dominantBefore = beforeEntries.length ? [...beforeEntries].sort((left, right) => right.value - left.value)[0] : null;
  const dominantAfter = afterEntries.length ? [...afterEntries].sort((left, right) => right.value - left.value)[0] : null;
  const beforeCriticalCount = beforeEntries.filter((entry) => entry.bucket === "critical").length;
  const beforeWatchCount = beforeEntries.filter((entry) => entry.bucket === "watch").length;
  const afterCriticalCount = afterEntries.filter((entry) => entry.bucket === "critical").length;
  const afterWatchCount = afterEntries.filter((entry) => entry.bucket === "watch").length;
  const channelComparisons = msoMotorVibrationChannelDefinitions.map((channel) => {
    const before = beforeEntries.find((entry) => entry.key === channel.key) || null;
    const after = afterEntries.find((entry) => entry.key === channel.key) || null;
    return {
      ...channel,
      beforeValue: before?.value ?? null,
      afterValue: after?.value ?? null,
      beforeBucket: before?.bucket || "",
      afterBucket: after?.bucket || "",
    };
  });
  return {
    beforeEntries,
    afterEntries,
    dominantBefore,
    dominantAfter,
    beforeCriticalCount,
    beforeWatchCount,
    afterCriticalCount,
    afterWatchCount,
    channelComparisons,
  };
}

function getMsoMotorTemperatureValues(payload = {}) {
  return [
    parseMsoMotorNumeric(payload.temperaturDs),
    parseMsoMotorNumeric(payload.temperaturNds),
  ].filter((value) => value !== null);
}

function getMsoMotorHistoryInspectionTime(entry) {
  return new Date(entry?.payload?.inspectionDate || 0).getTime() || 0;
}

function getDaysBetweenTimestamps(startTime, endTime) {
  if (!startTime || !endTime || endTime < startTime) {
    return null;
  }
  return Math.round((endTime - startTime) / (1000 * 60 * 60 * 24));
}

function isProblematicMsoMotorPayload(payload = {}) {
  const condition = String(payload.condition || "").toUpperCase();
  const maxTemperature = Math.max(...getMsoMotorTemperatureValues(payload), 0);
  const vibrationDiagnostics = getMsoMotorVibrationDiagnostics(payload);
  return condition === "BAD"
    || maxTemperature >= 60
    || vibrationDiagnostics.beforeCriticalCount > 0
    || vibrationDiagnostics.beforeWatchCount > 0;
}

function analyzeMsoMotorInspectionCadence(history) {
  const sortedHistory = [...history].sort((left, right) => getMsoMotorHistoryInspectionTime(left) - getMsoMotorHistoryInspectionTime(right));
  const intervals = [];
  let repeatedProblemWithinStandardCount = 0;
  let reappearedAfterEffectiveRegreaseCount = 0;
  for (let index = 1; index < sortedHistory.length; index += 1) {
    const previousEntry = sortedHistory[index - 1];
    const currentEntry = sortedHistory[index];
    const previousTime = getMsoMotorHistoryInspectionTime(previousEntry);
    const currentTime = getMsoMotorHistoryInspectionTime(currentEntry);
    const gapDays = getDaysBetweenTimestamps(previousTime, currentTime);
    if (gapDays === null) {
      continue;
    }
    const previousPayload = previousEntry.payload || {};
    const currentPayload = currentEntry.payload || {};
    const previousProblematic = isProblematicMsoMotorPayload(previousPayload);
    const currentProblematic = isProblematicMsoMotorPayload(currentPayload);
    const previousBefore = getMsoMotorMaxVibration(previousPayload, "before");
    const previousAfter = getMsoMotorMaxVibration(previousPayload, "after");
    const currentBefore = getMsoMotorMaxVibration(currentPayload, "before");
    const previousRecoveredByRegrease = previousBefore !== null
      && previousAfter !== null
      && previousBefore >= 2.8
      && previousAfter < 2.8;
    if (gapDays <= MSO_MOTOR_INSPECTION_STANDARD_DAYS && previousProblematic && currentProblematic) {
      repeatedProblemWithinStandardCount += 1;
    }
    if (gapDays <= MSO_MOTOR_INSPECTION_STANDARD_DAYS && previousRecoveredByRegrease && currentBefore !== null && currentBefore >= 2.8) {
      reappearedAfterEffectiveRegreaseCount += 1;
    }
    intervals.push({
      gapDays,
      previousProblematic,
      currentProblematic,
      previousRecoveredByRegrease,
    });
  }

  const latestEntry = sortedHistory.length ? sortedHistory[sortedHistory.length - 1] : null;
  const latestInspectionTime = getMsoMotorHistoryInspectionTime(latestEntry);
  const latestGapDays = intervals.length ? intervals[intervals.length - 1].gapDays : null;
  const averageGapDays = intervals.length
    ? Math.round(intervals.reduce((total, entry) => total + entry.gapDays, 0) / intervals.length)
    : null;
  const daysSinceLatestInspection = latestInspectionTime
    ? getDaysBetweenTimestamps(latestInspectionTime, Date.now())
    : null;
  const overdueDays = daysSinceLatestInspection === null
    ? 0
    : Math.max(0, daysSinceLatestInspection - MSO_MOTOR_INSPECTION_STANDARD_DAYS);

  return {
    standardDays: MSO_MOTOR_INSPECTION_STANDARD_DAYS,
    latestGapDays,
    averageGapDays,
    daysSinceLatestInspection,
    overdueDays,
    repeatedProblemWithinStandardCount,
    reappearedAfterEffectiveRegreaseCount,
    intervalCount: intervals.length,
  };
}

function analyzeMsoMotorRegreaseEffectiveness(history) {
  const inspectionPairs = history.map((entry) => {
    const payload = entry.payload || {};
    const before = getMsoMotorMaxVibration(payload, "before");
    const after = getMsoMotorMaxVibration(payload, "after");
    return {
      inspectionDate: payload.inspectionDate || "",
      label: formatInspectionDate(payload.inspectionDate),
      before,
      after,
      improved: before !== null && after !== null && after < before,
      stronglyImproved: before !== null && after !== null && before >= 2.8 && after < 2.8,
      unresolved: before !== null && after !== null && after >= before,
      highBefore: before !== null && before >= 2.8,
      lowAfter: after !== null && after < 2.8,
    };
  }).filter((entry) => entry.before !== null || entry.after !== null);

  const withCompletePair = inspectionPairs.filter((entry) => entry.before !== null && entry.after !== null);
  const improvedCount = withCompletePair.filter((entry) => entry.improved).length;
  const stronglyImprovedCount = withCompletePair.filter((entry) => entry.stronglyImproved).length;
  const unresolvedCount = withCompletePair.filter((entry) => entry.unresolved).length;
  const repeatHighBeforeLowAfterCount = withCompletePair.filter((entry) => entry.highBefore && entry.lowAfter).length;
  const consistentRecovery = withCompletePair.length >= 2 && repeatHighBeforeLowAfterCount >= Math.ceil(withCompletePair.length * 0.6);

  return {
    inspections: inspectionPairs,
    pairCount: withCompletePair.length,
    improvedCount,
    stronglyImprovedCount,
    unresolvedCount,
    repeatHighBeforeLowAfterCount,
    consistentRecovery,
  };
}

function getMsoMotorHealthSnapshot(item) {
  const history = getMsoMotorHistory(item);
  const latestEntry = history.length ? history[history.length - 1] : item;
  const payload = latestEntry?.payload || item.payload || {};
  const latestCondition = String(payload.condition || "").toUpperCase();
  const temperatureDs = parseMsoMotorNumeric(payload.temperaturDs);
  const temperatureNds = parseMsoMotorNumeric(payload.temperaturNds);
  const maxTemperature = Math.max(...getMsoMotorTemperatureValues(payload), 0);
  const vibrationDiagnostics = getMsoMotorVibrationDiagnostics(payload);
  const maxVibrationBefore = vibrationDiagnostics.dominantBefore?.value ?? null;
  const maxVibrationAfter = vibrationDiagnostics.dominantAfter?.value ?? null;
  const recentHistory = history.slice(-3);
  const recentConditions = recentHistory.map((entry) => String(entry.payload?.condition || "").toUpperCase());
  const badEntries = history.filter((entry) => String(entry.payload?.condition || "").toUpperCase() === "BAD");
  const latestBadEntry = badEntries.length ? badEntries[badEntries.length - 1] : null;
  const latestTime = getMsoMotorHistoryInspectionTime(latestEntry);
  const latestBadTime = getMsoMotorHistoryInspectionTime(latestBadEntry);
  const daysSinceLatestBad = latestBadTime && latestTime >= latestBadTime
    ? Math.round((latestTime - latestBadTime) / (1000 * 60 * 60 * 24))
    : null;
  const priorHistory = history.slice(0, -1);
  const priorMaxTemperature = priorHistory.length
    ? Math.max(...priorHistory.map((entry) => Math.max(...getMsoMotorTemperatureValues(entry.payload || {}), 0)))
    : null;
  const priorDominantVibration = priorHistory.length
    ? Math.max(...priorHistory.map((entry) => getMsoMotorMaxVibration(entry.payload || {}, "before") ?? 0))
    : null;
  const regreaseEffect = analyzeMsoMotorRegreaseEffectiveness(history);
  const cadence = analyzeMsoMotorInspectionCadence(history);
  const latestIsGood = latestCondition === "GOOD";
  const recentBadCount = recentConditions.filter((condition) => condition === "BAD").length;
  let score = 100;
  const notes = [];

  if (latestCondition === "BAD") {
    score -= 35;
    notes.push("MSO memberi status BAD pada inspeksi terbaru.");
  }
  if (maxTemperature >= 70) {
    score -= 25;
    notes.push(`Temperatur maksimum ${maxTemperature} C masuk area kritis.`);
  } else if (maxTemperature >= 60) {
    score -= 15;
    notes.push(`Temperatur maksimum ${maxTemperature} C perlu diawasi.`);
  }
  if (vibrationDiagnostics.beforeCriticalCount > 0) {
    score -= 12 + ((vibrationDiagnostics.beforeCriticalCount - 1) * 5);
    notes.push(`Ada ${vibrationDiagnostics.beforeCriticalCount} kanal vibrasi before pada zona kritis. Dominan di ${vibrationDiagnostics.dominantBefore?.label || "-"}.`);
  }
  if (vibrationDiagnostics.beforeWatchCount > 0) {
    score -= Math.min(12, vibrationDiagnostics.beforeWatchCount * 4);
    notes.push(`Ada ${vibrationDiagnostics.beforeWatchCount} kanal vibrasi before di zona watchlist.`);
  }
  if (!vibrationDiagnostics.beforeCriticalCount && !vibrationDiagnostics.beforeWatchCount && maxVibrationBefore !== null) {
    notes.push(`Kanal vibrasi tertinggi saat ini ada di ${vibrationDiagnostics.dominantBefore?.label || "-"} sebesar ${maxVibrationBefore} mm/s.`);
  }
  if (maxVibrationAfter !== null && maxVibrationBefore !== null && maxVibrationAfter >= maxVibrationBefore) {
    score -= 10;
    notes.push(`Nilai after belum membaik dari before. Kanal dominan after ada di ${vibrationDiagnostics.dominantAfter?.label || "-"} (${maxVibrationAfter} mm/s).`);
  }
  if (recentBadCount >= 2) {
    score -= 12;
    notes.push(`Dua atau lebih dari 3 inspeksi terakhir masih BAD (${recentBadCount}/3), jadi masalah dianggap masih aktif.`);
  } else if (recentBadCount === 1 && latestIsGood) {
    score -= 4;
    notes.push("Ada BAD pada salah satu inspeksi terakhir, tetapi inspeksi terbaru sudah GOOD sehingga penalti diperkecil.");
  }
  if (latestBadEntry && latestIsGood && daysSinceLatestBad !== null) {
    if (daysSinceLatestBad >= 90) {
      score += 8;
      notes.push(`BAD terakhir sudah lewat ${daysSinceLatestBad} hari dan inspeksi terbaru tetap GOOD. Pengaruh histori lama dikurangi.`);
    } else if (daysSinceLatestBad >= 30) {
      score += 4;
      notes.push(`BAD terakhir sudah lewat ${daysSinceLatestBad} hari dan kondisi terbaru GOOD. Riwayat lama masih dicatat, tapi bobotnya lebih kecil.`);
    } else {
      notes.push(`BAD terakhir masih relatif baru (${daysSinceLatestBad} hari lalu), jadi histori masih cukup mempengaruhi penilaian.`);
    }
  }
  if (latestIsGood && priorMaxTemperature !== null && maxTemperature < priorMaxTemperature) {
    score += Math.min(6, Math.round((priorMaxTemperature - maxTemperature) / 3));
    notes.push(`Temperatur terbaru lebih rendah dibanding histori sebelumnya (${maxTemperature} C vs puncak lama ${priorMaxTemperature} C).`);
  }
  if (latestIsGood && priorDominantVibration !== null && maxVibrationBefore !== null && maxVibrationBefore < priorDominantVibration) {
    score += Math.min(6, Math.round((priorDominantVibration - maxVibrationBefore) * 2));
    notes.push(`Vibrasi dominan terbaru membaik dibanding histori sebelumnya (${maxVibrationBefore} mm/s vs puncak lama ${priorDominantVibration} mm/s).`);
  }
  if (regreaseEffect.consistentRecovery) {
    score += 6;
    notes.push(`Pola histori menunjukkan regrease cukup efektif: pada ${regreaseEffect.repeatHighBeforeLowAfterCount} inspeksi, vibrasi before tinggi lalu turun rendah setelah regrease.`);
    notes.push("Artinya tindakan regrease memberi perbaikan nyata, tetapi equipment tetap perlu diawasi karena indikasi kenaikan vibrasi sebelum regrease muncul berulang.");
  } else if (regreaseEffect.unresolvedCount >= 2) {
    score -= 6;
    notes.push(`Pada ${regreaseEffect.unresolvedCount} inspeksi, vibrasi after tidak turun dari before. Efektivitas regrease perlu dievaluasi ulang.`);
  }
  if (cadence.overdueDays > 0) {
    const cadencePenalty = Math.min(12, 4 + Math.ceil(cadence.overdueDays / 7));
    score -= cadencePenalty;
    notes.push(`Inspeksi terakhir sudah lewat ${cadence.daysSinceLatestInspection} hari. Melebihi standar ${cadence.standardDays} hari, jadi perlu segera dikunjungi ulang.`);
  } else if (cadence.daysSinceLatestInspection !== null) {
    notes.push(`Inspeksi terakhir masih dalam rentang standar ${cadence.standardDays} hari (${cadence.daysSinceLatestInspection} hari lalu).`);
  }
  if (cadence.repeatedProblemWithinStandardCount >= 2) {
    score -= 10;
    notes.push(`Dalam ${cadence.repeatedProblemWithinStandardCount} interval yang masih di dalam standar ${cadence.standardDays} hari, masalah tetap muncul berulang. Equipment ini layak dipertimbangkan untuk inspeksi lebih sering dari 21 hari.`);
  } else if (cadence.repeatedProblemWithinStandardCount === 1) {
    score -= 5;
    notes.push(`Ada 1 kejadian masalah tetap muncul lagi meskipun inspeksi masih dalam interval standar ${cadence.standardDays} hari. Frekuensi kunjungan mungkin perlu dipercepat bila pola ini berulang.`);
  }
  if (cadence.reappearedAfterEffectiveRegreaseCount > 0) {
    score -= Math.min(8, cadence.reappearedAfterEffectiveRegreaseCount * 4);
    notes.push(`Pada ${cadence.reappearedAfterEffectiveRegreaseCount} siklus, vibrasi sempat turun setelah regrease tetapi sudah naik lagi sebelum siklus inspeksi ${cadence.standardDays} hari berikutnya. Ini tanda interval kunjungan bisa terlalu longgar untuk equipment ini.`);
  }

  score = Math.max(0, Math.min(100, score));
  let grade = "Healthy";
  let gradeClass = "is-healthy";
  if (score < 55) {
    grade = "Critical";
    gradeClass = "is-critical";
  } else if (score < 75) {
    grade = "Watchlist";
    gradeClass = "is-watch";
  }

  return {
    score,
    grade,
    gradeClass,
    latestCondition,
    temperatureDs,
    temperatureNds,
    maxTemperature,
    maxVibrationBefore,
    maxVibrationAfter,
    dominantVibrationBefore: vibrationDiagnostics.dominantBefore,
    dominantVibrationAfter: vibrationDiagnostics.dominantAfter,
    vibrationBeforeCriticalCount: vibrationDiagnostics.beforeCriticalCount,
    vibrationBeforeWatchCount: vibrationDiagnostics.beforeWatchCount,
    vibrationAfterCriticalCount: vibrationDiagnostics.afterCriticalCount,
    vibrationAfterWatchCount: vibrationDiagnostics.afterWatchCount,
    vibrationChannels: vibrationDiagnostics.channelComparisons,
    regreaseEffect,
    cadence,
    historyCount: history.length,
    recentBadCount,
    daysSinceLatestBad,
    notes,
  };
}

function buildMsoMotorTrendSvg(history, series, options = {}) {
  const width = 860;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 40, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const validSeries = series.map((entry) => ({
    ...entry,
    points: history.map((historyEntry, index) => ({
      x: index,
      label: historyEntry.label,
      value: entry.getValue(historyEntry),
    })).filter((point) => point.value !== null),
  })).filter((entry) => entry.points.length);
  const thresholds = Array.isArray(options.thresholds) ? options.thresholds : [];
  const allValues = validSeries.flatMap((entry) => entry.points.map((point) => point.value));
  if (!allValues.length) {
    return '<div class="trend-empty">Belum ada histori numerik yang cukup untuk ditampilkan.</div>';
  }

  const minValue = Math.min(...allValues, ...thresholds.map((entry) => entry.value));
  const maxValue = Math.max(...allValues, ...thresholds.map((entry) => entry.value));
  const paddingValue = Math.max((maxValue - minValue) * 0.14, 0.8);
  const domainMin = Math.max(0, minValue - paddingValue);
  const domainMax = maxValue + paddingValue;
  const xStep = history.length > 1 ? chartWidth / (history.length - 1) : chartWidth / 2;
  const valueToY = (value) => padding.top + ((domainMax - value) / (domainMax - domainMin || 1)) * chartHeight;
  const colorPalette = ["rgba(124,199,255,0.96)", "rgba(115,224,169,0.96)", "rgba(255,166,66,0.96)", "rgba(255,107,120,0.96)"];

  return `
    <svg class="trend-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(options.ariaLabel || "Grafik tren motor MSO")}">
      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" rx="14" fill="rgba(255,255,255,0.02)"></rect>
      ${thresholds.map((threshold, index) => {
        const y = valueToY(threshold.value);
        return `
          <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${threshold.color || "rgba(255,255,255,0.25)"}" stroke-dasharray="6 6"></line>
          <text x="${padding.left}" y="${y - 8}" class="trend-threshold ${index === 0 ? "low" : "high"}">${escapeHtml(threshold.label)}</text>
        `;
      }).join("")}
      ${validSeries.map((entry, seriesIndex) => {
        const stroke = entry.color || colorPalette[seriesIndex % colorPalette.length];
        const points = entry.points.map((point) => ({
          ...point,
          xCoord: padding.left + (history.length > 1 ? point.x * xStep : chartWidth / 2),
          yCoord: valueToY(point.value),
        }));
        const polyline = points.map((point) => `${point.xCoord},${point.yCoord}`).join(" ");
        return `
          <polyline fill="none" stroke="${stroke}" stroke-width="3" points="${polyline}"></polyline>
          ${points.map((point) => `
            <g>
              <circle cx="${point.xCoord}" cy="${point.yCoord}" r="5" class="trend-point" style="fill:${stroke};">
                <title>${escapeHtml(`${entry.label} | ${point.label} | ${point.value}`)}</title>
              </circle>
            </g>
          `).join("")}
        `;
      }).join("")}
      ${history.map((entry, index) => {
        const x = padding.left + (history.length > 1 ? index * xStep : chartWidth / 2);
        return `<text x="${x}" y="${height - 14}" text-anchor="middle" class="trend-axis-label">${escapeHtml(entry.label)}</text>`;
      }).join("")}
    </svg>
    <div class="mso-trend-legend">
      ${validSeries.map((entry, index) => `
        <span><i style="background:${entry.color || colorPalette[index % colorPalette.length]};"></i>${escapeHtml(entry.label)}</span>
      `).join("")}
    </div>
  `;
}

function buildMsoMotorAnalyticsHtml(item) {
  const history = getMsoMotorHistory(item);
  const latestSnapshot = getMsoMotorHealthSnapshot(item);
  const badCount = history.filter((entry) => String(entry.payload?.condition || "").toUpperCase() === "BAD").length;
  const trendHistory = history.map((entry) => ({
    label: formatInspectionDate(entry.payload?.inspectionDate),
    payload: entry.payload || {},
  }));
  const temperatureTrendHtml = buildMsoMotorTrendSvg(trendHistory, [
    { label: "Temp DS", getValue: (entry) => parseMsoMotorNumeric(entry.payload.temperaturDs), color: "rgba(255,166,66,0.96)" },
    { label: "Temp NDS", getValue: (entry) => parseMsoMotorNumeric(entry.payload.temperaturNds), color: "rgba(124,199,255,0.96)" },
  ], {
    ariaLabel: "Grafik tren temperatur motor MSO",
    thresholds: [
      { value: 60, label: "Watch 60 C", color: "rgba(255,210,79,0.75)" },
      { value: 70, label: "Critical 70 C", color: "rgba(255,107,120,0.75)" },
    ],
  });
  const vibrationTrendHtml = buildMsoMotorTrendSvg(trendHistory, [
    { label: "Vib Before Max", getValue: (entry) => getMsoMotorMaxVibration(entry.payload, "before"), color: "rgba(255,107,120,0.96)" },
    { label: "Vib After Max", getValue: (entry) => getMsoMotorMaxVibration(entry.payload, "after"), color: "rgba(115,224,169,0.96)" },
  ], {
    ariaLabel: "Grafik tren vibrasi motor MSO",
    thresholds: [
      { value: 2.8, label: "Watch 2.8 mm/s", color: "rgba(255,210,79,0.75)" },
      { value: 4.5, label: "Critical 4.5 mm/s", color: "rgba(255,107,120,0.75)" },
    ],
  });

  const recommendations = [];
  if (latestSnapshot.latestCondition === "BAD") {
    recommendations.push("Prioritaskan verifikasi lapangan karena inspeksi terbaru berstatus BAD.");
  }
  if (latestSnapshot.vibrationBeforeCriticalCount > 0 || latestSnapshot.vibrationBeforeWatchCount > 0) {
    const dominantChannel = latestSnapshot.dominantVibrationBefore;
    if (dominantChannel?.axis === "Axial") {
      recommendations.push(`Dominan vibrasi ada di ${dominantChannel.label}. Fokus cek kelurusan shaft dan kopling, kondisi thrust/beban dorong, serta kemungkinan poros tidak center.`);
    } else if (dominantChannel?.axis === "Hor") {
      recommendations.push(`Dominan vibrasi ada di ${dominantChannel.label}. Cek apakah ada bagian yang longgar, kaki motor tidak menapak rata, baut dudukan kendor, dan posisi motor bergeser ke samping.`);
    } else if (dominantChannel?.axis === "Vert") {
      recommendations.push(`Dominan vibrasi ada di ${dominantChannel.label}. Cek fondasi, plat dudukan motor, baut anchor, dan kondisi bearing pada sisi tersebut.`);
    }
    if (dominantChannel?.side === "DS") {
      recommendations.push("Karena titik tertinggi ada di sisi DS, prioritaskan cek bearing sisi kopling/penggerak, kondisi kopling, dan kekencangan baut di sisi penggerak.");
    } else if (dominantChannel?.side === "NDS") {
      recommendations.push("Karena titik tertinggi ada di sisi NDS, prioritaskan cek bearing sisi belakang motor, bagian fan/cooling end, serta dudukan motor sisi NDS apakah ada baut kendor atau plat dudukan kurang stabil.");
    }
    if (latestSnapshot.vibrationBeforeCriticalCount > 0) {
      recommendations.push(`Ada ${latestSnapshot.vibrationBeforeCriticalCount} kanal vibrasi kritis. Motor layak diprioritaskan untuk analisa getaran lanjutan.`);
    } else {
      recommendations.push(`Ada ${latestSnapshot.vibrationBeforeWatchCount} kanal vibrasi watchlist. Bandingkan kanal yang sama pada 3 inspeksi terakhir.`);
    }
  }
  if (latestSnapshot.maxTemperature >= 70) {
    recommendations.push("Evaluasi beban motor, pendinginan, ventilasi, dan kondisi bearing karena temperatur sudah kritis.");
  } else if (latestSnapshot.maxTemperature >= 60) {
    recommendations.push("Monitor kenaikan temperatur pada inspeksi berikutnya dan cek kebersihan jalur pendinginan.");
  }
  if (latestSnapshot.maxVibrationAfter !== null && latestSnapshot.maxVibrationBefore !== null && latestSnapshot.maxVibrationAfter >= latestSnapshot.maxVibrationBefore) {
    recommendations.push("Tindakan after belum efektif. Tinjau ulang metode regrease atau kebutuhan investigasi mekanik lebih lanjut.");
  }
  if (latestSnapshot.regreaseEffect.consistentRecovery) {
    recommendations.push(`Pola histori menunjukkan setelah regrease, vibrasi sering turun dari before tinggi menjadi after rendah (${latestSnapshot.regreaseEffect.repeatHighBeforeLowAfterCount} inspeksi).`);
    recommendations.push("Artinya regrease masih efektif sebagai tindakan korektif cepat, tetapi equipment punya kecenderungan vibrasi naik lagi sebelum jadwal berikutnya sehingga akar masalah mekanik tetap perlu dicari.");
  }
  if ((latestSnapshot.cadence?.overdueDays || 0) > 0) {
    recommendations.push(`Jadwal inspeksi sudah lewat ${latestSnapshot.cadence.overdueDays} hari dari standar ${latestSnapshot.cadence.standardDays} hari. Segera lakukan inspeksi ulang agar tren kerusakan tidak terlambat terbaca.`);
  }
  if ((latestSnapshot.cadence?.repeatedProblemWithinStandardCount || 0) > 0) {
    recommendations.push(`Masalah masih muncul lagi dalam interval inspeksi standar ${latestSnapshot.cadence.standardDays} hari. Untuk equipment ini, pertimbangkan interval kunjungan yang lebih rapat dari 21 hari sampai kondisi stabil.`);
  }
  if ((latestSnapshot.cadence?.reappearedAfterEffectiveRegreaseCount || 0) > 0) {
    recommendations.push("Setelah regrease hasilnya sempat bagus, tetapi vibrasi kembali naik sebelum siklus inspeksi berikutnya. Selain cek akar masalah mekanik, interval monitoring perlu dipercepat.");
  }
  if (badCount >= 3) {
    recommendations.push(`Motor ini sudah BAD sebanyak ${badCount} kali. Layak masuk prioritas planning tindak lanjut atau shutdown.`);
  }

  return `
    <section class="detail-card mso-health-card">
      <div class="mso-health-head">
        <div>
          <h4>Health Snapshot</h4>
          <p>Penilaian cepat berdasarkan kondisi terbaru, temperatur tertinggi, vibrasi maksimum, dan efektivitas after service.</p>
        </div>
        <div class="mso-health-badge ${latestSnapshot.gradeClass}">
          <strong>${latestSnapshot.score}</strong>
          <span>${escapeHtml(latestSnapshot.grade)}</span>
        </div>
      </div>
      <div class="detail-grid trend-summary-grid">
        ${buildDetailGridRows([
          ["Condition terbaru", latestSnapshot.latestCondition || "-"],
          ["Temperatur DS", latestSnapshot.temperatureDs ?? "-"],
          ["Temperatur NDS", latestSnapshot.temperatureNds ?? "-"],
          ["Temperatur maksimum", latestSnapshot.maxTemperature || "-"],
          ["Vibrasi before max", latestSnapshot.maxVibrationBefore ?? "-"],
          ["Vibrasi after max", latestSnapshot.maxVibrationAfter ?? "-"],
          ["Kanal before dominan", latestSnapshot.dominantVibrationBefore?.label || "-"],
          ["Kanal after dominan", latestSnapshot.dominantVibrationAfter?.label || "-"],
          ["Kanal before kritis", `${latestSnapshot.vibrationBeforeCriticalCount || 0} kanal`],
          ["Kanal before watch", `${latestSnapshot.vibrationBeforeWatchCount || 0} kanal`],
          ["Pair before/after", `${latestSnapshot.regreaseEffect.pairCount || 0} inspeksi`],
          ["Before tinggi -> after rendah", `${latestSnapshot.regreaseEffect.repeatHighBeforeLowAfterCount || 0} inspeksi`],
          ["Standar interval", `${latestSnapshot.cadence?.standardDays || MSO_MOTOR_INSPECTION_STANDARD_DAYS} hari`],
          ["Jarak 2 inspeksi terakhir", latestSnapshot.cadence?.latestGapDays === null ? "-" : `${latestSnapshot.cadence.latestGapDays} hari`],
          ["Rata-rata jarak inspeksi", latestSnapshot.cadence?.averageGapDays === null ? "-" : `${latestSnapshot.cadence.averageGapDays} hari`],
          ["Hari sejak inspeksi terakhir", latestSnapshot.cadence?.daysSinceLatestInspection === null ? "-" : `${latestSnapshot.cadence.daysSinceLatestInspection} hari`],
          ["Lewat dari standar", `${latestSnapshot.cadence?.overdueDays || 0} hari`],
          ["Masalah berulang <= 21 hari", `${latestSnapshot.cadence?.repeatedProblemWithinStandardCount || 0} kali`],
          ["Naik lagi setelah regrease <= 21 hari", `${latestSnapshot.cadence?.reappearedAfterEffectiveRegreaseCount || 0} kali`],
          ["Total histori", `${history.length} inspeksi`],
          ["Frekuensi BAD", `${badCount} kali`],
          ["BAD 3 inspeksi terakhir", `${latestSnapshot.recentBadCount || 0} kali`],
          ["Jarak dari BAD terakhir", latestSnapshot.daysSinceLatestBad === null ? "-" : `${latestSnapshot.daysSinceLatestBad} hari`],
          ["Source", item.payload?.source || "MSO"],
        ])}
      </div>
      <div class="detail-analysis">
        ${(latestSnapshot.notes.length ? latestSnapshot.notes : ["Kondisi terbaru relatif aman berdasarkan data historis yang tersimpan."]).map((entry) => `<div class="detail-analysis-item">${escapeHtml(entry)}</div>`).join("")}
      </div>
    </section>
    <section class="detail-card carbon-brush-trend-card">
      <div class="detail-modal-head compact-trend-head">
        <div>
          <h4>Trend Temperatur</h4>
          <p>Pergerakan temperatur DS dan NDS dari histori inspeksi motor MSO.</p>
        </div>
      </div>
      ${temperatureTrendHtml}
    </section>
    <section class="detail-card carbon-brush-trend-card">
      <div class="detail-modal-head compact-trend-head">
        <div>
          <h4>Trend Vibrasi</h4>
          <p>Grafik ini tetap menampilkan vibrasi maksimum before dan after. Tetapi health score, ranking, dan rekomendasi sekarang dihitung dari detail kanal DS/NDS dan Vert/Hor/Axial.</p>
        </div>
      </div>
      ${vibrationTrendHtml}
    </section>
    <section class="detail-card">
      <h4>Ringkasan Kanal Vibrasi</h4>
      <div class="detail-grid">
        ${buildDetailGridRows(
          latestSnapshot.vibrationChannels.flatMap((channel) => ([
            [`${channel.label} Before`, channel.beforeValue ?? "-"],
            [`${channel.label} After`, channel.afterValue ?? "-"],
          ])),
        )}
      </div>
    </section>
    <section class="detail-card">
      <h4>Rekomendasi Otomatis</h4>
      <div class="detail-analysis trend-event-list">
        ${(recommendations.length ? recommendations : ["Belum ada indikasi kuat untuk tindakan khusus. Lanjutkan monitoring rutin."]).map((entry) => `<div class="detail-analysis-item">${escapeHtml(entry)}</div>`).join("")}
      </div>
    </section>
  `;
}

function buildMsoMotorWatchlistSummary(serviceItems) {
  const latestByEquipment = new Map();
  serviceItems
    .filter((item) => item.formType === "service-motor-mso" && String(item.payload?.source || "").toUpperCase() === "MSO")
    .filter((item) => shouldDisplayMsoMotorEquipment(item.equipmentName))
    .forEach((item) => {
      const key = String(item.equipmentName || "").trim().toUpperCase();
      if (!key) {
        return;
      }
      const existing = latestByEquipment.get(key);
      const currentTime = new Date(item.payload?.inspectionDate || 0).getTime() || 0;
      const existingTime = new Date(existing?.payload?.inspectionDate || 0).getTime() || 0;
      if (!existing || currentTime >= existingTime) {
        latestByEquipment.set(key, item);
      }
    });

  return [...latestByEquipment.values()]
    .map((item) => {
      const snapshot = getMsoMotorHealthSnapshot(item);
      const history = getMsoMotorHistory(item);
      const badCount = history.filter((entry) => String(entry.payload?.condition || "").toUpperCase() === "BAD").length;
      const scoreComponent = 100 - snapshot.score;
      const vibrationComponent = (snapshot.vibrationBeforeCriticalCount * 14)
        + (snapshot.vibrationBeforeWatchCount * 6)
        + Math.round((snapshot.maxVibrationBefore ?? 0) * 2);
      const temperatureComponent = (snapshot.maxTemperature ?? 0) >= 70 ? 12 : (snapshot.maxTemperature ?? 0) >= 60 ? 6 : 0;
      const severity = scoreComponent + vibrationComponent + temperatureComponent;
      let priorityLabel = "Monitor";
      let priorityClass = "is-monitor";
      if (severity >= 85 || snapshot.grade === "Critical") {
        priorityLabel = "Prioritas 1";
        priorityClass = "is-priority-1";
      } else if (severity >= 60 || badCount >= 2) {
        priorityLabel = "Prioritas 2";
        priorityClass = "is-priority-2";
      } else if (severity >= 35 || snapshot.grade === "Watchlist") {
        priorityLabel = "Prioritas 3";
        priorityClass = "is-priority-3";
      }
      return {
        item,
        snapshot,
        badCount,
        severity,
        scoreComponent,
        vibrationComponent,
        temperatureComponent,
        priorityLabel,
        priorityClass,
      };
    })
    .sort((left, right) => right.severity - left.severity)
    .slice(0, 20)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
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
  const rawRows = formatServicePayloadLines(item).filter(([, value]) => !shouldHideInspectionDetailValue(value));
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
      <div class="detail-grid">${buildCarbonBrushPayloadDetailHtml(item)}</div>
      <div id="carbon-brush-analysis-slot">${buildCarbonBrushMeggerTrendHtml(item)}</div>
      ${buildCarbonBrushMatrixHtml(payload.measurements || {}, item.equipmentName || "", payload.plant || "", carbonBrushReplacementDraft)}
    `;
  }
  const msoAnalyticsHtml = item.formType === "service-motor-mso" && String(payload.source || "").toUpperCase() === "MSO"
    ? buildMsoMotorAnalyticsHtml(item)
    : "";

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
    ${msoAnalyticsHtml}
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

  activeServiceGroupDetailType = serviceType;
  serviceDetailTitle.textContent = `Detail ${serviceType}`;
  serviceDetailSubtitle.textContent = `Daftar penuh hasil inspeksi ${serviceType}. Gunakan pencarian dan filter langsung di halaman ini.`;

  renderServiceGroupDetailContent(serviceType);

  serviceDetailModal.classList.remove("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "false");
}

function renderServiceGroupDetailContent(serviceType, searchTerm = "", subtypeFilter = "") {
  if (!serviceDetailContent) {
    return;
  }
  const normalizedQuery = String(searchTerm || "").trim().toLowerCase();
  const normalizedSubtype = String(subtypeFilter || "").trim();
  const items = getServiceItemsFromDom()
    .filter((item) => item.type === serviceType)
    .filter((item) => shouldDisplayServiceItem(item));
  const subtypeOptions = [...new Set(items.map((item) => String(item.subtype || item.type || "").trim()).filter(Boolean))].sort((left, right) => left.localeCompare(right));
  const filteredItems = items.filter((item) => {
    const equipmentName = String(item.equipmentName || "").toLowerCase();
    const description = String(item.description || "").toLowerCase();
    const detail = String(item.detail || "").toLowerCase();
    const subtype = String(item.subtype || item.type || "").trim();
    const matchesSubtype = !normalizedSubtype || subtype === normalizedSubtype;
    const matchesQuery = !normalizedQuery
      || equipmentName.includes(normalizedQuery)
      || description.includes(normalizedQuery)
      || detail.includes(normalizedQuery)
      || subtype.toLowerCase().includes(normalizedQuery);
    return matchesSubtype && matchesQuery;
  });

  const filterToolbar = `
    <div class="service-group-filter-bar">
      <label class="service-group-filter-field">
        <span>Cari equipment / catatan</span>
        <input type="search" data-service-group-search value="${escapeHtml(searchTerm)}" placeholder="Ketik equipment, subtype, atau catatan inspeksi">
      </label>
      <label class="service-group-filter-field">
        <span>Filter subtype</span>
        <select data-service-group-subtype>
          <option value="">Semua subtype</option>
          ${subtypeOptions.map((option) => `<option value="${escapeHtml(option)}"${option === normalizedSubtype ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
      <div class="service-group-filter-summary">
        <strong>${filteredItems.length}</strong>
        <span>dari ${items.length} item</span>
      </div>
    </div>
  `;

  if (!items.length) {
    serviceDetailContent.innerHTML = `
      <section class="detail-card">
        <div class="detail-analysis">
          <div class="detail-analysis-item">Belum ada hasil inspeksi pada kolom ${escapeHtml(serviceType)}.</div>
        </div>
      </section>
    `;
    return;
  }

  serviceDetailContent.innerHTML = `
    <section class="detail-card">
      <h4>Daftar Hasil Inspeksi</h4>
      ${filterToolbar}
      <div class="service-group-detail-list">
        ${
          filteredItems.length
            ? filteredItems.map((item) => `
              <button class="service-group-detail-item" type="button" data-action="open-service-item-detail" data-id="${escapeHtml(item.id || "")}">
                <div>
                  <strong>${escapeHtml(item.equipmentName || "-")}</strong>
                  <span>${escapeHtml(item.subtype || item.type || "-")}</span>
                </div>
                <small>${escapeHtml(formatInspectionDate(item.payload?.inspectionDate))}</small>
              </button>
            `).join("")
            : `<div class="service-list-empty">Tidak ada hasil inspeksi yang cocok dengan pencarian/filter saat ini.</div>`
        }
      </div>
    </section>
  `;
}

function closeServiceDetail() {
  if (!serviceDetailModal) {
    return;
  }
  activeServiceGroupDetailType = "";
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

function confirmDeleteAction(label = "data ini") {
  return window.confirm(`Apakah anda yakin ingin menghapus ${label}?`);
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

  if (item.formType === "service-motor-mv" || item.formType === "service-motor-mso") {
    if ((payload.source || "").toUpperCase() === "MSO") {
      return [
        ["Sumber", payload.source || "-"],
        ["InspID", payload.inspId || "-"],
        ["ID AMTRANS", payload.idAmtrans || "-"],
        ["Condition", payload.condition || "-"],
        ["Equipment Desc", payload.equipmentDesc || "-"],
        ["Creator", payload.creator || "-"],
        ["Mplant", payload.mplant || "-"],
        ["Temperatur DS", payload.temperaturDs || "-"],
        ["Temperatur NDS", payload.temperaturNds || "-"],
        ["gE DS Vert Before", payload.geDsVertBefore || "-"],
        ["gE DS Hor Before", payload.geDsHorBefore || "-"],
        ["gE DS Axial Before", payload.geDsAxialBefore || "-"],
        ["Vibrasi DS Vert Before", payload.vibrasiDsVertBefore || "-"],
        ["Vibrasi DS Hor Before", payload.vibrasiDsHorBefore || "-"],
        ["Vibrasi DS Axial Before", payload.vibrasiDsAxialBefore || "-"],
        ["gE NDS Vert Before", payload.geNdsVertBefore || "-"],
        ["gE NDS Hor Before", payload.geNdsHorBefore || "-"],
        ["gE NDS Axial Before", payload.geNdsAxialBefore || "-"],
        ["Vibrasi NDS Vert Before", payload.vibrasiNdsVertBefore || "-"],
        ["Vibrasi NDS Hor Before", payload.vibrasiNdsHorBefore || "-"],
        ["Vibrasi NDS Axial Before", payload.vibrasiNdsAxialBefore || "-"],
        ["Regrease DE", payload.regreaseDe || "-"],
        ["Regrease NDE", payload.regreaseNde || "-"],
        ["gE DS Vert After", payload.geDsVertAfter || "-"],
        ["gE DS Hor After", payload.geDsHorAfter || "-"],
        ["gE DS Axial After", payload.geDsAxialAfter || "-"],
        ["Vibrasi DS Vert After", payload.vibrasiDsVertAfter || "-"],
        ["Vibrasi DS Hor After", payload.vibrasiDsHorAfter || "-"],
        ["Vibrasi DS Axial After", payload.vibrasiDsAxialAfter || "-"],
        ["gE NDS Vert After", payload.geNdsVertAfter || "-"],
        ["gE NDS Hor After", payload.geNdsHorAfter || "-"],
        ["gE NDS Axial After", payload.geNdsAxialAfter || "-"],
        ["Vibrasi NDS Vert After", payload.vibrasiNdsVertAfter || "-"],
        ["Vibrasi NDS Hor After", payload.vibrasiNdsHorAfter || "-"],
        ["Vibrasi NDS Axial After", payload.vibrasiNdsAxialAfter || "-"],
        ["Kelengkapan Motor", payload.kelengkapanMotor || "-"],
        ["Keterangan MSO", payload.inspectionNote || "-"],
        ["Photo URL", payload.photoUrl || "-"],
      ];
    }
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

  if (item.formType === "service-cems") {
    return [
      ["Nama inspektor", payload.inspectorName || "-"],
      ["O₂", `${payload.o2Status || "-"} | ${payload.o2Value || "-"} ${payload.o2Unit || ""}`.trim()],
      ["CO", `${payload.coStatus || "-"} | ${payload.coValue || "-"} ${payload.coUnit || ""}`.trim()],
      ["NOx", `${payload.noxStatus || "-"} | ${payload.noxValue || "-"} ${payload.noxUnit || ""}`.trim()],
      ["SO₂", `${payload.so2Status || "-"} | ${payload.so2Value || "-"} ${payload.so2Unit || ""}`.trim()],
      ["Dust / PM", `${payload.dustStatus || "-"} | ${payload.dustValue || "-"} ${payload.dustUnit || ""}`.trim()],
      ["Flow", `${payload.flowStatus || "-"} | ${payload.flowValue || "-"} ${payload.flowUnit || ""}`.trim()],
      ["Temperature", `${payload.temperatureStatus || "-"} | ${payload.temperatureValue || "-"} ${payload.temperatureUnit || ""}`.trim()],
      ["Pressure", `${payload.pressureStatus || "-"} | ${payload.pressureValue || "-"} ${payload.pressureUnit || ""}`.trim()],
      ["Analyzer", `Power ${payload.analyzerPower || "-"} | Status ${payload.analyzerStatus || "-"} | Alarm ${payload.analyzerAlarm || "-"}`],
      ["Sampling", `Probe ${payload.samplingProbe || "-"} | Filter ${payload.samplingFilter || "-"} | Pump ${payload.samplingPump || "-"}`],
      ["Gas kalibrasi", `Cylinder ${payload.calibrationCylinder || "-"} | Auto Cal ${payload.calibrationAuto || "-"} | Jadwal ${payload.calibrationSchedule || "-"}`],
      ["Data & komunikasi", `SCADA ${payload.dataDasScada || "-"} | Logger ${payload.dataLogger || "-"} | Loss ${payload.dataLoss || "-"}`],
      ["Sistem pendukung", `Power ${payload.supportPowerSupply || "-"} | UPS ${payload.supportUps || "-"} | AC ${payload.supportAcPanel || "-"} | Shelter ${payload.supportShelter || "-"}`],
      ["Temuan masalah", payload.findingIssue || "-"],
      ["Penyebab kemungkinan", payload.possibleCause || "-"],
      ["Dampak emisi / compliance", payload.emissionImpact || "-"],
      ["Urgensi", payload.urgencyLevel || "-"],
      ["Foto temuan", photoSummary],
    ];
  }

  if (item.formType === "service-opacity-meter") {
    const recommendations = [
      payload.recommendationCleaning ? "Cleaning" : "",
      payload.recommendationRealignment ? "Re-alignment" : "",
      payload.recommendationCalibration ? "Kalibrasi" : "",
      payload.recommendationSparePart ? "Penggantian Spare Part" : "",
      payload.recommendationOther || "",
    ].filter(Boolean).join(", ");
    return [
      ["Waktu", payload.inspectionTime || "-"],
      ["Merk / Model", payload.brandModel || "-"],
      ["Nama teknisi", payload.technicianName || "-"],
      ["Shift", payload.shift || "-"],
      ["Opacity", `${payload.opacityValue || "-"} ${payload.opacityUnit || ""} | Batas ${payload.opacityLimit || "-"} | ${payload.opacityStatus || "-"}`.trim()],
      ["Transmittance", `${payload.transmittanceValue || "-"} ${payload.transmittanceUnit || ""} | Batas ${payload.transmittanceLimit || "-"} | ${payload.transmittanceStatus || "-"}`.trim()],
      ["Alarm Status", `${payload.alarmStatusValue || "-"} | Batas ${payload.alarmStatusLimit || "-"} | ${payload.alarmStatusCondition || "-"}`.trim()],
      ["Visual & fisik", `Housing ${payload.visualHousingClean || "-"} | Mounting ${payload.visualMounting || "-"} | Alignment ${payload.visualAlignment || "-"}`],
      ["Optik & sensor", `Lens ${payload.opticLens || "-"} | Reflector ${payload.opticReflector || "-"} | Sinyal ${payload.opticSignal || "-"}`],
      ["Air purge / blower", `Purge ${payload.purgeActive || "-"} | Tekanan ${payload.purgePressure || "-"} | Flow ${payload.purgeFlow || "-"}`],
      ["Elektrik & komunikasi", `Power ${payload.electricalPowerSupply || "-"} | PLC/DCS ${payload.electricalOutput || "-"} | Noise ${payload.electricalNoise || "-"}`],
      ["Zero / Span / Drift", `Zero ${payload.zeroCheckValue || "-"} (${payload.zeroCheckStatus || "-"}) | Span ${payload.spanCheckValue || "-"} (${payload.spanCheckStatus || "-"}) | Drift ${payload.driftValue || "-"} (${payload.driftStatus || "-"})`],
      ["Masalah ditemukan", payload.findingIssue || "-"],
      ["Analisa penyebab", payload.possibleCause || "-"],
      ["Dampak pembacaan", payload.readingImpact || "-"],
      ["Rekomendasi", recommendations || "-"],
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

function analyzeCarbonBrushMeggerTrend(history, meggerMinimum = 100) {
  const numericHistory = history.filter((entry) => entry.numericValue !== null);
  if (numericHistory.length < 2) {
    return {
      numericHistory,
      firstValue: numericHistory[0]?.numericValue ?? null,
      latestValue: numericHistory[0]?.numericValue ?? null,
      intervals: Math.max(numericHistory.length - 1, 0),
      totalDays: null,
      totalDrop: null,
      avgDropPerService: null,
      avgDropPerMonth: null,
      servicesToThreshold: null,
      monthsToThreshold: null,
      estimatedThresholdDateLabel: "-",
      status: "Belum cukup histori",
    };
  }

  const first = numericHistory[0];
  const latest = numericHistory[numericHistory.length - 1];
  const totalServices = numericHistory.length - 1;
  const totalDays = getDaysBetweenDates(first.inspectionDate, latest.inspectionDate);
  const totalDrop = first.numericValue - latest.numericValue;
  const avgDropPerService = totalDrop > 0 ? totalDrop / totalServices : null;
  const avgDropPerMonth = totalDrop > 0 && totalDays && totalDays > 0 ? totalDrop / (totalDays / 30) : null;
  const servicesToThreshold = latest.numericValue > meggerMinimum && avgDropPerService
    ? (latest.numericValue - meggerMinimum) / avgDropPerService
    : null;
  const monthsToThreshold = latest.numericValue > meggerMinimum && avgDropPerMonth
    ? (latest.numericValue - meggerMinimum) / avgDropPerMonth
    : null;

  let estimatedThresholdDateLabel = "-";
  if (monthsToThreshold !== null && Number.isFinite(monthsToThreshold) && latest.inspectionDate instanceof Date) {
    const predictedDate = new Date(latest.inspectionDate.getTime() + Math.round(monthsToThreshold * 30) * 86400000);
    estimatedThresholdDateLabel = formatInspectionDate(predictedDate);
  }

  let status = "Stabil / belum terlihat tren turun";
  if (latest.numericValue <= meggerMinimum) {
    status = "Sudah di bawah batas";
  } else if (avgDropPerService && avgDropPerService > 0) {
    status = "Ada tren turun";
  }

  return {
    numericHistory,
    firstValue: first.numericValue,
    latestValue: latest.numericValue,
    intervals: totalServices,
    totalDays,
    totalDrop,
    avgDropPerService,
    avgDropPerMonth,
    servicesToThreshold,
    monthsToThreshold,
    estimatedThresholdDateLabel,
    status,
  };
}

function buildCarbonBrushMeggerAuditHtml(item, history, meggerTrend, meggerMinimum = 100) {
  const rows = history.length
    ? history.map((entry, index, array) => {
      const prev = index > 0 ? array[index - 1] : null;
      const daysGap = prev?.inspectionDate ? getDaysBetweenDates(prev.inspectionDate, entry.inspectionDate) : null;
      const delta = prev && prev.numericValue !== null && entry.numericValue !== null
        ? entry.numericValue - prev.numericValue
        : null;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(entry.inspectionDateLabel)}</td>
          <td>${escapeHtml(entry.rawValue || "-")}</td>
          <td>${entry.numericValue ?? "-"}</td>
          <td>${escapeHtml(entry.pic || "-")}</td>
          <td>${daysGap !== null ? `${daysGap} hari` : "-"}</td>
          <td>${delta !== null ? `${delta > 0 ? "+" : ""}${delta.toFixed(2)}` : "-"}</td>
          <td>${entry.numericValue !== null ? (entry.numericValue < meggerMinimum ? "Masuk hitung | di bawah batas" : "Masuk hitung") : "Tidak dihitung"}</td>
        </tr>
      `;
    }).join("")
    : `
      <tr>
        <td colspan="8">Belum ada histori megger untuk equipment ini.</td>
      </tr>
    `;

  const formulaService = meggerTrend.avgDropPerService !== null
    ? `(${meggerTrend.firstValue} - ${meggerTrend.latestValue}) / ${meggerTrend.intervals} = ${meggerTrend.avgDropPerService.toFixed(2)} Mohm per service`
    : "-";
  const formulaMonth = meggerTrend.avgDropPerMonth !== null && meggerTrend.totalDays
    ? `(${meggerTrend.firstValue} - ${meggerTrend.latestValue}) / (${meggerTrend.totalDays} / 30) = ${meggerTrend.avgDropPerMonth.toFixed(2)} Mohm per bulan`
    : "-";

  return `
    <section class="detail-card">
      <h4>Audit Perhitungan Megger</h4>
      <div class="detail-analysis">
        <div class="detail-analysis-item">
          <strong>Filter data yang dipakai</strong>
          <span>Form harus <strong>Motor MV Carbon Brush</strong>, nama equipment harus persis <strong>${escapeHtml(item.equipmentName || "-")}</strong>, tanggal inspeksi valid, dan nilai megger harus numerik.</span>
        </div>
        <div class="detail-analysis-item">
          <strong>Rumus rata-rata turun per service</strong>
          <span>${escapeHtml(formulaService)}</span>
        </div>
        <div class="detail-analysis-item">
          <strong>Rumus rata-rata turun per bulan</strong>
          <span>${escapeHtml(formulaMonth)}</span>
        </div>
      </div>
      <div class="audit-table-wrap">
        <table class="audit-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Raw Megger</th>
              <th>Numeric</th>
              <th>PIC</th>
              <th>Jeda</th>
              <th>Delta</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
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

function buildCarbonBrushMeggerTrendSvg(history) {
  const meggerMinimum = 100;
  const width = 860;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 40, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const numericPoints = history.filter((entry) => entry.numericValue !== null);
  if (!numericPoints.length) {
    return '<div class="trend-empty">Belum ada histori megger numerik untuk ditampilkan.</div>';
  }

  const values = numericPoints.map((entry) => entry.numericValue);
  const minValue = Math.min(...values, meggerMinimum);
  const maxValue = Math.max(...values);
  const paddingValue = Math.max((maxValue - minValue) * 0.12, 0.2);
  const domainMin = Math.max(0, minValue - paddingValue);
  const domainMax = maxValue + paddingValue;
  const xStep = numericPoints.length > 1 ? chartWidth / (numericPoints.length - 1) : chartWidth / 2;
  const valueToY = (value) => padding.top + ((domainMax - value) / (domainMax - domainMin || 1)) * chartHeight;
  const points = numericPoints.map((entry, index) => ({
    x: padding.left + (numericPoints.length > 1 ? index * xStep : chartWidth / 2),
    y: valueToY(entry.numericValue),
    value: entry.numericValue,
    label: entry.inspectionDateLabel,
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const latest = numericPoints[numericPoints.length - 1];
  const previous = numericPoints.length > 1 ? numericPoints[numericPoints.length - 2] : null;
  const trendStroke = previous && latest.numericValue < previous.numericValue
    ? "rgba(255,107,120,0.95)"
    : "rgba(124,199,255,0.95)";
  const thresholdY = valueToY(meggerMinimum);

  return `
    <svg class="trend-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik tren megger carbon brush">
      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" rx="14" fill="rgba(255,255,255,0.02)"></rect>
      <line x1="${padding.left}" y1="${thresholdY}" x2="${width - padding.right}" y2="${thresholdY}" stroke="rgba(255,107,120,0.82)" stroke-dasharray="6 6"></line>
      <polyline fill="none" stroke="${trendStroke}" stroke-width="3" points="${polyline}"></polyline>
      ${points.map((point) => `
        <g>
          <circle cx="${point.x}" cy="${point.y}" r="5.5" class="trend-point ${point.value < meggerMinimum ? "is-low" : "is-high"}"></circle>
          <text x="${point.x}" y="${height - 14}" text-anchor="middle" class="trend-axis-label">${escapeHtml(point.label)}</text>
          <text x="${point.x}" y="${point.y - 10}" text-anchor="middle" class="trend-axis-label">${escapeHtml(point.value)}</text>
        </g>
      `).join("")}
      <text x="${padding.left}" y="${thresholdY - 8}" class="trend-threshold low">Batas minimum IEEE 43: 100 Mohm</text>
      <text x="${padding.left}" y="${padding.top - 6}" class="trend-threshold high">Megger slip ring motor MV 6,3 kV</text>
    </svg>
  `;
}

function buildCarbonBrushMeggerTrendHtml(item) {
  const meggerMinimum = 100;
  const history = getCarbonBrushMeggerHistory(item);
  const meggerTrend = analyzeCarbonBrushMeggerTrend(history, meggerMinimum);
  const numericHistory = meggerTrend.numericHistory;
  const latest = numericHistory.length ? numericHistory[numericHistory.length - 1] : null;
  const previous = numericHistory.length > 1 ? numericHistory[numericHistory.length - 2] : null;
  const delta = latest && previous ? latest.numericValue - previous.numericValue : null;
  const trendDirection = delta === null
    ? "Belum cukup histori"
    : delta < 0
      ? "Turun"
      : delta > 0
        ? "Naik"
        : "Tetap";
  const lowest = numericHistory.length ? Math.min(...numericHistory.map((entry) => entry.numericValue)) : null;
  const highest = numericHistory.length ? Math.max(...numericHistory.map((entry) => entry.numericValue)) : null;

  return `
    <section class="detail-card carbon-brush-trend-card">
      <div class="detail-modal-head compact-trend-head">
        <div>
          <h4>Tren Megger - ${escapeHtml(item.equipmentName || "-")}</h4>
          <p>Riwayat nilai megger tiap service untuk melihat kecenderungan penurunan isolasi equipment. Acuan minimum yang dipakai adalah 100 Mohm.</p>
        </div>
      </div>
      ${buildCarbonBrushMeggerTrendSvg(history)}
      <div class="detail-grid trend-summary-grid">
        ${buildDetailGridRows([
          ["Total histori", `${history.length} inspeksi`],
          ["Batas minimum", `${meggerMinimum} Mohm`],
          ["Megger terbaru", latest?.rawValue || "-"],
          ["Status terbaru", latest?.numericValue !== null ? (latest.numericValue < meggerMinimum ? "Di bawah batas" : "Memenuhi batas") : "-"],
          ["Megger sebelumnya", previous?.rawValue || "-"],
          ["Tren terbaru", delta === null ? trendDirection : `${trendDirection} ${Math.abs(delta).toFixed(2)}`],
          ["Rata-rata turun / service", meggerTrend.avgDropPerService !== null ? `${meggerTrend.avgDropPerService.toFixed(2)} Mohm` : "-"],
          ["Rata-rata turun / bulan", meggerTrend.avgDropPerMonth !== null ? `${meggerTrend.avgDropPerMonth.toFixed(2)} Mohm` : "-"],
          ["Estimasi menuju 100 Mohm", meggerTrend.servicesToThreshold !== null ? `${meggerTrend.servicesToThreshold.toFixed(1)} service lagi` : "-"],
          ["Estimasi waktu", meggerTrend.monthsToThreshold !== null ? `${meggerTrend.monthsToThreshold.toFixed(1)} bulan lagi` : "-"],
          ["Perkiraan tanggal", meggerTrend.estimatedThresholdDateLabel],
          ["Megger terendah", lowest ?? "-"],
          ["Megger tertinggi", highest ?? "-"],
        ])}
      </div>
      <div class="detail-analysis trend-event-list">
        <div class="detail-analysis-item">
          <strong>Prediksi Tren</strong>
          <span>${
            escapeHtml(
              latest?.numericValue !== null && latest.numericValue <= meggerMinimum
                ? `Megger terbaru sudah menyentuh atau berada di bawah batas minimum ${meggerMinimum} Mohm. Perlu tindak lanjut prioritas.`
                : meggerTrend.avgDropPerService !== null
                  ? `Tren megger menunjukkan penurunan rata-rata ${meggerTrend.avgDropPerService.toFixed(2)} Mohm per service dan ${meggerTrend.avgDropPerMonth !== null ? `${meggerTrend.avgDropPerMonth.toFixed(2)} Mohm per bulan` : "belum cukup data per bulan"}. Dengan laju ini, nilai diperkirakan mendekati ${meggerMinimum} Mohm dalam ${meggerTrend.servicesToThreshold !== null ? `${meggerTrend.servicesToThreshold.toFixed(1)} service` : "-"} atau ${meggerTrend.monthsToThreshold !== null ? `${meggerTrend.monthsToThreshold.toFixed(1)} bulan` : "-"} sekitar ${meggerTrend.estimatedThresholdDateLabel}.`
                  : "Belum terlihat tren penurunan rata-rata yang cukup untuk membuat prediksi menuju batas minimum."
            )
          }</span>
        </div>
        ${(history.length ? history : [{ inspectionDateLabel: "-", rawValue: "-", pic: "-" }]).map((entry, index, array) => {
          const prev = index > 0 ? array[index - 1] : null;
          const currentNumeric = entry.numericValue;
          const previousNumeric = prev?.numericValue ?? null;
          const entryDelta = currentNumeric !== null && previousNumeric !== null ? currentNumeric - previousNumeric : null;
          const noteParts = [];
          if (entryDelta === null) {
            noteParts.push("Baseline histori megger.");
          } else if (entryDelta < 0) {
            noteParts.push(`Turun ${Math.abs(entryDelta).toFixed(2)} dari service sebelumnya.`);
          } else if (entryDelta > 0) {
            noteParts.push(`Naik ${Math.abs(entryDelta).toFixed(2)} dari service sebelumnya.`);
          } else {
            noteParts.push("Nilai tetap dibanding service sebelumnya.");
          }
          if (currentNumeric !== null) {
            noteParts.push(currentNumeric < meggerMinimum
              ? `Di bawah batas minimum ${meggerMinimum} Mohm.`
              : `Masih di atas batas minimum ${meggerMinimum} Mohm.`);
          }
          return `
            <div class="detail-analysis-item">
              <strong>${escapeHtml(entry.inspectionDateLabel)}</strong>
              <span>Megger ${escapeHtml(entry.rawValue || "-")} | PIC ${escapeHtml(entry.pic || "-")} | ${escapeHtml(noteParts.join(" "))}</span>
            </div>
          `;
        }).join("")}
      </div>
      ${buildCarbonBrushMeggerAuditHtml(item, history, meggerTrend, meggerMinimum)}
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

async function getNamedFindingPhotoPayload(formData, existingPayload = {}, fieldConfigs = []) {
  const collectedPhotos = [];

  fieldConfigs.forEach((config) => {
    const fieldName = String(config?.fieldName || "").trim();
    const label = String(config?.label || "foto").trim() || "foto";
    if (!fieldName) {
      return;
    }
    const files = formData.getAll(fieldName)
      .filter((photo) => photo && typeof photo === "object" && "name" in photo && photo.name && "size" in photo && photo.size > 0);
    files.forEach((file) => {
      collectedPhotos.push({
        label,
        file,
      });
    });
  });

  if (collectedPhotos.length > 0) {
    const findingPhotos = await Promise.all(collectedPhotos.map(async ({ label, file }) => ({
      name: `${label} - ${file.name}`,
      data: await readFileAsDataUrl(file),
    })));
    return buildFindingPhotoCompatibility(findingPhotos);
  }

  return buildFindingPhotoCompatibility(normalizeFindingPhotosPayload(existingPayload));
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
  if (sourceGroup) {
    backendState.masters = {
      areas: Array.isArray(result.areas) ? result.areas : backendState.masters.areas,
      inspectionTemplates: Array.isArray(result.inspectionTemplates) ? result.inspectionTemplates : backendState.masters.inspectionTemplates,
      equipmentReferences: backendState.masters.equipmentReferences,
      appSettings: Array.isArray(result.appSettings) ? result.appSettings : backendState.masters.appSettings,
    };
  } else {
    backendState.masters = {
      areas: Array.isArray(result.areas) ? result.areas : [],
      inspectionTemplates: Array.isArray(result.inspectionTemplates) ? result.inspectionTemplates : [],
      equipmentReferences: Array.isArray(result.equipmentReferences) ? result.equipmentReferences : [],
      appSettings: Array.isArray(result.appSettings) ? result.appSettings : [],
    };
  }
  renderElectricalRoomReferenceOptions();
  renderCemsReferenceOptions();
  renderOpacityReferenceOptions();
  renderMsoMotorSyncSettings();
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
  link.download = `${resourceName}.xls`;
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

async function importMsoMotorScrapeItems(items, sourceName) {
  return apiRequest("/admin/import-mso-motor-scrape", {
    method: "POST",
    body: {
      items,
      sourceName,
    },
  });
}

async function resetMsoMotorItems() {
  return apiRequest("/admin/reset-mso-motor", {
    method: "POST",
    body: {},
  });
}

function buildMsoMotorBrowserSyncScript(startDate) {
  const safeStartDate = String(startDate || "2026-01-01").trim() || "2026-01-01";
  const targetOrigin = window.location.origin;
  return `(() => {
  const CONFIG = {
    startDate: ${JSON.stringify(safeStartDate)},
    targetOrigin: ${JSON.stringify(targetOrigin)},
    bridgeUrl: ${JSON.stringify(`${targetOrigin}/?mso_bridge=1`)},
    pageLength: "100",
    waitMs: 1400,
    maxPages: 500,
    tableId: "mcircle",
    filterId: "filterDb",
    pageLengthSelector: 'select[name="mcircle_length"]',
    nextSelector: "#mcircle_next",
    disabledClass: "disabled",
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const normalizeText = (value) => String(value || "").replace(/\\s+/g, " ").trim();
  const parseMsoDate = (rawValue) => {
    const raw = normalizeText(rawValue);
    const match = raw.match(/^(\\d{2})\\/(\\d{2})\\/(\\d{4})(?:\\s+(\\d{2}):(\\d{2})(?::(\\d{2}))?)?$/);
    if (!match) return null;
    const [, dd, mm, yyyy, hh = "00", mi = "00", ss = "00"] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const formatDateLabel = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getVisibleRows = () => {
    const table = document.getElementById(CONFIG.tableId);
    if (!table) throw new Error("Tabel #mcircle tidak ditemukan.");
    return [...table.querySelectorAll("tbody tr")];
  };
  const readRow = (row, pageNumber) => {
    const cells = [...row.querySelectorAll("td")].map((cell) => normalizeText(cell.textContent));
    if (!cells.length) return null;
    return {
      page: pageNumber,
      no: cells[0] || "",
      inspId: cells[1] || "",
      idAmtrans: cells[2] || "",
      tgl: cells[3] || "",
      condition: cells[4] || "",
      descr: cells[5] || "",
      photoPath: row.querySelector("td:nth-child(7) a")?.href || "",
      equptName: cells[7] || "",
      equipmentDesc: cells[8] || "",
      creator: cells[9] || "",
      mplant: cells[10] || "",
      temperaturDs: cells[11] || "",
      temperaturNds: cells[12] || "",
      geDsVertBefore: cells[13] || "",
      geDsHorBefore: cells[14] || "",
      geDsAxialBefore: cells[15] || "",
      vibrasiDsVertBefore: cells[16] || "",
      vibrasiDsHorBefore: cells[17] || "",
      vibrasiDsAxialBefore: cells[18] || "",
      geNdsVertBefore: cells[19] || "",
      geNdsHorBefore: cells[20] || "",
      geNdsAxialBefore: cells[21] || "",
      vibrasiNdsVertBefore: cells[22] || "",
      vibrasiNdsHorBefore: cells[23] || "",
      vibrasiNdsAxialBefore: cells[24] || "",
      regreaseDe: cells[25] || "",
      regreaseNde: cells[26] || "",
      geDsVertAfter: cells[27] || "",
      geDsHorAfter: cells[28] || "",
      geDsAxialAfter: cells[29] || "",
      vibrasiDsVertAfter: cells[30] || "",
      vibrasiDsHorAfter: cells[31] || "",
      vibrasiDsAxialAfter: cells[32] || "",
      geNdsVertAfter: cells[33] || "",
      geNdsHorAfter: cells[34] || "",
      geNdsAxialAfter: cells[35] || "",
      vibrasiNdsVertAfter: cells[36] || "",
      vibrasiNdsHorAfter: cells[37] || "",
      vibrasiNdsAxialAfter: cells[38] || "",
      kelengkapanMotor: cells[39] || "",
      inspectionNote: cells[40] || "",
    };
  };
  const dedupeRows = (rows) => {
    const seen = new Set();
    return rows.filter((row) => {
      const key = [row.inspId, row.idAmtrans, row.tgl, row.equptName].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const filterByStartDate = (rows) => {
    const start = new Date(CONFIG.startDate + "T00:00:00");
    return rows.filter((row) => {
      const parsed = parseMsoDate(row.tgl);
      return parsed && parsed >= start;
    });
  };
  const waitForTableRefresh = async (previousFirstKey) => {
    const started = Date.now();
    while (Date.now() - started < 15000) {
      await sleep(250);
      const currentRows = getVisibleRows();
      const currentFirstKey = currentRows.length ? normalizeText(currentRows[0].textContent).slice(0, 160) : "";
      if (currentFirstKey && currentFirstKey !== previousFirstKey) return;
    }
  };
  const resetBuiltInSearch = async () => {
    const searchInput = document.querySelector('#mcircle_filter input[type="search"]');
    if (!searchInput) return;
    if (!String(searchInput.value || "").trim()) return;
    searchInput.value = "";
    ["input", "change", "keyup", "search"].forEach((eventName) => {
      searchInput.dispatchEvent(new Event(eventName, { bubbles: true }));
    });
    await sleep(1800);
  };
  const resetCustomSearch = async () => {
    const customSearchInput = document.getElementById("customSearchInput");
    const countInput = document.getElementById("jumlahCustomSearchInput");
    const customForm = document.getElementById("customfilterform");
    if (customSearchInput) {
      customSearchInput.value = "false";
    }
    if (countInput) {
      countInput.value = "";
    }
    if (customForm instanceof HTMLFormElement) {
      customForm.reset();
    }
    const extraRows = [...document.querySelectorAll("table.order-list tbody tr")];
    extraRows.slice(1).forEach((row) => row.remove());
    if (window.oTable && typeof window.oTable.columns?.adjust === "function") {
      window.oTable.columns.adjust().draw();
      await sleep(2200);
    }
  };
  const buildSummary = (rows, pagesRead) => {
    const parsedDates = rows
      .map((row) => parseMsoDate(row.tgl))
      .filter((value) => value instanceof Date && !Number.isNaN(value.getTime()))
      .sort((left, right) => left.getTime() - right.getTime());
    return {
      pagesRead,
      totalRows: rows.length,
      firstDate: parsedDates.length ? formatDateLabel(parsedDates[0]) : "-",
      lastDate: parsedDates.length ? formatDateLabel(parsedDates[parsedDates.length - 1]) : "-",
    };
  };
  const ensureMotorFilter = async () => {
    const filterSelect = document.getElementById(CONFIG.filterId);
    if (!filterSelect) throw new Error("Filter inspection #filterDb tidak ditemukan.");
    if (filterSelect.value !== "1-1") {
      filterSelect.value = "1-1";
      filterSelect.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(2200);
    }
  };
  const setPageLength = async () => {
    const lengthSelect = document.querySelector(CONFIG.pageLengthSelector);
    if (!lengthSelect) return;
    if (lengthSelect.value !== CONFIG.pageLength) {
      lengthSelect.value = CONFIG.pageLength;
      lengthSelect.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(2200);
    }
  };
  const getNextButton = () => {
    const next = document.querySelector(CONFIG.nextSelector);
    if (!next) return null;
    return next.classList.contains(CONFIG.disabledClass) ? null : next.querySelector("a") || next;
  };
  const sendRowsToPlirm34 = (rows) => new Promise((resolve, reject) => {
    const bridgeWindow = window.open(CONFIG.bridgeUrl, "plirm34-mso-bridge");
    if (!bridgeWindow) {
      reject(new Error("Popup bridge PLIRM34 gagal dibuka. Izinkan popup lalu coba lagi."));
      return;
    }
    let settled = false;
    let sendCount = 0;
    const messagePayload = {
      type: "plirm34-mso-sync",
      sourceName: "MSO Browser Sync " + new Date().toISOString(),
      items: rows,
    };
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(sendTimer);
      window.clearTimeout(timeoutTimer);
    };
    const finish = (callback) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    const onMessage = (event) => {
      if (event.origin !== CONFIG.targetOrigin) return;
      if (!event.data || event.data.type !== "plirm34-mso-sync-result") return;
      if (event.data.ok) {
        finish(() => resolve(event.data));
      } else {
        finish(() => reject(new Error(event.data.error || "Bridge PLIRM34 menolak data sync.")));
      }
    };
    window.addEventListener("message", onMessage);
    const postPayload = () => {
      sendCount += 1;
      bridgeWindow.postMessage(messagePayload, CONFIG.targetOrigin);
      if (sendCount === 1) {
        bridgeWindow.focus();
      }
    };
    const sendTimer = window.setInterval(postPayload, 1000);
    const timeoutTimer = window.setTimeout(() => {
      finish(() => reject(new Error("Bridge PLIRM34 tidak merespons. Pastikan Anda masih login di PLIRM34, lalu coba lagi.")));
    }, 25000);
    postPayload();
  });

  (async () => {
    await resetCustomSearch();
    await resetBuiltInSearch();
    await ensureMotorFilter();
    await setPageLength();
    const collectedRows = [];
    let pageNumber = 1;
    let pagesRead = 0;
    while (pageNumber <= CONFIG.maxPages) {
      const rows = getVisibleRows();
      const firstKey = rows.length ? normalizeText(rows[0].textContent).slice(0, 160) : "";
      const pageRows = rows.map((row) => readRow(row, pageNumber)).filter(Boolean);
      collectedRows.push(...pageRows);
      pagesRead += 1;
      console.log("MSO page", pageNumber, pageRows.length);
      const nextButton = getNextButton();
      if (!nextButton) break;
      nextButton.click();
      await sleep(CONFIG.waitMs);
      await waitForTableRefresh(firstKey);
      pageNumber += 1;
    }
    const filteredRows = filterByStartDate(dedupeRows(collectedRows));
    if (!filteredRows.length) {
      alert("Tidak ada data motor sesuai filter tanggal.");
      return;
    }
    const summary = buildSummary(filteredRows, pagesRead);
    console.log("MSO scrape summary", summary);
    const payload = await sendRowsToPlirm34(filteredRows);
    alert("Sinkron selesai: " + (payload.imported || 0) + " item. Baru: " + (payload.created || 0) + ", update: " + (payload.updated || 0) + ". Halaman terbaca: " + summary.pagesRead + ". Rentang data: " + summary.firstDate + " s/d " + summary.lastDate);
    console.log("PLIRM34 sync payload", payload);
  })().catch((error) => {
    console.error(error);
    alert("Gagal sinkron browser MSO: " + (error.message || error));
  });
})();`;
}

function buildMsoMotorScrapeOnlyScript(startDate) {
  const safeStartDate = String(startDate || "2026-01-01").trim() || "2026-01-01";
  return `(() => {
  const CONFIG = {
    startDate: ${JSON.stringify(safeStartDate)},
    pageLength: "100",
    waitMs: 1400,
    maxPages: 500,
    tableId: "mcircle",
    filterId: "filterDb",
    pageLengthSelector: 'select[name="mcircle_length"]',
    nextSelector: "#mcircle_next",
    disabledClass: "disabled",
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const normalizeText = (value) => String(value || "").replace(/\\s+/g, " ").trim();
  const parseMsoDate = (rawValue) => {
    const raw = normalizeText(rawValue);
    const match = raw.match(/^(\\d{2})\\/(\\d{2})\\/(\\d{4})(?:\\s+(\\d{2}):(\\d{2})(?::(\\d{2}))?)?$/);
    if (!match) return null;
    const [, dd, mm, yyyy, hh = "00", mi = "00", ss = "00"] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const formatDateLabel = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const downloadJson = (filename, payload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const getVisibleRows = () => {
    const table = document.getElementById(CONFIG.tableId);
    if (!table) throw new Error("Tabel #mcircle tidak ditemukan.");
    return [...table.querySelectorAll("tbody tr")];
  };
  const readRow = (row, pageNumber) => {
    const cells = [...row.querySelectorAll("td")].map((cell) => normalizeText(cell.textContent));
    if (!cells.length) return null;
    return {
      page: pageNumber,
      no: cells[0] || "",
      inspId: cells[1] || "",
      idAmtrans: cells[2] || "",
      tgl: cells[3] || "",
      condition: cells[4] || "",
      descr: cells[5] || "",
      photoPath: row.querySelector("td:nth-child(7) a")?.href || "",
      equptName: cells[7] || "",
      equipmentDesc: cells[8] || "",
      creator: cells[9] || "",
      mplant: cells[10] || "",
      temperaturDs: cells[11] || "",
      temperaturNds: cells[12] || "",
      geDsVertBefore: cells[13] || "",
      geDsHorBefore: cells[14] || "",
      geDsAxialBefore: cells[15] || "",
      vibrasiDsVertBefore: cells[16] || "",
      vibrasiDsHorBefore: cells[17] || "",
      vibrasiDsAxialBefore: cells[18] || "",
      geNdsVertBefore: cells[19] || "",
      geNdsHorBefore: cells[20] || "",
      geNdsAxialBefore: cells[21] || "",
      vibrasiNdsVertBefore: cells[22] || "",
      vibrasiNdsHorBefore: cells[23] || "",
      vibrasiNdsAxialBefore: cells[24] || "",
      regreaseDe: cells[25] || "",
      regreaseNde: cells[26] || "",
      geDsVertAfter: cells[27] || "",
      geDsHorAfter: cells[28] || "",
      geDsAxialAfter: cells[29] || "",
      vibrasiDsVertAfter: cells[30] || "",
      vibrasiDsHorAfter: cells[31] || "",
      vibrasiDsAxialAfter: cells[32] || "",
      geNdsVertAfter: cells[33] || "",
      geNdsHorAfter: cells[34] || "",
      geNdsAxialAfter: cells[35] || "",
      vibrasiNdsVertAfter: cells[36] || "",
      vibrasiNdsHorAfter: cells[37] || "",
      vibrasiNdsAxialAfter: cells[38] || "",
      kelengkapanMotor: cells[39] || "",
      inspectionNote: cells[40] || "",
    };
  };
  const dedupeRows = (rows) => {
    const seen = new Set();
    return rows.filter((row) => {
      const key = [row.inspId, row.idAmtrans, row.tgl, row.equptName].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const filterByStartDate = (rows) => {
    const start = new Date(CONFIG.startDate + "T00:00:00");
    return rows.filter((row) => {
      const parsed = parseMsoDate(row.tgl);
      return parsed && parsed >= start;
    });
  };
  const waitForTableRefresh = async (previousFirstKey) => {
    const started = Date.now();
    while (Date.now() - started < 15000) {
      await sleep(250);
      const currentRows = getVisibleRows();
      const currentFirstKey = currentRows.length ? normalizeText(currentRows[0].textContent).slice(0, 160) : "";
      if (currentFirstKey && currentFirstKey !== previousFirstKey) return;
    }
  };
  const resetBuiltInSearch = async () => {
    const searchInput = document.querySelector('#mcircle_filter input[type="search"]');
    if (!searchInput) return;
    if (!String(searchInput.value || "").trim()) return;
    searchInput.value = "";
    ["input", "change", "keyup", "search"].forEach((eventName) => {
      searchInput.dispatchEvent(new Event(eventName, { bubbles: true }));
    });
    await sleep(1800);
  };
  const resetCustomSearch = async () => {
    const customSearchInput = document.getElementById("customSearchInput");
    const countInput = document.getElementById("jumlahCustomSearchInput");
    const customForm = document.getElementById("customfilterform");
    if (customSearchInput) {
      customSearchInput.value = "false";
    }
    if (countInput) {
      countInput.value = "";
    }
    if (customForm instanceof HTMLFormElement) {
      customForm.reset();
    }
    const extraRows = [...document.querySelectorAll("table.order-list tbody tr")];
    extraRows.slice(1).forEach((row) => row.remove());
    if (window.oTable && typeof window.oTable.columns?.adjust === "function") {
      window.oTable.columns.adjust().draw();
      await sleep(2200);
    }
  };
  const buildSummary = (rows, pagesRead) => {
    const parsedDates = rows
      .map((row) => parseMsoDate(row.tgl))
      .filter((value) => value instanceof Date && !Number.isNaN(value.getTime()))
      .sort((left, right) => left.getTime() - right.getTime());
    return {
      pagesRead,
      totalRows: rows.length,
      firstDate: parsedDates.length ? formatDateLabel(parsedDates[0]) : "-",
      lastDate: parsedDates.length ? formatDateLabel(parsedDates[parsedDates.length - 1]) : "-",
    };
  };
  const ensureMotorFilter = async () => {
    const filterSelect = document.getElementById(CONFIG.filterId);
    if (!filterSelect) throw new Error("Filter inspection #filterDb tidak ditemukan.");
    if (filterSelect.value !== "1-1") {
      filterSelect.value = "1-1";
      filterSelect.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(2200);
    }
  };
  const setPageLength = async () => {
    const lengthSelect = document.querySelector(CONFIG.pageLengthSelector);
    if (!lengthSelect) return;
    if (lengthSelect.value !== CONFIG.pageLength) {
      lengthSelect.value = CONFIG.pageLength;
      lengthSelect.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(2200);
    }
  };
  const getNextButton = () => {
    const next = document.querySelector(CONFIG.nextSelector);
    if (!next) return null;
    return next.classList.contains(CONFIG.disabledClass) ? null : next.querySelector("a") || next;
  };
  (async () => {
    await resetCustomSearch();
    await resetBuiltInSearch();
    await ensureMotorFilter();
    await setPageLength();
    const collectedRows = [];
    let pageNumber = 1;
    let pagesRead = 0;
    while (pageNumber <= CONFIG.maxPages) {
      const rows = getVisibleRows();
      const firstKey = rows.length ? normalizeText(rows[0].textContent).slice(0, 160) : "";
      const pageRows = rows.map((row) => readRow(row, pageNumber)).filter(Boolean);
      collectedRows.push(...pageRows);
      pagesRead += 1;
      console.log("MSO page", pageNumber, pageRows.length);
      const nextButton = getNextButton();
      if (!nextButton) break;
      nextButton.click();
      await sleep(CONFIG.waitMs);
      await waitForTableRefresh(firstKey);
      pageNumber += 1;
    }
    const filteredRows = filterByStartDate(dedupeRows(collectedRows));
    if (!filteredRows.length) {
      alert("Tidak ada data motor sesuai filter tanggal.");
      return;
    }
    const summary = buildSummary(filteredRows, pagesRead);
    console.log("MSO scrape summary", summary);
    const filename = "mso-motor-scrape-" + CONFIG.startDate + "-" + new Date().toISOString().replace(/[:.]/g, "-") + ".json";
    downloadJson(filename, {
      sourceName: "MSO Scrape File " + new Date().toISOString(),
      summary,
      items: filteredRows,
    });
    alert("Scrape selesai. File JSON berhasil diunduh: " + filename + ". Halaman terbaca: " + summary.pagesRead + ". Rentang data: " + summary.firstDate + " s/d " + summary.lastDate + ". Total item: " + summary.totalRows);
  })().catch((error) => {
    console.error(error);
    alert("Gagal scrape MSO: " + (error.message || error));
  });
})();`;
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

const msoMotorSyncControls = [
  adminMsoMotorSaveButton,
  adminMsoMotorUploadButton,
  adminMsoMotorUploadImportButton,
  adminMsoMotorImportButton,
  adminMsoMotorResetButton,
  adminMsoMotorCopyScriptButton,
  adminMsoMotorCopyScrapeOnlyButton,
  adminMsoMotorImportJsonButton,
];

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
  msoMotorSyncControls.forEach((control) => {
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
    history: Array.isArray(bootstrap.calendar?.history) ? bootstrap.calendar.history : [],
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
      history: Array.isArray(bootstrap.calendar?.history) ? bootstrap.calendar.history : [],
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
  startDashboardSlideshow();
  renderCarbonBrushMeasurementGrid();
  if (serviceElectricalCarbonBrushForm?.inspectionDate && !serviceElectricalCarbonBrushForm.inspectionDate.value) {
    serviceElectricalCarbonBrushForm.inspectionDate.value = new Date().toISOString().slice(0, 10);
  }
  renderElectricalRoomReferenceOptions();
  renderCemsReferenceOptions();
  renderOpacityReferenceOptions();
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

window.addEventListener("message", async (event) => {
  if (!isMsoBridgeMode || event.origin !== "https://smip.sig.id") {
    return;
  }
  if (!event.data || event.data.type !== "plirm34-mso-sync") {
    return;
  }

  const reply = (payload) => {
    try {
      event.source?.postMessage({ type: "plirm34-mso-sync-result", ...payload }, event.origin);
    } catch (error) {
      console.error("Gagal kirim balasan bridge MSO", error);
    }
  };

  try {
    const items = Array.isArray(event.data.items) ? event.data.items : [];
    const sourceName = String(event.data.sourceName || "MSO Browser Sync").trim() || "MSO Browser Sync";
    if (!items.length) {
      throw new Error("Data scrape MSO kosong.");
    }
    if (!backendState.available) {
      throw new Error("Backend PLIRM34 tidak tersedia.");
    }
    if (!backendState.sessionActive) {
      const restored = await restoreBackendSession();
      if (!restored) {
        throw new Error("Sesi PLIRM34 belum aktif. Login dulu di tab bridge PLIRM34, lalu ulangi sync.");
      }
    }
    const result = await importMsoMotorScrapeItems(items, sourceName);
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    if (activeRole === "admin") {
      await refreshAdminMasters();
    }
    showToast("MSO Motor", `Browser sync selesai: ${result.imported || 0} item.`);
    reply({
      ok: true,
      imported: result.imported || 0,
      created: result.created || 0,
      updated: result.updated || 0,
      sourceName,
    });
  } catch (error) {
    const message = error?.message || "Gagal memproses browser sync MSO.";
    showToast("MSO Motor", message);
    reply({ ok: false, error: message });
  }
});

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
        <button class="table-action danger" data-action="delete-user-role" type="button">Hapus Role</button>
        <button class="table-action danger" data-action="delete-user-account" type="button">Hapus Akun</button>
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
    const identifier = item.id
      ? String(item.id)
      : `${item.sourceGroup || ""}|${item.equipmentCode || ""}|${item.equipmentName || ""}`;
    row.dataset.identifier = identifier;
    row.dataset.sourceGroup = item.sourceGroup || "";
    row.dataset.equipmentCode = item.equipmentCode || "";
    row.dataset.equipmentName = item.equipmentName || "";
    row.dataset.category = item.category || "";
    row.dataset.area = item.area || "";
    row.dataset.plant = item.plant || "";
    row.innerHTML = `
      <td>${escapeHtml(item.sourceGroup || "-")}</td>
      <td>${escapeHtml(item.equipmentCode || "-")}</td>
      <td>${escapeHtml(item.equipmentName || "-")}</td>
      <td>${escapeHtml(item.category || "-")}</td>
      <td>${escapeHtml(item.area || "-")}</td>
      <td>${escapeHtml(item.plant || "-")}</td>
      <td class="action-cell">
        <button class="table-action" data-action="edit-equipment-master" type="button" title="Edit">Edit</button>
        <button class="table-action danger" data-action="delete-equipment-master" type="button" title="Hapus">Hapus</button>
      </td>
    `;
    adminEquipmentBody.append(row);
  });
}

function renderAdminEquipmentSourceFilter(items) {
  if (!filterAdminEquipmentSource) {
    return;
  }
  const currentValue = filterAdminEquipmentSource.value || "semua";
  const sources = [...new Set(
    (Array.isArray(items) ? items : [])
      .map((item) => String(item.sourceGroup || "").trim())
      .filter(Boolean),
  )].sort((left, right) => left.localeCompare(right, "id"));
  filterAdminEquipmentSource.innerHTML = `
    <option value="semua">Semua source</option>
    ${sources.map((source) => `<option value="${escapeHtml(source)}">${escapeHtml(source)}</option>`).join("")}
  `;
  filterAdminEquipmentSource.value = sources.includes(currentValue) ? currentValue : "semua";
}

function applyAdminEquipmentFilter() {
  const items = Array.isArray(backendState.masters.equipmentReferences)
    ? backendState.masters.equipmentReferences
    : [];
  const query = String(searchAdminEquipment?.value || "").trim().toLowerCase();
  const source = String(filterAdminEquipmentSource?.value || "semua");
  const filteredItems = items.filter((item) => {
    const isSourceMatch = source === "semua" || item.sourceGroup === source;
    const searchText = [
      item.sourceGroup,
      item.equipmentCode,
      item.equipmentName,
      item.category,
      item.area,
      item.plant,
    ].join(" ").toLowerCase();
    return isSourceMatch && (!query || searchText.includes(query));
  });
  renderAdminEquipmentTable(filteredItems);
  if (adminEquipmentFilterSummary) {
    adminEquipmentFilterSummary.textContent = `${filteredItems.length} dari ${items.length} equipment`;
  }
}

function normalizeTableSortValue(value) {
  const text = String(value || "").trim();
  if (!text) {
    return { type: "empty", value: "" };
  }

  const parsedDate = Date.parse(text);
  if (/^\d{4}-\d{2}-\d{2}/.test(text) && !Number.isNaN(parsedDate)) {
    return { type: "date", value: parsedDate };
  }

  const numericText = text
    .replace(/\s+/g, "")
    .replace(/^Rp/i, "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const numericValue = Number(numericText);
  if (numericText && !Number.isNaN(numericValue) && /\d/.test(numericText)) {
    return { type: "number", value: numericValue };
  }

  return { type: "text", value: text.toLowerCase() };
}

function sortTableByColumn(table, columnIndex, direction) {
  const tbody = table.tBodies?.[0];
  if (!tbody) {
    return;
  }
  const rows = [...tbody.rows];
  rows.sort((leftRow, rightRow) => {
    const left = normalizeTableSortValue(leftRow.cells[columnIndex]?.textContent || "");
    const right = normalizeTableSortValue(rightRow.cells[columnIndex]?.textContent || "");
    if (left.type === "empty" && right.type !== "empty") return 1;
    if (right.type === "empty" && left.type !== "empty") return -1;
    if (left.type === "number" && right.type === "number") {
      return direction === "asc" ? left.value - right.value : right.value - left.value;
    }
    if (left.type === "date" && right.type === "date") {
      return direction === "asc" ? left.value - right.value : right.value - left.value;
    }
    return direction === "asc"
      ? String(left.value).localeCompare(String(right.value), "id", { numeric: true })
      : String(right.value).localeCompare(String(left.value), "id", { numeric: true });
  });
  tbody.replaceChildren(...rows);
}

function updateSortableHeaderState(table, activeHeader, direction) {
  table.querySelectorAll("th").forEach((header) => {
    header.classList.remove("sort-asc", "sort-desc");
    header.removeAttribute("aria-sort");
  });
  activeHeader.classList.add(direction === "asc" ? "sort-asc" : "sort-desc");
  activeHeader.setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
}

function handleSortableTableHeaderClick(event) {
  const header = event.target instanceof HTMLElement ? event.target.closest("th") : null;
  if (!header || header.dataset.sortDisabled === "true") {
    return;
  }
  const table = header.closest("table");
  const headerRow = header.parentElement;
  if (!table || !headerRow || !table.tBodies?.[0]) {
    return;
  }
  const headerText = String(header.textContent || "").trim().toLowerCase();
  if (!headerText || headerText === "aksi" || headerText === "ubah role") {
    header.dataset.sortDisabled = "true";
    return;
  }
  const columnIndex = [...headerRow.children].indexOf(header);
  if (columnIndex < 0) {
    return;
  }
  const nextDirection = table.dataset.sortColumn === String(columnIndex) && table.dataset.sortDirection === "asc"
    ? "desc"
    : "asc";
  table.dataset.sortColumn = String(columnIndex);
  table.dataset.sortDirection = nextDirection;
  sortTableByColumn(table, columnIndex, nextDirection);
  updateSortableHeaderState(table, header, nextDirection);
}

function resetAdminEquipmentForm() {
  if (!adminEquipmentForm) {
    return;
  }
  adminEquipmentForm.reset();
  adminEquipmentForm.elements.originalIdentifier.value = "";
  const submitButton = adminEquipmentForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = "Simpan Equipment";
  }
}

function fillAdminEquipmentFormFromRow(row) {
  if (!adminEquipmentForm || !row) {
    return;
  }
  adminEquipmentForm.elements.sourceGroup.value = row.dataset.sourceGroup || "negatif-list";
  adminEquipmentForm.elements.equipmentCode.value = row.dataset.equipmentCode || "";
  adminEquipmentForm.elements.equipmentName.value = row.dataset.equipmentName || "";
  adminEquipmentForm.elements.category.value = row.dataset.category || "";
  adminEquipmentForm.elements.area.value = row.dataset.area || "";
  adminEquipmentForm.elements.plant.value = row.dataset.plant || "";
  adminEquipmentForm.elements.originalIdentifier.value = row.dataset.identifier || "";
  const submitButton = adminEquipmentForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = "Update Equipment";
  }
  adminEquipmentForm.scrollIntoView({ behavior: "smooth", block: "center" });
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

function formatBytes(value) {
  const size = Number(value || 0);
  if (!Number.isFinite(size) || size <= 0) {
    return "0 B";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
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
    const [areas, equipmentReferences, templates, appSettings] = await Promise.all([
      fetchAdminMaster("areas"),
      fetchAdminMaster("equipment-references"),
      fetchAdminMaster("inspection-templates"),
      fetchAdminMaster("app-settings"),
    ]);
    backendState.masters.areas = areas;
    backendState.masters.equipmentReferences = equipmentReferences;
    backendState.masters.inspectionTemplates = templates;
    backendState.masters.appSettings = appSettings;
    renderAdminAreasTable(areas);
    renderAdminElectricalRoomTable();
    renderAdminEquipmentSourceFilter(equipmentReferences);
    applyAdminEquipmentFilter();
    renderAdminTemplatesTable(templates);
    hydrateCarbonBrushThresholdForm();
    hydrateElectricalRoomThresholdForm();
    renderMsoMotorSyncSettings();
    renderElectricalRoomReferenceOptions();
    renderMccReferenceOptions();
  } catch (error) {
    console.error("Gagal memuat master admin:", error);
  }
}

function getNegatifItemsFromDom() {
  return [...negatifListBody.querySelectorAll("tr")].map((row) => ({
    id: row.dataset.id,
    equipment: row.children[1].textContent.trim(),
    damageDescription: row.children[2].textContent.trim(),
    followUpPlan: row.children[3].textContent.trim(),
    foundDate: row.children[4].textContent.trim(),
    pendingMark: row.children[5].textContent.trim(),
    workStatus: row.children[6].textContent.trim(),
    category: row.children[7].textContent.trim(),
    area: row.children[8].textContent.trim(),
  }));
}

function getServiceItemsFromDom() {
  if (serviceItemCache.size > 0) {
    return getSortedServiceItems([...serviceItemCache.values()].map((item) => ({
      ...item,
      payload: item.payload || {},
    })));
  }

  const storedItems = readStorage(storageKeys.service);
  if (Array.isArray(storedItems) && storedItems.length > 0) {
    return getSortedServiceItems(storedItems.map((item) => normalizeServiceItem(item)));
  }

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

function shouldDisplayMsoMotorEquipment(equipmentName) {
  return /^3/.test(String(equipmentName || "").trim());
}

function shouldDisplayServiceItem(item) {
  if (!item) {
    return false;
  }
  const isMsoMotorItem = (item.formType === "service-motor-mv" || item.formType === "service-motor-mso")
    && String(item.payload?.source || "").toUpperCase() === "MSO";
  if (!isMsoMotorItem) {
    return true;
  }
  return shouldDisplayMsoMotorEquipment(item.equipmentName);
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
  const serviceItems = getServiceItemsFromDom().filter((item) => shouldDisplayServiceItem(item));
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
        <div class="mobile-card-pill-row">
          <span class="tag tag-neutral">Tanggal: ${item.foundDate || "-"}</span>
          <span class="tag ${getNegatifStatusTagClass(item.workStatus)}">${item.workStatus || "-"}</span>
        </div>
        <div class="mobile-meta">
          <span>Kerusakan: ${item.damageDescription}</span>
          <span>Tindak lanjut: ${item.followUpPlan}</span>
          <span>Mark: ${item.pendingMark || "-"}</span>
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

  if (dashboardMsoWatchlistPreview) {
    const watchlistItems = buildMsoMotorWatchlistSummary(serviceItems);
    dashboardMsoWatchlistPreview.innerHTML = "";
    if (!watchlistItems.length) {
      dashboardMsoWatchlistPreview.innerHTML = `
        <article>
          <strong>Belum ada data Motor MSO</strong>
          <span>Equipment prioritas akan tampil di sini berdasarkan health score, vibrasi, temperatur, dan frekuensi BAD.</span>
          <small>Sinkron dari data service Motor MSO</small>
        </article>
      `;
    }
    watchlistItems.forEach(({
      item,
      snapshot,
      badCount,
      rank,
      priorityLabel,
      priorityClass,
      severity,
      scoreComponent,
      vibrationComponent,
      temperatureComponent,
    }) => {
      const article = document.createElement("article");
      article.className = `dashboard-watchlist-item ${priorityClass}`;
      article.dataset.serviceId = item.id || "";
      article.dataset.openable = "true";
      article.tabIndex = 0;
      article.innerHTML = `
        <div class="dashboard-watchlist-head">
          <span class="dashboard-watchlist-rank">#${rank}</span>
          <span class="dashboard-watchlist-priority ${priorityClass}">${escapeHtml(priorityLabel)}</span>
        </div>
        <strong>${escapeHtml(item.equipmentName || "-")}</strong>
        <span>${escapeHtml(snapshot.grade)} | Score ${snapshot.score} | BAD ${badCount}x</span>
        <span class="dashboard-watchlist-severity">Severity ${severity} = Score ${scoreComponent} + Vib ${vibrationComponent} + Temp ${temperatureComponent}</span>
        <small>Temp max ${escapeHtml(snapshot.maxTemperature || "-")} C | Vib dominan ${escapeHtml(snapshot.dominantVibrationBefore?.label || "-")} ${escapeHtml(snapshot.maxVibrationBefore ?? "-")} | Kanal kritis ${snapshot.vibrationBeforeCriticalCount || 0}</small>
      `;
      dashboardMsoWatchlistPreview.append(article);
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
  renderInspectionScheduleCard(
    dashboardInspectionHistory,
    dashboardInspectionSchedule.history,
    "Belum ada history jadwal inspeksi",
    { showDate: true, limit: 8 },
  );
}

function renderInspectionScheduleCard(container, items, emptyTitle, options = {}) {
  if (!container) {
    return;
  }

  const rows = Array.isArray(items) ? items.slice(0, options.limit || 5) : [];
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
    if (options.showDate && item.date) {
      detailParts.unshift(formatInspectionDate(item.date));
    }
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

function buildDashboardSlideshowImagePath(filename) {
  return `/slideshow-images/${encodeURIComponent(String(filename || "").trim())}`;
}

function renderDashboardSlideshowDots(activeIndex) {
  if (!dashboardSlideshowDots) {
    return;
  }
  dashboardSlideshowDots.innerHTML = DASHBOARD_SLIDESHOW_FILENAMES.map((_, index) => `
    <span class="dashboard-slideshow-dot ${index === activeIndex ? "is-active" : ""}"></span>
  `).join("");
}

function showDashboardSlide(index) {
  if (!dashboardSlideshow || !dashboardSlideshowImage || !DASHBOARD_SLIDESHOW_FILENAMES.length) {
    return;
  }
  const normalizedIndex = ((index % DASHBOARD_SLIDESHOW_FILENAMES.length) + DASHBOARD_SLIDESHOW_FILENAMES.length) % DASHBOARD_SLIDESHOW_FILENAMES.length;
  const filename = DASHBOARD_SLIDESHOW_FILENAMES[normalizedIndex];
  dashboardSlideshowIndex = normalizedIndex;
  dashboardSlideshow.classList.remove("is-ready");
  dashboardSlideshowImage.onload = () => {
    dashboardSlideshow?.classList.add("is-ready");
  };
  dashboardSlideshowImage.onerror = () => {
    dashboardSlideshow?.classList.remove("is-ready");
  };
  dashboardSlideshowImage.src = buildDashboardSlideshowImagePath(filename);
  if (dashboardSlideshowTitle) {
    dashboardSlideshowTitle.textContent = `Dokumentasi unit kerja PLIRM34 • ${normalizedIndex + 1}/${DASHBOARD_SLIDESHOW_FILENAMES.length}`;
  }
  renderDashboardSlideshowDots(normalizedIndex);
}

function startDashboardSlideshow() {
  if (!dashboardSlideshow || !dashboardSlideshowImage || !DASHBOARD_SLIDESHOW_FILENAMES.length) {
    return;
  }
  if (dashboardSlideshowTimer) {
    window.clearInterval(dashboardSlideshowTimer);
  }
  showDashboardSlide(0);
  dashboardSlideshowTimer = window.setInterval(() => {
    showDashboardSlide(dashboardSlideshowIndex + 1);
  }, 5000);
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
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const allItems = getServiceItemsFromDom().filter((item) => shouldDisplayServiceItem(item));
  const filteredItems = allItems.filter((item) => {
    const searchableText = [
      item.equipmentName || "",
      item.type || "",
      item.subtype || "",
      item.description || "",
      item.detail || "",
    ].join(" ").toLowerCase();
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesType = type === "semua" || item.type === type;
    return matchesQuery && matchesType;
  });
  const isFiltered = Boolean(normalizedQuery) || type !== "semua";

  renderServiceBoard(filteredItems, {
    syncCache: false,
    previewLimit: isFiltered ? Number.MAX_SAFE_INTEGER : 5,
  });
  serviceCardList.classList.toggle("single-focus", (type !== "semua") || (isFiltered && [...new Set(filteredItems.map((item) => item.type))].length <= 1));
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

function escapeExcelCell(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadExcel(filename, headers, rows, sheetTitle = "PLIRM34 Export") {
  const tableHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; }
          th { background: #ff6a00; color: #ffffff; font-weight: bold; }
          th, td { border: 1px solid #999999; padding: 6px 8px; vertical-align: top; mso-number-format:"\\@"; }
          caption { font-size: 14pt; font-weight: bold; margin-bottom: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <table>
          <caption>${escapeExcelCell(sheetTitle)}</caption>
          <thead><tr>${headers.map((header) => `<th>${escapeExcelCell(header)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeExcelCell(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.replace(/\.csv$/i, ".xls");
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

function normalizeCemsStatusValue(value) {
  return String(value || "").trim().toUpperCase() === "NG" ? "NG" : "OK";
}

function buildCemsDetailSummary(payload = {}) {
  const abnormalParameters = [
    payload.o2Status,
    payload.coStatus,
    payload.noxStatus,
    payload.so2Status,
    payload.dustStatus,
    payload.flowStatus,
    payload.temperatureStatus,
    payload.pressureStatus,
  ].filter((value) => normalizeCemsStatusValue(value) === "NG").length;

  const abnormalChecks = [
    payload.analyzerPower,
    payload.analyzerStatus,
    payload.analyzerAlarm,
    payload.analyzerResponseTime,
    payload.analyzerSpanDrift,
    payload.analyzerZeroDrift,
    payload.samplingProbe,
    payload.samplingFilter,
    payload.samplingHeatedLine,
    payload.samplingPump,
    payload.samplingFlow,
    payload.calibrationCylinder,
    payload.calibrationPressure,
    payload.calibrationRegulator,
    payload.calibrationAuto,
    payload.calibrationSchedule,
    payload.dataDasScada,
    payload.dataLogger,
    payload.dataLoss,
    payload.timeSync,
    payload.supportPowerSupply,
    payload.supportUps,
    payload.supportAcPanel,
    payload.supportShelter,
  ].filter((value) => normalizeCemsStatusValue(value) === "NG").length;

  return `Parameter NG: ${abnormalParameters} | Checklist NG: ${abnormalChecks} | Urgensi: ${payload.urgencyLevel || "-"}`;
}

function normalizeOpacityStatusValue(value) {
  return String(value || "").trim().toUpperCase() === "NG" ? "NG" : "OK";
}

function buildOpacityDetailSummary(payload = {}) {
  const parameterNg = [
    payload.opacityStatus,
    payload.transmittanceStatus,
    payload.alarmStatusCondition,
  ].filter((value) => normalizeOpacityStatusValue(value) === "NG").length;

  const checklistNg = [
    payload.visualHousingClean,
    payload.visualMounting,
    payload.visualAlignment,
    payload.visualVibration,
    payload.visualCondensation,
    payload.opticLens,
    payload.opticReflector,
    payload.opticDeposit,
    payload.opticSignal,
    payload.opticLightIntensity,
    payload.purgeActive,
    payload.purgePressure,
    payload.purgeFlow,
    payload.purgeFilter,
    payload.electricalPowerSupply,
    payload.electricalOutput,
    payload.electricalCable,
    payload.electricalNoise,
    payload.zeroCheckStatus,
    payload.spanCheckStatus,
    payload.driftStatus,
  ].filter((value) => normalizeOpacityStatusValue(value) === "NG").length;

  return `Parameter NG: ${parameterNg} | Checklist NG: ${checklistNg} | Shift: ${payload.shift || "-"}`;
}

function getNegatifStatusTagClass(value) {
  return String(value || "").toLowerCase() === "close" ? "tag-neutral" : "tag-danger";
}

function getNegatifMarkTagClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("material")) return "tag-warning";
  if (normalized.includes("rawmill")) return "tag-blue";
  if (normalized.includes("ovh")) return "tag-purple";
  return "tag-neutral";
}

function getNegatifCategoryTagClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "electrical") return "tag-blue";
  if (normalized === "instrument") return "tag-success";
  if (normalized === "dcs") return "tag-purple";
  return "tag-neutral";
}

function getNegatifAreaTagClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("34")) return "tag-purple";
  if (normalized.includes("4")) return "tag-success";
  if (normalized.includes("3")) return "tag-blue";
  return "tag-neutral";
}

function renderNegatifRow(item) {
  const row = document.createElement("tr");
  row.dataset.id = item.id;
  row.innerHTML = `
    <td class="action-cell">
      <button class="table-action icon-action" data-action="edit-negatif" type="button" title="Edit" aria-label="Edit">&#9998;</button>
      <button class="table-action danger icon-action" data-action="delete-negatif" type="button" title="Hapus" aria-label="Hapus">&#128465;</button>
    </td>
    <td>
      <div class="negative-cell-main">
        <strong>${escapeHtml(item.equipment || "-")}</strong>
      </div>
    </td>
    <td>
      <div class="negative-text-clamp" title="${escapeHtml(item.damageDescription || "-")}">${escapeHtml(item.damageDescription || "-")}</div>
    </td>
    <td>
      <div class="negative-text-clamp" title="${escapeHtml(item.followUpPlan || "-")}">${escapeHtml(item.followUpPlan || "-")}</div>
    </td>
    <td><span class="negative-date-pill">${escapeHtml(item.foundDate || "-")}</span></td>
    <td><span class="tag ${getNegatifMarkTagClass(item.pendingMark)}">${escapeHtml(item.pendingMark || "-")}</span></td>
    <td><span class="tag ${getNegatifStatusTagClass(item.workStatus)}">${escapeHtml(item.workStatus || "-")}</span></td>
    <td><span class="tag ${getNegatifCategoryTagClass(item.category)}">${escapeHtml(item.category || "-")}</span></td>
    <td><span class="tag ${getNegatifAreaTagClass(item.area)}">${escapeHtml(item.area || "-")}</span></td>
  `;
  return row;
}

function renderServiceCard(item) {
  serviceItemCache.set(item.id, {
    ...item,
    payload: item.payload || {},
  });
  const isMsoMotorItem = (item.formType === "service-motor-mv" || item.formType === "service-motor-mso") && String(item.payload?.source || "").toUpperCase() === "MSO";
  const canDeleteService = activeRole !== "team";
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
  const msoMaxVibration = isMsoMotorItem
    ? [
      item.payload?.vibrasiDsVertBefore,
      item.payload?.vibrasiDsHorBefore,
      item.payload?.vibrasiDsAxialBefore,
      item.payload?.vibrasiNdsVertBefore,
      item.payload?.vibrasiNdsHorBefore,
      item.payload?.vibrasiNdsAxialBefore,
    ]
      .map((value) => Number.parseFloat(String(value || "").replace(",", ".")))
      .filter((value) => Number.isFinite(value))
      .sort((left, right) => right - left)[0]
    : null;
  const summaryText = item.formType === "service-motor-mv-carbon-brush"
    ? `Merah ${carbonBrushStatsPayload?.low || 0} | Kuning ${carbonBrushStatsPayload?.medium || 0} | Hijau ${carbonBrushStatsPayload?.high || 0}`
    : (isMsoMotorItem
      ? `Condition ${item.payload?.condition || "-"} | Temp DS ${item.payload?.temperaturDs || "-"} | Temp NDS ${item.payload?.temperaturNds || "-"} | Vib max ${msoMaxVibration ?? "-"}`
      : (item.detail || "-"));

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
      ${isMsoMotorItem ? '<span class="table-action compact muted-action" title="Data sinkron dari MSO">MSO</span>' : '<button class="table-action compact" data-action="edit-service" type="button">Edit</button>'}
      ${canDeleteService && !isMsoMotorItem ? '<button class="table-action compact danger" data-action="delete-service" type="button">Hapus</button>' : ""}
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

function renderServiceBoard(items, options = {}) {
  if (!serviceCardList) {
    return;
  }
  const previewLimit = Number.isFinite(options.previewLimit) ? options.previewLimit : 5;
  const syncCache = options.syncCache !== false;

  const groups = [
    {
      key: "Electrical",
      title: "Electrical",
      sections: [
        { key: "service-electrical-room", title: "Electrical Room" },
        { key: "service-motor-mso", title: "Service Motor MSO" },
        { key: "service-motor-mv-carbon-brush", title: "Motor MV (Carbon Brush)" },
        { key: "service-mcc", title: "MCC" },
        { key: "service-ehca", title: "EH/CA" },
      ],
    },
    { key: "Instrument", title: "Instrument" },
    { key: "DCS", title: "DCS" },
  ];

  serviceCardList.innerHTML = "";
  if (syncCache) {
    serviceItemCache.clear();
    items.forEach((item) => {
      if (!item?.id) {
        return;
      }
      serviceItemCache.set(item.id, {
        ...item,
        payload: item.payload || {},
      });
    });
  }

  const visibleItems = items.filter((item) => shouldDisplayServiceItem(item));

  groups.forEach((group) => {
    const column = document.createElement("section");
    column.className = "service-column";
    column.dataset.serviceGroup = group.key;
    const groupItems = visibleItems.filter((item) => item.type === group.key);
    const previewGroupItems = getSortedServiceItems(groupItems).slice(0, previewLimit);
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
        const previewSectionItems = getSortedServiceItems(sectionItems).slice(0, previewLimit);
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
    <td class="action-cell">
      <button class="table-action icon-action" data-action="edit-spb" type="button" title="Edit" aria-label="Edit">&#9998;</button>
      <button class="table-action danger icon-action" data-action="delete-spb" type="button" title="Hapus" aria-label="Hapus">&#128465;</button>
    </td>
    <td><span class="tag tag-neutral">${escapeHtml(normalizedItem.year || "-")}</span></td>
    <td><span class="tag tag-neutral">${escapeHtml(normalizedItem.quarter || "-")}</span></td>
    <td><span class="tag tag-blue">${escapeHtml(normalizedItem.spbType || "-")}</span></td>
    <td>${escapeHtml(normalizedItem.notificationNo || "-")}</td>
    <td><strong class="spb-code-cell">${escapeHtml(normalizedItem.orderNo || "-")}</strong></td>
    <td>${escapeHtml(normalizedItem.reservationNo || "-")}</td>
    <td><strong class="spb-code-cell">${escapeHtml(normalizedItem.stockNo || "-")}</strong></td>
    <td><div class="spb-text-clamp" title="${escapeHtml(normalizedItem.materialDescription || "-")}">${escapeHtml(normalizedItem.materialDescription || "-")}</div></td>
    <td><span class="spb-number-pill">${escapeHtml(normalizedItem.qty || "-")}</span></td>
    <td><span class="tag tag-neutral">${escapeHtml(normalizedItem.mrp || "-")}</span></td>
    <td><span class="spb-amount-pill">${escapeHtml(formatSpbAmount(normalizedItem.totalEce))}</span></td>
    <td><span class="tag ${getSpbStatusTag(normalizedItem.note)}">${escapeHtml(normalizedItem.note || "-")}</span></td>
    <td>${escapeHtml(normalizedItem.prNo || "-")}</td>
    <td>${escapeHtml(normalizedItem.poNo || "-")}</td>
    <td><span class="spb-date-pill">${escapeHtml(normalizedItem.deliveryDate || "-")}</span></td>
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
    year: row.children[1].textContent.trim(),
    quarter: row.children[2].textContent.trim(),
    spbType: row.children[3].textContent.trim(),
    notificationNo: row.children[4].textContent.trim(),
    orderNo: row.children[5].textContent.trim(),
    reservationNo: row.children[6].textContent.trim(),
    stockNo: row.children[7].textContent.trim(),
    materialDescription: row.children[8].textContent.trim(),
    qty: row.children[9].textContent.trim(),
    mrp: row.children[10].textContent.trim(),
    totalEce: row.children[11].textContent.trim(),
    note: row.children[12].textContent.trim(),
    prNo: row.children[13].textContent.trim(),
    poNo: row.children[14].textContent.trim(),
    deliveryDate: row.children[15].textContent.trim(),
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
    if (item.formType === "service-motor-mv" || item.formType === "service-motor-mso") {
      openElectricalPane("motor-mso");
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
    if (item.formType === "service-cems") {
      openInstrumentPane("cems");
    } else if (item.formType === "service-opacity-meter") {
      openInstrumentPane("opacity");
    } else {
      openInstrumentPane("instrument-basic");
    }
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

  if (item.formType === "service-motor-mv" || item.formType === "service-motor-mso") {
    form.vibrationDe.value = payload.vibrationDe || "";
    form.vibrationNde.value = payload.vibrationNde || "";
    form.windingTemperature.value = payload.windingTemperature || "";
    form.bearingCondition.value = payload.bearingCondition || "";
    form.motorCurrent.value = payload.motorCurrent || "";
  }

  if (item.formType === "service-motor-mv-carbon-brush") {
    selectedCarbonBrushEquipmentReference = item.equipmentName || "";
    form.inspectionDate.value = String(payload.inspectionDate || "").slice(0, 10);
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

  if (item.formType === "service-cems") {
    form.inspectionDate.value = String(payload.inspectionDate || "").slice(0, 10);
    form.inspectorName.value = payload.inspectorName || "";
    form.o2Status.value = normalizeCemsStatusValue(payload.o2Status || "OK");
    form.o2Value.value = payload.o2Value || "";
    form.o2Unit.value = payload.o2Unit || "%";
    form.o2Note.value = payload.o2Note || "";
    form.coStatus.value = normalizeCemsStatusValue(payload.coStatus || "OK");
    form.coValue.value = payload.coValue || "";
    form.coUnit.value = payload.coUnit || "mg/Nm3";
    form.coNote.value = payload.coNote || "";
    form.noxStatus.value = normalizeCemsStatusValue(payload.noxStatus || "OK");
    form.noxValue.value = payload.noxValue || "";
    form.noxUnit.value = payload.noxUnit || "mg/Nm3";
    form.noxNote.value = payload.noxNote || "";
    form.so2Status.value = normalizeCemsStatusValue(payload.so2Status || "OK");
    form.so2Value.value = payload.so2Value || "";
    form.so2Unit.value = payload.so2Unit || "mg/Nm3";
    form.so2Note.value = payload.so2Note || "";
    form.dustStatus.value = normalizeCemsStatusValue(payload.dustStatus || "OK");
    form.dustValue.value = payload.dustValue || "";
    form.dustUnit.value = payload.dustUnit || "mg/Nm3";
    form.dustNote.value = payload.dustNote || "";
    form.flowStatus.value = normalizeCemsStatusValue(payload.flowStatus || "OK");
    form.flowValue.value = payload.flowValue || "";
    form.flowUnit.value = payload.flowUnit || "Nm3/h";
    form.flowNote.value = payload.flowNote || "";
    form.temperatureStatus.value = normalizeCemsStatusValue(payload.temperatureStatus || "OK");
    form.temperatureValue.value = payload.temperatureValue || "";
    form.temperatureUnit.value = payload.temperatureUnit || "C";
    form.temperatureNote.value = payload.temperatureNote || "";
    form.pressureStatus.value = normalizeCemsStatusValue(payload.pressureStatus || "OK");
    form.pressureValue.value = payload.pressureValue || "";
    form.pressureUnit.value = payload.pressureUnit || "kPa";
    form.pressureNote.value = payload.pressureNote || "";
    form.analyzerPower.value = normalizeCemsStatusValue(payload.analyzerPower || "OK");
    form.analyzerStatus.value = normalizeCemsStatusValue(payload.analyzerStatus || "OK");
    form.analyzerAlarm.value = normalizeCemsStatusValue(payload.analyzerAlarm || "OK");
    form.analyzerResponseTime.value = normalizeCemsStatusValue(payload.analyzerResponseTime || "OK");
    form.analyzerSpanDrift.value = normalizeCemsStatusValue(payload.analyzerSpanDrift || "OK");
    form.analyzerZeroDrift.value = normalizeCemsStatusValue(payload.analyzerZeroDrift || "OK");
    form.analyzerNote.value = payload.analyzerNote || "";
    form.samplingProbe.value = normalizeCemsStatusValue(payload.samplingProbe || "OK");
    form.samplingFilter.value = normalizeCemsStatusValue(payload.samplingFilter || "OK");
    form.samplingHeatedLine.value = normalizeCemsStatusValue(payload.samplingHeatedLine || "OK");
    form.samplingPump.value = normalizeCemsStatusValue(payload.samplingPump || "OK");
    form.samplingFlow.value = normalizeCemsStatusValue(payload.samplingFlow || "OK");
    form.samplingNote.value = payload.samplingNote || "";
    form.calibrationCylinder.value = normalizeCemsStatusValue(payload.calibrationCylinder || "OK");
    form.calibrationPressure.value = normalizeCemsStatusValue(payload.calibrationPressure || "OK");
    form.calibrationRegulator.value = normalizeCemsStatusValue(payload.calibrationRegulator || "OK");
    form.calibrationAuto.value = normalizeCemsStatusValue(payload.calibrationAuto || "OK");
    form.calibrationSchedule.value = normalizeCemsStatusValue(payload.calibrationSchedule || "OK");
    form.calibrationNote.value = payload.calibrationNote || "";
    form.dataDasScada.value = normalizeCemsStatusValue(payload.dataDasScada || "OK");
    form.dataLogger.value = normalizeCemsStatusValue(payload.dataLogger || "OK");
    form.dataLoss.value = normalizeCemsStatusValue(payload.dataLoss || "OK");
    form.timeSync.value = normalizeCemsStatusValue(payload.timeSync || "OK");
    form.dataCommunicationNote.value = payload.dataCommunicationNote || "";
    form.supportPowerSupply.value = normalizeCemsStatusValue(payload.supportPowerSupply || "OK");
    form.supportUps.value = normalizeCemsStatusValue(payload.supportUps || "OK");
    form.supportAcPanel.value = normalizeCemsStatusValue(payload.supportAcPanel || "OK");
    form.supportShelter.value = normalizeCemsStatusValue(payload.supportShelter || "OK");
    form.supportNote.value = payload.supportNote || "";
    form.findingIssue.value = payload.findingIssue || "";
    form.possibleCause.value = payload.possibleCause || "";
    form.emissionImpact.value = payload.emissionImpact || "";
    form.urgencyLevel.value = payload.urgencyLevel || "Low";
  }

  if (item.formType === "service-opacity-meter") {
    form.inspectionDate.value = String(payload.inspectionDate || "").slice(0, 10);
    form.inspectionTime.value = payload.inspectionTime || "";
    form.brandModel.value = payload.brandModel || "";
    form.technicianName.value = payload.technicianName || "";
    form.shift.value = payload.shift || "";
    form.opacityValue.value = payload.opacityValue || "";
    form.opacityUnit.value = payload.opacityUnit || "%";
    form.opacityLimit.value = payload.opacityLimit || "";
    form.opacityStatus.value = normalizeOpacityStatusValue(payload.opacityStatus || "OK");
    form.transmittanceValue.value = payload.transmittanceValue || "";
    form.transmittanceUnit.value = payload.transmittanceUnit || "%";
    form.transmittanceLimit.value = payload.transmittanceLimit || "";
    form.transmittanceStatus.value = normalizeOpacityStatusValue(payload.transmittanceStatus || "OK");
    form.alarmStatusValue.value = payload.alarmStatusValue || "";
    form.alarmStatusUnit.value = payload.alarmStatusUnit || "-";
    form.alarmStatusLimit.value = payload.alarmStatusLimit || "";
    form.alarmStatusCondition.value = normalizeOpacityStatusValue(payload.alarmStatusCondition || "OK");
    form.visualHousingClean.value = normalizeOpacityStatusValue(payload.visualHousingClean || "OK");
    form.visualMounting.value = normalizeOpacityStatusValue(payload.visualMounting || "OK");
    form.visualAlignment.value = normalizeOpacityStatusValue(payload.visualAlignment || "OK");
    form.visualVibration.value = normalizeOpacityStatusValue(payload.visualVibration || "OK");
    form.visualCondensation.value = normalizeOpacityStatusValue(payload.visualCondensation || "OK");
    form.visualNote.value = payload.visualNote || "";
    form.opticLens.value = normalizeOpacityStatusValue(payload.opticLens || "OK");
    form.opticReflector.value = normalizeOpacityStatusValue(payload.opticReflector || "OK");
    form.opticDeposit.value = normalizeOpacityStatusValue(payload.opticDeposit || "OK");
    form.opticSignal.value = normalizeOpacityStatusValue(payload.opticSignal || "OK");
    form.opticLightIntensity.value = normalizeOpacityStatusValue(payload.opticLightIntensity || "OK");
    form.opticNote.value = payload.opticNote || "";
    form.purgeActive.value = normalizeOpacityStatusValue(payload.purgeActive || "OK");
    form.purgePressure.value = normalizeOpacityStatusValue(payload.purgePressure || "OK");
    form.purgeFlow.value = normalizeOpacityStatusValue(payload.purgeFlow || "OK");
    form.purgeFilter.value = normalizeOpacityStatusValue(payload.purgeFilter || "OK");
    form.purgeNote.value = payload.purgeNote || "";
    form.electricalPowerSupply.value = normalizeOpacityStatusValue(payload.electricalPowerSupply || "OK");
    form.electricalOutput.value = normalizeOpacityStatusValue(payload.electricalOutput || "OK");
    form.electricalCable.value = normalizeOpacityStatusValue(payload.electricalCable || "OK");
    form.electricalNoise.value = normalizeOpacityStatusValue(payload.electricalNoise || "OK");
    form.electricalNote.value = payload.electricalNote || "";
    form.zeroCheckValue.value = payload.zeroCheckValue || "";
    form.zeroCheckStatus.value = normalizeOpacityStatusValue(payload.zeroCheckStatus || "OK");
    form.zeroCheckNote.value = payload.zeroCheckNote || "";
    form.spanCheckValue.value = payload.spanCheckValue || "";
    form.spanCheckStatus.value = normalizeOpacityStatusValue(payload.spanCheckStatus || "OK");
    form.spanCheckNote.value = payload.spanCheckNote || "";
    form.driftValue.value = payload.driftValue || "";
    form.driftStatus.value = normalizeOpacityStatusValue(payload.driftStatus || "OK");
    form.driftNote.value = payload.driftNote || "";
    form.findingIssue.value = payload.findingIssue || "";
    form.possibleCause.value = payload.possibleCause || "";
    form.readingImpact.value = payload.readingImpact || "";
    form.recommendationCleaning.checked = Boolean(payload.recommendationCleaning);
    form.recommendationRealignment.checked = Boolean(payload.recommendationRealignment);
    form.recommendationCalibration.checked = Boolean(payload.recommendationCalibration);
    form.recommendationSparePart.checked = Boolean(payload.recommendationSparePart);
    form.recommendationOther.value = payload.recommendationOther || "";
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
  if (!(target instanceof HTMLElement) || !["save-user-role", "delete-user-role", "delete-user-account"].includes(target.dataset.action || "")) {
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

  if (target.dataset.action === "delete-user-account") {
    if (!confirmDeleteAction(`akun ${username}`)) {
      return;
    }
    if (backendState.available) {
      try {
        const result = await apiRequest(`/users/${encodeURIComponent(username)}`, { method: "DELETE" });
        cacheUsers(result.users);
        renderUserManagementTable();
        const session = readStorage(storageKeys.session);
        if (session && !Array.isArray(session) && session.username === username) {
          await performLogout("Akun aktif sudah dihapus. Silakan login ulang dengan akun lain.");
          return;
        }
        showToast("Manajemen User", `Akun ${username} berhasil dihapus.`);
      } catch (error) {
        showToast("Manajemen User", error.message || "Gagal menghapus akun user.");
      }
      return;
    }

    const users = getStoredUsers().filter((user) => user.username !== username);
    writeStorage(storageKeys.users, users);
    renderUserManagementTable();
    const session = readStorage(storageKeys.session);
    if (session && !Array.isArray(session) && session.username === username) {
      await performLogout("Akun aktif sudah dihapus. Silakan login ulang dengan akun lain.");
      return;
    }
    showToast("Manajemen User", `Akun ${username} berhasil dihapus.`);
    return;
  }

  const isDeleteRole = target.dataset.action === "delete-user-role";
  const nextRole = isDeleteRole ? "team" : roleSelect.value;
  if (isDeleteRole && !confirmDeleteAction(`role user ${username}; role akan kembali ke Team`)) {
    return;
  }

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

      showToast("Manajemen User", isDeleteRole
        ? `Role ${username} berhasil dihapus. User kembali menjadi Team.`
        : `Role ${username} berhasil diubah menjadi ${roleLabels[nextRole]}.`);
    } catch (error) {
      showToast("Manajemen User", error.message || (isDeleteRole ? "Gagal menghapus role user." : "Gagal mengubah role user."));
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

  showToast("Manajemen User", isDeleteRole
    ? `Role ${username} berhasil dihapus. User kembali menjadi Team.`
    : `Role ${username} berhasil diubah menjadi ${roleLabels[nextRole]}.`);
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

adminMsoMotorSaveButton?.addEventListener("click", async () => {
  const currentSettings = getAppSetting("mso_motor_sync") || {};
  const directory = String(adminMsoMotorDirectory?.value || "").trim();
  const pattern = String(adminMsoMotorPattern?.value || "").trim();
  if (!directory || !pattern) {
    showToast("MSO Motor", "Folder server dan pattern file wajib diisi.");
    return;
  }
  try {
    await saveAdminMaster("app-settings", {
      settingKey: "mso_motor_sync",
      value: {
        ...currentSettings,
        directory,
        pattern,
      },
    });
    await refreshAdminMasters();
    showToast("MSO Motor", "Setting sinkronisasi MSO motor berhasil disimpan.");
  } catch (error) {
    showToast("MSO Motor", error.message || "Gagal menyimpan setting sinkronisasi MSO motor.");
  }
});

adminMsoMotorImportButton?.addEventListener("click", async () => {
  try {
    const result = await importLatestMsoMotorFile();
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    if (activeRole === "admin") {
      await refreshAdminMasters();
    }
    showToast(
      "MSO Motor",
      `Import selesai: ${result.imported || 0} item dari ${result.fileName || "file terbaru"} (${result.created || 0} baru, ${result.updated || 0} update).`,
    );
  } catch (error) {
    showToast("MSO Motor", error.message || "Gagal import file MSO motor terbaru.");
  }
});

adminMsoMotorUploadButton?.addEventListener("click", async () => {
  const file = adminMsoMotorUploadInput?.files?.[0];
  if (!file) {
    showToast("MSO Motor", "Pilih file CSV MSO terlebih dahulu.");
    return;
  }
  try {
    const result = await uploadMsoMotorCsvFile(file);
    if (activeRole === "admin") {
      await refreshAdminMasters();
    }
    if (adminMsoMotorUploadInput) {
      adminMsoMotorUploadInput.value = "";
    }
    showToast("MSO Motor", `Upload berhasil: ${result.fileName || file.name} disimpan ke server.`);
  } catch (error) {
    showToast("MSO Motor", error.message || "Gagal upload CSV MSO motor.");
  }
});

adminMsoMotorUploadImportButton?.addEventListener("click", async () => {
  const file = adminMsoMotorUploadInput?.files?.[0];
  if (!file) {
    showToast("MSO Motor", "Pilih file CSV MSO terlebih dahulu.");
    return;
  }
  try {
    const uploadResult = await uploadMsoMotorCsvFile(file);
    const importResult = await importLatestMsoMotorFile();
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    if (activeRole === "admin") {
      await refreshAdminMasters();
    }
    if (adminMsoMotorUploadInput) {
      adminMsoMotorUploadInput.value = "";
    }
    showToast(
      "MSO Motor",
      `Upload + import selesai: ${importResult.imported || 0} item dari ${importResult.fileName || uploadResult.fileName || file.name}.`,
    );
  } catch (error) {
    showToast("MSO Motor", error.message || "Gagal upload dan import CSV MSO motor.");
  }
});

adminMsoMotorCopyScriptButton?.addEventListener("click", async () => {
  const startDate = String(adminMsoMotorStartDate?.value || "2026-01-01").trim() || "2026-01-01";
  const scriptText = buildMsoMotorBrowserSyncScript(startDate);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(scriptText);
    } else {
      const temp = document.createElement("textarea");
      temp.value = scriptText;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }
    showToast("MSO Motor", `Script browser sync berhasil disalin. Buka MSO, paste di Console, mulai dari ${startDate}.`);
  } catch (error) {
    showToast("MSO Motor", error.message || "Gagal menyalin script browser sync.");
  }
});

adminMsoMotorCopyScrapeOnlyButton?.addEventListener("click", async () => {
  const startDate = String(adminMsoMotorStartDate?.value || "2026-01-01").trim() || "2026-01-01";
  const scriptText = buildMsoMotorScrapeOnlyScript(startDate);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(scriptText);
    } else {
      const temp = document.createElement("textarea");
      temp.value = scriptText;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }
    showToast("MSO Motor", `Script scrape-only berhasil disalin. Jalankan di MSO lalu upload JSON hasilnya ke PLIRM34.`);
  } catch (error) {
    showToast("MSO Motor", error.message || "Gagal menyalin script scrape-only.");
  }
});

adminMsoMotorImportJsonButton?.addEventListener("click", async () => {
  const file = adminMsoMotorJsonInput?.files?.[0];
  if (!file) {
    showToast("MSO Motor", "Pilih file JSON hasil scrape terlebih dahulu.");
    return;
  }
  try {
    showMsoMotorProgress("Membaca file JSON MSO...", `${file.name} | ${formatBytes(file.size || 0)}`);
    const text = await file.text();
    updateMsoMotorProgress("Memvalidasi isi JSON...", `Ukuran file ${formatBytes(file.size || 0)}.`);
    const payload = JSON.parse(text);
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const sourceName = String(payload?.sourceName || file.name).trim() || file.name;
    if (!items.length) {
      throw new Error("File JSON tidak berisi item scrape MSO.");
    }
    updateMsoMotorProgress("Mengirim data ke server...", `${items.length.toLocaleString("id-ID")} item siap diimport dari ${sourceName}.`);
    const result = await importMsoMotorScrapeItems(items, sourceName);
    updateMsoMotorProgress("Menyegarkan data aplikasi...", `Server sudah memproses ${result.imported || items.length} item. Memuat ulang data terbaru...`);
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    if (activeRole === "admin") {
      updateMsoMotorProgress("Menyelesaikan sinkronisasi MSO...", "Memperbarui master admin dan status sinkron terbaru...");
      await refreshAdminMasters();
    }
    if (adminMsoMotorJsonInput) {
      adminMsoMotorJsonInput.value = "";
    }
    finishMsoMotorProgress(
      "Import JSON MSO selesai.",
      `${result.imported || 0} item diproses | ${result.created || 0} baru | ${result.updated || 0} update.`,
      "success",
    );
    showToast("MSO Motor", `Import JSON selesai: ${result.imported || 0} item (${result.created || 0} baru, ${result.updated || 0} update).`);
  } catch (error) {
    finishMsoMotorProgress("Import JSON MSO gagal.", error.message || "Terjadi kesalahan saat memproses file JSON hasil scrape.", "error");
    showToast("MSO Motor", error.message || "Gagal import JSON hasil scrape.");
  }
});

adminMsoMotorResetButton?.addEventListener("click", async () => {
  const isConfirmed = window.confirm("Reset semua data Motor MSO? Tindakan ini akan menghapus seluruh hasil import/sinkron Motor MSO dari aplikasi.");
  if (!isConfirmed) {
    return;
  }
  try {
    showMsoMotorProgress("Menghapus seluruh data Motor MSO...", "Backend sedang membersihkan data hasil sinkron Motor MSO.");
    const result = await resetMsoMotorItems();
    updateMsoMotorProgress("Menyegarkan data aplikasi...", `Sebanyak ${result.deleted || 0} item Motor MSO dihapus. Memuat ulang data terbaru...`);
    await hydrateFromBackendAfterLogin();
    updateDashboardMetrics();
    if (activeRole === "admin") {
      updateMsoMotorProgress("Menyelesaikan reset Motor MSO...", "Memperbarui master admin dan status sinkron terbaru...");
      await refreshAdminMasters();
    }
    finishMsoMotorProgress("Reset data Motor MSO selesai.", `${result.deleted || 0} item berhasil dihapus.`, "success");
    showToast("MSO Motor", `Reset data Motor MSO selesai: ${result.deleted || 0} item dihapus.`);
  } catch (error) {
    finishMsoMotorProgress("Reset data Motor MSO gagal.", error.message || "Terjadi kesalahan saat menghapus data Motor MSO.", "error");
    showToast("MSO Motor", error.message || "Gagal reset data Motor MSO.");
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
  const originalIdentifier = String(formData.get("originalIdentifier") || "").trim();
  const nextIdentifier = [
    String(formData.get("sourceGroup") || "").trim(),
    String(formData.get("equipmentCode") || "").trim() || String(formData.get("equipmentName") || "").trim().split(" ")[0],
    String(formData.get("equipmentName") || "").trim(),
  ].join("|");
  try {
    if (originalIdentifier && originalIdentifier !== nextIdentifier) {
      await deleteAdminMaster("equipment-references", originalIdentifier);
    }
    await saveAdminMaster("equipment-references", {
      sourceGroup: String(formData.get("sourceGroup") || "").trim(),
      equipmentCode: String(formData.get("equipmentCode") || "").trim(),
      equipmentName: String(formData.get("equipmentName") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      area: String(formData.get("area") || "").trim(),
      plant: String(formData.get("plant") || "").trim(),
    });
    resetAdminEquipmentForm();
    await refreshAdminMasters();
    await Promise.allSettled([
      loadEquipmentReference(),
      loadCarbonBrushEquipmentReference(),
      loadDcsEquipmentReference({ force: true }),
    ]);
    renderMccReferenceOptions();
    showToast("Master Equipment", "Equipment reference berhasil disimpan.");
  } catch (error) {
    showToast("Master Equipment", error.message || "Gagal menyimpan equipment reference.");
  }
});

adminEquipmentCancelEditButton?.addEventListener("click", () => {
  resetAdminEquipmentForm();
});

searchAdminEquipment?.addEventListener("input", applyAdminEquipmentFilter);
filterAdminEquipmentSource?.addEventListener("change", applyAdminEquipmentFilter);
resetAdminEquipmentFilterButton?.addEventListener("click", () => {
  if (searchAdminEquipment) {
    searchAdminEquipment.value = "";
  }
  if (filterAdminEquipmentSource) {
    filterAdminEquipmentSource.value = "semua";
  }
  applyAdminEquipmentFilter();
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
  if (!confirmDeleteAction("area ini")) {
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
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const row = target.closest("tr");
  if (target.dataset.action === "edit-equipment-master") {
    fillAdminEquipmentFormFromRow(row);
    return;
  }
  if (target.dataset.action !== "delete-equipment-master") {
    return;
  }
  if (!confirmDeleteAction("referensi equipment ini")) {
    return;
  }
  const identifier = row?.dataset.identifier || "";
  try {
    await deleteAdminMaster("equipment-references", identifier);
    await refreshAdminMasters();
    await Promise.allSettled([
      loadEquipmentReference(),
      loadCarbonBrushEquipmentReference(),
      loadDcsEquipmentReference({ force: true }),
    ]);
    renderMccReferenceOptions();
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
  if (!confirmDeleteAction("template ini")) {
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
  if (!confirmDeleteAction("referensi room / panel ini")) {
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

instrumentSubtabs.forEach((button) => {
  button.addEventListener("click", () => {
    openInstrumentPane(button.dataset.instrumentTab);
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

document.querySelector('[data-form-type="service-cems"] [name="equipmentName"]')?.addEventListener("blur", (event) => {
  event.target.value = String(event.target.value || "").trim().toUpperCase();
});

document.querySelector('[data-form-type="service-opacity-meter"] [name="equipmentName"]')?.addEventListener("blur", (event) => {
  event.target.value = String(event.target.value || "").trim().toUpperCase();
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

    if (formType === "service-motor-mso") {
      setSubmitNote(form, "Inspeksi Motor MSO hanya bisa masuk melalui sinkronisasi MSO.");
      showToast("Motor MSO", "Gunakan sinkronisasi atau import MSO di Manajemen User.");
      return;
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
      const inspectionDateValue = String(formData.get("inspectionDate") || "").trim() || new Date().toISOString().slice(0, 10);
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
          inspectionDate: inspectionDateValue,
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

    if (formType === "service-cems") {
      const selectedEquipment = String(formData.get("equipmentName") || "").trim();
      const cemsEquipmentReferenceList = getCemsEquipmentReferenceList();
      if (!selectedEquipment || !cemsEquipmentReferenceList.includes(selectedEquipment)) {
        setSubmitNote(form, "Pilih equipment CEMS dari Master Equipment source group cems-service.");
        showToast("CEMS", "Equipment harus dipilih dari referensi CEMS resmi.");
        return;
      }
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getNamedFindingPhotoPayload(formData, existingPayload, [
        { fieldName: "cemsConditionPhoto", label: "Foto kondisi alat" },
        { fieldName: "cemsScreenshot", label: "Screenshot data CEMS" },
        { fieldName: "cemsAlarmLog", label: "Log alarm" },
      ]);
      const inspectionDateValue = String(formData.get("inspectionDate") || "").trim();
      const payload = {
        inspectionDate: inspectionDateValue
          ? new Date(`${inspectionDateValue}T00:00:00`).toISOString()
          : existingPayload.inspectionDate || new Date().toISOString(),
        inspectorName: String(formData.get("inspectorName") || "").trim(),
        o2Status: normalizeCemsStatusValue(formData.get("o2Status")),
        o2Value: String(formData.get("o2Value") || "").trim(),
        o2Unit: String(formData.get("o2Unit") || "").trim(),
        o2Note: String(formData.get("o2Note") || "").trim(),
        coStatus: normalizeCemsStatusValue(formData.get("coStatus")),
        coValue: String(formData.get("coValue") || "").trim(),
        coUnit: String(formData.get("coUnit") || "").trim(),
        coNote: String(formData.get("coNote") || "").trim(),
        noxStatus: normalizeCemsStatusValue(formData.get("noxStatus")),
        noxValue: String(formData.get("noxValue") || "").trim(),
        noxUnit: String(formData.get("noxUnit") || "").trim(),
        noxNote: String(formData.get("noxNote") || "").trim(),
        so2Status: normalizeCemsStatusValue(formData.get("so2Status")),
        so2Value: String(formData.get("so2Value") || "").trim(),
        so2Unit: String(formData.get("so2Unit") || "").trim(),
        so2Note: String(formData.get("so2Note") || "").trim(),
        dustStatus: normalizeCemsStatusValue(formData.get("dustStatus")),
        dustValue: String(formData.get("dustValue") || "").trim(),
        dustUnit: String(formData.get("dustUnit") || "").trim(),
        dustNote: String(formData.get("dustNote") || "").trim(),
        flowStatus: normalizeCemsStatusValue(formData.get("flowStatus")),
        flowValue: String(formData.get("flowValue") || "").trim(),
        flowUnit: String(formData.get("flowUnit") || "").trim(),
        flowNote: String(formData.get("flowNote") || "").trim(),
        temperatureStatus: normalizeCemsStatusValue(formData.get("temperatureStatus")),
        temperatureValue: String(formData.get("temperatureValue") || "").trim(),
        temperatureUnit: String(formData.get("temperatureUnit") || "").trim(),
        temperatureNote: String(formData.get("temperatureNote") || "").trim(),
        pressureStatus: normalizeCemsStatusValue(formData.get("pressureStatus")),
        pressureValue: String(formData.get("pressureValue") || "").trim(),
        pressureUnit: String(formData.get("pressureUnit") || "").trim(),
        pressureNote: String(formData.get("pressureNote") || "").trim(),
        analyzerPower: normalizeCemsStatusValue(formData.get("analyzerPower")),
        analyzerStatus: normalizeCemsStatusValue(formData.get("analyzerStatus")),
        analyzerAlarm: normalizeCemsStatusValue(formData.get("analyzerAlarm")),
        analyzerResponseTime: normalizeCemsStatusValue(formData.get("analyzerResponseTime")),
        analyzerSpanDrift: normalizeCemsStatusValue(formData.get("analyzerSpanDrift")),
        analyzerZeroDrift: normalizeCemsStatusValue(formData.get("analyzerZeroDrift")),
        analyzerNote: String(formData.get("analyzerNote") || "").trim(),
        samplingProbe: normalizeCemsStatusValue(formData.get("samplingProbe")),
        samplingFilter: normalizeCemsStatusValue(formData.get("samplingFilter")),
        samplingHeatedLine: normalizeCemsStatusValue(formData.get("samplingHeatedLine")),
        samplingPump: normalizeCemsStatusValue(formData.get("samplingPump")),
        samplingFlow: normalizeCemsStatusValue(formData.get("samplingFlow")),
        samplingNote: String(formData.get("samplingNote") || "").trim(),
        calibrationCylinder: normalizeCemsStatusValue(formData.get("calibrationCylinder")),
        calibrationPressure: normalizeCemsStatusValue(formData.get("calibrationPressure")),
        calibrationRegulator: normalizeCemsStatusValue(formData.get("calibrationRegulator")),
        calibrationAuto: normalizeCemsStatusValue(formData.get("calibrationAuto")),
        calibrationSchedule: normalizeCemsStatusValue(formData.get("calibrationSchedule")),
        calibrationNote: String(formData.get("calibrationNote") || "").trim(),
        dataDasScada: normalizeCemsStatusValue(formData.get("dataDasScada")),
        dataLogger: normalizeCemsStatusValue(formData.get("dataLogger")),
        dataLoss: normalizeCemsStatusValue(formData.get("dataLoss")),
        timeSync: normalizeCemsStatusValue(formData.get("timeSync")),
        dataCommunicationNote: String(formData.get("dataCommunicationNote") || "").trim(),
        supportPowerSupply: normalizeCemsStatusValue(formData.get("supportPowerSupply")),
        supportUps: normalizeCemsStatusValue(formData.get("supportUps")),
        supportAcPanel: normalizeCemsStatusValue(formData.get("supportAcPanel")),
        supportShelter: normalizeCemsStatusValue(formData.get("supportShelter")),
        supportNote: String(formData.get("supportNote") || "").trim(),
        findingIssue: String(formData.get("findingIssue") || "").trim(),
        possibleCause: String(formData.get("possibleCause") || "").trim(),
        emissionImpact: String(formData.get("emissionImpact") || "").trim(),
        urgencyLevel: String(formData.get("urgencyLevel") || "Low").trim(),
        ...photoPayload,
      };
      const item = {
        id: editingServiceId || createId("service"),
        type: "Instrument",
        subtype: "CEMS",
        formType: "service-cems",
        equipmentName: selectedEquipment,
        description: String(formData.get("description") || "-").trim(),
        detail: buildCemsDetailSummary(payload),
        payload,
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Inspeksi CEMS berhasil diperbarui.");
        showToast("CEMS", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi CEMS berhasil ditambahkan.");
        showToast("CEMS", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-opacity-meter") {
      const selectedEquipment = String(formData.get("equipmentName") || "").trim();
      const opacityEquipmentReferenceList = getOpacityEquipmentReferenceList();
      if (!selectedEquipment || !opacityEquipmentReferenceList.includes(selectedEquipment)) {
        setSubmitNote(form, "Pilih equipment opacity meter dari Master Equipment source group opacity-service.");
        showToast("Opacity Meter", "Equipment harus dipilih dari referensi opacity resmi.");
        return;
      }
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const inspectionDateValue = String(formData.get("inspectionDate") || "").trim();
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const payload = {
        inspectionDate: inspectionDateValue
          ? new Date(`${inspectionDateValue}T00:00:00`).toISOString()
          : existingPayload.inspectionDate || new Date().toISOString(),
        inspectionTime: String(formData.get("inspectionTime") || "").trim(),
        brandModel: String(formData.get("brandModel") || "").trim(),
        technicianName: String(formData.get("technicianName") || "").trim(),
        shift: String(formData.get("shift") || "").trim(),
        opacityValue: String(formData.get("opacityValue") || "").trim(),
        opacityUnit: String(formData.get("opacityUnit") || "").trim(),
        opacityLimit: String(formData.get("opacityLimit") || "").trim(),
        opacityStatus: normalizeOpacityStatusValue(formData.get("opacityStatus")),
        transmittanceValue: String(formData.get("transmittanceValue") || "").trim(),
        transmittanceUnit: String(formData.get("transmittanceUnit") || "").trim(),
        transmittanceLimit: String(formData.get("transmittanceLimit") || "").trim(),
        transmittanceStatus: normalizeOpacityStatusValue(formData.get("transmittanceStatus")),
        alarmStatusValue: String(formData.get("alarmStatusValue") || "").trim(),
        alarmStatusUnit: String(formData.get("alarmStatusUnit") || "").trim(),
        alarmStatusLimit: String(formData.get("alarmStatusLimit") || "").trim(),
        alarmStatusCondition: normalizeOpacityStatusValue(formData.get("alarmStatusCondition")),
        visualHousingClean: normalizeOpacityStatusValue(formData.get("visualHousingClean")),
        visualMounting: normalizeOpacityStatusValue(formData.get("visualMounting")),
        visualAlignment: normalizeOpacityStatusValue(formData.get("visualAlignment")),
        visualVibration: normalizeOpacityStatusValue(formData.get("visualVibration")),
        visualCondensation: normalizeOpacityStatusValue(formData.get("visualCondensation")),
        visualNote: String(formData.get("visualNote") || "").trim(),
        opticLens: normalizeOpacityStatusValue(formData.get("opticLens")),
        opticReflector: normalizeOpacityStatusValue(formData.get("opticReflector")),
        opticDeposit: normalizeOpacityStatusValue(formData.get("opticDeposit")),
        opticSignal: normalizeOpacityStatusValue(formData.get("opticSignal")),
        opticLightIntensity: normalizeOpacityStatusValue(formData.get("opticLightIntensity")),
        opticNote: String(formData.get("opticNote") || "").trim(),
        purgeActive: normalizeOpacityStatusValue(formData.get("purgeActive")),
        purgePressure: normalizeOpacityStatusValue(formData.get("purgePressure")),
        purgeFlow: normalizeOpacityStatusValue(formData.get("purgeFlow")),
        purgeFilter: normalizeOpacityStatusValue(formData.get("purgeFilter")),
        purgeNote: String(formData.get("purgeNote") || "").trim(),
        electricalPowerSupply: normalizeOpacityStatusValue(formData.get("electricalPowerSupply")),
        electricalOutput: normalizeOpacityStatusValue(formData.get("electricalOutput")),
        electricalCable: normalizeOpacityStatusValue(formData.get("electricalCable")),
        electricalNoise: normalizeOpacityStatusValue(formData.get("electricalNoise")),
        electricalNote: String(formData.get("electricalNote") || "").trim(),
        zeroCheckValue: String(formData.get("zeroCheckValue") || "").trim(),
        zeroCheckStatus: normalizeOpacityStatusValue(formData.get("zeroCheckStatus")),
        zeroCheckNote: String(formData.get("zeroCheckNote") || "").trim(),
        spanCheckValue: String(formData.get("spanCheckValue") || "").trim(),
        spanCheckStatus: normalizeOpacityStatusValue(formData.get("spanCheckStatus")),
        spanCheckNote: String(formData.get("spanCheckNote") || "").trim(),
        driftValue: String(formData.get("driftValue") || "").trim(),
        driftStatus: normalizeOpacityStatusValue(formData.get("driftStatus")),
        driftNote: String(formData.get("driftNote") || "").trim(),
        findingIssue: String(formData.get("findingIssue") || "").trim(),
        possibleCause: String(formData.get("possibleCause") || "").trim(),
        readingImpact: String(formData.get("readingImpact") || "").trim(),
        recommendationCleaning: formData.get("recommendationCleaning") === "on",
        recommendationRealignment: formData.get("recommendationRealignment") === "on",
        recommendationCalibration: formData.get("recommendationCalibration") === "on",
        recommendationSparePart: formData.get("recommendationSparePart") === "on",
        recommendationOther: String(formData.get("recommendationOther") || "").trim(),
        ...photoPayload,
      };
      const item = {
        id: editingServiceId || createId("service"),
        type: "Instrument",
        subtype: "Opacity Meter",
        formType: "service-opacity-meter",
        equipmentName: selectedEquipment,
        description: String(formData.get("description") || "-").trim(),
        detail: buildOpacityDetailSummary(payload),
        payload,
      };
      const savedItem = await saveItemToBackend("service", item, Boolean(editingServiceId));
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(savedItem));
        }
        setSubmitNote(form, "Inspeksi Opacity Meter berhasil diperbarui.");
        showToast("Opacity Meter", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(savedItem);
        setSubmitNote(form, "Inspeksi Opacity Meter berhasil ditambahkan.");
        showToast("Opacity Meter", "Item baru berhasil ditambahkan.");
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
      if (form.inspectionDate) {
        form.inspectionDate.value = new Date().toISOString().slice(0, 10);
      }
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
    if (!confirmDeleteAction("data ini")) {
      return;
    }
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
      equipment: row.children[1].textContent,
      damageDescription: row.children[2].textContent,
      followUpPlan: row.children[3].textContent,
      foundDate: row.children[4].textContent.trim(),
      pendingMark: row.children[5].textContent.trim(),
      workStatus: row.children[6].textContent.trim(),
      category: row.children[7].textContent.trim(),
      area: row.children[8].textContent.trim(),
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
    if (!confirmDeleteAction("data ini")) {
      return;
    }
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
    if ((item.formType === "service-motor-mv" || item.formType === "service-motor-mso") && String(item.payload?.source || "").toUpperCase() === "MSO") {
      showToast("Motor MSO", "Data sinkron MSO tidak dihapus manual dari daftar service.");
      return;
    }
    if (!confirmDeleteAction("data ini")) {
      return;
    }
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
    if ((item.formType === "service-motor-mv" || item.formType === "service-motor-mso") && String(item.payload?.source || "").toUpperCase() === "MSO") {
      showToast("Motor MSO", "Data sinkron MSO tidak diedit manual. Perbarui lewat file import berikutnya.");
      return;
    }
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

dashboardMsoWatchlistPreview?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const card = target.closest(".dashboard-watchlist-item");
  if (!(card instanceof HTMLElement)) {
    return;
  }
  const item = await resolveServiceItem(card.dataset.serviceId || "");
  if (item) {
    openServiceDetail(item);
  }
});

dashboardMsoWatchlistPreview?.addEventListener("keydown", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !(event.key === "Enter" || event.key === " ")) {
    return;
  }
  const card = target.closest(".dashboard-watchlist-item");
  if (!(card instanceof HTMLElement)) {
    return;
  }
  event.preventDefault();
  const item = await resolveServiceItem(card.dataset.serviceId || "");
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
  const meggerButton = target.closest('[data-action="open-carbon-brush-megger-trend"]');
  if (meggerButton instanceof HTMLElement && activeServiceDetailItem?.formType === "service-motor-mv-carbon-brush") {
    const slot = serviceDetailContent.querySelector("#carbon-brush-analysis-slot");
    if (slot) {
      slot.innerHTML = buildCarbonBrushMeggerTrendHtml(activeServiceDetailItem);
      slot.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    const slot = serviceDetailContent.querySelector("#carbon-brush-analysis-slot");
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

serviceDetailContent?.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !activeServiceGroupDetailType) {
    return;
  }
  if (target.matches("[data-service-group-search]")) {
    const searchInput = serviceDetailContent.querySelector("[data-service-group-search]");
    const subtypeSelect = serviceDetailContent.querySelector("[data-service-group-subtype]");
    renderServiceGroupDetailContent(
      activeServiceGroupDetailType,
      searchInput instanceof HTMLInputElement ? searchInput.value : "",
      subtypeSelect instanceof HTMLSelectElement ? subtypeSelect.value : "",
    );
  }
});

serviceDetailContent?.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !activeServiceGroupDetailType) {
    return;
  }
  if (target.matches("[data-service-group-subtype]")) {
    const searchInput = serviceDetailContent.querySelector("[data-service-group-search]");
    const subtypeSelect = serviceDetailContent.querySelector("[data-service-group-subtype]");
    renderServiceGroupDetailContent(
      activeServiceGroupDetailType,
      searchInput instanceof HTMLInputElement ? searchInput.value : "",
      subtypeSelect instanceof HTMLSelectElement ? subtypeSelect.value : "",
    );
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
    if (!confirmDeleteAction("data ini")) {
      return;
    }
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
    if (!confirmDeleteAction("data ini")) {
      return;
    }
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
    if (!confirmDeleteAction("data ini")) {
      return;
    }
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
      year: row.children[1].textContent.trim(),
      quarter: row.children[2].textContent.trim(),
      spbType: row.children[3].textContent.trim(),
      notificationNo: row.children[4].textContent.trim(),
      orderNo: row.children[5].textContent.trim(),
      reservationNo: row.children[6].textContent.trim(),
      stockNo: row.children[7].textContent.trim(),
      materialDescription: row.children[8].textContent.trim(),
      qty: row.children[9].textContent.trim(),
      mrp: row.children[10].textContent.trim(),
      totalEce: row.children[11].textContent.trim(),
      note: row.children[12].textContent.trim(),
      prNo: row.children[13].textContent.trim(),
      poNo: row.children[14].textContent.trim(),
      deliveryDate: row.children[15].textContent.trim(),
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
      downloadExcel(
        "negatif-list.xls",
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
      showToast("Export", "Negatif List berhasil diexport ke Excel.");
    }

    if (exportType === "sparepart") {
      const items = getSparepartItemsFromDom();
      downloadExcel("sparepart.xls", ["Kode", "Nama", "Kategori", "Lokasi", "Qty", "Kondisi"], items.map((item) => [item.code, item.name, item.category, item.location, item.qty, item.condition]));
      showToast("Export", "Sparepart berhasil diexport ke Excel.");
    }

      if (exportType === "service") {
        const items = getServiceItemsFromDom();
        downloadExcel("service.xls", ["Tipe", "Sub Menu", "Equipment", "Deskripsi", "Detail"], items.map((item) => [item.type, item.subtype, item.equipmentName, item.description, item.detail]));
        showToast("Export", "Service berhasil diexport ke Excel.");
      }

    if (exportType === "bom") {
      if (activeBomPane === "motor") {
        const items = getBomMotorItemsFromDom();
        downloadExcel(
          "bom-motor.xls",
          ["Tanggal", "Equipment", "Manufacture", "Power", "Ampere", "Voltage", "Speed", "Frame", "Serial Nr.", "Keterangan", "Long Text", "Foto Nameplate", "Foto Koneksi", "Foto Motor"],
          items.map((item) => [item.inspectionDate, item.equipment, item.manufacture, item.power, item.ampere, item.voltage, item.speed, item.frame, item.serialNumber, item.note, item.longText, item.nameplatePhoto, item.connectionPhoto, item.motorPhoto]),
        );
        showToast("Export", "BOM Motor berhasil diexport ke Excel.");
      } else {
        const items = getBomItemsFromDom();
        downloadExcel(
          "bom.xls",
          ["Equipment", "Part", "Jumlah", "Keterangan", "Long Text", "Foto Barang", "Foto Nameplate", "Foto Lain"],
          items.map((item) => [item.equipment, item.part, item.qty, item.note, item.longText, item.itemPhoto, item.nameplatePhoto, item.extraPhoto]),
        );
        showToast("Export", "BOM berhasil diexport ke Excel.");
      }
    }

    if (exportType === "spb") {
      const items = getSpbItemsFromDom();
      downloadExcel("spb.xls", ["ID", "TAHUN", "QUARTER", "TYPE", "NOTIF", "ORDER", "RESERVASI", "NO STOCK", "DESKRIPSI MATERIAL", "QTY", "MRP", "TOTAL ECE", "KETERANGAN", "PR", "PO", "DELIV DATE"], items.map((item) => [item.id, item.year, item.quarter, item.spbType, item.notificationNo, item.orderNo, item.reservationNo, item.stockNo, item.materialDescription, item.qty, item.mrp, item.totalEce, item.note, item.prNo, item.poNo, item.deliveryDate]));
      showToast("Export", "SPB berhasil diexport ke Excel.");
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

document.addEventListener("click", handleSortableTableHeaderClick);

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
