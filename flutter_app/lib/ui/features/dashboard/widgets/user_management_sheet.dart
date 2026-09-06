import "package:flutter/material.dart";
import "../../../../core/constants/app_constants.dart";
import "../../../../core/theme/app_theme.dart";
import "../../../../data/models/models.dart";
import "../../../../data/services/api_service.dart";

class UserManagementSheet extends StatefulWidget {
  final ApiService apiService;

  const UserManagementSheet({super.key, required this.apiService});

  static Future<void> show(BuildContext context, {required ApiService apiService}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => UserManagementSheet(apiService: apiService),
    );
  }

  @override
  State<UserManagementSheet> createState() => _UserManagementSheetState();
}

class _UserManagementSheetState extends State<UserManagementSheet> {
  List<UserModel> _users = [];
  bool _isLoading = true;
  String? _updatingUsername;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() => _isLoading = true);
    final users = await widget.apiService.fetchUsers();
    if (mounted) {
      setState(() {
        _users = users;
        _isLoading = false;
      });
    }
  }

  Future<void> _changeRole(String username, String newRole) async {
    setState(() => _updatingUsername = username);
    final success = await widget.apiService.updateUserRole(username, newRole);
    if (mounted) {
      setState(() => _updatingUsername = null);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Role $username berhasil diubah menjadi ${newRole.toUpperCase()}"),
            backgroundColor: AppConstants.successGreen,
          ),
        );
        _loadUsers();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Gagal mengubah role untuk $username"),
            backgroundColor: AppConstants.alertRed,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.82,
      decoration: const BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        border: Border(top: BorderSide(color: AppConstants.accentCyan, width: 2)),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: const BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(bottom: BorderSide(color: AppTheme.borderMuted)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppConstants.accentCyan.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.manage_accounts_rounded, color: AppConstants.accentCyan, size: 22),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Kelola Hak Akses Pengguna",
                        style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "Hak Admin: Naikkan Teknisi ke Organik",
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: AppTheme.textMuted),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),

          // User list
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppConstants.primaryTeal))
                : _users.isEmpty
                    ? const Center(
                        child: Text("Tidak ada data pengguna terdaftar", style: TextStyle(color: AppTheme.textMuted)),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: _users.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final user = _users[index];
                          final isUpdating = _updatingUsername == user.username;

                          Color badgeColor = AppConstants.successGreen;
                          if (user.isAdmin) badgeColor = AppConstants.warningYellow;
                          if (user.isOrganik) badgeColor = AppConstants.accentCyan;

                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: AppTheme.surface,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppTheme.borderMuted),
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 18,
                                  backgroundColor: AppTheme.surfaceFloat,
                                  child: Text(
                                    user.username.isNotEmpty ? user.username[0].toUpperCase() : "U",
                                    style: TextStyle(color: badgeColor, fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        user.username,
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 4),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: badgeColor.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(6),
                                          border: Border.all(color: badgeColor.withValues(alpha: 0.4)),
                                        ),
                                        child: Text(
                                          user.roleBadgeLabel,
                                          style: TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold),
                                          maxLines: 1,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                if (isUpdating)
                                  const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: AppConstants.primaryTeal),
                                  )
                                else if (user.isTeam)
                                  Material(
                                    color: Colors.transparent,
                                    child: InkWell(
                                      onTap: () => _changeRole(user.username, "organik"),
                                      borderRadius: BorderRadius.circular(8),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: AppConstants.accentCyan.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: AppConstants.accentCyan),
                                        ),
                                        child: const Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.arrow_upward_rounded, size: 14, color: AppConstants.accentCyan),
                                            SizedBox(width: 4),
                                            Text(
                                              "Naikkan ke Organik",
                                              style: TextStyle(
                                                color: AppConstants.accentCyan,
                                                fontSize: 11,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  )
                                else if (user.isOrganik)
                                  Material(
                                    color: Colors.transparent,
                                    child: InkWell(
                                      onTap: () => _changeRole(user.username, "team"),
                                      borderRadius: BorderRadius.circular(8),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: AppTheme.surfaceFloat,
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: AppTheme.borderMuted),
                                        ),
                                        child: const Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.arrow_downward_rounded, size: 14, color: AppTheme.textMuted),
                                            SizedBox(width: 4),
                                            Text(
                                              "Turunkan ke Teknisi",
                                              style: TextStyle(
                                                color: AppTheme.textMuted,
                                                fontSize: 11,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
