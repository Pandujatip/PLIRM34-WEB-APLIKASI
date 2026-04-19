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
const carbonBrushEquipmentInput = document.getElementById("carbon-brush-equipment-name");
const carbonBrushEquipmentResults = document.getElementById("carbon-brush-equipment-results");
const carbonBrushEquipmentStatus = document.getElementById("carbon-brush-equipment-status");
const carbonBrushEquipmentMeta = document.getElementById("carbon-brush-equipment-meta");
const carbonBrushMeasurementGrid = document.getElementById("carbon-brush-measurement-grid");
const carbonBrushStats = document.getElementById("carbon-brush-stats");
const serviceDetailModal = document.getElementById("service-detail-modal");
const serviceDetailClose = document.getElementById("service-detail-close");
const serviceDetailTitle = document.getElementById("service-detail-title");
const serviceDetailSubtitle = document.getElementById("service-detail-subtitle");
const serviceDetailContent = document.getElementById("service-detail-content");
const userManagementBody = document.getElementById("user-management-body");
const adminBackupButton = document.getElementById("admin-backup-button");
const adminExportButton = document.getElementById("admin-export-button");
const adminExportResource = document.getElementById("admin-export-resource");
const adminRestoreInput = document.getElementById("admin-restore-input");
const adminRestoreButton = document.getElementById("admin-restore-button");
const adminAreaForm = document.getElementById("admin-area-form");
const adminEquipmentForm = document.getElementById("admin-equipment-form");
const adminTemplateForm = document.getElementById("admin-template-form");
const adminAreasBody = document.getElementById("admin-areas-body");
const adminEquipmentBody = document.getElementById("admin-equipment-body");
const adminTemplatesBody = document.getElementById("admin-templates-body");
const negatifListBody = document.getElementById("negatif-list-body");
const sparepartBody = document.getElementById("sparepart-body");
const serviceCardList = document.getElementById("service-card-list");
const bomList = document.getElementById("bom-list");
const spbBody = document.getElementById("spb-body");
const dashboardNegatifPreview = document.getElementById("dashboard-negatif-preview");
const dashboardSpbPreview = document.getElementById("dashboard-spb-preview");
const statNegatif = document.getElementById("stat-negatif");
const statSpbBelumAda = document.getElementById("stat-spb-belum-ada");
const statService = document.getElementById("stat-service");
const metricSparepartTotal = document.getElementById("metric-sparepart-total");
const metricBomTotal = document.getElementById("metric-bom-total");
const metricServiceElectrical = document.getElementById("metric-service-electrical");
const metricSpbTotal = document.getElementById("metric-spb-total");
const areaElectricalCount = document.getElementById("area-electrical-count");
const areaInstrumentCount = document.getElementById("area-instrument-count");
const areaDcsCount = document.getElementById("area-dcs-count");
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
const CARBON_BRUSH_REFERENCE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfKUBfJ2IEybsMUaBoZnPeTgqCdPwuGnoXPtFuLfRzydveC6cBMYobCistT3GNdm2kS7xIKUgVkAVb/pub?output=csv";
const carbonBrushMeasurementRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const carbonBrushMeasurementColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const carbonBrushMeasurementKeys = carbonBrushMeasurementRows.flatMap((row) => carbonBrushMeasurementColumns.map((column) => `${row}${column}`));
let equipmentReferenceList = [];
let selectedEquipmentReference = "";
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
  spb: "plirm34-spb-list",
};

const apiResourceMap = {
  [storageKeys.negatifList]: "negatif-list",
  [storageKeys.sparepart]: "sparepart",
  [storageKeys.service]: "service",
  [storageKeys.bom]: "bom",
  [storageKeys.spb]: "spb",
};

const backendState = {
  available: false,
  sessionActive: false,
  masters: {
    areas: [],
    inspectionTemplates: [],
    equipmentReferences: [],
  },
};

let activeRole = "admin";
let editingNegatifId = null;
let editingSparepartId = null;
let editingServiceId = null;
let editingBomId = null;
let editingSpbId = null;

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
  admin: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb", "user-management"],
  organik: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
  team: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
};

const roleEditable = {
  admin: ["negatif-list", "sparepart", "service", "bom", "spb", "user-management"],
  organik: ["negatif-list"],
  team: ["service"],
};

