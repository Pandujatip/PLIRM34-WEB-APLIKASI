"use strict";

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
  isTargetGroup,
  resolveGroupId,
};
