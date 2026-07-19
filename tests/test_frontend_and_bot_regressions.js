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
assert.match(serviceWorkerSource, /"\/app\.js\?v=/);
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
const os = require("node:os");
const test = require("node:test");
const { spawnSync } = require("node:child_process");

test("helper WhatsApp menolak input tidak valid dan menjaga idempotensi", () => {
  const {
    BotInputError,
    buildIdempotencyKey,
    hasNegatifWriteIntent,
    validateCloseBatch,
    validateNegatifInput,
  } = require(path.join(projectRoot, "whatsapp-bot-utils.js"));

  assert.equal(hasNegatifWriteIntent("!input negatif RM 1"), true);
  assert.equal(hasNegatifWriteIntent("pesan biasa"), false);
  assert.throws(() => validateNegatifInput({ equipment: "A", description: "Rusak" }), BotInputError);
  assert.deepEqual(
    validateCloseBatch(["RM 1", "rm 1", "FM 2"], "Selesai"),
    { equipments: ["RM 1", "FM 2"], note: "Selesai" },
  );
  assert.equal(buildIdempotencyKey("message-1", "create"), buildIdempotencyKey("message-1", "create"));
  assert.notEqual(buildIdempotencyKey("message-1", "create"), buildIdempotencyKey("message-2", "create"));
});

test("service worker mem-precache semua bundle dan tidak meng-cache media terlindungi", () => {
  const source = fs.readFileSync(path.join(projectRoot, "service-worker.js"), "utf8");
  const listeners = {};
  const context = vm.createContext({
    URL,
    fetch: async () => ({ ok: false }),
    caches: {
      keys: async () => [],
      delete: async () => true,
      match: async () => undefined,
      open: async () => ({ addAll: async () => {}, put: async () => {} }),
    },
    self: {
      location: { origin: "https://plirm34.test" },
      clients: { claim: async () => {} },
      skipWaiting: async () => {},
      addEventListener(name, callback) {
        listeners[name] = callback;
      },
    },
  });
  vm.runInContext(source, context, { filename: "service-worker.js" });

  const shell = vm.runInContext("APP_SHELL", context);
  const bootstrapSource = fs.readFileSync(path.join(projectRoot, "app.bootstrap.js"), "utf8");
  const lazyScripts = [...bootstrapSource.matchAll(/"(\/app(?:\.[a-z-]+)?\.js\?v=[^"]+)"/g)].map((match) => match[1]);
  assert.ok(lazyScripts.length >= 7, "Daftar bundle lazy-load tidak ditemukan");
  lazyScripts.forEach((scriptPath) => assert.ok(shell.includes(scriptPath), `${scriptPath} belum diprecache`));

  const protectedRequestIsCacheable = vm.runInContext(
    `isCacheableRequest({ method: "GET", url: "https://plirm34.test/bom-images/private.png", destination: "image" })`,
    context,
  );
  const publicScriptIsCacheable = vm.runInContext(
    `isCacheableRequest({ method: "GET", url: "https://plirm34.test/app.js?v=1", destination: "script" })`,
    context,
  );
  const apiRequestIsCacheable = vm.runInContext(
    `isCacheableRequest({ method: "GET", url: "https://plirm34.test/api/items/service", destination: "" })`,
    context,
  );
  assert.equal(protectedRequestIsCacheable, false);
  assert.equal(publicScriptIsCacheable, true);
  assert.equal(apiRequestIsCacheable, false);
  assert.ok(listeners.install && listeners.activate && listeners.fetch);
});

test("stok Carbon Brush direkonsiliasi dan ikut backup/restore", () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "plirm34-stock-regression-"));
  const pythonSource = String.raw`
import json
import server

server.init_db()
admin = dict(server.get_user_by_username("admin.plirm34"))
stocks = server.list_carbon_brush_stock_items()
first, second = stocks[:2]
for stock in (first, second):
    server.save_manual_carbon_brush_stock_movement({
        "stockKey": stock["stockKey"], "movementType": "adjust", "quantity": 10
    }, admin)

item = {
    "id": "stock-regression-service",
    "type": "Electrical",
    "subtype": "Motor MV (Carbon Brush)",
    "formType": "service-motor-mv-carbon-brush",
    "equipmentName": "REGRESSION EQUIPMENT",
    "description": "Regression",
    "detail": "Regression",
    "payload": {"carbonBrushStockKey": first["stockKey"], "replacedPoints": ["A1", "A2"]},
}
server.create_or_update_service_item_atomic(item, admin)
item["payload"]["carbonBrushStockKey"] = second["stockKey"]
server.create_or_update_service_item_atomic(item, admin)
after_type_change = {row["stockKey"]: row["currentStock"] for row in server.list_carbon_brush_stock_items()}
server.delete_service_item_atomic(item["id"], admin)
after_delete = {row["stockKey"]: row["currentStock"] for row in server.list_carbon_brush_stock_items()}

backup = server.build_backup_payload()
expected_stock = {row["stockKey"]: row["currentStock"] for row in backup["carbonBrushStock"]}
expected_log_count = len(backup["carbonBrushStockLogs"])
server.save_manual_carbon_brush_stock_movement({
    "stockKey": first["stockKey"], "movementType": "adjust", "quantity": 3
}, admin)
server.restore_backup_payload(backup)
restored_stock = {row["stockKey"]: row["currentStock"] for row in server.list_carbon_brush_stock_items()}
restored_log_count = len(server.list_carbon_brush_stock_logs_for_backup())

print(json.dumps({
    "firstKey": first["stockKey"],
    "secondKey": second["stockKey"],
    "afterTypeChange": after_type_change,
    "afterDelete": after_delete,
    "backupVersion": backup["meta"]["version"],
    "expectedStock": expected_stock,
    "restoredStock": restored_stock,
    "expectedLogCount": expected_log_count,
    "restoredLogCount": restored_log_count,
}))
`;

  try {
    const result = spawnSync("python3", ["-c", pythonSource], {
      cwd: projectRoot,
      encoding: "utf8",
      env: { ...process.env, PLIRM34_DATA_DIR: dataDir },
      timeout: 120000,
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const output = JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1));
    assert.equal(output.afterTypeChange[output.firstKey], 10);
    assert.equal(output.afterTypeChange[output.secondKey], 8);
    assert.equal(output.afterDelete[output.firstKey], 10);
    assert.equal(output.afterDelete[output.secondKey], 10);
    assert.equal(output.backupVersion, 2);
    assert.deepEqual(output.restoredStock, output.expectedStock);
    assert.equal(output.restoredLogCount, output.expectedLogCount);
    assert.ok(output.expectedLogCount >= 6);
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});