const sampleData = {
  negatifList: [
    { id: "negatif-001", equipment: "Motor Raw Mill 1A", damageDescription: "Bearing motor mengalami overheat saat operasi penuh.", followUpPlan: "Menunggu bearing pengganti dan jadwal pemasangan.", foundDate: "2026-04-12", pendingMark: "Menunggu material", workStatus: "Open", category: "Electrical", area: "Tuban 3" },
    { id: "negatif-002", equipment: "Coal Feeder FT-02", damageDescription: "Signal weight feeder tidak stabil dan perlu kalibrasi ulang.", followUpPlan: "Menunggu tim Rawmill service untuk inspeksi bersama.", foundDate: "2026-04-14", pendingMark: "Menunggu Rawmill service", workStatus: "Open", category: "Instrument", area: "Tuban 4" },
    { id: "negatif-003", equipment: "Operator Station CCR-03", damageDescription: "Unit HMI restart sendiri saat beban monitoring tinggi.", followUpPlan: "Menunggu jadwal OVH untuk penggantian storage dan cleanup system.", foundDate: "2026-04-16", pendingMark: "Menunggu OVH", workStatus: "Open", category: "DCS", area: "Tuban 34" },
    { id: "negatif-004", equipment: "Temperature Scanner Kiln", damageDescription: "Pembacaan beberapa channel hilang secara intermittent.", followUpPlan: "Menunggu material terminal module pengganti sebelum commissioning ulang.", foundDate: "2026-04-17", pendingMark: "Menunggu material", workStatus: "Close", category: "Instrument", area: "Tuban 34" },
    { id: "negatif-005", equipment: "Panel MCC Finish Mill", damageDescription: "Breaker incoming trip dan belum bisa direstorasi karena part auxiliary rusak.", followUpPlan: "Menunggu material auxiliary contact kit dan pengecekan ulang wiring.", foundDate: "2026-04-18", pendingMark: "Menunggu material", workStatus: "Open", category: "Electrical", area: "Tuban 4" },
    { id: "negatif-006", equipment: "Server Historian HS-01", damageDescription: "Storage historian menunjukkan bad sector dan performa menurun.", followUpPlan: "Menunggu jadwal OVH untuk clone disk dan penggantian storage.", foundDate: "2026-04-18", pendingMark: "Menunggu OVH", workStatus: "Open", category: "DCS", area: "Tuban 3" },
  ],
  sparepart: [
    { id: "sparepart-001", code: "SPX-101", name: "Soft Starter 30kW", category: "Electrical", location: "Rak E-01", qty: "4", condition: "Ready" },
    { id: "sparepart-002", code: "SPX-102", name: "Smart Transmitter HART", category: "Instrument", location: "Rak E-02", qty: "6", condition: "Ready" },
    { id: "sparepart-003", code: "SPX-103", name: "Fiber Optic Converter", category: "DCS", location: "Rak E-03", qty: "2", condition: "Terbatas" },
    { id: "sparepart-004", code: "SPX-104", name: "Pump Mechanical Seal", category: "Mechanical", location: "Rak E-04", qty: "7", condition: "Ready" },
    { id: "sparepart-005", code: "SPX-105", name: "Isolator Signal 4-20mA", category: "Instrument", location: "Rak E-05", qty: "3", condition: "Terbatas" },
    { id: "sparepart-006", code: "SPX-106", name: "Industrial Thin Client", category: "DCS", location: "Rak E-06", qty: "1", condition: "Rusak" },
  ],
  service: [
    { id: "service-001", type: "Electrical", subtype: "Electrical Room", formType: "service-electrical-room", equipmentName: "Electrical Room Raw Mill", description: "Battery charger normal, tetapi kebersihan lantai perlu ditingkatkan dan satu pintu panel MCC belum tertutup rapat.", detail: "Pintu panel: NOT OK | Lantai: Kotor | Temperature: Dingin", payload: { panelDoorCondition: "NOT OK", floorCleanliness: "Kotor", roomTemperature: "Dingin", batteryVdc: "125 VDC", batteryAmpere: "4 A", batteryTotalVdc: "125 VDC", battery1: "12.5 VDC", battery2: "12.5 VDC", battery3: "12.4 VDC", battery4: "12.5 VDC", battery5: "12.5 VDC", battery6: "12.5 VDC", battery7: "12.4 VDC", battery8: "12.5 VDC", battery9: "12.5 VDC", battery10: "12.5 VDC", transformerEquipment: "TR-RM-01", transformerWindingTemperature: "74 C", transformerOilTemperature: "58 C", transformerOilLevel: "Normal", transformerSilicaGel: "OK", findingPhotoName: "room_rawmill.jpg" } },
    { id: "service-002", type: "Electrical", subtype: "Motor MV", formType: "service-motor-mv", equipmentName: "Motor Raw Mill MV-01", description: "Vibrasi sisi DE meningkat dan arus motor mendekati batas operasi harian.", detail: "Vibrasi DE: 4.2 mm/s | Vibrasi NDE: 3.7 mm/s | Arus: 112 A", payload: { vibrationDe: "4.2 mm/s", vibrationNde: "3.7 mm/s", windingTemperature: "78 C", bearingCondition: "panas", motorCurrent: "112 A" } },
    { id: "service-003", type: "Electrical", subtype: "Motor MV (Carbon Brush)", formType: "service-motor-mv-carbon-brush", equipmentName: "343RM1 - ABB", description: "Beberapa titik carbon brush turun ke zona merah dan perlu penggantian bertahap saat window shutdown berikutnya.", detail: "Merah: 1 | Kuning: 10 | Hijau: 13 | Terendah: 29.8", payload: { inspectionDate: "2026-04-18T00:00:00.000Z", plant: "Tuban 3", location: "Rawmill", category: "Equipment utama produksi", pic: "Purwanto, Rudi", replacement: "3", megger: "405", measurements: { A1: "36.37", A2: "35.38", A3: "42.31", A4: "34.64", A5: "35.04", B1: "30.56", B2: "41.48", B3: "32.62", C1: "32.3", C2: "44.95", C3: "35.46", C4: "31.65", C5: "33.26", C6: "30.47", D1: "31.7", D2: "29.80", D3: "31.74", D4: "31.36", D5: "42.03", D6: "35.35", D7: "43.58", D8: "38.55", D9: "32.62" }, stats: { low: 1, medium: 10, high: 13, empty: 57, min: 29.8, attentionPoints: ["D2", "B1", "B3", "C1", "C4", "C5", "C6", "D1"] } } },
    { id: "service-004", type: "Electrical", subtype: "EH/CA", formType: "service-ehca", equipmentName: "Hydraulic Unit EH-01", description: "Tekanan sistem stabil, namun filter oil mendekati batas penggantian.", detail: "Pressure: 135 bar | Filter: perlu ganti | Leakage: tidak ada", payload: { systemPressure: "135 bar", fluidLevel: "normal", filterCondition: "perlu ganti", leakCondition: "tidak ada", unitCondition: "normal" } },
    { id: "service-005", type: "Instrument", subtype: "Instrument", formType: "service-instrument", equipmentName: "Level Transmitter TK-11", description: "Pembacaan level meloncat saat agitator aktif, perlu inspeksi mounting.", detail: "Kondisi sensor: noise sinyal | Foto: level_tk11.jpg", payload: { sensorCondition: "noise sinyal", findingPhotoName: "level_tk11.jpg" } },
    { id: "service-006", type: "DCS", subtype: "DCS", formType: "service-dcs", equipmentName: "Engineering Station ES-01", description: "Response HMI melambat pada jam beban puncak dan perlu housekeeping software.", detail: "Fungsi: engineering & konfigurasi | Kebersihan: bersih", payload: { equipmentFunction: "engineering & konfigurasi", environmentCleanliness: "bersih" } },
  ],
  bom: [
    { id: "bom-001", name: "Pump Cooling Water P-204", description: "Centrifugal pump untuk sirkulasi cooling water pada line produksi utama.", meta: "Tag: P-204 | Vendor: KSB | Serial: CW-204A", itemPhoto: "pump_p204.jpg", nameplatePhoto: "nameplate_p204.jpg" },
    { id: "bom-002", name: "Panel DCS Cabinet C-11", description: "Kabinet kontrol DCS untuk monitoring dan interlock area utility.", meta: "Tag: DCS-C11 | Vendor: Yokogawa | Serial: DCS-1188", itemPhoto: "cabinet_c11.jpg", nameplatePhoto: "nameplate_c11.jpg" },
    { id: "bom-003", name: "Air Compressor AC-03", description: "Unit kompresor udara instrumen untuk menyuplai pneumatic valve.", meta: "Tag: AC-03 | Vendor: Atlas Copco | Serial: AC030998", itemPhoto: "compressor_ac03.jpg", nameplatePhoto: "nameplate_ac03.jpg" },
    { id: "bom-004", name: "Motor Fan Cooling CT-01", description: "Motor induksi untuk penggerak fan cooling tower area utility.", meta: "Tag: CT-01-M | Vendor: Siemens | Serial: MTR-CT01", itemPhoto: "motor_ct01.jpg", nameplatePhoto: "nameplate_ct01.jpg" },
  ],
  spb: [
    { id: "spb-001", requestType: "Urgent", requestSubtype: "Stock Refill", notificationNo: "5100921", orderNo: "45008291", reservationNo: "3001021", materialNo: "10023891", materialDescription: "Motor Fan Cooling", qty: "2", price: "12500000", status: "Belum ada" },
    { id: "spb-002", requestType: "Normal", requestSubtype: "Corrective", notificationNo: "5100933", orderNo: "45008295", reservationNo: "3001032", materialNo: "10023900", materialDescription: "Solenoid Valve 24VDC", qty: "4", price: "2350000", status: "Belum ada" },
    { id: "spb-003", requestType: "Urgent", requestSubtype: "Critical Equipment", notificationNo: "5100952", orderNo: "45008312", reservationNo: "3001054", materialNo: "10023945", materialDescription: "Power Supply DCS", qty: "1", price: "18900000", status: "Belum ada" },
    { id: "spb-004", requestType: "Normal", requestSubtype: "Preventive", notificationNo: "5100964", orderNo: "45008319", reservationNo: "3001062", materialNo: "10023982", materialDescription: "Bearing Pump 6310 ZZ", qty: "6", price: "540000", status: "Belum ada" },
    { id: "spb-005", requestType: "Normal", requestSubtype: "Improvement", notificationNo: "5100978", orderNo: "45008341", reservationNo: "3001083", materialNo: "10024022", materialDescription: "Industrial SSD 1TB", qty: "2", price: "2850000", status: "Proses" },
    { id: "spb-006", requestType: "Urgent", requestSubtype: "Shutdown Preparation", notificationNo: "5100991", orderNo: "45008357", reservationNo: "3001090", materialNo: "10024055", materialDescription: "Seal Kit Pump P-204", qty: "3", price: "1750000", status: "Selesai" },
  ],
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

function getCarbonBrushThresholdConfig(equipmentName, explicitPlant = "") {
  const code = parseCarbonBrushEquipmentCode(equipmentName);
  const areaDigit = code[2] || (String(explicitPlant).match(/(\d)$/)?.[1] || "");
  const plantLabel = areaDigit === "4" ? "Tuban 4" : areaDigit === "3" ? "Tuban 3" : (explicitPlant || "-");

  if (!code && !explicitPlant) {
    return { plantLabel: "-", low: 30, high: 34, legend: "-" };
  }

  if (plantLabel === "Tuban 4") {
    return { plantLabel, low: 35, high: 38, legend: "Merah < 35 | Kuning 35-37.99 | Hijau >= 38" };
  }

  return { plantLabel: plantLabel === "-" ? "Tuban 3" : plantLabel, low: 30, high: 34, legend: "Merah < 30 | Kuning 30-33.99 | Hijau >= 34" };
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

  sections.forEach((section) => {
    section.classList.toggle("visible", section.dataset.panel === sectionName);
  });

  menuItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionName);
  });

  const activeItem = [...menuItems].find((item) => item.dataset.section === sectionName);
  if (activeItem) {
    pageTitle.textContent = activeItem.textContent;
  }

  window.localStorage.setItem(storageKeys.lastSection, sectionName);
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

