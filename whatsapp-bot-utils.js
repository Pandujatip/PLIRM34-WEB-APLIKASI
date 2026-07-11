"use strict";

const crypto = require("node:crypto");

const BOT_LIMITS = Object.freeze({
  message: 2000,
  equipment: 80,
  description: 600,
  followUpPlan: 600,
  area: 120,
  pendingMark: 120,
  closeNote: 240,
  closeBatch: 20,
  apiResponseBytes: 1024 * 1024,
});

class BotInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "BotInputError";
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function assertMessageLength(value) {
  const text = String(value || "");
  if (text.length > BOT_LIMITS.message) {
    throw new BotInputError(`Pesan maksimal ${BOT_LIMITS.message} karakter.`);
  }
  return text;
}

function boundedText(value, label, maxLength, { required = false } = {}) {
  const text = normalizeText(value);
  if (required && !text) {
    throw new BotInputError(`${label} wajib diisi.`);
  }
  if (text.length > maxLength) {
    throw new BotInputError(`${label} maksimal ${maxLength} karakter.`);
  }
  return text;
}

function validateEquipment(value) {
  const equipment = boundedText(value, "Equipment", BOT_LIMITS.equipment, { required: true });
  if (equipment.length < 3 || !/^[A-Za-z0-9 ._/&()-]+$/.test(equipment)) {
    throw new BotInputError("Format equipment tidak valid.");
  }
  return equipment;
}

function validateNegatifInput(input) {
  return {
    equipment: validateEquipment(input?.equipment),
    description: boundedText(input?.description, "Deskripsi", BOT_LIMITS.description, { required: true }),
    followUpPlan: boundedText(input?.followUpPlan, "Rencana tindak lanjut", BOT_LIMITS.followUpPlan),
    area: boundedText(input?.area, "Area", BOT_LIMITS.area),
    pendingMark: boundedText(input?.pendingMark, "Pending mark", BOT_LIMITS.pendingMark),
  };
}

function validateCloseBatch(equipments, note) {
  const unique = [];
  const seen = new Set();
  for (const value of Array.isArray(equipments) ? equipments : []) {
    const equipment = validateEquipment(value);
    const key = equipment.toUpperCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(equipment);
    }
  }
  if (!unique.length) {
    throw new BotInputError("Equipment wajib diisi.");
  }
  if (unique.length > BOT_LIMITS.closeBatch) {
    throw new BotInputError(`Maksimal ${BOT_LIMITS.closeBatch} equipment per perintah.`);
  }
  return {
    equipments: unique,
    note: boundedText(note || "Closed dari WhatsApp", "Catatan", BOT_LIMITS.closeNote, { required: true }),
  };
}

function hasNegatifWriteIntent(value, commandPrefix = "!") {
  const raw = String(value || "").trim();
  const prefix = String(commandPrefix || "!").trim() || "!";
  const withoutPrefix = raw.startsWith(prefix) ? raw.slice(prefix.length).trim() : raw;
  return /^(?:(?:input|open)\s+)?negatif\b/i.test(withoutPrefix);
}

function shouldIgnoreMessage(message) {
  return Boolean(message?.fromMe);
}

function buildIdempotencyKey(messageId, action, index = 0) {
  const source = `${String(action || "message")}|${Number(index) || 0}|${String(messageId || "")}`;
  return `${String(action || "message").slice(0, 24)}:${crypto.createHash("sha256").update(source).digest("hex")}`;
}

function resolveGroupId(message) {
  const from = String(message?.from || "").trim();
  const to = String(message?.to || "").trim();
  if (from.endsWith("@g.us")) {
    return from;
  }
  if (to.endsWith("@g.us")) {
    return to;
  }
  return "";
}

function isTargetGroup(message, targetGroupId) {
  const groupId = resolveGroupId(message);
  const configuredGroupId = String(targetGroupId || "").trim();
  if (!groupId || !configuredGroupId) {
    return false;
  }
  return groupId === configuredGroupId;
}

module.exports = {
  BOT_LIMITS,
  BotInputError,
  assertMessageLength,
  buildIdempotencyKey,
  hasNegatifWriteIntent,
  isTargetGroup,
  normalizeText,
  resolveGroupId,
  shouldIgnoreMessage,
  validateCloseBatch,
  validateNegatifInput,
};
