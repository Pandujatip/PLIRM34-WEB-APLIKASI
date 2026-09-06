const defaultAuthUsers = [
  { username: "admin.plirm34", password: "admin123", role: "admin" },
  { username: "organik.plirm34", password: "organik123", role: "organik" },
  { username: "team.plirm34", password: "team123", role: "team" },
];

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

function showProfileCompletionModal(user) {
  const modal = document.getElementById("profile-completion-modal");
  if (!modal) return;
  const fullNameInput = document.getElementById("profile-full-name");
  const badgeInput = document.getElementById("profile-badge-number");
  const empTypeSelect = document.getElementById("profile-employment-type");
  const companyInput = document.getElementById("profile-company");
  const unitSelect = document.getElementById("profile-unit-kerja");

  if (fullNameInput && !fullNameInput.value) {
    fullNameInput.value = user.fullName || user.name || "";
  }
  if (badgeInput && user.badgeNumber) {
    badgeInput.value = user.badgeNumber;
  }
  if (empTypeSelect && user.employmentType) {
    empTypeSelect.value = user.employmentType;
  }
  if (companyInput) {
    if (empTypeSelect && empTypeSelect.value === "organik") {
      companyInput.value = "Gopo Tuban";
      companyInput.readOnly = true;
    } else {
      companyInput.value = user.company || "";
      companyInput.readOnly = false;
    }
  }
  if (unitSelect && user.unitKerja) {
    unitSelect.value = user.unitKerja;
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function loginWithUser(user) {
  applyRoleAccess(user.role);
  currentUser.textContent = user.fullName ? `${user.fullName} (${user.username})` : user.username;
  currentRole.textContent = (roleLabels[user.role] || "Team") + (user.unitKerja ? ` • ${user.unitKerja}` : "");
  
  const badgeEl = document.getElementById("current-unit-badge");
  if (badgeEl) {
    badgeEl.textContent = user.role === "admin" ? "ALL UNITS" : (user.unitKerja || "UNIT BELUM DISET");
  }

  if (playerAvatar) {
    const initials = String(user.fullName || user.username || "PL")
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2) || "PL";
    playerAvatar.textContent = initials;
  }
  saveSession(user.username, user.role);
  loginScreen.classList.add("hidden");
  workspace.classList.remove("hidden");
  sidebar?.classList.remove("menu-open");
  if (typeof initializeAuthenticatedWorkspace === "function") {
    void initializeAuthenticatedWorkspace();
  }
  renderUserManagementTable();
  openSection("dashboard");
  if (typeof syncDashboardSlideshowState === "function") {
    syncDashboardSlideshowState();
  }
  resetIdleLogoutTimer();

  if ((!user.isProfileCompleted || !user.unitKerja) && user.role !== "admin") {
    showProfileCompletionModal(user);
  }
}
