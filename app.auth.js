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

function loginWithUser(user) {
  applyRoleAccess(user.role);
  currentUser.textContent = user.username;
  currentRole.textContent = roleLabels[user.role] || "Team";
  if (playerAvatar) {
    const initials = String(user.username || "PL")
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
  renderUserManagementTable();
  openSection("dashboard");
  resetIdleLogoutTimer();
}
