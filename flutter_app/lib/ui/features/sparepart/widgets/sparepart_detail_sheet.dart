import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/share_service.dart';
import '../../../../data/models/models.dart';

class SparepartDetailSheet extends StatelessWidget {
  final SparepartItem item;
  final UserModel? currentUser;

  const SparepartDetailSheet({
    super.key,
    required this.item,
    this.currentUser,
  });

  static Future<void> show(
    BuildContext context, {
    required SparepartItem item,
    UserModel? currentUser,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SparepartDetailSheet(
        item: item,
        currentUser: currentUser,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    Color stockColor = AppConstants.successGreen;
    String stockStatus = 'STOK AMAN';
    if (item.stok <= 2) {
      stockColor = AppConstants.alertRed;
      stockStatus = 'STOK KRITIS';
    } else if (item.stok <= 10) {
      stockColor = AppConstants.warningYellow;
      stockStatus = 'STOK MENIPIS';
    }

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
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
                    color: stockColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: stockColor.withValues(alpha: 0.4)),
                  ),
                  child: Icon(Icons.inventory_2_outlined, color: stockColor, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.kode.isNotEmpty ? item.kode : 'Sparepart Item',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        item.nama,
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 12),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
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
                // Stock Level Display Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppConstants.cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: stockColor.withValues(alpha: 0.4)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'JUMLAH STOK TERSEDIA',
                            style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                '${item.stok}',
                                style: TextStyle(
                                  color: stockColor,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                item.satuan,
                                style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: stockColor.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: stockColor),
                        ),
                        child: Text(
                          stockStatus,
                          style: TextStyle(color: stockColor, fontWeight: FontWeight.bold, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Location Card
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppConstants.cardBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Column(
                    children: [
                      _buildRow('Kode Material / Part', item.kode.isNotEmpty ? item.kode : '-'),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Deskripsi', item.nama),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Lokasi Gudang / Rak', item.lokasi.isNotEmpty ? item.lokasi : 'Gudang Utama'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Role Privilege Notice
                if (currentUser != null)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: currentUser!.canManageSpareparts
                          ? AppConstants.primaryTeal.withValues(alpha: 0.1)
                          : Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          currentUser!.canManageSpareparts ? Icons.admin_panel_settings_outlined : Icons.info_outline,
                          color: currentUser!.canManageSpareparts ? AppConstants.primaryTeal : Colors.white54,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            currentUser!.canManageSpareparts
                                ? 'Sebagai Admin, Anda dapat menambah atau memperbarui stok master sparepart.'
                                : 'Role: ${currentUser!.roleBadgeLabel}. Untuk mutasi fisik part, hubungi gudang.',
                            style: const TextStyle(color: Colors.white70, fontSize: 11),
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
                      final waText = '*Permintaan Sparepart PLIRM34*\n'
                          'Mohon informasi stok / penyiapan part:\n'
                          '• Kode: ${item.kode}\n'
                          '• Barang: ${item.nama}\n'
                          '• Stok Tertera: ${item.stok} ${item.satuan}\n'
                          '• Lokasi: ${item.lokasi}\n'
                          'Terima kasih.';
                      ShareService.sendWhatsApp(waText);
                    },
                    icon: const Icon(Icons.chat, size: 18),
                    label: const Text('Minta via WA', style: TextStyle(fontWeight: FontWeight.bold)),
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
                      final text = ShareService.buildSparepartShareText(item);
                      ShareService.shareText('Info Sparepart', text);
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