function bootstrapDebugMode() {
  const params = new URLSearchParams(window.location.search);
  const debugDemo = params.get("demo");
  const debugSample = params.get("sample");
  const debugSection = params.get("section");

  if (debugDemo === "1") {
    const username = params.get("user") || "debug.plirm34";
    const role = params.get("role") || "admin";
    applyRoleAccess(role);
    currentUser.textContent = username;
    currentRole.textContent = roleLabels[role] || "Admin";
    saveSession(username, role);
    loginScreen.classList.add("hidden");
    workspace.classList.remove("hidden");
  }

  if (debugSample === "1") {
    void applySampleDataState();
  }

  if (debugDemo === "1") {
    openSection(debugSection || "negatif-list");
  }
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
}

function openCreatePanel(sectionName) {
  createPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.createPanel !== sectionName);
  });
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
    return {
      ...item,
      subtype: "Instrument",
      formType: "service-instrument",
      payload: {
        sensorCondition: match?.[1] || "",
        findingPhotoName: match?.[2] || "",
      },
    };
  }

  const dcsMatch = item.detail.match(/Fungsi: (.*) \| Kebersihan: (.*)/);
  return {
    ...item,
    subtype: "DCS",
    formType: "service-dcs",
    payload: {
      equipmentFunction: dcsMatch?.[1] || "",
      environmentCleanliness: dcsMatch?.[2] || "",
    },
  };
}

function formatCarbonBrushPayloadLines(item) {
  const payload = item.payload || {};
  const meta = decodeCarbonBrushEquipmentMeta(item.equipmentName || "", payload.plant || "");
  const stats = payload.stats || computeCarbonBrushStats(payload.measurements || {}, item.equipmentName || "", payload.plant || "");
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
    ["Titik perhatian", stats.attentionPoints?.length ? stats.attentionPoints.join(", ") : "-"],
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
    const notes = [];
    if (payload.panelDoorCondition === "NOT OK") {
      notes.push("Pintu panel belum tertutup sesuai standar. Prioritaskan pengamanan panel sebelum operasi berlanjut.");
    }
    if (payload.floorCleanliness === "Kotor") {
      notes.push("Kebersihan lantai room kurang baik. Housekeeping perlu dijadwalkan untuk menurunkan risiko kontaminasi dan trip.");
    }
    if (payload.roomTemperature === "Tidak dingin") {
      notes.push("Temperature ruangan tidak ideal. Cek ventilasi, AC panel, dan beban panas di dalam room.");
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
    const notes = [];
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
    const notes = [];
    if (!/bersih/i.test(payload.environmentCleanliness || "")) {
      notes.push("Kebersihan lingkungan belum ideal. Housekeeping area DCS perlu dijaga untuk mencegah gangguan perangkat.");
    }
    if ((payload.equipmentFunction || "").length > 0) {
      notes.push("Pastikan fungsi peralatan tervalidasi kembali setelah inspeksi, terutama bila perangkat masuk kategori kritikal kontrol.");
    }
    return notes.length ? notes : ["Kondisi DCS dari isian ini belum menunjukkan temuan kritis."];
  }

  return ["Analisa otomatis belum tersedia untuk form ini."];
}

