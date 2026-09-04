(function initializeOvertimeModule() {
  "use strict";

  const root = document.querySelector('[data-panel="overtime"]');
  if (!root) return;

  const elements = {
    state: document.getElementById("overtime-state"),
    adminPanel: document.getElementById("overtime-admin-panel"),
    personnelAdmin: document.getElementById("overtime-personnel-admin"),
    importFile: document.getElementById("overtime-import-file"),
    importButton: document.getElementById("overtime-import-button"),
    importNote: document.getElementById("overtime-import-note"),
    fileName: document.getElementById("overtime-file-name"),
    scheduleFile: document.getElementById("overtime-schedule-file"),
    scheduleFileName: document.getElementById("overtime-schedule-file-name"),
    scheduleImportButton: document.getElementById("overtime-schedule-import-button"),
    scheduleNote: document.getElementById("overtime-schedule-note"),
    startDate: document.getElementById("overtime-start-date"),
    endDate: document.getElementById("overtime-end-date"),
    contractPeriod: document.getElementById("overtime-contract-period"),
    search: document.getElementById("overtime-search"),
    group: document.getElementById("overtime-group-filter"),
    company: document.getElementById("overtime-company-filter"),
    dayType: document.getElementById("overtime-day-filter"),
    status: document.getElementById("overtime-status-filter"),
    refresh: document.getElementById("overtime-refresh-button"),
    totalRaw: document.getElementById("overtime-total-raw"),
    totalLive: document.getElementById("overtime-total-live"),
    unclassified: document.getElementById("overtime-unclassified"),
    people: document.getElementById("overtime-people"),
    annualUsed: document.getElementById("overtime-annual-used"),
    annualRemaining: document.getElementById("overtime-annual-remaining"),
    groupSummary: document.getElementById("overtime-group-summary"),
    trend: document.getElementById("overtime-trend"),
    ranking: document.getElementById("overtime-ranking-body"),
    rankingCompany: document.getElementById("overtime-ranking-company"),
    rankingGroup: document.getElementById("overtime-ranking-group"),
    rankingQuota: document.getElementById("overtime-ranking-quota"),
    transactions: document.getElementById("overtime-transaction-body"),
    tableNote: document.getElementById("overtime-table-note"),
    selectAll: document.getElementById("overtime-select-all"),
    bulkBar: document.getElementById("overtime-bulk-bar"),
    selectedCount: document.getElementById("overtime-selected-count"),
    personnel: document.getElementById("overtime-personnel-body"),
    prev: document.getElementById("overtime-prev-page"),
    next: document.getElementById("overtime-next-page"),
    pageLabel: document.getElementById("overtime-page-label"),
  };

  const state = {
    role: "team",
    page: 1,
    pages: 1,
    loading: false,
    loadedRange: "",
    selected: new Map(),
    payload: null,
    searchTimer: null,
  };

  function previousMonthRange() {
    const value = new Date();
    value.setDate(1);
    value.setMonth(value.getMonth() - 1);
    const start = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-01`;
    const end = new Date(value.getFullYear(), value.getMonth() + 1, 0);
    return { start, end: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}` };
  }

  function rangeKey() {
    return `${elements.startDate?.value || ""}|${elements.endDate?.value || ""}`;
  }

  function monthRange(period) {
    const [year, month] = String(period || "").split("-").map(Number);
    if (!year || !month) return previousMonthRange();
    const end = new Date(year, month, 0);
    return { start: `${period}-01`, end: `${period}-${String(end.getDate()).padStart(2, "0")}` };
  }

  function sbgOvertimeCycle() {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 2);
    if (today.getDate() < 2) start.setMonth(start.getMonth() - 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const format = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
    return { start: format(start), end: format(end) };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatHours(value) {
    return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value || 0));
  }

  function formatDate(value) {
    const parts = String(value || "").split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : String(value || "-");
  }

  function formatContractPeriod(contractPeriod) {
    if (!contractPeriod?.startDate || !contractPeriod?.endDate) return "PT belum dipetakan";
    return `${formatDate(contractPeriod.startDate)}–${formatDate(contractPeriod.endDate)}`;
  }

  function formatOptionalHours(value) {
    return value === null || value === undefined ? "—" : formatHours(value);
  }

  function groupLabel(value) {
    return { gangguan: "Gangguan", preventif: "Preventif", unassigned: "Belum ditentukan" }[value] || "Belum ditentukan";
  }

  function dayLabel(value) {
    return { workday: "Hari kerja", day_off: "Hari libur", unknown: "Belum diklasifikasi" }[value] || "Belum diklasifikasi";
  }

  function setMessage(message, kind = "") {
    if (!elements.state) return;
    elements.state.textContent = message;
    elements.state.classList.remove("hidden", "is-error", "is-success");
    if (kind) elements.state.classList.add(`is-${kind}`);
  }

  function clearMessage() {
    elements.state?.classList.add("hidden");
  }

  async function request(path, options = {}) {
    const response = await fetch(`/api${path}`, {
      method: options.method || "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }
    if (!response.ok) {
      const error = new Error(payload.error || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function filtersQuery() {
    const query = new URLSearchParams({
      startDate: elements.startDate?.value || previousMonthRange().start,
      endDate: elements.endDate?.value || previousMonthRange().end,
      page: String(state.page),
      limit: "50",
    });
    if (elements.search?.value.trim()) query.set("search", elements.search.value.trim());
    if (elements.group?.value) query.set("group", elements.group.value);
    if (elements.company?.value) query.set("company", elements.company.value);
    if (elements.dayType?.value) query.set("dayType", elements.dayType.value);
    if (elements.status?.value) query.set("status", elements.status.value);
    return query.toString();
  }

  function updateContractWindow(contractPeriods = {}, resetRange = false) {
    const companyKey = elements.company?.value || "";
    const contract = contractPeriods[companyKey];
    if (!contract) {
      elements.contractPeriod.textContent = "Semua PT · pilih PT untuk periode kontrak";
      elements.startDate.removeAttribute("min");
      elements.startDate.removeAttribute("max");
      elements.endDate.removeAttribute("min");
      elements.endDate.removeAttribute("max");
      return;
    }
    const sbgCycle = companyKey === "sbg" ? sbgOvertimeCycle() : null;
    elements.contractPeriod.textContent = sbgCycle
      ? `${contract.companyName} · Siklus lembur ${formatDate(sbgCycle.start)}–${formatDate(sbgCycle.end)}`
      : `${contract.companyName} · ${formatDate(contract.startDate)}–${formatDate(contract.endDate)}`;
    elements.startDate.min = contract.startDate;
    elements.startDate.max = contract.endDate;
    elements.endDate.min = contract.startDate;
    elements.endDate.max = contract.endDate;
    if (resetRange) {
      const rangeStart = sbgCycle ? (sbgCycle.start < contract.startDate ? contract.startDate : sbgCycle.start) : contract.startDate;
      const rangeEnd = sbgCycle ? (sbgCycle.end > contract.endDate ? contract.endDate : sbgCycle.end) : contract.endDate;
      // A future cycle can fall entirely outside a completed contract. Keep both
      // controls valid rather than sending an inverted date range to the API.
      elements.startDate.value = rangeStart <= rangeEnd ? rangeStart : contract.endDate;
      elements.endDate.value = rangeStart <= rangeEnd ? rangeEnd : contract.endDate;
    }
  }

  function renderMetrics(summary = {}) {
    elements.totalRaw.textContent = formatHours(summary.totalRawHours);
    elements.totalLive.textContent = formatHours(summary.totalLiveHours);
    elements.unclassified.textContent = new Intl.NumberFormat("id-ID").format(summary.unclassifiedCount || 0);
    elements.people.textContent = new Intl.NumberFormat("id-ID").format(summary.peopleCount || 0);
    elements.annualUsed.textContent = formatHours(summary.annualUsedHours);
    elements.annualRemaining.textContent = formatHours(summary.annualRemainingHours);
  }

  function renderGroups(groups = []) {
    if (!elements.groupSummary) return;
    elements.groupSummary.innerHTML = groups.map((group) => `
      <article class="overtime-group-card">
        <span class="overtime-group-badge is-${escapeHtml(group.groupType)}">${escapeHtml(groupLabel(group.groupType))}</span>
        <strong>${formatHours(group.liveHours)} jam</strong>
        <span>${formatHours(group.rawHours)} jam mati · ${group.people || 0} personel</span>
        <small>${group.unclassifiedCount || 0} transaksi belum diklasifikasi</small>
      </article>
    `).join("");
  }

  function renderTrend(items = []) {
    if (!elements.trend) return;
    const maxValue = Math.max(1, ...items.map((item) => Number(item.liveHours || 0)));
    elements.trend.innerHTML = items.map((item) => {
      const height = Math.max(3, Math.round(Number(item.liveHours || 0) / maxValue * 112));
      const month = String(item.period || "").slice(5);
      return `<div class="overtime-trend-item" title="${escapeHtml(item.period)}: ${formatHours(item.liveHours)} jam hidup">
        <span style="height:${height}px"></span><small>${escapeHtml(month)}</small>
      </div>`;
    }).join("");
  }

  function progressMarkup(person) {
    const width = Math.min(100, Math.max(0, Number(person.annualUsagePercent || 0)));
    return person.contractPeriod
      ? `<div class="overtime-progress" aria-label="${width}% kuota kontrak terpakai"><span style="width:${width}%"></span></div>`
      : "";
  }

  function groupSelect(person) {
    if (state.role !== "admin") {
      return `<span class="overtime-group-badge is-${escapeHtml(person.groupType)}">${escapeHtml(groupLabel(person.groupType))}</span>`;
    }
    return `<select class="overtime-group-select" data-overtime-employee="${escapeHtml(person.employeeNo)}" aria-label="Grup ${escapeHtml(person.employeeName)}">
      <option value="unassigned" ${person.groupType === "unassigned" ? "selected" : ""}>Belum ditentukan</option>
      <option value="gangguan" ${person.groupType === "gangguan" ? "selected" : ""}>Gangguan</option>
      <option value="preventif" ${person.groupType === "preventif" ? "selected" : ""}>Preventif</option>
    </select>`;
  }

  function renderRanking(items = []) {
    if (!elements.ranking) return;
    const filtered = items.filter((person) => (
      (!elements.rankingCompany?.value || person.companyName === elements.rankingCompany.value)
      && (!elements.rankingGroup?.value || person.groupType === elements.rankingGroup.value)
      && (!elements.rankingQuota?.value || person.quotaStatus?.key === elements.rankingQuota.value)
    ));
    if (!filtered.length) {
      elements.ranking.innerHTML = '<tr><td class="overtime-empty-row" colspan="7">Belum ada personel pada slicer ini.</td></tr>';
      return;
    }
    elements.ranking.innerHTML = filtered.slice(0, 20).map((person) => `
      <tr>
        <td><strong>${escapeHtml(person.employeeName)}</strong><small>${escapeHtml(person.employeeNo)}</small></td>
        <td><span class="overtime-company-badge">${escapeHtml(person.companyName || "Belum dipetakan")}</span><small>${escapeHtml(formatContractPeriod(person.contractPeriod))}</small></td>
        <td>${groupSelect(person)}</td>
        <td><strong class="overtime-live-value">${formatHours(person.monthLiveHours)} jam</strong><small>${escapeHtml(person.monthStatus?.label || "-")}</small></td>
        <td><strong>${formatOptionalHours(person.contractLiveHours)}${person.contractPeriod ? " jam" : ""}</strong>${progressMarkup(person)}</td>
        <td>${formatOptionalHours(person.annualRemainingHours)}${person.contractPeriod ? " jam" : ""}</td>
        <td><span class="overtime-quota-badge is-${escapeHtml(person.quotaStatus?.key || "normal")}">${escapeHtml(person.quotaStatus?.label || "Normal")}</span></td>
      </tr>
    `).join("");
  }

  function dayControl(item) {
    const source = item.classificationSource === "schedule"
      ? `<small class="overtime-classification-source">Otomatis dari ${item.scheduleMatch === "name" ? "nama" : "badge"}: ${escapeHtml(item.scheduleShiftCode || "jadwal kerja")}</small>`
      : item.classificationSource === "manual"
        ? '<small class="overtime-classification-source">Override manual</small>'
        : '<small class="overtime-classification-source">Belum ada jadwal</small>';
    if (state.role !== "admin") {
      return `<span class="overtime-day-badge is-${escapeHtml(item.dayType)}">${escapeHtml(dayLabel(item.dayType))}</span>${source}`;
    }
    return `<select class="overtime-day-select" data-overtime-day-employee="${escapeHtml(item.employeeNo)}" data-overtime-day-date="${escapeHtml(item.workDate)}" aria-label="Tipe hari ${escapeHtml(item.employeeName)} ${escapeHtml(item.workDate)}">
      <option value="unknown" ${item.classificationSource !== "manual" ? "selected" : ""}>Otomatis dari jadwal</option>
      <option value="workday" ${item.classificationSource === "manual" && item.dayType === "workday" ? "selected" : ""}>Hari kerja</option>
      <option value="day_off" ${item.classificationSource === "manual" && item.dayType === "day_off" ? "selected" : ""}>Hari libur</option>
    </select>${source}`;
  }

  function renderTransactions(items = [], pagination = {}) {
    state.selected.clear();
    updateBulkBar();
    document.querySelectorAll(".overtime-admin-column").forEach((node) => node.classList.toggle("hidden", state.role !== "admin"));
    if (!items.length) {
      elements.transactions.innerHTML = '<tr><td class="overtime-empty-row" colspan="10">Belum ada transaksi untuk filter ini.</td></tr>';
    } else {
      elements.transactions.innerHTML = items.map((item) => {
        const key = `${item.employeeNo}|${item.workDate}`;
        const audit = item.hasDurationMismatch
          ? `<span class="overtime-audit-warning">Berbeda ${formatHours(Math.abs(item.durationDelta))} jam</span><small>Selisih waktu ${formatHours(item.clockDurationHours)} jam</small>`
          : `<span>Sesuai</span><small>Selisih waktu ${formatHours(item.clockDurationHours)} jam</small>`;
        return `<tr>
          <td class="overtime-admin-column ${state.role === "admin" ? "" : "hidden"}"><input type="checkbox" data-overtime-select="${escapeHtml(key)}" data-employee="${escapeHtml(item.employeeNo)}" data-date="${escapeHtml(item.workDate)}" aria-label="Pilih ${escapeHtml(item.employeeName)} ${escapeHtml(item.workDate)}"></td>
          <td><strong>${formatDate(item.workDate)}</strong><small>${escapeHtml(item.startTime.slice(0, 5))}–${escapeHtml(item.endTime.slice(0, 5))}</small></td>
          <td><strong>${escapeHtml(item.employeeName)}</strong><small>${escapeHtml(item.employeeNo)} · ${escapeHtml(groupLabel(item.groupType))}</small></td>
          <td><span class="overtime-company-badge">${escapeHtml(item.companyName || "Belum dipetakan")}</span></td>
          <td><strong>${escapeHtml(item.task || "-")}</strong><small>${escapeHtml(item.unitName || "-")}</small></td>
          <td><span class="overtime-status-badge">${escapeHtml(item.status || "-")}</span></td>
          <td><strong class="overtime-raw-value">${formatHours(item.rawHours)}</strong><small>jam mati</small>${item.deductionHours > 0 ? `<small class="overtime-classification-source" title="${escapeHtml(item.deductionReason || '')}">-${formatHours(item.deductionHours)} jam (${escapeHtml(item.deductionReason || 'potongan')})</small>` : ''}</td>
          <td>${dayControl(item)}</td>
          <td>${item.liveHours === null ? '<span class="overtime-day-badge is-unknown">Belum dihitung</span>' : `<strong class="overtime-live-value">${formatHours(item.liveHours)}</strong><small>jam hidup</small>`}<small class="overtime-classification-source ${item.quotaEligible ? "" : "is-outside-contract"}">${escapeHtml(item.quotaEligibilityLabel || "")}</small></td>
          <td>${audit}</td>
        </tr>`;
      }).join("");
    }
    state.page = Number(pagination.page || 1);
    state.pages = Number(pagination.pages || 1);
    elements.pageLabel.textContent = `Halaman ${state.page} dari ${state.pages}`;
    elements.prev.disabled = state.page <= 1;
    elements.next.disabled = state.page >= state.pages;
    elements.tableNote.textContent = `${pagination.total || 0} transaksi sesuai filter. Semua status sumber tetap dihitung setelah tipe hari ditentukan.`;
  }

  function renderStatuses(statuses = []) {
    const selected = elements.status.value;
    elements.status.innerHTML = '<option value="">Semua status</option>' + statuses.map((status) => (
      `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`
    )).join("");
    if (statuses.includes(selected)) elements.status.value = selected;
  }

  function renderCompanies(companies = []) {
    if (!elements.company) return;
    const selected = elements.company.value;
    elements.company.innerHTML = '<option value="">Semua PT</option>' + companies.map((company) => (
      `<option value="${escapeHtml(company.key)}">${escapeHtml(company.name)}</option>`
    )).join("");
    if (companies.some((company) => company.key === selected)) elements.company.value = selected;
  }

  function renderRankingCompanies(items = []) {
    if (!elements.rankingCompany) return;
    const selected = elements.rankingCompany.value;
    const companies = [...new Set(items.map((item) => item.companyName).filter(Boolean))].sort();
    elements.rankingCompany.innerHTML = '<option value="">Semua PT</option>' + companies.map((name) => (
      `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
    )).join("");
    if (companies.includes(selected)) elements.rankingCompany.value = selected;
  }

  function renderPersonnel(items = []) {
    if (!elements.personnel) return;
    if (!items.length) {
      elements.personnel.innerHTML = '<tr><td class="overtime-empty-row" colspan="6">Belum ada master personel.</td></tr>';
      return;
    }
    elements.personnel.innerHTML = items.map((person) => `
      <tr><td>${escapeHtml(person.employeeNo)}</td><td><strong>${escapeHtml(person.employeeName)}</strong></td><td><span class="overtime-company-badge">${escapeHtml(person.companyName || "Belum dipetakan")}</span><small>${escapeHtml(formatContractPeriod(person.contractPeriod))}</small></td><td>${groupSelect(person)}</td><td>${formatOptionalHours(person.contractLiveHours)}${person.contractPeriod ? " jam" : ""}</td><td><span class="overtime-quota-badge is-${escapeHtml(person.quotaStatus?.key || "normal")}">${escapeHtml(person.quotaStatus?.label || "Normal")}</span></td></tr>
    `).join("");
  }

  async function loadPersonnel() {
    if (state.role !== "admin") return;
    const period = (elements.endDate.value || previousMonthRange().end).slice(0, 7);
    const payload = await request(`/overtime/personnel?year=${encodeURIComponent(period.slice(0, 4))}&period=${encodeURIComponent(period)}`);
    renderPersonnel(payload.items || []);
  }

  async function load(options = {}) {
    if (state.loading) return;
    if (options.resetPage) state.page = 1;
    state.loading = true;
    root.setAttribute("aria-busy", "true");
    setMessage("Memuat transaksi dan menghitung kuota lembur…");
    try {
      const payload = await request(`/overtime?${filtersQuery()}`);
      state.payload = payload;
      state.loadedRange = rangeKey();
      renderMetrics(payload.summary || {});
      renderGroups(payload.summary?.groupTotals || []);
      renderTrend(payload.summary?.trend || []);
      renderRankingCompanies(payload.summary?.ranking || []);
      renderRanking(payload.summary?.ranking || []);
      renderTransactions(payload.items || [], payload.pagination || {});
      renderStatuses(payload.availableStatuses || []);
      renderCompanies(payload.availableCompanies || []);
      updateContractWindow(payload.summary?.contractPeriods || {});
      if (payload.activeBatch) {
        elements.importNote.textContent = `Batch aktif: ${payload.activeBatch.file_name} · ${payload.activeBatch.row_count} baris · ${String(payload.activeBatch.imported_at || "").replace("T", " ").slice(0, 16)}`;
      } else if ((payload.activeBatches || []).length) {
        elements.importNote.textContent = `${payload.activeBatches.length} batch aktif pada rentang ${formatDate(payload.range?.startDate)}–${formatDate(payload.range?.endDate)}.`;
      } else {
        elements.importNote.textContent = "Belum ada file untuk rentang tanggal ini.";
      }
      if (payload.activeScheduleBatch) {
        elements.scheduleNote.textContent = `Jadwal aktif: ${payload.activeScheduleBatch.file_name} · ${payload.activeScheduleBatch.row_count} entri · sinkron otomatis aktif.`;
      } else {
        elements.scheduleNote.textContent = "Belum ada jadwal kerja tersinkron; klasifikasi masih manual.";
      }
      await loadPersonnel();
      clearMessage();
    } catch (error) {
      setMessage(error.message || "Gagal memuat data lembur.", "error");
      renderTransactions([], { page: 1, pages: 1, total: 0 });
    } finally {
      state.loading = false;
      root.removeAttribute("aria-busy");
    }
  }

  function updateBulkBar() {
    const count = state.selected.size;
    elements.selectedCount.textContent = String(count);
    elements.bulkBar.classList.toggle("hidden", state.role !== "admin" || count === 0);
    if (elements.selectAll && count === 0) elements.selectAll.checked = false;
  }

  async function saveDayTypes(classifications) {
    setMessage("Menyimpan klasifikasi hari…");
    try {
      await request("/admin/overtime/day-types", { method: "PUT", body: { classifications } });
      setMessage(`${classifications.length} klasifikasi berhasil disimpan.`, "success");
      await load();
    } catch (error) {
      setMessage(error.message || "Gagal menyimpan klasifikasi.", "error");
    }
  }

  async function saveGroup(employeeNo, groupType) {
    setMessage("Menyimpan mapping grup personel…");
    try {
      await request(`/admin/overtime/personnel/${encodeURIComponent(employeeNo)}`, { method: "PUT", body: { groupType } });
      setMessage("Mapping grup berhasil disimpan.", "success");
      await load();
    } catch (error) {
      setMessage(error.message || "Gagal menyimpan mapping grup.", "error");
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("File gagal dibaca oleh browser."));
      reader.readAsDataURL(file);
    });
  }

  async function importFile() {
    const file = elements.importFile.files?.[0];
    if (!file) {
      setMessage("Pilih file .xls yang akan diimpor.", "error");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".xls")) {
      setMessage("Format file harus .xls.", "error");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setMessage("Ukuran file melebihi batas 12 MB.", "error");
      return;
    }
    elements.importButton.disabled = true;
    elements.importButton.textContent = "Memvalidasi…";
    setMessage("Memvalidasi struktur, tanggal, dan isi file…");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const fileData = dataUrl.split(",", 2)[1] || "";
      const preview = await request("/admin/overtime/import", {
        method: "POST",
        body: { fileName: file.name, fileData, previewOnly: true },
      });
      const periods = (preview.periodDetails || []).map((item) => `${item.period} (${item.rowCount} transaksi)`);
      const replacements = (preview.periodDetails || []).filter((item) => item.willReplace);
      const confirmed = window.confirm([
        `Periode terdeteksi: ${(preview.periods || []).join(", ")}`,
        periods.join("\n"),
        `${preview.rowCount} transaksi dari ${preview.peopleCount} personel`,
        `${formatHours(preview.totalRawHours)} jam mati`,
        `${preview.durationMismatchCount} selisih durasi untuk diaudit`,
        `Rentang ${preview.dateFrom} s.d. ${preview.dateTo}`,
        preview.noOp
          ? "File identik sudah aktif pada semua bulan; tidak ada transaksi yang akan diubah."
          : replacements.length
            ? `${replacements.length} bulan dengan ${preview.activeRowCount} transaksi aktif akan diganti secara atomik.`
            : "Belum ada batch aktif pada bulan-bulan file ini.",
        "Lanjutkan impor?",
      ].join("\n"));
      if (!confirmed) {
        setMessage("File valid. Impor dibatalkan sebelum data diubah.");
        return;
      }
      elements.importButton.textContent = "Mengimpor…";
      setMessage("Mengganti transaksi setiap bulan secara atomik…");
      const result = await request("/admin/overtime/import", {
        method: "POST",
        body: { fileName: file.name, fileData },
      });
      const importedRange = monthRange(result.latestPeriod || preview.latestPeriod);
      elements.startDate.value = importedRange.start;
      elements.endDate.value = importedRange.end;
      state.page = 1;
      setMessage(result.noOp ? "File identik sudah pernah diimpor; tidak ada data yang diubah." : `${result.imported} transaksi dari ${(result.periods || []).length} bulan berhasil diimpor.`, "success");
      await load();
    } catch (error) {
      setMessage(error.message || "Impor file gagal.", "error");
    } finally {
      elements.importButton.disabled = false;
      elements.importButton.textContent = "Validasi & Impor";
    }
  }

  async function importSchedule() {
    const file = elements.scheduleFile.files?.[0];
    if (!file) {
      setMessage("Pilih file jadwal kerja .xlsx.", "error");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setMessage("Format jadwal kerja harus .xlsx.", "error");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setMessage("Ukuran jadwal kerja melebihi batas 12 MB.", "error");
      return;
    }
    elements.scheduleImportButton.disabled = true;
    elements.scheduleImportButton.textContent = "Memvalidasi…";
    setMessage("Membaca jadwal bulanan dan revisi…");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const fileData = dataUrl.split(",", 2)[1] || "";
      const preview = await request("/admin/overtime/schedule/import", {
        method: "POST",
        body: { fileName: file.name, fileData, previewOnly: true },
      });
      const revisions = (preview.sheets || []).filter((sheet) => Number(sheet.revisionRank || 0) > 0).map((sheet) => sheet.name);
      const confirmed = window.confirm([
        `Preview jadwal kerja: ${preview.fileName}`,
        `${preview.entryCount} jadwal dari ${preview.peopleCount} personel`,
        `Periode: ${(preview.months || []).join(", ")}`,
        revisions.length ? `Revisi diprioritaskan: ${revisions.join(", ")}` : "Tidak ada sheet revisi.",
        "Jadwal aktif lama akan diganti. Override manual tetap dipertahankan.",
        "Sinkronkan sekarang?",
      ].join("\n"));
      if (!confirmed) {
        setMessage("Jadwal valid. Sinkronisasi dibatalkan sebelum data diubah.");
        return;
      }
      elements.scheduleImportButton.textContent = "Menyinkronkan…";
      const result = await request("/admin/overtime/schedule/import", {
        method: "POST",
        body: { fileName: file.name, fileData },
      });
      setMessage(result.noOp ? "Jadwal identik sudah aktif; tidak ada perubahan." : `${result.imported} jadwal berhasil disinkronkan otomatis.`, "success");
      await load({ resetPage: true });
    } catch (error) {
      setMessage(error.message || "Gagal menyinkronkan jadwal kerja.", "error");
    } finally {
      elements.scheduleImportButton.disabled = false;
      elements.scheduleImportButton.textContent = "Validasi & Sinkronkan Jadwal";
    }
  }

  root.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target === elements.importFile) {
      const file = elements.importFile.files?.[0];
      elements.fileName.textContent = file ? file.name : "Pilih file transaksi lembur";
      elements.importNote.textContent = file ? `${new Intl.NumberFormat("id-ID").format(file.size)} byte siap divalidasi.` : "Belum ada file dipilih.";
      return;
    }
    if (target === elements.scheduleFile) {
      const file = elements.scheduleFile.files?.[0];
      elements.scheduleFileName.textContent = file ? file.name : "Pilih file jadwal kerja";
      elements.scheduleNote.textContent = file ? `${new Intl.NumberFormat("id-ID").format(file.size)} byte siap divalidasi.` : "Belum ada jadwal kerja dipilih.";
      return;
    }
    if (target.matches("[data-overtime-select]")) {
      const checkbox = target;
      const key = checkbox.dataset.overtimeSelect;
      if (checkbox.checked) state.selected.set(key, { employeeNo: checkbox.dataset.employee, workDate: checkbox.dataset.date });
      else state.selected.delete(key);
      updateBulkBar();
      return;
    }
    if (target.matches(".overtime-day-select")) {
      void saveDayTypes([{ employeeNo: target.dataset.overtimeDayEmployee, workDate: target.dataset.overtimeDayDate, dayType: target.value }]);
      return;
    }
    if (target.matches(".overtime-group-select")) {
      void saveGroup(target.dataset.overtimeEmployee, target.value);
      return;
    }
    if ([elements.rankingCompany, elements.rankingGroup, elements.rankingQuota].includes(target)) {
      renderRanking(state.payload?.summary?.ranking || []);
      return;
    }
    if (target === elements.company) {
      updateContractWindow(state.payload?.summary?.contractPeriods || {}, true);
      void load({ resetPage: true });
      return;
    }
    if ([elements.startDate, elements.endDate, elements.group, elements.dayType, elements.status].includes(target)) {
      void load({ resetPage: true });
    }
  });

  root.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("button") : null;
    if (!target) return;
    if (target === elements.importButton) {
      void importFile();
      return;
    }
    if (target === elements.scheduleImportButton) {
      void importSchedule();
      return;
    }
    if (target === elements.refresh) {
      void load();
      return;
    }
    if (target === elements.prev && state.page > 1) {
      state.page -= 1;
      void load();
      return;
    }
    if (target === elements.next && state.page < state.pages) {
      state.page += 1;
      void load();
      return;
    }
    if (target.dataset.overtimeBulkDay) {
      const dayType = target.dataset.overtimeBulkDay;
      const classifications = [...state.selected.values()].map((item) => ({ ...item, dayType }));
      if (classifications.length) void saveDayTypes(classifications);
    }
  });

  elements.selectAll?.addEventListener("change", () => {
    root.querySelectorAll("[data-overtime-select]").forEach((checkbox) => {
      checkbox.checked = elements.selectAll.checked;
      const key = checkbox.dataset.overtimeSelect;
      if (checkbox.checked) state.selected.set(key, { employeeNo: checkbox.dataset.employee, workDate: checkbox.dataset.date });
      else state.selected.delete(key);
    });
    updateBulkBar();
  });

  elements.search?.addEventListener("input", () => {
    window.clearTimeout(state.searchTimer);
    state.searchTimer = window.setTimeout(() => void load({ resetPage: true }), 320);
  });

  const initialRange = previousMonthRange();
  elements.startDate.value = initialRange.start;
  elements.endDate.value = initialRange.end;

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  function ensureDatePickerModal() {
    let modal = document.getElementById("overtime-datepicker-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "overtime-datepicker-modal";
    modal.className = "overtime-datepicker-overlay hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="overtime-datepicker-card">
        <div class="overtime-datepicker-header">
          <div class="ot-dp-title-row">
            <h3 id="ot-dp-title">Pilih Tanggal</h3>
            <button class="ot-dp-close-btn" id="ot-dp-close" type="button" aria-label="Tutup">✕</button>
          </div>
          <div class="ot-dp-preview" id="ot-dp-preview">-</div>
        </div>
        <div class="ot-dp-presets">
          <button class="ot-dp-preset-btn" data-ot-preset="today" type="button">Hari Ini</button>
          <button class="ot-dp-preset-btn" data-ot-preset="start-month" type="button">Awal Bulan</button>
          <button class="ot-dp-preset-btn" data-ot-preset="end-month" type="button">Akhir Bulan</button>
          <button class="ot-dp-preset-btn" data-ot-preset="sbg-cycle" type="button">Siklus SBG (Tgl 2 - 1)</button>
        </div>
        <div class="overtime-datepicker-nav">
          <button class="ot-dp-nav-btn" id="ot-dp-prev-month" type="button" aria-label="Bulan Sebelumnya">◀</button>
          <div class="ot-dp-selectors">
            <select class="ot-dp-select" id="ot-dp-month-select" aria-label="Pilih Bulan">
              ${MONTH_NAMES.map((m, idx) => `<option value="${idx}">${m}</option>`).join("")}
            </select>
            <select class="ot-dp-select" id="ot-dp-year-select" aria-label="Pilih Tahun">
              ${Array.from({ length: 11 }, (_, i) => 2022 + i).map(y => `<option value="${y}">${y}</option>`).join("")}
            </select>
          </div>
          <button class="ot-dp-nav-btn" id="ot-dp-next-month" type="button" aria-label="Bulan Berikutnya">▶</button>
        </div>
        <div class="overtime-datepicker-weekdays">
          <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
        </div>
        <div class="overtime-datepicker-grid" id="ot-dp-grid"></div>
        <div class="overtime-datepicker-actions">
          <button class="btn btn-secondary" id="ot-dp-cancel-btn" type="button">Batal</button>
          <button class="btn btn-primary" id="ot-dp-confirm-btn" type="button">Pilih Tanggal Ini</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  let activeDatePickerTarget = null;
  let activeDatePickerState = {
    year: 2026,
    month: 7,
    day: 2,
  };

  function formatDisplayDate(year, month, day) {
    const dd = String(day).padStart(2, "0");
    return `${dd} ${MONTH_NAMES[month]} ${year}`;
  }

  function formatIsoDate(year, month, day) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function parseIsoDate(str) {
    if (!str) return null;
    const parts = str.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return { year: y, month: m, day: d };
      }
    }
    return null;
  }

  function renderDatePickerCalendar() {
    const modal = ensureDatePickerModal();
    const grid = modal.querySelector("#ot-dp-grid");
    const monthSelect = modal.querySelector("#ot-dp-month-select");
    const yearSelect = modal.querySelector("#ot-dp-year-select");
    const preview = modal.querySelector("#ot-dp-preview");

    const { year, month, day } = activeDatePickerState;
    monthSelect.value = String(month);
    yearSelect.value = String(year);
    preview.textContent = formatDisplayDate(year, month, day);

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    let cellsHtml = "";
    for (let i = 0; i < firstDayIndex; i++) {
      cellsHtml += `<button class="ot-dp-day-btn is-empty" type="button" tabindex="-1"></button>`;
    }
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = d === day;
      const isToday = isThisMonth && d === todayDate;
      const classes = ["ot-dp-day-btn"];
      if (isSelected) classes.push("is-selected");
      if (isToday) classes.push("is-today");
      cellsHtml += `<button class="${classes.join(" ")}" data-day="${d}" type="button">${d}</button>`;
    }
    grid.innerHTML = cellsHtml;
  }

  function openDatePicker(targetInput, labelTitle) {
    activeDatePickerTarget = targetInput;
    const modal = ensureDatePickerModal();
    const titleEl = modal.querySelector("#ot-dp-title");
    titleEl.textContent = labelTitle || "Pilih Tanggal";

    const parsed = parseIsoDate(targetInput.value);
    if (parsed) {
      activeDatePickerState = { ...parsed };
    } else {
      const now = new Date();
      activeDatePickerState = {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
      };
    }

    renderDatePickerCalendar();
    modal.classList.remove("hidden");
  }

  function closeDatePicker() {
    const modal = document.getElementById("overtime-datepicker-modal");
    if (modal) modal.classList.add("hidden");
    activeDatePickerTarget = null;
  }

  function applyDatePickerSelection() {
    if (activeDatePickerTarget) {
      const { year, month, day } = activeDatePickerState;
      const val = formatIsoDate(year, month, day);
      activeDatePickerTarget.value = val;
      activeDatePickerTarget.dispatchEvent(new Event("change", { bubbles: true }));
      void load({ resetPage: true });
    }
    closeDatePicker();
  }

  function initDatePickerEvents() {
    const modal = ensureDatePickerModal();

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeDatePicker();
        return;
      }
      const closeBtn = e.target.closest("#ot-dp-close, #ot-dp-cancel-btn");
      if (closeBtn) {
        closeDatePicker();
        return;
      }
      const confirmBtn = e.target.closest("#ot-dp-confirm-btn");
      if (confirmBtn) {
        applyDatePickerSelection();
        return;
      }
      const prevBtn = e.target.closest("#ot-dp-prev-month");
      if (prevBtn) {
        if (activeDatePickerState.month === 0) {
          activeDatePickerState.month = 11;
          activeDatePickerState.year -= 1;
        } else {
          activeDatePickerState.month -= 1;
        }
        const maxD = new Date(activeDatePickerState.year, activeDatePickerState.month + 1, 0).getDate();
        if (activeDatePickerState.day > maxD) activeDatePickerState.day = maxD;
        renderDatePickerCalendar();
        return;
      }
      const nextBtn = e.target.closest("#ot-dp-next-month");
      if (nextBtn) {
        if (activeDatePickerState.month === 11) {
          activeDatePickerState.month = 0;
          activeDatePickerState.year += 1;
        } else {
          activeDatePickerState.month += 1;
        }
        const maxD = new Date(activeDatePickerState.year, activeDatePickerState.month + 1, 0).getDate();
        if (activeDatePickerState.day > maxD) activeDatePickerState.day = maxD;
        renderDatePickerCalendar();
        return;
      }
      const dayBtn = e.target.closest("[data-day]");
      if (dayBtn) {
        activeDatePickerState.day = parseInt(dayBtn.dataset.day, 10);
        renderDatePickerCalendar();
        applyDatePickerSelection();
        return;
      }
      const presetBtn = e.target.closest("[data-ot-preset]");
      if (presetBtn) {
        const preset = presetBtn.dataset.otPreset;
        const now = new Date();
        if (preset === "today") {
          activeDatePickerState = { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
        } else if (preset === "start-month") {
          activeDatePickerState.day = 1;
        } else if (preset === "end-month") {
          activeDatePickerState.day = new Date(activeDatePickerState.year, activeDatePickerState.month + 1, 0).getDate();
        } else if (preset === "sbg-cycle") {
          if (activeDatePickerTarget === elements.startDate) {
            activeDatePickerState.day = 2;
          } else {
            activeDatePickerState.day = 1;
          }
        }
        renderDatePickerCalendar();
        applyDatePickerSelection();
        return;
      }
    });

    modal.querySelector("#ot-dp-month-select").addEventListener("change", (e) => {
      activeDatePickerState.month = parseInt(e.target.value, 10);
      const maxD = new Date(activeDatePickerState.year, activeDatePickerState.month + 1, 0).getDate();
      if (activeDatePickerState.day > maxD) activeDatePickerState.day = maxD;
      renderDatePickerCalendar();
    });

    modal.querySelector("#ot-dp-year-select").addEventListener("change", (e) => {
      activeDatePickerState.year = parseInt(e.target.value, 10);
      const maxD = new Date(activeDatePickerState.year, activeDatePickerState.month + 1, 0).getDate();
      if (activeDatePickerState.day > maxD) activeDatePickerState.day = maxD;
      renderDatePickerCalendar();
    });

    [elements.startDate, elements.endDate].forEach((input) => {
      if (!input) return;
      const isStart = input === elements.startDate;
      const title = isStart ? "Pilih Tanggal Awal" : "Pilih Tanggal Akhir";

      input.addEventListener("click", (e) => {
        e.preventDefault();
        openDatePicker(input, title);
      });
      input.addEventListener("focus", (e) => {
        e.preventDefault();
        openDatePicker(input, title);
      });
      input.parentElement?.addEventListener("click", (e) => {
        if (e.target !== input) {
          e.preventDefault();
          openDatePicker(input, title);
        }
      });
    });
  }

  initDatePickerEvents();

  window.OvertimeModule = {
    render() {
      const selectedRange = rangeKey();
      if (!state.payload || state.loadedRange !== selectedRange) void load({ resetPage: true });
    },
    onRoleChange(role) {
      state.role = role || "team";
      const isAdmin = state.role === "admin";
      elements.adminPanel.classList.toggle("hidden", !isAdmin);
      elements.personnelAdmin.classList.toggle("hidden", !isAdmin);
      document.querySelectorAll(".overtime-admin-column").forEach((node) => node.classList.toggle("hidden", !isAdmin));
      if (state.payload) {
        renderRanking(state.payload.summary?.ranking || []);
        renderTransactions(state.payload.items || [], state.payload.pagination || {});
        if (isAdmin) void loadPersonnel();
      }
    },
    reload: () => load(),
  };
})();
