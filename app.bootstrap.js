(function bootstrapPlirm34Login() {
  "use strict";


  // Client-Side Error Tracking
  window.addEventListener("error", (e) => {
    fetch("/api/monitor/error-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: e.message, url: e.filename, line: e.lineno })
    }).catch(() => {});
  });
  window.addEventListener("unhandledrejection", (e) => {
    fetch("/api/monitor/error-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Unhandled Promise Rejection: " + e.reason, url: window.location.href, line: 0 })
    }).catch(() => {});
  });

  const loadModules = async () => {
    await import('./combined.js');
  };

  const loginForm = document.getElementById("login-form");
  const signupButton = document.getElementById("signup-button");
  const forgotPasswordButton = document.getElementById("forgot-password-button");
  const loadingOverlay = document.getElementById("global-loading-overlay");
  const loadingTitle = document.getElementById("global-loading-title");
  const loadingMessage = document.getElementById("global-loading-message");
  const toastStack = document.getElementById("toast-stack");
  let fullAppPromise = null;
  let fullAppReady = false;

  function setLoading(isVisible, title = "Menyiapkan aplikasi", message = "Mohon tunggu...") {
    if (!loadingOverlay) return;
    if (loadingTitle) loadingTitle.textContent = title;
    if (loadingMessage) loadingMessage.textContent = message;
    loadingOverlay.classList.toggle("hidden", !isVisible);
    document.body.classList.toggle("is-global-loading", isVisible);
  }

  function showMessage(title, message) {
    if (!toastStack) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    const strong = document.createElement("strong");
    const copy = document.createElement("p");
    strong.textContent = title;
    copy.textContent = message;
    toast.append(strong, copy);
    toastStack.append(toast);
    window.setTimeout(() => toast.remove(), 4500);
  }

  async function request(path, options = {}) {
    const response = await fetch(`/api${path}`, {
      method: options.method || "GET",
      credentials: "same-origin",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
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

  function materializeWorkspace() {
    if (document.getElementById("workspace")) return;
    const template = document.getElementById("workspace-template");
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error("Template workspace tidak tersedia.");
    }
    template.replaceWith(template.content.cloneNode(true));
  }

  function ensureFullAppLoaded() {
    if (fullAppPromise) return fullAppPromise;
    fullAppPromise = (async () => {
      materializeWorkspace();
      await loadModules();
      fullAppReady = true;
    })().catch((error) => {
      fullAppPromise = null;
      throw error;
    });
    return fullAppPromise;
  }

  async function handOffSecondaryAction(button) {
    if (fullAppReady) return;
    setLoading(true, "Menyiapkan fitur akun", "Memuat modul autentikasi...");
    try {
      await ensureFullAppLoaded();
      setLoading(false);
      button.click();
    } catch (error) {
      setLoading(false);
      showMessage("Aplikasi gagal dimuat", error.message || "Silakan muat ulang halaman.");
    }
  }

  loginForm?.addEventListener("submit", async (event) => {
    if (fullAppReady) return;
    event.preventDefault();
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent || "Login";
    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Masuk...";
    }
    setLoading(true, "Memproses login", "Memvalidasi akun PLIRM34...");
    try {
      await request("/auth/login", { method: "POST", body: { username, password } });
      setLoading(true, "Login berhasil", "Memuat workspace dan seluruh data dashboard...");
      await ensureFullAppLoaded();
    } catch (error) {
      setLoading(false);
      showMessage("Login gagal", error.message || "Username atau password tidak cocok.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });

  signupButton?.addEventListener("click", (event) => {
    if (fullAppReady) return;
    event.preventDefault();
    void handOffSecondaryAction(signupButton);
  });

  forgotPasswordButton?.addEventListener("click", (event) => {
    if (fullAppReady) return;
    event.preventDefault();
    void handOffSecondaryAction(forgotPasswordButton);
  });

  (async () => {
    try {
      await request("/health");
      try {
        const session = await request("/auth/me");
        if (session?.user) {
          setLoading(true, "Memulihkan sesi", "Memuat workspace terakhir...");
          await ensureFullAppLoaded();
        }
      } catch (sessionError) {
        if (sessionError.status !== 401) throw sessionError;
      }
    } catch (error) {
      // Mode lokal/offline tetap memakai mekanisme autentikasi legacy aplikasi penuh.
      try {
        await ensureFullAppLoaded();
      } catch (loadError) {
        showMessage("Aplikasi gagal dimuat", loadError.message || "Silakan muat ulang halaman.");
      }
    } finally {
      if (!fullAppReady) setLoading(false);
    }
  })();

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "date") {
      try {
        if (typeof target.showPicker === "function") {
          target.showPicker();
        }
      } catch (e) {}
    }
  });

  
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "date") {
      try {
        if (typeof target.showPicker === "function") {
          target.showPicker();
        }
      } catch (e) {}
    }
  });

  window.plirm34Bootstrap = {
    ensureFullAppLoaded,
    isFullAppReady: () => fullAppReady,
  };
})();