function buildCarbonBrushMatrixHtml(measurements, equipmentName, explicitPlant = "") {
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
        return `<td><div class="carbon-brush-input ${className}">${escapeHtml(value)}</div></td>`;
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

  let rawHtml = `<div class="detail-grid">${buildDetailGridRows(rawRows)}</div>`;
  if (item.formType === "service-motor-mv-carbon-brush") {
    rawHtml = `
      <div class="detail-grid">${buildDetailGridRows(formatCarbonBrushPayloadLines(item))}</div>
      ${buildCarbonBrushMatrixHtml(payload.measurements || {}, item.equipmentName || "", payload.plant || "")}
    `;
  }

  const photoHtml = payload.findingPhotoData
    ? `
      <section class="detail-card">
        <h4>Lampiran Foto</h4>
        <img class="detail-photo" src="${payload.findingPhotoData}" alt="Lampiran inspeksi ${escapeHtml(item.equipmentName || "")}">
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

function closeServiceDetail() {
  if (!serviceDetailModal) {
    return;
  }
  serviceDetailModal.classList.add("hidden");
  serviceDetailModal.setAttribute("aria-hidden", "true");
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
      ["Foto temuan", payload.findingPhotoName || "-"],
    ];
  }

  if (item.formType === "service-motor-mv") {
    return [
      ["Vibrasi DE", payload.vibrationDe || "-"],
      ["Vibrasi NDE", payload.vibrationNde || "-"],
      ["Suhu winding", payload.windingTemperature || "-"],
      ["Kondisi bearing", payload.bearingCondition || "-"],
      ["Arus motor", payload.motorCurrent || "-"],
    ];
  }

  if (item.formType === "service-motor-mv-carbon-brush") {
    return formatCarbonBrushPayloadLines(item);
  }

  if (item.formType === "service-ehca") {
    return [
      ["Tekanan sistem", payload.systemPressure || "-"],
      ["Level oli/media", payload.fluidLevel || "-"],
      ["Kondisi filter", payload.filterCondition || "-"],
      ["Kebocoran", payload.leakCondition || "-"],
      ["Kondisi unit", payload.unitCondition || "-"],
    ];
  }

  if (item.formType === "service-instrument") {
    return [
      ["Kondisi sensor", payload.sensorCondition || "-"],
      ["Foto temuan", payload.findingPhotoName || "-"],
    ];
  }

  if (item.formType === "service-dcs") {
    return [
      ["Fungsi peralatan", payload.equipmentFunction || "-"],
      ["Kebersihan lingkungan", payload.environmentCleanliness || "-"],
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

async function createServiceInspectionImage(item) {
  const payloadLines = formatServicePayloadLines(item);
  const payload = item.payload || {};
  const photoData = payload.findingPhotoData || "";
  const photoImage = photoData ? await loadImageElement(photoData).catch(() => null) : null;
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

  const width = 1400;
  const padding = 64;
  const contentWidth = width - (padding * 2);
  canvas.width = width;

  context.font = "28px Arial";
  const rowGap = 14;
  const sectionGap = 28;
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

  let estimatedHeight = 180 + (titleLines.length * 48);
  const measureRows = (rows) => {
    rows.forEach(([, value]) => {
      const wrapped = wrapCanvasText(context, value, contentWidth - 280);
      estimatedHeight += (wrapped.length * 38) + rowGap;
    });
  };

  measureRows(headerLines);
  estimatedHeight += 96;
  const descriptionLines = wrapCanvasText(context, item.description || "-", contentWidth);
  estimatedHeight += descriptionLines.length * 40;
  estimatedHeight += sectionGap + 52;
  estimatedHeight += sectionGap;
  if (isElectricalRoom) {
    measureRows(generalElectricalRows);
    estimatedHeight += 96;
    estimatedHeight += 6 * 42;
    estimatedHeight += 7 * 42;
    estimatedHeight += 48;
    measureRows(transformerRows);
    if (payload.findingPhotoName) {
      estimatedHeight += 52;
    }
  } else if (isCarbonBrush) {
    measureRows(formatCarbonBrushPayloadLines(item));
    estimatedHeight += 26 * 42;
  } else {
    measureRows(payloadLines);
  }
  analysisLines.forEach((entry) => {
    const wrapped = wrapCanvasText(context, entry, contentWidth - 36);
    estimatedHeight += (wrapped.length * 36) + 24;
  });
  if (photoImage) {
    estimatedHeight += sectionGap + 420;
  }
  estimatedHeight += 80;

  canvas.height = estimatedHeight;

  context.fillStyle = "#0b1220";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const drawCardSection = (title, startY, drawer) => {
    const cardPaddingX = 22;
    const cardPaddingTop = 22;
    const titleHeight = 34;
    const innerWidth = contentWidth - (cardPaddingX * 2);
    const measuredHeight = drawer(null, startY + cardPaddingTop + titleHeight + 10, innerWidth, true);
    const cardHeight = measuredHeight - startY + 22;

    context.fillStyle = "rgba(255,255,255,0.035)";
    context.strokeStyle = "rgba(124, 199, 255, 0.16)";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(padding, startY, contentWidth, cardHeight, 22);
    context.fill();
    context.stroke();

    context.fillStyle = "#15b8a6";
    context.font = "700 26px Arial";
    context.fillText(title, padding + cardPaddingX, startY + cardPaddingTop + 6);

    return drawer(context, startY + cardPaddingTop + titleHeight + 10, innerWidth, false) + 22;
  };

  const drawRows = (rows, y, leftX = padding, widthLimit = contentWidth - 280) => {
    rows.forEach(([label, value]) => {
      context.fillStyle = "#7cc7ff";
      context.font = "700 24px Arial";
      context.fillText(label, leftX, y);

      context.fillStyle = "#eef6ff";
      context.font = "24px Arial";
      const wrapped = wrapCanvasText(context, value, widthLimit);
      wrapped.forEach((line, index) => {
        context.fillText(line, leftX + 280, y + (index * 34));
      });
      y += (wrapped.length * 34) + rowGap;
    });
    return y;
  };

  const drawBatteryColumns = (rows, y) => {
    const leftRows = rows.slice(0, Math.ceil(rows.length / 2));
    const rightRows = rows.slice(Math.ceil(rows.length / 2));
    const columnGap = 46;
    const columnWidth = (contentWidth - columnGap) / 2;
    const labelWidth = 220;
    const valueWidth = columnWidth - labelWidth;
    const rowHeight = 42;

    const drawColumn = (columnRows, x, startY) => {
      columnRows.forEach(([label, value], index) => {
        const rowY = startY + (index * rowHeight);
        context.fillStyle = "#7cc7ff";
        context.font = "700 22px Arial";
        context.fillText(label, x, rowY);
        context.fillStyle = "#eef6ff";
        context.font = "22px Arial";
        const wrapped = wrapCanvasText(context, value, valueWidth);
        wrapped.slice(0, 2).forEach((line, lineIndex) => {
          context.fillText(line, x + labelWidth, rowY + (lineIndex * 24));
        });
      });
      return startY + (columnRows.length * rowHeight);
    };

    const leftBottom = drawColumn(leftRows, padding, y);
    const rightBottom = drawColumn(rightRows, padding + columnWidth + columnGap, y);
    return Math.max(leftBottom, rightBottom);
  };

  const drawAnalysis = (entries, y, leftX = padding + 22, boxWidth = contentWidth - 44) => {
    entries.forEach((entry) => {
      const wrapped = wrapCanvasText(context, entry, boxWidth - 28);
      const itemHeight = (wrapped.length * 34) + 18;
      context.fillStyle = "rgba(124, 199, 255, 0.06)";
      context.strokeStyle = "rgba(124, 199, 255, 0.14)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.roundRect(leftX, y, boxWidth, itemHeight, 14);
      context.fill();
      context.stroke();

      context.fillStyle = "#eef6ff";
      context.font = "24px Arial";
      wrapped.forEach((line, index) => {
        context.fillText(line, leftX + 14, y + 28 + (index * 32));
      });
      y += itemHeight + 12;
    });
    return y;
  };

  const drawCarbonBrushMatrix = (measurements, equipmentName, explicitPlant, y) => {
    const startX = padding + 22;
    const rowLabelWidth = 54;
    const cellWidth = 112;
    const cellHeight = 40;
    const tableWidth = rowLabelWidth + (cellWidth * carbonBrushMeasurementColumns.length);

    context.fillStyle = "rgba(124, 199, 255, 0.08)";
    context.font = "700 20px Arial";
    context.fillText("Titik", startX + 10, y + 26);
    carbonBrushMeasurementColumns.forEach((column, index) => {
      context.fillText(String(column), startX + rowLabelWidth + 18 + (index * cellWidth), y + 26);
    });
    y += 36;

    carbonBrushMeasurementRows.forEach((row) => {
      context.fillStyle = "rgba(255,255,255,0.03)";
      context.fillRect(startX, y, rowLabelWidth, cellHeight);
      context.fillStyle = "#eef6ff";
      context.font = "700 20px Arial";
      context.fillText(row, startX + 18, y + 25);

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
        context.font = "18px Arial";
        context.fillText(String(value), startX + rowLabelWidth + 12 + (index * cellWidth), y + 25);
      });
      y += cellHeight;
    });

    context.strokeStyle = "rgba(124, 199, 255, 0.12)";
    context.strokeRect(startX, y - (cellHeight * carbonBrushMeasurementRows.length), tableWidth, (cellHeight * carbonBrushMeasurementRows.length) + 36);
    return y;
  };

  let y = 70;
  context.fillStyle = "#eef6ff";
  context.font = "700 42px Arial";
  titleLines.forEach((line) => {
    context.fillText(line, padding, y);
    y += 48;
  });

  context.fillStyle = "#9bb0c8";
  context.font = "24px Arial";
  context.fillText(`Tanggal inspeksi: ${inspectionDate}`, padding, y);

  y += sectionGap;
  y = drawCardSection("Informasi Umum", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    if (measuringOnly) {
      let currentY = cardY;
      headerLines.forEach(([, value]) => {
        const wrapped = wrapCanvasText(context, value, innerWidth - 280);
        currentY += (wrapped.length * 34) + rowGap;
      });
      return currentY;
    }
    return drawRows(headerLines, cardY, padding + 22, innerWidth - 280);
  });

  y += sectionGap;
  y = drawCardSection("Deskripsi Temuan", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    const lines = wrapCanvasText(context, item.description || "-", innerWidth);
    if (measuringOnly) {
      return cardY + (lines.length * 34);
    }
    context.fillStyle = "#eef6ff";
    context.font = "24px Arial";
    lines.forEach((line) => {
      context.fillText(line, padding + 22, cardY);
      cardY += 34;
    });
    return cardY;
  });

  y += sectionGap;
  y = drawCardSection("Hasil Inspeksi", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    if (isElectricalRoom) {
      if (measuringOnly) {
        let currentY = cardY;
        generalElectricalRows.forEach(([, value]) => {
          const wrapped = wrapCanvasText(context, value, innerWidth - 280);
          currentY += (wrapped.length * 34) + rowGap;
        });
        currentY += 52 + (Math.ceil(batteryChargeRows.length / 2) * 42) + 42 + (transformerRows.length * 48);
        if (payload.findingPhotoName) {
          currentY += 48;
        }
        return currentY;
      }
      let currentY = drawRows(generalElectricalRows, cardY, padding + 22, innerWidth - 280);
      currentY += 10;
      context.fillStyle = "#15b8a6";
      context.font = "700 24px Arial";
      context.fillText("Battery Charge", padding + 22, currentY);
      currentY += 34;
      currentY = drawBatteryColumns(batteryChargeRows, currentY);
      currentY += 18;
      context.fillStyle = "#15b8a6";
      context.font = "700 24px Arial";
      context.fillText("Transformator", padding + 22, currentY);
      currentY += 34;
      currentY = drawRows(transformerRows, currentY, padding + 22, innerWidth - 280);
      if (payload.findingPhotoName) {
        currentY = drawRows([["Foto temuan", payload.findingPhotoName]], currentY + 8, padding + 22, innerWidth - 280);
      }
      return currentY;
    }

    if (isCarbonBrush) {
      const summaryRows = formatCarbonBrushPayloadLines(item);
      if (measuringOnly) {
        let currentY = cardY;
        summaryRows.forEach(([, value]) => {
          const wrapped = wrapCanvasText(context, value, innerWidth - 280);
          currentY += (wrapped.length * 34) + rowGap;
        });
        currentY += 36 + (carbonBrushMeasurementRows.length * 40) + 42;
        return currentY;
      }
      let currentY = drawRows(summaryRows, cardY, padding + 22, innerWidth - 280);
      currentY += 18;
      currentY = drawCarbonBrushMatrix(payload.measurements || {}, item.equipmentName || "", payload.plant || "", currentY);
      return currentY;
    }

    if (measuringOnly) {
      let currentY = cardY;
      payloadLines.forEach(([, value]) => {
        const wrapped = wrapCanvasText(context, value, innerWidth - 280);
        currentY += (wrapped.length * 34) + rowGap;
      });
      return currentY;
    }
    return drawRows(payloadLines, cardY, padding + 22, innerWidth - 280);
  });

  y += sectionGap;
  y = drawCardSection("Analisa", y, (_ctx, cardY, innerWidth, measuringOnly) => {
    if (measuringOnly) {
      let currentY = cardY;
      analysisLines.forEach((entry) => {
        const wrapped = wrapCanvasText(context, entry, innerWidth - 28);
        currentY += (wrapped.length * 36) + 24 + 12;
      });
      return currentY;
    }
    return drawAnalysis(analysisLines, cardY, padding + 22, innerWidth);
  });

  if (photoImage) {
    y += sectionGap;
    y = drawCardSection("Lampiran Foto", y, (_ctx, cardY, innerWidth, measuringOnly) => {
      const maxPhotoWidth = innerWidth;
      const maxPhotoHeight = 360;
      const ratio = Math.min(maxPhotoWidth / photoImage.width, maxPhotoHeight / photoImage.height, 1);
      const drawWidth = photoImage.width * ratio;
      const drawHeight = photoImage.height * ratio;
      if (measuringOnly) {
        return cardY + drawHeight;
      }
      context.fillStyle = "rgba(255,255,255,0.03)";
      context.fillRect(padding + 22, cardY, drawWidth, drawHeight);
      context.drawImage(photoImage, padding + 22, cardY, drawWidth, drawHeight);
      return cardY + drawHeight;
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

async function getFindingPhotoPayload(formData, existingPayload = {}) {
  const photo = formData.get("findingPhoto");
  if (photo && typeof photo === "object" && "name" in photo && photo.name && "size" in photo && photo.size > 0) {
    return {
      findingPhotoName: photo.name,
      findingPhotoData: await readFileAsDataUrl(photo),
    };
  }

  return {
    findingPhotoName: existingPayload.findingPhotoName || "tidak ada file",
    findingPhotoData: existingPayload.findingPhotoData || "",
  };
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gagal memuat image lampiran"));
    image.src = src;
  });
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
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
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
    const message = payload.error || `HTTP ${response.status}`;
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

async function fetchItemsFromBackend(resourceKey) {
  if (!backendState.available || !backendState.sessionActive) {
    return [];
  }
  const result = await apiRequest(`/items/${resourceKey}`);
  return Array.isArray(result.items) ? result.items : [];
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
  };
  return result;
}

async function fetchAdminMaster(resourceName) {
  const result = await apiRequest(`/admin/masters/${resourceName}`);
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
  saveSession(user.username, user.role);
  loginScreen.classList.add("hidden");
  workspace.classList.remove("hidden");
  renderUserManagementTable();
  openSection("dashboard");
}

async function loadAllDataFromBackend() {
  const [negatifItems, sparepartItems, serviceItems, bomItems, spbItems] = await Promise.all([
    fetchItemsFromBackend("negatif-list"),
    fetchItemsFromBackend("sparepart"),
    fetchItemsFromBackend("service"),
    fetchItemsFromBackend("bom"),
    fetchItemsFromBackend("spb"),
  ]);

  writeStorage(storageKeys.negatifList, negatifItems.map((item) => normalizeNegatifItem(item)));
  writeStorage(storageKeys.sparepart, sparepartItems);
  writeStorage(storageKeys.service, serviceItems.map((item) => normalizeServiceItem(item)));
  writeStorage(storageKeys.bom, bomItems);
  writeStorage(storageKeys.spb, spbItems);
  loadStoredData();
}

async function hydrateFromBackendAfterLogin() {
  const bootstrap = await apiRequest("/bootstrap");
  backendState.sessionActive = true;
  if (Array.isArray(bootstrap.users) && bootstrap.users.length) {
    cacheUsers(bootstrap.users);
  }
  await loadAllDataFromBackend();
  await loadMastersFromBackend();
  renderUserManagementTable();
  await refreshAdminMasters();

  if (!hasAnyStoredData()) {
    await applySampleDataState();
    if (sampleDataStatus) {
      sampleDataStatus.textContent = "Sample data aktif otomatis karena database masih kosong.";
    }
  }
}

async function restoreBackendSession() {
  try {
    const bootstrap = await apiRequest("/bootstrap");
    if (!bootstrap?.user) {
      return false;
    }

    backendState.sessionActive = true;
    if (Array.isArray(bootstrap.users) && bootstrap.users.length) {
      cacheUsers(bootstrap.users);
    }
    await loadAllDataFromBackend();
    await loadMastersFromBackend();
    loginWithUser(bootstrap.user);
    await refreshAdminMasters();
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

  await Promise.allSettled([
    loadEquipmentReference(),
    loadCarbonBrushEquipmentReference(),
  ]);

  if (!hasAnyStoredData()) {
    await applySampleDataState();
    if (sampleDataStatus) {
      sampleDataStatus.textContent = backendReady
        ? "Sample data aktif otomatis karena database masih kosong."
        : "Sample data aktif otomatis karena data lokal masih kosong.";
    }
  }

  bootstrapDebugMode();
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
    renderAdminEquipmentTable(equipmentReferences);
    renderAdminTemplatesTable(templates);
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
  return [...serviceCardList.querySelectorAll(".inspection-card")].map((card) => ({
    id: card.dataset.id,
    type: card.dataset.type,
    subtype: card.dataset.subtype || card.dataset.type,
    formType: card.dataset.formType || "",
    equipmentName: card.querySelector(".inspection-head strong").textContent,
    description: card.querySelector("p").textContent,
    detail: card.querySelectorAll(".inspection-meta span")[1]?.textContent || "",
    payload: card.dataset.payload ? JSON.parse(card.dataset.payload) : {},
  }));
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

function persistSpbList() {
  const items = getSpbItemsFromDom();
  writeStorage(storageKeys.spb, items);
}

function updateDashboardStats() {
  const negatifItems = getNegatifItemsFromDom();
  const sparepartItems = getSparepartItemsFromDom();
  const serviceItems = getServiceItemsFromDom();
  const bomItems = getBomItemsFromDom();
  const spbItems = getSpbItemsFromDom();

  const belumAdaCount = spbItems.filter((item) => item.status === "Belum ada").length;
  const electricalCount = serviceItems.filter((item) => item.type === "Electrical").length;
  const totalSpb = spbItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  statNegatif.textContent = `${negatifItems.length} item`;
  statSpbBelumAda.textContent = `${belumAdaCount} item`;
  statService.textContent = `${serviceItems.length} area`;
  metricSparepartTotal.textContent = `${sparepartItems.length}`;
  metricBomTotal.textContent = `${bomItems.length} mesin`;
  metricServiceElectrical.textContent = `${electricalCount} temuan`;
  metricSpbTotal.textContent = `Rp${Math.round(totalSpb / 1000000)} jt`;
  renderExecutiveSummary(negatifItems, serviceItems, spbItems);
  renderMiniCharts(negatifItems, serviceItems, spbItems);
  renderDashboardPreviews(negatifItems, spbItems);
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

function renderExecutiveSummary(negatifItems, serviceItems, spbItems) {
  const electrical = negatifItems.filter((item) => item.category === "Electrical").length + serviceItems.filter((item) => item.type === "Electrical").length;
  const instrument = negatifItems.filter((item) => item.category === "Instrument").length + serviceItems.filter((item) => item.type === "Instrument").length;
  const dcs = negatifItems.filter((item) => item.category === "DCS").length + serviceItems.filter((item) => item.type === "DCS").length + spbItems.filter((item) => /DCS|network|monitor/i.test(item.materialDescription)).length;

  areaElectricalCount.textContent = `${electrical} item`;
  areaInstrumentCount.textContent = `${instrument} item`;
  areaDcsCount.textContent = `${dcs} item`;
}

function renderChart(container, rows) {
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
      <strong>${row.value}</strong>
    `;
    container.append(node);
  });
}

