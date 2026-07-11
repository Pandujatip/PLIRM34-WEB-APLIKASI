"use strict";

const fs = require("node:fs");
const path = require("node:path");
const QRCode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { isTargetGroup } = require("./whatsapp-bot-utils");

const ROOT_DIR = __dirname;
const DATA_DIR = process.env.PLIRM34_DATA_DIR
  ? path.resolve(ROOT_DIR, process.env.PLIRM34_DATA_DIR)
  : path.resolve(ROOT_DIR, "..", ".plirm34-data");
const CONFIG_PATH = process.env.PLIRM34_WHATSAPP_CONFIG || path.join(DATA_DIR, "whatsapp-bot-runtime.json");
const NEGATIF_FIELD_ALIASES = [
  "equipment",
  "equip",
  "eq",
  "deskripsi",
  "description",
  "desc",
  "kerusakan",
  "problem",
  "temuan",
  "rencana",
  "follow up",
  "followup",
  "fu",
  "area",
  "mark",
  "pending",
];

let runtimeConfig = loadRuntimeConfig();
let client = null;
let clientReady = false;
let lastScheduleSentDate = "";
let lastCarbonBrushAlertSentDate = "";
let lastConfigSignature = "";
const processedMessageIds = [];

function nowIso() {
  return new Date().toISOString();
}

function loadRuntimeConfig() {
  try {
    const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return {
      apiBaseUrl: parsed.apiBaseUrl || "http://127.0.0.1:8017/api",
      statusPath: parsed.statusPath || path.join(DATA_DIR, "whatsapp-bot-status.json"),
      sessionPath: parsed.sessionPath || path.join(DATA_DIR, ".wwebjs_auth"),
      enabled: Boolean(parsed.enabled),
      groupId: String(parsed.groupId || "").trim(),
      groupName: String(parsed.groupName || "").trim(),
      autoWriteEnabled: parsed.autoWriteEnabled !== false,
      dailyScheduleEnabled: parsed.dailyScheduleEnabled !== false,
      dailyScheduleTime: String(parsed.dailyScheduleTime || "08:00").trim(),
      commandPrefix: String(parsed.commandPrefix || "!").trim() || "!",
      botToken: String(parsed.botToken || "").trim(),
    };
  } catch (error) {
    return {
      apiBaseUrl: "http://127.0.0.1:8017/api",
      statusPath: path.join(DATA_DIR, "whatsapp-bot-status.json"),
      sessionPath: path.join(DATA_DIR, ".wwebjs_auth"),
      enabled: false,
      groupId: "",
      groupName: "",
      autoWriteEnabled: true,
      dailyScheduleEnabled: true,
      dailyScheduleTime: "08:00",
      commandPrefix: "!",
      botToken: "",
    };
  }
}

