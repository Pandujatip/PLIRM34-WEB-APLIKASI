"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const { isTargetGroup } = require(path.join(projectRoot, "whatsapp-bot-utils.js"));

const indexSource = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(projectRoot, "app.js"), "utf8");
const serviceWorkerSource = fs.readFileSync(path.join(projectRoot, "service-worker.js"), "utf8");
const serverSource = fs.readFileSync(path.join(projectRoot, "server.py"), "utf8");

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
console.log("carbon_banner_replaced_points=ok");
console.log("carbon_banner_null_format=ok");
console.log("login_bundle_deferred=ok");
console.log("large_lists_windowed=ok");