test("adapter WSGI menyediakan seluruh endpoint fitur baru", () => {
  const source = fs.readFileSync(path.join(projectRoot, "pythonanywhere_wsgi.py"), "utf8");
  const requiredRoutes = [
    "/api/carbon-brush-stock",
    "/api/carbon-brush-stock/movement",
    "/api/inspection-schedule/realizations",
    "/api/inspection-schedule/realization",
    "/api/admin/whatsapp-bot",
    "/api/admin/whatsapp-bot/reset-token",
    "/api/admin/import-sparepart-master",
    "/api/admin/import-mso-motor-latest",
    "/api/admin/upload-mso-motor",
    "/api/admin/import-mso-motor-scrape",
    "/api/admin/reset-mso-motor",
    "/api/bot/whatsapp/negatif-list",
    "/api/bot/whatsapp/negatif-list/close",
    "/api/bot/whatsapp/negatif-list/open",
    "/api/bot/whatsapp/inspection-today",
    "/api/bot/whatsapp/carbon-brush-alerts",
  ];
  requiredRoutes.forEach((route) => assert.ok(source.includes(route), `${route} belum tersedia pada adapter WSGI`));
  assert.ok(source.includes('method == "DELETE"'));
  assert.ok(source.includes("delete_user_account"));
  assert.ok(source.includes('resource_key == "inspection-calendar"'));
});

test("endpoint utama WSGI dapat dipanggil dengan sesi admin", () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "plirm34-wsgi-regression-"));
  const pythonSource = String.raw`
from io import BytesIO
import json
import server
import pythonanywhere_wsgi as wsgi

admin = dict(server.get_user_by_username("admin.plirm34"))
token, _ = server.create_session(admin["id"])

def call(path, method="GET", payload=None, query=""):
    raw = json.dumps(payload or {}).encode("utf-8")
    captured = {}
    environ = {
        "REQUEST_METHOD": method,
        "PATH_INFO": path,
        "QUERY_STRING": query,
        "CONTENT_LENGTH": str(len(raw)),
        "CONTENT_TYPE": "application/json",
        "HTTP_COOKIE": f"{server.SESSION_COOKIE_NAME}={token}",
        "wsgi.input": BytesIO(raw),
    }
    def start_response(status, headers):
        captured["status"] = status
    body = b"".join(wsgi.application(environ, start_response))
    return int(captured["status"].split(" ", 1)[0]), json.loads(body.decode("utf-8"))

results = [
    call("/api/carbon-brush-stock"),
    call("/api/inspection-schedule/realizations"),
    call("/api/admin/whatsapp-bot"),
    call("/api/inspection-schedule/realization", "POST", {
        "scheduleKey": "wsgi-regression",
        "plannedDate": "2026-07-19",
        "plannedTitle": "WSGI Regression",
        "plannedTimeLabel": "08:00",
        "realizedDate": "2026-07-19",
        "note": "ok",
    }),
]
server.create_user("wsgi.delete", "password123", "team")
results.append(call("/api/users/wsgi.delete", "DELETE"))
assert all(status == 200 for status, _ in results), results
assert results[0][1].get("items") is not None
assert results[3][1]["item"]["scheduleKey"] == "wsgi-regression"
assert results[4][1]["user"]["username"] == "wsgi.delete"
print(json.dumps({"statuses": [status for status, _ in results]}))
`;

  try {
    const result = spawnSync("python3", ["-c", pythonSource], {
      cwd: projectRoot,
      encoding: "utf8",
      env: { ...process.env, PLIRM34_DATA_DIR: dataDir },
      timeout: 120000,
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.deepEqual(JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1)).statuses, [200, 200, 200, 200, 200]);
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});