function writeStatus(partial) {
  const previous = readStatus();
  const payload = {
    state: "starting",
    ready: clientReady,
    message: "",
    qrDataUrl: "",
    groups: [],
    groupId: runtimeConfig.groupId,
    groupName: runtimeConfig.groupName,
    updatedAt: nowIso(),
    ...previous,
    ...partial,
    ready: partial.ready ?? clientReady,
    groupId: runtimeConfig.groupId,
    groupName: runtimeConfig.groupName,
    updatedAt: nowIso(),
  };
  try {
    fs.writeFileSync(runtimeConfig.statusPath, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.error("Failed writing WhatsApp status", error);
  }
}

function readStatus() {
  try {
    const parsed = JSON.parse(fs.readFileSync(runtimeConfig.statusPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function apiFetch(pathname, options = {}) {
  if (!runtimeConfig.botToken) {
    throw new Error("Bot token is empty. Open Admin > WhatsApp Bot once to generate runtime config.");
  }
  const response = await fetch(`${runtimeConfig.apiBaseUrl}${pathname}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-PLIRM34-Bot-Token": runtimeConfig.botToken,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }
  if (!response.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  return payload;
}

function getJakartaParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayIndex = new Date(Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day))).getUTCDay();
  return {
    date: `${map.year}-${map.month}-${map.day}`,
    time: `${map.hour}:${map.minute}`,
    isBusinessDay: weekdayIndex >= 1 && weekdayIndex <= 5,
  };
}

function getMessageId(message) {
  return message?.id?._serialized
    || message?.id?.id
    || `${message?.from || ""}|${message?.to || ""}|${message?.timestamp || ""}|${message?.body || ""}`;
}

function wasMessageProcessed(messageId) {
  return processedMessageIds.includes(messageId);
}

function rememberProcessedMessage(messageId) {
  if (!messageId || wasMessageProcessed(messageId)) {
    return;
  }
  processedMessageIds.push(messageId);
  if (processedMessageIds.length > 400) {
    processedMessageIds.splice(0, processedMessageIds.length - 400);
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function isLikelyEquipmentCode(value) {
  const text = normalizeText(value).toUpperCase();
  if (!text || text.length < 3) {
    return false;
  }
  if (["LIST", "OPEN", "CLOSE", "CLOSED", "INPUT", "NEGATIF", "REMINDER", "MONGGO"].includes(text)) {
    return false;
  }
  return /^[A-Z0-9._/-]+$/.test(text) && /\d/.test(text);
}

function isLikelyEquipmentName(value) {
  const text = normalizeText(value);
  const upper = text.toUpperCase();
  if (!text || text.length < 3 || text.length > 80) {
    return false;
  }
  if (["LIST", "OPEN", "CLOSE", "CLOSED", "INPUT", "NEGATIF", "REMINDER", "MONGGO"].includes(upper)) {
    return false;
  }
  return /^[A-Za-z0-9 ._/&()-]+$/.test(text) && /[A-Za-z0-9]/.test(text);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fieldAliasPattern(value) {
  return escapeRegExp(value).replace(/\s+/g, "\\s+");
}

function parseEquipmentCodeList(value) {
  return normalizeText(value)
    .split(",")
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function splitDescriptionAndPendingMark(value, explicitPendingMark = "") {
  const descriptionText = normalizeText(value);
  const pendingMarkText = normalizeText(explicitPendingMark);
  if (!descriptionText) {
    return { description: descriptionText, pendingMark: pendingMarkText };
  }

  const explicitMatch = descriptionText.match(/^(.*?)\s+(?:mark|pending)\s*[:=]\s*(.+)$/i);
  if (explicitMatch) {
    const description = normalizeText(explicitMatch[1]);
    const inlinePendingMark = normalizeText(explicitMatch[2]);
    return {
      description: description || descriptionText,
      pendingMark: pendingMarkText || inlinePendingMark,
    };
  }

  if (pendingMarkText) {
    return { description: descriptionText, pendingMark: pendingMarkText };
  }

  const match = descriptionText.match(/^(.*?)\s+\b((?:nunggu|menunggu|tunggu|waiting|wait)\b.+)$/i);
  if (!match) {
    return { description: descriptionText, pendingMark: "" };
  }

  const description = normalizeText(match[1]);
  const pendingMark = normalizeText(match[2]);
  if (!description || !pendingMark) {
    return { description: descriptionText, pendingMark: "" };
  }
  return { description, pendingMark };
}

function parseField(text, names) {
  const allFields = NEGATIF_FIELD_ALIASES.map(fieldAliasPattern).join("|");
  for (const name of names) {
    const pattern = new RegExp(`${fieldAliasPattern(name)}\\s*[:=]\\s*(.+?)(?=\\s*(?:\\||\\n|$)|\\s+(?:${allFields})\\s*[:=])`, "i");
    const match = text.match(pattern);
    if (match) {
      return normalizeText(match[1]);
    }
  }
  return "";
}

function parseNegatifInput(text) {
  const raw = String(text || "").trim();
  const prefix = runtimeConfig.commandPrefix || "!";
  const normalizedRaw = raw.startsWith(prefix) ? raw.slice(prefix.length).trim() : raw;
  const lower = normalizedRaw.toLowerCase();
  if (!(lower.startsWith("negatif") || lower.startsWith("input negatif") || lower.startsWith("open negatif") || lower.includes("equipment:"))) {
    return null;
  }

  const equipment = parseField(normalizedRaw, ["equipment", "equip", "eq"]);
  const description = parseField(normalizedRaw, ["deskripsi", "description", "desc", "kerusakan", "problem", "temuan"]);
  const followUpPlan = parseField(normalizedRaw, ["rencana", "follow up", "followup", "fu"]);
  const area = parseField(normalizedRaw, ["area"]);
  const pendingMark = parseField(normalizedRaw, ["mark", "pending"]);

  if (equipment && description) {
    const split = splitDescriptionAndPendingMark(description, pendingMark);
    return { equipment, description: split.description, followUpPlan, area, pendingMark: split.pendingMark };
  }

  const openShorthand = normalizedRaw.match(/^open\s+negatif(?:\s+list)?\s+([A-Za-z0-9._/-]+)\s+(.+)$/i);
  if (openShorthand && isLikelyEquipmentCode(openShorthand[1])) {
    const split = splitDescriptionAndPendingMark(openShorthand[2], pendingMark);
    return {
      equipment: normalizeText(openShorthand[1]),
      description: split.description,
      followUpPlan,
      area,
      pendingMark: split.pendingMark,
    };
  }

  const compact = normalizedRaw.match(/^(?:input\s+)?negatif\s+(.+?)\s*[|;-]\s*(.+)$/i);
  if (compact && isLikelyEquipmentName(compact[1])) {
    const split = splitDescriptionAndPendingMark(compact[2], pendingMark);
    return {
      equipment: normalizeText(compact[1]),
      description: split.description,
      followUpPlan,
      area,
      pendingMark: split.pendingMark,
    };
  }

  const shorthand = normalizedRaw.match(/^(?:input\s+)?negatif\s+([A-Za-z0-9._/-]+)\s+(.+)$/i);
  if (shorthand && isLikelyEquipmentCode(shorthand[1])) {
    const split = splitDescriptionAndPendingMark(shorthand[2], pendingMark);
    return {
      equipment: normalizeText(shorthand[1]),
      description: split.description,
      followUpPlan,
      area,
      pendingMark: split.pendingMark,
    };
  }
  return null;
}

function parseCloseNegatifCommand(text) {
  const raw = normalizeText(text);
  const prefix = runtimeConfig.commandPrefix || "!";
  const withoutPrefix = raw.startsWith(prefix) ? raw.slice(prefix.length).trim() : raw;
  const match = withoutPrefix.match(/^(?:close|closed|tutup|selesai)\s+negatif(?:\s+list)?\s+(.+)$/i);
  if (!match) {
    return null;
  }

  let equipmentText = normalizeText(match[1]);
  let note = "Closed dari WhatsApp";
  const noteMatch = equipmentText.match(/^(.*?)\s+(?:note|catatan|keterangan)\s*[:=]\s*(.+)$/i);
  if (noteMatch) {
    equipmentText = normalizeText(noteMatch[1]);
    note = normalizeText(noteMatch[2] || note) || note;
  }

  let equipments = [];
  let allowNamedEquipment = false;
  if (equipmentText.includes(",")) {
    equipments = parseEquipmentCodeList(equipmentText);
    allowNamedEquipment = true;
  } else {
    const singleMatch = equipmentText.match(/^([A-Za-z0-9._/-]+)(?:\s+(.+))?$/i);
    if (!singleMatch) {
      return null;
    }
    equipments = [normalizeText(singleMatch[1])];
    if (!noteMatch) {
      note = normalizeText(singleMatch[2] || note) || note;
    }
  }

  const isValidEquipment = allowNamedEquipment ? isLikelyEquipmentName : isLikelyEquipmentCode;
  if (!equipments.length || equipments.some((equipment) => !isValidEquipment(equipment))) {
    return null;
  }
  return {
    equipment: equipments[0],
    equipments,
    note,
  };
}

function isCloseNegatifCommandPrefix(text) {
  const raw = normalizeText(text).toLowerCase();
  const prefix = runtimeConfig.commandPrefix || "!";
  const withoutPrefix = raw.startsWith(prefix) ? raw.slice(prefix.length).trim() : raw;
  return /^(?:close|closed|tutup|selesai)\s+negatif(?:\s+list)?\b/.test(withoutPrefix);
}

function isOpenNegatifCommand(text) {
  const normalized = normalizeText(text).toLowerCase();
  const prefix = runtimeConfig.commandPrefix || "!";
  const withoutPrefix = normalized.startsWith(prefix) ? normalized.slice(prefix.length).trim() : normalized;
  return [
    "negatif open",
    "negatif list open",
    "list negatif open",
    "negatif list",
  ].includes(withoutPrefix);
}

function formatOpenNegatif(items) {
  if (!items.length) {
    return "Negatif List open kosong.";
  }
  const rows = items.map((item, index) => {
    const equipment = item.equipment || "-";
    const description = item.description || "-";
    return `${index + 1}. ${equipment} - ${description}`;
  });
  return `Negatif List masih OPEN (${items.length} item):\n${rows.join("\n")}`;
}

function formatSchedule(items) {
  if (!items.length) {
    return "Jadwal inspeksi hari ini kosong.";
  }
  const rows = items.map((item, index) => {
    const title = item.summary || "Jadwal inspeksi";
    return `${index + 1}. ${title}`;
  });
  return `Jadwal inspeksi hari ini:\n${rows.join("\n")}`;
}

function formatDateId(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "-";
  }
  const parsed = new Date(text.length === 10 ? `${text}T00:00:00+07:00` : text);
  if (Number.isNaN(parsed.getTime())) {
    return text;
  }
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function formatCarbonBrushNumber(value, digits = 2) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(digits) : "-";
}

function formatCarbonBrushAlerts(items, thresholdDays = 7) {
  if (!items.length) {
    return "";
  }
  const rows = items.map((item, index) => {
    const equipment = item.equipment || "-";
    const pointKey = item.pointKey || "-";
    const hasCountdown = Number.isFinite(Number(item.countdownDays));
    const countdownText = hasCountdown ? `${Number(item.countdownDays)} hari` : "histori kurang";
    const estimatedDate = item.estimatedReplacementDate ? formatDateId(item.estimatedReplacementDate) : "Belum bisa dihitung";
    const lastInspectionDate = formatDateId(item.lastInspectionDate);
    const lastMeasurement = formatCarbonBrushNumber(item.lastMeasurementMm ?? item.currentValue, 2);
    const thresholdLow = formatCarbonBrushNumber(item.thresholdLow, 2);
    const thresholdPlant = item.thresholdPlant || item.thresholdPlantLabel || "-";
    const statusLabel = item.status?.label || item.displayStatus?.label || item.actualStatus?.label || "Monitor";
    const qualityLabel = item.predictionQuality?.label || "Belum cukup histori";
    const wearRate = Number.isFinite(Number(item.medianWearRateMmPerDay))
      ? `${formatCarbonBrushNumber(item.medianWearRateMmPerDay, 3)} mm/hari`
      : "histori kurang";
    return `${index + 1}. ${equipment} - ${statusLabel}\n   Estimasi ganti: ${estimatedDate} (${countdownText})\n   Pengukuran terakhir: ${lastInspectionDate}\n   Titik utama: ${pointKey} = ${lastMeasurement} mm\n   Limit: ${thresholdPlant}, merah < ${thresholdLow} mm\n   Histori: ${qualityLabel} | median aus ${wearRate}`;
  });
  return `CARBON BRUSH EARLY WARNING\nAktual critical atau estimasi penggantian <= ${thresholdDays} hari\n\n${rows.join("\n\n")}`;
}

function isBotGeneratedReply(body) {
  const normalized = normalizeText(body).toLowerCase();
  if (!normalized) {
    return false;
  }
  return [
    "negatif list dibuat:",
    "negatif list ditutup:",
    "negatif list masih open",
    "negatif list open kosong",
    "gagal membaca negatif list:",
    "gagal close negatif list:",
    "gagal input negatif list:",
    "berhasil close negatif list",
    "format close negatif list",
    "jadwal inspeksi hari ini:",
    "jadwal inspeksi hari ini kosong",
    "carbon brush early warning",
  ].some((prefix) => normalized.startsWith(prefix));
}

function shouldProcessBody(body) {
  if (!body) {
    return false;
  }
  return Boolean(
    isOpenNegatifCommand(body)
    || parseCloseNegatifCommand(body)
    || isCloseNegatifCommandPrefix(body)
    || parseNegatifInput(body)
  );
}

async function processMessageEvent(message) {
  const messageId = getMessageId(message);
  if (wasMessageProcessed(messageId)) {
    return;
  }
  const body = String(message?.body || "").trim();
  if (message?.fromMe && isBotGeneratedReply(body)) {
    rememberProcessedMessage(messageId);
    return;
  }
  if (message?.fromMe && !shouldProcessBody(body)) {
    rememberProcessedMessage(messageId);
    return;
  }
  rememberProcessedMessage(messageId);
  await handleMessage(message);
}
async function refreshGroups() {
  if (!clientReady || !client) {
    return;
  }
  try {
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup)
      .map((chat) => ({
        id: chat.id?._serialized || "",
        name: chat.name || "Group WhatsApp",
      }))
      .filter((group) => group.id)
      .sort((left, right) => left.name.localeCompare(right.name));
    writeStatus({
      state: "ready",
      ready: true,
      message: runtimeConfig.enabled ? "WhatsApp tersambung." : "WhatsApp tersambung, bot nonaktif.",
      qrDataUrl: "",
      groups,
    });
  } catch (error) {
    writeStatus({ state: "ready", ready: true, message: `Gagal membaca daftar group: ${error.message}` });
  }
}

async function handleMessage(message) {
  if (!runtimeConfig.enabled || !isTargetGroup(message, runtimeConfig.groupId)) {
    return;
  }
  const body = String(message.body || "").trim();
  if (!body) {
    return;
  }

  if (isOpenNegatifCommand(body)) {
    try {
      const result = await apiFetch("/bot/whatsapp/negatif-list/open?limit=20");
      await message.reply(formatOpenNegatif(Array.isArray(result.items) ? result.items : []));
    } catch (error) {
      await message.reply(`Gagal membaca Negatif List: ${error.message}`);
    }
    return;
  }

  const closeInput = parseCloseNegatifCommand(body);
  if (closeInput) {
    const equipments = closeInput.equipments || [closeInput.equipment];
    const closed = [];
    const failed = [];
    for (const equipment of equipments) {
      try {
        const result = await apiFetch("/bot/whatsapp/negatif-list/close", {
          method: "POST",
          body: { equipment, note: closeInput.note },
        });
        const item = result.item || {};
        closed.push(item.equipment || equipment);
      } catch (error) {
        failed.push(`${equipment} (${error.message})`);
      }
    }
    if (equipments.length === 1) {
      if (closed.length) {
        await message.reply(`Negatif List ditutup: ${closed[0]}`);
      } else {
        await message.reply(`Gagal close Negatif List: ${failed[0] || "tidak diketahui"}`);
      }
    } else {
      const lines = [];
      if (closed.length) {
        lines.push(`Berhasil close Negatif List (${closed.length}): ${closed.join(", ")}`);
      }
      if (failed.length) {
        lines.push(`Gagal close Negatif List (${failed.length}): ${failed.join(", ")}`);
      }
      await message.reply(lines.join("\n"));
    }
    return;
  }
  if (isCloseNegatifCommandPrefix(body)) {
    await message.reply("Format close Negatif List belum terbaca. Contoh: close negatif list 343RM1,353SC1,UPS & Battery");
    return;
  }

  const negatifInput = parseNegatifInput(body);
  if (negatifInput && runtimeConfig.autoWriteEnabled) {
    try {
      const result = await apiFetch("/bot/whatsapp/negatif-list", {
        method: "POST",
        body: negatifInput,
      });
      const item = result.item || {};
      const mark = negatifInput.pendingMark || "";
      await message.reply(`Negatif List dibuat: ${item.equipment || negatifInput.equipment} - ${item.damageDescription || negatifInput.description}${mark ? ` | Mark: ${mark}` : ""}`);
    } catch (error) {
      await message.reply(`Gagal input Negatif List: ${error.message}`);
    }
  }
}

async function maybeSendCarbonBrushAlerts(date) {
  if (lastCarbonBrushAlertSentDate === date) {
    return;
  }
  try {
    const result = await apiFetch("/bot/whatsapp/carbon-brush-alerts?limit=10");
    const items = Array.isArray(result.items) ? result.items : [];
    const thresholdDays = Number.isFinite(Number(result.thresholdDays)) ? Number(result.thresholdDays) : 7;
    const message = formatCarbonBrushAlerts(items, thresholdDays);
    if (message) {
      await client.sendMessage(runtimeConfig.groupId, message);
      writeStatus({ lastCarbonBrushAlertSentAt: nowIso(), message: `Carbon Brush Early Warning ${date} terkirim ke group.` });
    }
    lastCarbonBrushAlertSentDate = date;
  } catch (error) {
    writeStatus({ state: "ready", ready: true, message: `Gagal kirim Carbon Brush Early Warning: ${error.message}` });
  }
}

async function maybeSendDailySchedule() {
  if (!clientReady || !client || !runtimeConfig.enabled || !runtimeConfig.dailyScheduleEnabled || !runtimeConfig.groupId) {
    return;
  }
  const { date, time, isBusinessDay } = getJakartaParts();
  if (!isBusinessDay) {
    return;
  }
  if (time !== runtimeConfig.dailyScheduleTime || lastScheduleSentDate === date) {
    return;
  }
  try {
    const result = await apiFetch("/bot/whatsapp/inspection-today");
    const message = formatSchedule(Array.isArray(result.items) ? result.items : []);
    await client.sendMessage(runtimeConfig.groupId, message);
    lastScheduleSentDate = date;
    writeStatus({ lastScheduleSentAt: nowIso(), message: `Jadwal inspeksi ${date} terkirim ke group.` });
    await maybeSendCarbonBrushAlerts(date);
  } catch (error) {
    writeStatus({ state: "ready", ready: true, message: `Gagal kirim jadwal inspeksi: ${error.message}` });
  }
}

function reloadRuntimeConfig() {
  const nextConfig = loadRuntimeConfig();
  const signature = JSON.stringify({
    enabled: nextConfig.enabled,
    groupId: nextConfig.groupId,
    groupName: nextConfig.groupName,
    autoWriteEnabled: nextConfig.autoWriteEnabled,
    dailyScheduleEnabled: nextConfig.dailyScheduleEnabled,
    dailyScheduleTime: nextConfig.dailyScheduleTime,
    commandPrefix: nextConfig.commandPrefix,
    botToken: nextConfig.botToken ? "set" : "",
  });
  runtimeConfig = nextConfig;
  if (signature !== lastConfigSignature) {
    lastConfigSignature = signature;
    writeStatus({
      message: runtimeConfig.enabled ? "Config bot aktif." : "Config bot nonaktif.",
    });
  }
}

async function startClient() {
  fs.mkdirSync(runtimeConfig.sessionPath, { recursive: true });
  writeStatus({ state: "starting", ready: false, message: "Memulai WhatsApp Bot..." });

  client = new Client({
    authStrategy: new LocalAuth({
      clientId: "plirm34",
      dataPath: runtimeConfig.sessionPath,
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    },
  });

  client.on("qr", async (qr) => {
    clientReady = false;
    try {
      const qrDataUrl = await QRCode.toDataURL(qr, { margin: 1, width: 320 });
      writeStatus({
        state: "qr",
        ready: false,
        qrDataUrl,
        message: "Scan QR dari WhatsApp di HP.",
      });
    } catch (error) {
      writeStatus({ state: "qr", ready: false, message: `QR diterima, gagal render image: ${error.message}` });
    }
  });

  client.on("authenticated", () => {
    writeStatus({ state: "authenticated", ready: false, message: "WhatsApp berhasil autentikasi." });
  });

  client.on("auth_failure", (message) => {
    clientReady = false;
    writeStatus({ state: "auth-failure", ready: false, qrDataUrl: "", message: `Auth gagal: ${message}` });
  });

  client.on("ready", async () => {
    clientReady = true;
    await refreshGroups();
  });

  client.on("disconnected", (reason) => {
    clientReady = false;
    writeStatus({ state: "disconnected", ready: false, qrDataUrl: "", message: `WhatsApp disconnected: ${reason}` });
  });

  client.on("message", (message) => {
    processMessageEvent(message).catch((error) => {
      writeStatus({ state: "ready", ready: clientReady, message: `Error handle message: ${error.message}` });
    });
  });

  client.on("message_create", (message) => {
    processMessageEvent(message).catch((error) => {
      writeStatus({ state: "ready", ready: clientReady, message: `Error handle message: ${error.message}` });
    });
  });

  await client.initialize();
}

function runBot() {
  setInterval(reloadRuntimeConfig, 5000);
  setInterval(refreshGroups, 60000);
  setInterval(maybeSendDailySchedule, 30000);

  process.on("SIGINT", async () => {
    writeStatus({ state: "stopping", ready: false, message: "Service dihentikan." });
    if (client) {
      await client.destroy().catch(() => {});
    }
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    writeStatus({ state: "stopping", ready: false, message: "Service dihentikan." });
    if (client) {
      await client.destroy().catch(() => {});
    }
    process.exit(0);
  });

  startClient().catch((error) => {
    console.error(error);
    writeStatus({ state: "error", ready: false, message: error.message, qrDataUrl: "" });
    process.exit(1);
  });
}

if (require.main === module) {
  runBot();
}
