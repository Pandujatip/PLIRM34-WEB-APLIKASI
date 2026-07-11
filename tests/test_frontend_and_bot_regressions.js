"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const botUtils = require(path.join(projectRoot, "whatsapp-bot-utils.js"));
const {
  BOT_LIMITS,
  buildIdempotencyKey,
  hasNegatifWriteIntent,
  isTargetGroup,
  shouldIgnoreMessage,
  validateCloseBatch,
  validateNegatifInput,
} = botUtils;

const indexSource = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(projectRoot, "app.js"), "utf8");
const serviceWorkerSource = fs.readFileSync(path.join(projectRoot, "service-worker.js"), "utf8");
const serverSource = fs.readFileSync(path.join(projectRoot, "server.py"), "utf8");
const whatsappBotSource = fs.readFileSync(path.join(projectRoot, "whatsapp-bot.js"), "utf8");
const botModule = { exports: {} };
const botContext = vm.createContext({
  AbortController,
  Buffer,
  clearInterval,
  clearTimeout,
  console,
  fetch,
  module: botModule,
  exports: botModule.exports,
  process,
  setInterval,
  setTimeout,
  __dirname: projectRoot,
  require: (request) => {
    if (request === "qrcode") {
      return { toDataURL: async () => "" };
    }
    if (request === "whatsapp-web.js") {
      return {
        Client: class Client {},
        LocalAuth: class LocalAuth {},
      };
    }
    if (request === "./whatsapp-bot-utils") {
      return botUtils;
    }
    return require(request);
  },
});
vm.runInContext(whatsappBotSource, botContext, { filename: "whatsapp-bot.js" });
const { parseCloseNegatifCommand, parseNegatifInput } = botModule.exports;

assert.match(indexSource, /app\.bootstrap\.js\?v=20260711-02/);
assert.doesNotMatch(indexSource, /<script src="app\.js/);
assert.match(indexSource, /<template id="workspace-template">[\s\S]+<section class="workspace hidden" id="workspace">/);
assert.match(indexSource, /id="dashboard-slideshow-image"[^>]+loading="lazy"/);
assert.doesNotMatch(serviceWorkerSource, /"\/app\.js\?v=/);
assert.match(serverSource, /PUBLIC_STATIC_FILES[\s\S]+"app\.bootstrap\.js"/);
assert.match(appSource, /function syncDashboardSlideshowState\(\)/);
assert.match(appSource, /function renderWindowedCollection\(/);
assert.match(appSource, /pageSize: 100/);
assert.doesNotMatch(appSource, /const backendReady = await detectBackendAvailability\(\);\s*startDashboardSlideshow\(\);/);

assert.equal(isTargetGroup({ from: "120363123456789@g.us" }, ""), false);
assert.equal(isTargetGroup({ from: "120363123456789@g.us" }, "120363000000000@g.us"), false);
assert.equal(isTargetGroup({ from: "120363123456789@g.us" }, "120363123456789@g.us"), true);
assert.equal(isTargetGroup({ from: "628123456789@c.us" }, "120363123456789@g.us"), false);
assert.equal(shouldIgnoreMessage({ fromMe: true }), true);
assert.equal(shouldIgnoreMessage({ fromMe: false }), false);
assert.equal(hasNegatifWriteIntent("FYI equipment: 343RM1", "!"), false);
assert.equal(hasNegatifWriteIntent("input negatif equipment: 343RM1", "!"), true);
assert.equal(parseNegatifInput("FYI equipment: 343RM1 | description: rusak"), null);
assert.deepEqual(
  JSON.parse(JSON.stringify(parseNegatifInput("input negatif equipment: 343RM1 | description: bearing rusak"))),
  {
    equipment: "343RM1",
    description: "bearing rusak",
    followUpPlan: "",
    area: "",
    pendingMark: "",
  },
);
assert.throws(
  () => validateNegatifInput({ equipment: "A".repeat(BOT_LIMITS.equipment + 1), description: "rusak" }),
  /Equipment maksimal/,
);
assert.throws(
  () => parseNegatifInput(`input negatif equipment: ${"A".repeat(BOT_LIMITS.equipment + 1)} | description: rusak`),
  /Equipment maksimal/,
);
assert.deepEqual(validateCloseBatch(["343RM1", "343rm1", "353SC1"], "selesai"), {
  equipments: ["343RM1", "353SC1"],
  note: "selesai",
});
assert.throws(
  () => parseCloseNegatifCommand(`close negatif list ${Array.from({ length: BOT_LIMITS.closeBatch + 1 }, (_, index) => `EQ${index + 1}`).join(",")}`),
  /Maksimal 20 equipment/,
);
assert.equal(buildIdempotencyKey("message-1", "create-negatif"), buildIdempotencyKey("message-1", "create-negatif"));
assert.notEqual(buildIdempotencyKey("message-1", "create-negatif"), buildIdempotencyKey("message-2", "create-negatif"));
assert.doesNotMatch(whatsappBotSource, /--no-sandbox|--disable-setuid-sandbox/);
assert.match(whatsappBotSource, /new AbortController\(\)/);
assert.match(whatsappBotSource, /sourceMessageId: buildIdempotencyKey/);

const dashboardSource = fs.readFileSync(path.join(projectRoot, "app.dashboard.js"), "utf8");
const context = vm.createContext({
  console,
  window: { plirm34CarbonBrushDashboardAlerts: [] },
});
vm.runInContext(dashboardSource, context, { filename: "app.dashboard.js" });

assert.equal(context.formatCarbonBrushAlertNumber(null, 3), "-");
assert.equal(context.formatCarbonBrushAlertNumber(undefined, 3), "-");
assert.equal(context.formatCarbonBrushAlertNumber("", 3), "-");
assert.equal(context.formatCarbonBrushAlertNumber(0, 3), "0.000");
assert.equal(context.formatCarbonBrushAlertNumber("1.25", 2), "1.25");

const serviceItem = {
  id: "service-carbon-test",
  formType: "service-motor-mv-carbon-brush",
  equipmentName: "TEST MOTOR",
  payload: {
    inspectionDate: "2026-07-10",
    measurements: { A1: "20", A2: "32" },
    replacedPoints: ["A1"],
  },
};

const activeSummary = context.buildCarbonBrushBannerFallbackSummary([serviceItem]);
assert.equal(activeSummary.length, 1);
assert.equal(activeSummary[0].worstPoint.pointKey, "A2");

const fullyReplacedSummary = context.buildCarbonBrushBannerFallbackSummary([
  {
    ...serviceItem,
    payload: {
      ...serviceItem.payload,
      replacedPoints: ["A1", "A2"],
    },
  },
]);
assert.equal(fullyReplacedSummary.length, 0);

console.log("bot_group_fail_closed=ok");
console.log("bot_from_me_fail_closed=ok");
console.log("bot_input_limits=ok");
console.log("bot_batch_limits=ok");
console.log("bot_idempotency_keys=ok");
console.log("bot_chromium_sandbox_default=ok");
console.log("carbon_banner_replaced_points=ok");
console.log("carbon_banner_null_format=ok");
console.log("login_bundle_deferred=ok");
console.log("large_lists_windowed=ok");
