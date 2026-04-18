const loginForm = document.getElementById("login-form");
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
const editableBlocks = document.querySelectorAll("[data-editable-for]");
const lockedNotes = document.querySelectorAll("[data-locked-for]");
const forms = document.querySelectorAll(".input-form");
const negatifListForm = document.querySelector('[data-form-type="negatif-list"]');
const equipmentReferenceInput = negatifListForm?.querySelector('[name="equipment"]');
const equipmentReferenceResults = document.getElementById("equipment-reference-results");
const equipmentReferenceStatus = document.getElementById("equipment-reference-status");
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
const EQUIPMENT_REFERENCE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRt_ysTFRHmKVY3-hlFDgBYex-BExU0cdFnuBaWOPqxKAo6mqavGhtZeKdTkvvFXsm-uvcOt2QVLHHC/pub?output=csv";
let equipmentReferenceList = [];
let selectedEquipmentReference = "";
const storageKeys = {
  session: "plirm34-session",
  lastSection: "plirm34-last-section",
  negatifList: "plirm34-negatif-list",
  sparepart: "plirm34-sparepart-list",
  service: "plirm34-service-list",
  bom: "plirm34-bom-list",
  spb: "plirm34-spb-list",
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

const roleSections = {
  admin: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
  organik: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
  team: ["dashboard", "negatif-list", "sparepart", "service", "bom", "spb"],
};

const roleEditable = {
  admin: ["negatif-list", "sparepart", "service", "bom", "spb"],
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
    { id: "service-001", type: "Electrical", equipmentName: "Trafo Utility TR-02", description: "Arus fasa tidak seimbang dan perlu investigasi pembebanan.", detail: "Vibrasi DE 1.4 mm/s | Vibrasi NDE 1.1 mm/s" },
    { id: "service-002", type: "Instrument", equipmentName: "Level Transmitter TK-11", description: "Pembacaan level meloncat saat agitator aktif, perlu inspeksi mounting.", detail: "Kondisi sensor: noise sinyal | Foto: level_tk11.jpg" },
    { id: "service-003", type: "DCS", equipmentName: "Engineering Station ES-01", description: "Response HMI melambat pada jam beban puncak dan perlu housekeeping software.", detail: "Fungsi: engineering & konfigurasi | Kebersihan: bersih" },
    { id: "service-004", type: "Electrical", equipmentName: "Motor Conveyor CV-07", description: "Temperatur bearing naik melebihi baseline inspeksi bulan lalu.", detail: "Vibrasi DE 4.2 mm/s | Vibrasi NDE 3.7 mm/s" },
    { id: "service-005", type: "Instrument", equipmentName: "Control Valve Steam CV-12", description: "Actuator masih normal tetapi feedback position sesekali hilang.", detail: "Kondisi sensor: intermittent | Foto: cv12_feedback.jpg" },
    { id: "service-006", type: "DCS", equipmentName: "Panel Network Rack NR-01", description: "Patch cord tidak tertata dan ventilasi rack perlu dibersihkan.", detail: "Fungsi: distribusi jaringan kontrol | Kebersihan: perlu housekeeping" },
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

function hideEquipmentReferenceResults() {
  equipmentReferenceResults?.classList.add("hidden");
  if (equipmentReferenceResults) {
    equipmentReferenceResults.innerHTML = "";
  }
}

function setEquipmentReferenceValue(value) {
  if (!equipmentReferenceInput) {
    return;
  }

  equipmentReferenceInput.value = value;
  selectedEquipmentReference = value;
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

async function loadEquipmentReference() {
  if (!equipmentReferenceInput) {
    return;
  }

  equipmentReferenceInput.disabled = true;
  updateEquipmentReferenceStatus("Memuat referensi equipment dari spreadsheet...");

  try {
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

  applyRoleAccess(session.role);
  currentUser.textContent = session.username;
  currentRole.textContent = roleLabels[session.role] || "Admin";
  loginScreen.classList.add("hidden");
  workspace.classList.remove("hidden");
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
    applySampleDataState();
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
    equipmentName: card.querySelector(".inspection-head strong").textContent,
    description: card.querySelector("p").textContent,
    detail: card.querySelector(".inspection-meta span").textContent,
  }));
}

function persistNegatifList() {
  writeStorage(storageKeys.negatifList, getNegatifItemsFromDom());
}

function persistServiceList() {
  writeStorage(storageKeys.service, getServiceItemsFromDom());
}

function persistSparepartList() {
  writeStorage(storageKeys.sparepart, getSparepartItemsFromDom());
}

function persistBomList() {
  writeStorage(storageKeys.bom, getBomItemsFromDom());
}

function persistSpbList() {
  writeStorage(storageKeys.spb, getSpbItemsFromDom());
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
  [...negatifListBody.querySelectorAll("tr")].forEach((row) => {
    const rowText = row.textContent || "";
    const rowStatus = row.children[5]?.textContent.trim() || "";
    const rowCause = row.children[4]?.textContent.trim() || "";
    const matchesQuery = !query || matchesSearch(rowText, query);
    const matchesStatus = status === "semua" || rowStatus === status;
    const matchesCause = cause === "semua" || rowCause === cause;
    row.hidden = !(matchesQuery && matchesStatus && matchesCause);
  });
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
  card.dataset.id = item.id;
  card.dataset.type = item.type;
  card.innerHTML = `
    <div class="inspection-head">
      <span class="tag ${getServiceTag(item.type)}">${item.type}</span>
      <strong>${item.equipmentName}</strong>
    </div>
    <p>${item.description}</p>
    <div class="inspection-meta">
      <span>${item.detail}</span>
      <span>Status: Draft frontend</span>
    </div>
    <div class="card-actions">
      <button class="table-action" data-action="edit-service" type="button">Edit</button>
      <button class="table-action danger" data-action="delete-service" type="button">Hapus</button>
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

function applySampleDataState() {
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
    storedService.forEach((item) => {
      serviceCardList.append(renderServiceCard(item));
    });
  } else {
    [...serviceCardList.querySelectorAll(".inspection-card")].forEach((card, index) => {
      const type = card.querySelector(".inspection-head .tag").textContent.trim();
      card.dataset.id = createId("service");
      card.dataset.type = type;
      const editButton = card.querySelectorAll(".table-action")[0];
      const deleteButton = card.querySelectorAll(".table-action")[1];
      if (editButton) {
        editButton.dataset.action = "edit-service";
      }
      if (deleteButton) {
        deleteButton.dataset.action = "delete-service";
      }
      if (!card.querySelector(".inspection-meta span")) {
        card.querySelector(".inspection-meta").prepend(`Item ${index + 1}`);
      }
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
  const typeMap = {
    Electrical: 'service-electrical',
    Instrument: 'service-instrument',
    DCS: 'service-dcs',
  };
  const form = document.querySelector(`[data-form-type="${typeMap[item.type]}"]`);
  if (!form) {
    return;
  }

  form.equipmentName.value = item.equipmentName;
  form.description.value = item.description;

  if (item.type === "Electrical") {
    const match = item.detail.match(/Vibrasi DE (.*) \| Vibrasi NDE (.*)/);
    form.vibrationDe.value = match?.[1] || "";
    form.vibrationNde.value = match?.[2] || "";
  }

  if (item.type === "Instrument") {
    const match = item.detail.match(/Kondisi sensor: (.*) \| Foto: (.*)/);
    form.sensorCondition.value = match?.[1] || "";
  }

  if (item.type === "DCS") {
    const match = item.detail.match(/Fungsi: (.*) \| Kebersihan: (.*)/);
    form.equipmentFunction.value = match?.[1] || "";
    form.environmentCleanliness.value = match?.[2] || "";
  }

  editingServiceId = item.id;
  setSubmitNote(form, `Mode edit aktif untuk service ${item.type}.`);
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
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "user.plirm34").trim();
    const role = String(formData.get("role") || "admin");

    applyRoleAccess(role);
    currentUser.textContent = username || "user.plirm34";
    currentRole.textContent = roleLabels[role] || "Admin";
    saveSession(username || "user.plirm34", role);

    loginScreen.classList.add("hidden");
    workspace.classList.remove("hidden");
    openSection("dashboard");
  });
}

loadStoredData();
loadEquipmentReference();
restoreSession();

if (!hasAnyStoredData()) {
  applySampleDataState();
  if (sampleDataStatus) {
    sampleDataStatus.textContent = "Sample data aktif otomatis karena data lokal masih kosong.";
  }
}

bootstrapDebugMode();

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

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    openSection(item.dataset.section);
    if (window.innerWidth <= 640) {
      sidebar?.classList.remove("menu-open");
    }
  });
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openSection(button.dataset.sectionJump);
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formType = form.dataset.formType;
    const formData = new FormData(form);

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
      if (editingNegatifId) {
        const existing = negatifListBody.querySelector(`tr[data-id="${editingNegatifId}"]`);
        if (existing) {
          existing.replaceWith(renderNegatifRow(item));
        }
        setSubmitNote(form, "Negatif list berhasil diperbarui.");
        showToast("Negatif List", "Data berhasil diperbarui.");
        editingNegatifId = null;
      } else {
        appendNegatifListRow(item);
        setSubmitNote(form, "Negatif list baru berhasil ditambahkan ke tabel frontend.");
        showToast("Negatif List", "Item baru berhasil ditambahkan.");
      }
      persistNegatifList();
      updateDashboardStats();
      applyNegatifListFilter();
    }

    if (formType === "service-electrical") {
      const item = {
        id: editingServiceId || createId("service"),
        type: "Electrical",
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
        detail: `Vibrasi DE ${String(formData.get("vibrationDe") || "-")} | Vibrasi NDE ${String(formData.get("vibrationNde") || "-")}`,
      };
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(item));
        }
        setSubmitNote(form, "Service electrical berhasil diperbarui.");
        showToast("Service Electrical", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(item);
        setSubmitNote(form, "Service electrical berhasil ditambahkan ke daftar service.");
        showToast("Service Electrical", "Item baru berhasil ditambahkan.");
      }
      persistServiceList();
      updateDashboardStats();
      applyServiceFilter();
    }

    if (formType === "service-instrument") {
      const photo = formData.get("findingPhoto");
      const photoName = photo && typeof photo === "object" && "name" in photo && photo.name ? photo.name : "tidak ada file";
      const item = {
        id: editingServiceId || createId("service"),
        type: "Instrument",
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
        detail: `Kondisi sensor: ${String(formData.get("sensorCondition") || "-")} | Foto: ${photoName}`,
      };
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(item));
        }
        setSubmitNote(form, "Service instrument berhasil diperbarui.");
        showToast("Service Instrument", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(item);
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
        equipmentName: String(formData.get("equipmentName") || "-"),
        description: String(formData.get("description") || "-"),
        detail: `Fungsi: ${String(formData.get("equipmentFunction") || "-")} | Kebersihan: ${String(formData.get("environmentCleanliness") || "-")}`,
      };
      if (editingServiceId) {
        const existing = serviceCardList.querySelector(`[data-id="${editingServiceId}"]`);
        if (existing) {
          existing.replaceWith(renderServiceCard(item));
        }
        setSubmitNote(form, "Service DCS berhasil diperbarui.");
        showToast("Service DCS", "Data berhasil diperbarui.");
        editingServiceId = null;
      } else {
        appendServiceCard(item);
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
      if (editingSparepartId) {
        const existing = sparepartBody.querySelector(`tr[data-id="${editingSparepartId}"]`);
        if (existing) existing.replaceWith(renderSparepartRow(item));
        setSubmitNote(form, "Sparepart berhasil diperbarui.");
        showToast("Sparepart", "Data berhasil diperbarui.");
        editingSparepartId = null;
        persistSparepartList();
        updateDashboardStats();
        applySparepartFilter();
      } else {
        appendSparepartRow(item);
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
      if (editingBomId) {
        const existing = bomList.querySelector(`[data-id="${editingBomId}"]`);
        if (existing) existing.replaceWith(renderBomCard(item));
        setSubmitNote(form, "BOM berhasil diperbarui.");
        showToast("BOM", "Data berhasil diperbarui.");
        editingBomId = null;
        persistBomList();
        updateDashboardStats();
        applyBomFilter();
      } else {
        appendBomCard(item);
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
      if (editingSpbId) {
        const existing = spbBody.querySelector(`tr[data-id="${editingSpbId}"]`);
        if (existing) existing.replaceWith(renderSpbRow(item));
        setSubmitNote(form, "SPB berhasil diperbarui.");
        showToast("SPB", "Data berhasil diperbarui.");
        editingSpbId = null;
        persistSpbList();
        updateDashboardStats();
        applySpbFilter();
      } else {
        appendSpbRow(item);
        setSubmitNote(form, "SPB berhasil ditambahkan.");
        showToast("SPB", "Item baru berhasil ditambahkan.");
      }
    }

    form.reset();
  });
});

negatifListBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const row = target.closest("tr");
  if (!row) {
    return;
  }

  if (target.dataset.action === "delete-negatif") {
    row.remove();
    persistNegatifList();
    updateDashboardStats();
    applyNegatifListFilter();
    showToast("Negatif List", "Item berhasil dihapus.");
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
  }
});

sparepartBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const row = target.closest("tr");
  if (!row) return;

  if (target.dataset.action === "delete-sparepart") {
    row.remove();
    persistSparepartList();
    updateDashboardStats();
    applySparepartFilter();
    showToast("Sparepart", "Item berhasil dihapus.");
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
  }
});

serviceCardList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const card = target.closest(".inspection-card");
  if (!card) {
    return;
  }

  if (target.dataset.action === "delete-service") {
    card.remove();
    persistServiceList();
    updateDashboardStats();
    applyServiceFilter();
    showToast("Service", "Item berhasil dihapus.");
  }

  if (target.dataset.action === "edit-service") {
    hydrateServiceForm({
      id: card.dataset.id,
      type: card.dataset.type,
      equipmentName: card.querySelector(".inspection-head strong").textContent,
      description: card.querySelector("p").textContent,
      detail: card.querySelector(".inspection-meta span").textContent,
    });
    openSection("service");
  }
});

bomList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const card = target.closest(".bom-card");
  if (!card) return;

  if (target.dataset.action === "delete-bom") {
    card.remove();
    persistBomList();
    updateDashboardStats();
    applyBomFilter();
    showToast("BOM", "Item berhasil dihapus.");
  }

  if (target.dataset.action === "edit-bom") {
    hydrateBomForm({
      id: card.dataset.id,
      name: card.querySelector(".bom-copy strong").textContent,
      description: card.querySelector(".bom-copy p").textContent,
      meta: card.querySelector(".bom-copy small").textContent,
    });
    openSection("bom");
  }
});

spbBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const row = target.closest("tr");
  if (!row) return;

  if (target.dataset.action === "delete-spb") {
    row.remove();
    persistSpbList();
    updateDashboardStats();
    applySpbFilter();
    showToast("SPB", "Item berhasil dihapus.");
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
  }
});

searchNegatifList?.addEventListener("input", applyNegatifListFilter);
filterNegatifPriority?.addEventListener("change", applyNegatifListFilter);
filterNegatifCause?.addEventListener("change", applyNegatifListFilter);
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
      downloadCsv("service.csv", ["Tipe", "Equipment", "Deskripsi", "Detail"], items.map((item) => [item.type, item.equipmentName, item.description, item.detail]));
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
  logoutButton.addEventListener("click", () => {
    workspace.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    loginForm.reset();
    activeRole = "admin";
    clearSession();
  });
}