function renderMiniCharts(negatifItems, serviceItems, spbItems) {
  renderChart(chartNegatif, [
    { label: "Material", value: negatifItems.filter((item) => item.pendingMark === "Menunggu material").length },
    { label: "Rawmill", value: negatifItems.filter((item) => item.pendingMark === "Menunggu Rawmill service").length },
    { label: "OVH", value: negatifItems.filter((item) => item.pendingMark === "Menunggu OVH").length },
  ]);

  renderChart(chartService, [
    { label: "Electrical", value: serviceItems.filter((item) => item.type === "Electrical").length },
    { label: "Instrument", value: serviceItems.filter((item) => item.type === "Instrument").length },
    { label: "DCS", value: serviceItems.filter((item) => item.type === "DCS").length },
  ]);

  renderChart(chartSpb, [
    { label: "Belum ada", value: spbItems.filter((item) => item.status === "Belum ada").length },
    { label: "Proses", value: spbItems.filter((item) => item.status === "Proses").length },
    { label: "Selesai", value: spbItems.filter((item) => item.status === "Selesai").length },
  ]);
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
          <span>Jenis Ajuan: ${item.requestType}</span>
          <span>No Order: ${item.orderNo}</span>
          <span>No Material: ${item.materialNo}</span>
          <span>Qty: ${item.qty}</span>
          <span>Harga: Rp${Number(item.price).toLocaleString("id-ID")}</span>
          <span>Status: ${item.status}</span>
        </div>
      `;
      spbMobile.append(card);
    });
  }
}

function renderDashboardPreviews(negatifItems, spbItems) {
  if (dashboardNegatifPreview) {
    const previewItems = negatifItems.slice(0, 3);
    dashboardNegatifPreview.innerHTML = "";
    previewItems.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.equipment}</td>
        <td>${item.category}</td>
        <td>${item.area}</td>
        <td>${item.workStatus}</td>
      `;
      dashboardNegatifPreview.append(row);
    });
  }

  if (dashboardSpbPreview) {
    const previewItems = spbItems.filter((item) => item.status === "Belum ada").slice(0, 4);
    dashboardSpbPreview.innerHTML = "";
    previewItems.forEach((item) => {
      const article = document.createElement("article");
      article.innerHTML = `
        <strong>${item.materialDescription}</strong>
        <span>No order: ${item.orderNo}</span>
        <small>Status: ${item.status}</small>
      `;
      dashboardSpbPreview.append(article);
    });
  }
}

