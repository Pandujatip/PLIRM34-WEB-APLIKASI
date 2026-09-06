import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/share_service.dart';
import '../../../../data/models/models.dart';

class OvertimeDetailSheet extends StatelessWidget {
  final OvertimeItem item;
  final UserModel? currentUser;

  const OvertimeDetailSheet({
    super.key,
    required this.item,
    this.currentUser,
  });

  static Future<void> show(
    BuildContext context, {
    required OvertimeItem item,
    UserModel? currentUser,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => OvertimeDetailSheet(
        item: item,
        currentUser: currentUser,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    Color quotaColor = AppConstants.successGreen;
    if (item.annualUsagePercent >= 85.0) {
      quotaColor = AppConstants.alertRed;
    } else if (item.annualUsagePercent >= 70.0) {
      quotaColor = AppConstants.warningYellow;
    }

    final isAdmin = currentUser?.canApproveOvertime ?? false;

    return Container(
      height: MediaQuery.of(context).size.height * 0.82,
      decoration: const BoxDecoration(
        color: AppConstants.bgDark,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag Handle
          const SizedBox(height: 12),
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppConstants.accentCyan.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppConstants.accentCyan.withValues(alpha: 0.4)),
                  ),
                  child: const Icon(Icons.access_time_rounded, color: AppConstants.accentCyan, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.employeeName.isNotEmpty ? item.employeeName : 'Data Lembur',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${item.companyName} • Reg: ${item.employeeNo} • ${item.groupType}',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 12),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Colors.white60),
                ),
              ],
            ),
          ),
          const Divider(color: Colors.white12, height: 20),

          // Content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: [
                // Hours Summary Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppConstants.cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppConstants.primaryTeal.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildHourStat('JAM REAL', '${item.monthRawHours.toStringAsFixed(1)} j', Colors.white70),
                          Container(width: 1, height: 36, color: Colors.white12),
                          _buildHourStat('JAM DIAKUI', '${item.monthLiveHours.toStringAsFixed(1)} j', AppConstants.primaryTeal),
                          Container(width: 1, height: 36, color: Colors.white12),
                          _buildHourStat('SISA KUOTA', '${item.annualRemainingHours.toStringAsFixed(1)} j', quotaColor),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Progress bar usage
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Penggunaan Kuota Tahunan', style: TextStyle(color: Colors.white54, fontSize: 11)),
                              Text(
                                '${item.annualUsagePercent.toStringAsFixed(1)}%',
                                style: TextStyle(color: quotaColor, fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: (item.annualUsagePercent / 100.0).clamp(0.0, 1.0),
                              minHeight: 8,
                              backgroundColor: AppConstants.surfaceDark,
                              valueColor: AlwaysStoppedAnimation<Color>(quotaColor),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Details Card
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppConstants.cardBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Column(
                    children: [
                      _buildRow('Nama Personel', item.employeeName),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('No Registrasi (NIK)', item.employeeNo),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Kelompok Tugas', item.groupType),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Perusahaan Rekanan', item.companyName),
                      if (item.task.isNotEmpty) ...[
                        const Divider(color: Colors.white10, height: 16),
                        _buildRow('Pekerjaan / Tugas', item.task),
                      ],
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Status Kuota', item.quotaStatus),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Role Authorization Notice
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isAdmin
                        ? AppConstants.primaryTeal.withValues(alpha: 0.1)
                        : Colors.white.withValues(alpha: 0.04),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isAdmin ? AppConstants.primaryTeal.withValues(alpha: 0.4) : Colors.white12,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        isAdmin ? Icons.verified_user : Icons.lock_outline,
                        color: isAdmin ? AppConstants.primaryTeal : Colors.white54,
                        size: 22,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isAdmin ? 'Otorisasi Approval Lembur Aktif' : 'Akses Approval Terbatas',
                              style: TextStyle(
                                color: isAdmin ? AppConstants.accentCyan : Colors.white70,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              isAdmin
                                  ? 'Sebagai Admin, Anda berwenang menyetujui, merevisi, atau mengesahkan jam lembur.'
                                  : 'Hanya Admin PLIRM34 yang memiliki kewenangan validasi dan persetujuan lembur.',
                              style: const TextStyle(color: Colors.white54, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),

          // Bottom Actions
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppConstants.surfaceDark,
              border: Border(top: BorderSide(color: Colors.white12)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      final text = '*PLIRM34 - Data Lembur Personel*\n'
                          '• Nama: ${item.employeeName} (${item.employeeNo})\n'
                          '• Perusahaan: ${item.companyName}\n'
                          '• Kelompok: ${item.groupType}\n'
                          '• Jam Real: ${item.monthRawHours.toStringAsFixed(1)} jam\n'
                          '• Jam Diakui: ${item.monthLiveHours.toStringAsFixed(1)} jam\n'
                          '• Sisa Kuota: ${item.annualRemainingHours.toStringAsFixed(1)} jam (${item.annualUsagePercent.toStringAsFixed(1)}%)\n'
                          '• Status: ${item.quotaStatus}';
                      ShareService.sendWhatsApp(text);
                    },
                    icon: const Icon(Icons.chat, size: 18),
                    label: const Text('Kirim WA', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppConstants.accentCyan,
                      side: const BorderSide(color: AppConstants.accentCyan),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      final text = '*PLIRM34 - Data Lembur Personel*\n'
                          '• Nama: ${item.employeeName} (${item.employeeNo})\n'
                          '• Jam Diakui: ${item.monthLiveHours.toStringAsFixed(1)} jam\n'
                          '• Sisa Kuota: ${item.annualRemainingHours.toStringAsFixed(1)} jam';
                      ShareService.shareText('Info Lembur Personel', text);
                    },
                    icon: const Icon(Icons.share, size: 18),
                    label: const Text('Bagikan', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHourStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(color: color, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