function matchesSearch(text, query) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
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
  [...serviceCardList.querySelectorAll(".inspection-card")].forEach((card) => {
    const cardText = card.textContent || "";
    const cardType = card.dataset.type || "";
    const matchesQuery = !query || matchesSearch(cardText, query);
    const matchesType = type === "semua" || cardType === type;
    card.hidden = !(matchesQuery && matchesType);
  });
}

function applyBomFilter() {
  const query = searchBom?.value || "";
  [...bomList.querySelectorAll(".bom-card")].forEach((card) => {
    const cardText = card.textContent || "";
    card.hidden = !!query && !matchesSearch(cardText, query);
  });
}

function applySpbFilter() {
  const query = searchSpb?.value || "";
  const status = filterSpbStatus?.value || "semua";
  [...spbBody.querySelectorAll("tr")].forEach((row) => {
    const rowText = row.textContent || "";
    const rowStatus = row.children[9]?.textContent.trim() || "";
    const matchesQuery = !query || matchesSearch(rowText, query);
    const matchesStatus = status === "semua" || rowStatus === status;
    row.hidden = !(matchesQuery && matchesStatus);
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
  if (status === "Belum ada") {
    return "tag-neutral";
  }
  if (status === "Proses") {
    return "tag-warning";
  }
  return "tag-success";
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
      <button class="table-action" data-action="edit-negatif" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-negatif" type="button">Hapus</button>
    </td>
  `;
  return row;
}

function renderServiceCard(item) {
  const card = document.createElement("article");
  card.className = "inspection-card";
  card.dataset.openable = "true";
  card.tabIndex = 0;
  card.dataset.id = item.id;
  card.dataset.type = item.type;
  card.dataset.subtype = item.subtype || item.type;
  card.dataset.formType = item.formType || "";
  card.dataset.payload = JSON.stringify(item.payload || {});
  const carbonBrushStatsPayload = item.formType === "service-motor-mv-carbon-brush"
    ? (item.payload?.stats || computeCarbonBrushStats(item.payload?.measurements || {}, item.equipmentName || "", item.payload?.plant || ""))
    : null;
  const carbonBrushMeta = item.formType === "service-motor-mv-carbon-brush"
    ? decodeCarbonBrushEquipmentMeta(item.equipmentName || "", item.payload?.plant || "")
    : null;
  const carbonBrushSummary = item.formType === "service-motor-mv-carbon-brush"
    ? `
      <div class="carbon-brush-card-summary">
        <span class="summary-pill">${carbonBrushMeta?.plant || "-"}</span>
        <span class="summary-pill">${carbonBrushMeta?.location || "-"}</span>
        <span class="summary-pill low">Merah: ${carbonBrushStatsPayload?.low || 0}</span>
        <span class="summary-pill medium">Kuning: ${carbonBrushStatsPayload?.medium || 0}</span>
        <span class="summary-pill high">Hijau: ${carbonBrushStatsPayload?.high || 0}</span>
        <span class="summary-pill">Terendah: ${carbonBrushStatsPayload?.min ?? "-"}</span>
      </div>
    `
    : "";
  card.innerHTML = `
    <div class="card-actions card-actions-icon service-card-actions">
      <button class="table-action icon-action send" data-action="send-service" type="button" title="Kirim" aria-label="Kirim">↗</button>
      <button class="table-action icon-action" data-action="edit-service" type="button" title="Edit" aria-label="Edit">✎</button>
      <button class="table-action icon-action danger" data-action="delete-service" type="button" title="Hapus" aria-label="Hapus">✕</button>
    </div>
    <div class="inspection-head">
      <span class="tag ${getServiceTag(item.type)}">${item.type}</span>
      <strong>${item.equipmentName}</strong>
    </div>
    <p>${item.description}</p>
    ${carbonBrushSummary}
    <div class="inspection-meta">
      <span>Sub menu: ${item.subtype || item.type}</span>
      <span>${item.detail}</span>
      <span>Status: Draft frontend</span>
    </div>
  `;
  return card;
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
  const card = document.createElement("article");
  card.className = "bom-card";
  card.dataset.id = item.id;
  card.innerHTML = `
    <div class="bom-visual">
      <div class="image-placeholder">${item.itemPhoto || "Foto Barang"}</div>
      <div class="image-placeholder secondary">${item.nameplatePhoto || "Foto Nameplate"}</div>
    </div>
    <div class="bom-copy">
      <strong>${item.name}</strong>
      <p>${item.description}</p>
      <small>${item.meta}</small>
    </div>
    <div class="card-actions">
      <button class="table-action" data-action="edit-bom" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-bom" type="button">Hapus</button>
    </div>
  `;
  return card;
}

function renderSpbRow(item) {
  const row = document.createElement("tr");
  row.dataset.id = item.id;
  row.innerHTML = `
    <td>${item.requestType}</td>
    <td>${item.requestSubtype}</td>
    <td>${item.notificationNo}</td>
    <td>${item.orderNo}</td>
    <td>${item.reservationNo}</td>
    <td>${item.materialNo}</td>
    <td>${item.materialDescription}</td>
    <td>${item.qty}</td>
    <td>Rp${Number(item.price).toLocaleString("id-ID")}</td>
    <td><span class="tag ${getSpbStatusTag(item.status)}">${item.status}</span></td>
    <td class="action-cell">
      <button class="table-action" data-action="edit-spb" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-spb" type="button">Hapus</button>
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

async function applySampleDataState() {
  [
    storageKeys.negatifList,
    storageKeys.sparepart,
    storageKeys.service,
    storageKeys.bom,
    storageKeys.spb,
  ].forEach((key) => {
    window.localStorage.removeItem(key);
  });
  resetFilters();
  replaceBodyRows(negatifListBody, sampleData.negatifList, renderNegatifRow);
  replaceBodyRows(sparepartBody, sampleData.sparepart, renderSparepartRow);
  replaceCardList(serviceCardList, sampleData.service, renderServiceCard);
  replaceCardList(bomList, sampleData.bom, renderBomCard);
  replaceBodyRows(spbBody, sampleData.spb, renderSpbRow);

  if (backendState.available && backendState.sessionActive) {
    await Promise.all([
      ...sampleData.negatifList.map((item) => saveItemToBackend("negatif-list", item)),
      ...sampleData.sparepart.map((item) => saveItemToBackend("sparepart", item)),
      ...sampleData.service.map((item) => saveItemToBackend("service", item)),
      ...sampleData.bom.map((item) => saveItemToBackend("bom", item)),
      ...sampleData.spb.map((item) => saveItemToBackend("spb", item)),
    ]);
  }

  persistNegatifList();
  persistSparepartList();
  persistServiceList();
  persistBomList();
  persistSpbList();
  updateDashboardStats();
  if (sampleDataStatus) {
    sampleDataStatus.textContent = "Sample data aktif. Klik menu Negatif List, Sparepart, Service, BOM, atau SPB untuk melihat data lengkap di layar.";
  }
  applyNegatifListFilter();
  applySparepartFilter();
  applyServiceFilter();
  applyBomFilter();
  applySpbFilter();
}

function hasAnyStoredData() {
  return (
    readStorage(storageKeys.negatifList).length > 0 ||
    readStorage(storageKeys.sparepart).length > 0 ||
    readStorage(storageKeys.service).length > 0 ||
    readStorage(storageKeys.bom).length > 0 ||
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
  serviceCardList.prepend(renderServiceCard(item));
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
    name: card.querySelector(".bom-copy strong").textContent,
    description: card.querySelector(".bom-copy p").textContent,
    meta: card.querySelector(".bom-copy small").textContent,
    itemPhoto: card.querySelector(".bom-visual .image-placeholder").textContent,
    nameplatePhoto: card.querySelector(".bom-visual .secondary").textContent,
  }));
}

function getSpbItemsFromDom() {
  return [...spbBody.querySelectorAll("tr")].map((row) => ({
    id: row.dataset.id,
    requestType: row.children[0].textContent,
    requestSubtype: row.children[1].textContent,
    notificationNo: row.children[2].textContent,
    orderNo: row.children[3].textContent,
    reservationNo: row.children[4].textContent,
    materialNo: row.children[5].textContent,
    materialDescription: row.children[6].textContent,
    qty: row.children[7].textContent,
    price: row.children[8].textContent.replace(/[^\d]/g, ""),
    status: row.children[9].textContent.trim(),
  }));
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
    [...negatifListBody.querySelectorAll("tr")].forEach((row) => {
      row.dataset.id = row.dataset.id || createId("negatif");
      const editButton = row.querySelectorAll(".table-action")[0];
      const deleteButton = row.querySelectorAll(".table-action")[1];
      if (editButton) {
        editButton.dataset.action = "edit-negatif";
      }
      if (deleteButton) {
        deleteButton.dataset.action = "delete-negatif";
      }
    });
    persistNegatifList();
  }

  const storedSparepart = readStorage(storageKeys.sparepart);
  if (storedSparepart.length) {
    sparepartBody.innerHTML = "";
    storedSparepart.forEach((item) => {
      sparepartBody.append(renderSparepartRow(item));
    });
  } else {
    [...sparepartBody.querySelectorAll("tr")].forEach((row) => {
      row.dataset.id = createId("sparepart");
      const editButton = row.querySelectorAll(".table-action")[0];
      const deleteButton = row.querySelectorAll(".table-action")[1];
      if (editButton) editButton.dataset.action = "edit-sparepart";
      if (deleteButton) deleteButton.dataset.action = "delete-sparepart";
    });
    persistSparepartList();
  }

  const storedService = readStorage(storageKeys.service);
  if (storedService.length) {
    serviceCardList.innerHTML = "";
    const normalizedService = storedService.map((item) => normalizeServiceItem(item));
    normalizedService.forEach((item) => {
      serviceCardList.append(renderServiceCard(item));
    });
    writeStorage(storageKeys.service, normalizedService);
  } else {
    serviceCardList.innerHTML = "";
    sampleData.service.forEach((item) => {
      serviceCardList.append(renderServiceCard(item));
    });
    persistServiceList();
  }

  const storedBom = readStorage(storageKeys.bom);
  if (storedBom.length) {
    bomList.innerHTML = "";
    storedBom.forEach((item) => {
      bomList.append(renderBomCard(item));
    });
  } else {
    [...bomList.querySelectorAll(".bom-card")].forEach((card) => {
      card.dataset.id = createId("bom");
      const editButton = card.querySelectorAll(".table-action")[0];
      const deleteButton = card.querySelectorAll(".table-action")[1];
      if (editButton) editButton.dataset.action = "edit-bom";
      if (deleteButton) deleteButton.dataset.action = "delete-bom";
    });
    persistBomList();
  }

  const storedSpb = readStorage(storageKeys.spb);
  if (storedSpb.length) {
    spbBody.innerHTML = "";
    storedSpb.forEach((item) => {
      spbBody.append(renderSpbRow(item));
    });
  } else {
    [...spbBody.querySelectorAll("tr")].forEach((row) => {
      row.dataset.id = createId("spb");
      const editButton = row.querySelectorAll(".table-action")[0];
      const deleteButton = row.querySelectorAll(".table-action")[1];
      if (editButton) editButton.dataset.action = "edit-spb";
      if (deleteButton) deleteButton.dataset.action = "delete-spb";
    });
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
    form.equipmentFunction.value = payload.equipmentFunction || "";
    form.environmentCleanliness.value = payload.environmentCleanliness || "";
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
  form.name.value = item.name;
  form.description.value = item.description;
  form.meta.value = item.meta;
  editingBomId = item.id;
  setSubmitNote(form, "Mode edit aktif untuk BOM. File foto tidak diisi ulang otomatis.");
}

function hydrateSpbForm(item) {
  const form = document.querySelector('[data-form-type="spb"]');
  form.requestType.value = item.requestType;
  form.requestSubtype.value = item.requestSubtype;
  form.notificationNo.value = item.notificationNo;
  form.orderNo.value = item.orderNo;
  form.reservationNo.value = item.reservationNo;
  form.materialNo.value = item.materialNo;
  form.materialDescription.value = item.materialDescription;
  form.qty.value = item.qty;
  form.price.value = item.price;
  form.status.value = item.status;
  editingSpbId = item.id;
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

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Node)) {
    return;
  }
  if (negatifListForm && !negatifListForm.contains(event.target)) {
    hideEquipmentReferenceResults();
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
    if (window.innerWidth <= 640) {
      sidebar?.classList.remove("menu-open");
    }
  });
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openSection(button.dataset.sectionJump);
    closeAllCreatePanels();
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
      const existingPayload = editingServiceId
        ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload || {}
        : {};
      const photoPayload = await getFindingPhotoPayload(formData, existingPayload);
      const item = {
        id: editingServiceId || createId("service"),
        type: "Electrical",
        subtype: "Electrical Room",
        formType: "service-electrical-room",
        equipmentName: String(formData.get("equipmentName") || "-"),
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
          findingPhotoName: photoPayload.findingPhotoName,
          findingPhotoData: photoPayload.findingPhotoData,
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

    if (formType === "service-ehca") {
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
            findingPhotoName: photoPayload.findingPhotoName,
            findingPhotoData: photoPayload.findingPhotoData,
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
        const item = {
          id: editingServiceId || createId("service"),
          type: "DCS",
          subtype: "DCS",
          formType: "service-dcs",
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
          detail: `Fungsi: ${String(formData.get("equipmentFunction") || "-")} | Kebersihan: ${String(formData.get("environmentCleanliness") || "-")}`,
          payload: {
            inspectionDate: editingServiceId
              ? getServiceItemsFromDom().find((item) => item.id === editingServiceId)?.payload?.inspectionDate || new Date().toISOString()
              : new Date().toISOString(),
            equipmentFunction: String(formData.get("equipmentFunction") || ""),
            environmentCleanliness: String(formData.get("environmentCleanliness") || ""),
          },
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
      const itemPhoto = formData.get("itemPhoto");
      const nameplatePhoto = formData.get("nameplatePhoto");
      const item = {
        id: editingBomId || createId("bom"),
        name: String(formData.get("name") || "-"),
        description: String(formData.get("description") || "-"),
        meta: String(formData.get("meta") || "-"),
        itemPhoto: itemPhoto && typeof itemPhoto === "object" && "name" in itemPhoto && itemPhoto.name ? itemPhoto.name : "Foto Barang",
        nameplatePhoto: nameplatePhoto && typeof nameplatePhoto === "object" && "name" in nameplatePhoto && nameplatePhoto.name ? nameplatePhoto.name : "Foto Nameplate",
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

    if (formType === "spb") {
      const item = {
        id: editingSpbId || createId("spb"),
        requestType: String(formData.get("requestType") || "-"),
        requestSubtype: String(formData.get("requestSubtype") || "-"),
        notificationNo: String(formData.get("notificationNo") || "-"),
        orderNo: String(formData.get("orderNo") || "-"),
        reservationNo: String(formData.get("reservationNo") || "-"),
        materialNo: String(formData.get("materialNo") || "-"),
        materialDescription: String(formData.get("materialDescription") || "-"),
        qty: String(formData.get("qty") || "0"),
        price: String(formData.get("price") || "0"),
        status: String(formData.get("status") || "Belum ada"),
      };
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
  const card = target.closest(".inspection-card");
  if (!card) {
    return;
  }

  if (!target.closest("[data-action]")) {
    openServiceDetail({
      id: card.dataset.id,
      type: card.dataset.type,
      subtype: card.dataset.subtype || card.dataset.type,
      formType: card.dataset.formType || "",
      equipmentName: card.querySelector(".inspection-head strong").textContent,
      description: card.querySelector("p").textContent,
      detail: card.querySelectorAll(".inspection-meta span")[1]?.textContent || "",
      payload: card.dataset.payload ? JSON.parse(card.dataset.payload) : {},
    });
    return;
  }

  if (target.dataset.action === "delete-service") {
    try {
      await deleteItemFromBackend("service", card.dataset.id || "");
      card.remove();
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
      showToast("Service", "Item berhasil dihapus.");
    } catch (error) {
      showToast("Service", error.message || "Gagal menghapus item.");
    }
  }

  if (target.dataset.action === "send-service") {
    const item = {
      id: card.dataset.id,
      type: card.dataset.type,
      subtype: card.dataset.subtype || card.dataset.type,
      formType: card.dataset.formType || "",
      equipmentName: card.querySelector(".inspection-head strong").textContent,
      description: card.querySelector("p").textContent,
      detail: card.querySelectorAll(".inspection-meta span")[1]?.textContent || "",
      payload: card.dataset.payload ? JSON.parse(card.dataset.payload) : {},
    };

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
    hydrateServiceForm({
      id: card.dataset.id,
      type: card.dataset.type,
      subtype: card.dataset.subtype || card.dataset.type,
      formType: card.dataset.formType || "",
      equipmentName: card.querySelector(".inspection-head strong").textContent,
      description: card.querySelector("p").textContent,
      detail: card.querySelectorAll(".inspection-meta span")[1]?.textContent || "",
      payload: card.dataset.payload ? JSON.parse(card.dataset.payload) : {},
    });
    openSection("service");
    openCreatePanel("service");
  }
});

serviceCardList.addEventListener("keydown", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !(event.key === "Enter" || event.key === " ")) {
    return;
  }

  const card = target.closest(".inspection-card");
  if (!card || target.closest("[data-action]")) {
    return;
  }

  event.preventDefault();
  openServiceDetail({
    id: card.dataset.id,
    type: card.dataset.type,
    subtype: card.dataset.subtype || card.dataset.type,
    formType: card.dataset.formType || "",
    equipmentName: card.querySelector(".inspection-head strong").textContent,
    description: card.querySelector("p").textContent,
    detail: card.querySelectorAll(".inspection-meta span")[1]?.textContent || "",
    payload: card.dataset.payload ? JSON.parse(card.dataset.payload) : {},
  });
});

bomList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const card = target.closest(".bom-card");
  if (!card) return;

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
      name: card.querySelector(".bom-copy strong").textContent,
      description: card.querySelector(".bom-copy p").textContent,
      meta: card.querySelector(".bom-copy small").textContent,
    });
    openSection("bom");
    openCreatePanel("bom");
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
      requestType: row.children[0].textContent,
      requestSubtype: row.children[1].textContent,
      notificationNo: row.children[2].textContent,
      orderNo: row.children[3].textContent,
      reservationNo: row.children[4].textContent,
      materialNo: row.children[5].textContent,
      materialDescription: row.children[6].textContent,
      qty: row.children[7].textContent,
      price: row.children[8].textContent.replace(/[^\d]/g, ""),
      status: row.children[9].textContent.trim(),
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
      const items = getBomItemsFromDom();
      downloadCsv("bom.csv", ["Nama", "Deskripsi", "Meta", "Foto Barang", "Foto Nameplate"], items.map((item) => [item.name, item.description, item.meta, item.itemPhoto, item.nameplatePhoto]));
      showToast("Export", "BOM berhasil diexport ke CSV.");
    }

    if (exportType === "spb") {
      const items = getSpbItemsFromDom();
      downloadCsv("spb.csv", ["Jenis Ajuan", "Type Ajuan", "No Notifikasi", "No Order", "No Reservasi", "No Material", "Deskripsi", "Qty", "Harga", "Status"], items.map((item) => [item.requestType, item.requestSubtype, item.notificationNo, item.orderNo, item.reservationNo, item.materialNo, item.materialDescription, item.qty, item.price, item.status]));
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
  refreshButton.addEventListener("click", () => {
    showToast("Refresh Tampilan", "Memuat ulang aplikasi tanpa perlu login ulang.");
    window.setTimeout(() => {
      window.location.reload();
    }, 300);
  });
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    sidebar?.classList.toggle("menu-open");
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    if (backendState.available) {
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
    clearSession();
  });
}
