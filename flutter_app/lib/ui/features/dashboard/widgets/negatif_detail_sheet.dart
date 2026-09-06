import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/share_service.dart';
import '../../../../data/models/models.dart';
import '../../../../data/services/api_service.dart';

class NegatifDetailSheet extends StatefulWidget {
  final NegatifItem item;
  final UserModel? currentUser;
  final VoidCallback? onItemClosed;

  const NegatifDetailSheet({
    super.key,
    required this.item,
    this.currentUser,
    this.onItemClosed,
  });

  static Future<void> show(
    BuildContext context, {
    required NegatifItem item,
    UserModel? currentUser,
    VoidCallback? onItemClosed,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => NegatifDetailSheet(
        item: item,
        currentUser: currentUser,
        onItemClosed: onItemClosed,
      ),
    );
  }

  @override
  State<NegatifDetailSheet> createState() => _NegatifDetailSheetState();
}

class _NegatifDetailSheetState extends State<NegatifDetailSheet> {
  bool _isClosing = false;
  late NegatifItem _item;

  @override
  void initState() {
    super.initState();
    _item = widget.item;
  }

  Future<void> _handleCloseItem() async {
    final noteController = TextEditingController(text: 'Sudah ditindaklanjuti dan diverifikasi');
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppConstants.cardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.check_circle_outline, color: AppConstants.successGreen),
            SizedBox(width: 8),
            Text('Tutup Temuan?', style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Equipment: ${_item.equipment}\nStatus akan diubah menjadi CLOSED.',
              style: const TextStyle(color: Colors.white70, fontSize: 13),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: noteController,
              maxLines: 2,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: InputDecoration(
                labelText: 'Catatan Penyelesaian',
                labelStyle: const TextStyle(color: AppConstants.primaryTeal),
                filled: true,
                fillColor: AppConstants.surfaceDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppConstants.successGreen),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Tutup Temuan', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() => _isClosing = true);
    final success = await ApiService().closeNegatifItem(_item, notes: noteController.text);
    if (!mounted) return;
    setState(() => _isClosing = false);

    if (success) {
      setState(() {
        _item = NegatifItem(
          id: _item.id,
          equipment: _item.equipment,
          temuan: _item.temuan,
          status: 'CLOSED',
          statusTambahan: noteController.text,
          area: _item.area,
          followUpPlan: noteController.text,
          foundDate: _item.foundDate,
          pendingMark: noteController.text,
          category: _item.category,
        );
      });
      widget.onItemClosed?.call();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Temuan berhasil ditutup (CLOSED)'),
          backgroundColor: AppConstants.successGreen,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Gagal menutup temuan di server'),
          backgroundColor: AppConstants.alertRed,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.currentUser;
    final canClose = user?.canCloseNegatifList ?? false;
    final isOpen = _item.isOpen;

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
                    color: (isOpen ? AppConstants.alertRed : AppConstants.successGreen).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: (isOpen ? AppConstants.alertRed : AppConstants.successGreen).withValues(alpha: 0.4),
                    ),
                  ),
                  child: Icon(
                    isOpen ? Icons.warning_amber_rounded : Icons.check_circle_outline,
                    color: isOpen ? AppConstants.alertRed : AppConstants.successGreen,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _item.equipment,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Text(
                            _item.area.isNotEmpty ? _item.area : 'Area Pabrik',
                            style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 12),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: isOpen ? AppConstants.alertRed : AppConstants.successGreen,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              _item.status.toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 9,
                              ),
                            ),
                          ),
                        ],
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

          // Content List
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: [
                // Temuan / Damage Card
                _buildInfoCard(
                  title: 'DESKRIPSI TEMUAN',
                  icon: Icons.report_problem_outlined,
                  iconColor: AppConstants.warningYellow,
                  content: _item.temuan.isNotEmpty ? _item.temuan : 'Tidak ada detail temuan',
                  highlight: true,
                ),
                const SizedBox(height: 12),

                // Rencana Tindak Lanjut
                if (_item.followUpPlan.isNotEmpty) ...[
                  _buildInfoCard(
                    title: 'RENCANA TINDAK LANJUT',
                    icon: Icons.assignment_outlined,
                    iconColor: AppConstants.primaryTeal,
                    content: _item.followUpPlan,
                  ),
                  const SizedBox(height: 12),
                ],

                // Metadata Details
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppConstants.cardBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Column(
                    children: [
                      _buildDetailRow('Tanggal Ditemukan', _item.foundDate.isNotEmpty ? _item.foundDate : '-'),
                      const Divider(color: Colors.white10, height: 16),
                      _buildDetailRow('Sumber / Keterangan', _item.pendingMark.isNotEmpty ? _item.pendingMark : '-'),
                      if (_item.category.isNotEmpty) ...[
                        const Divider(color: Colors.white10, height: 16),
                        _buildDetailRow('Kategori', _item.category),
                      ],
                      const Divider(color: Colors.white10, height: 16),
                      _buildDetailRow('Status Alur', _item.statusTambahan.isNotEmpty ? _item.statusTambahan : 'Open'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Role Authorization Action Banner
                if (isOpen)
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: canClose
                          ? AppConstants.primaryTeal.withValues(alpha: 0.1)
                          : Colors.orange.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: canClose ? AppConstants.primaryTeal.withValues(alpha: 0.3) : Colors.orange.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          canClose ? Icons.verified_user_outlined : Icons.lock_outline,
                          color: canClose ? AppConstants.primaryTeal : Colors.orangeAccent,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                canClose ? 'Otorisasi Penutupan Temuan' : 'Akses Khusus Pengawas',
                                style: TextStyle(
                                  color: canClose ? AppConstants.accentCyan : Colors.orangeAccent,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                canClose
                                    ? 'Sebagai ${user?.roleBadgeLabel ?? "Pengawas"}, Anda dapat memverifikasi & menutup temuan ini.'
                                    : 'Role Tim Teknisi hanya berwenang melapor. Penutupan temuan memerlukan persetujuan Organik / Admin.',
                                style: const TextStyle(color: Colors.white70, fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                // Close Button if Authorized
                if (isOpen && canClose) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppConstants.successGreen,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: _isClosing ? null : _handleCloseItem,
                      icon: _isClosing
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                            )
                          : const Icon(Icons.check_circle, size: 18),
                      label: Text(
                        _isClosing ? 'Menyimpan...' : 'Tutup Temuan (Mark Closed)',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 24),
              ],
            ),
          ),

          // Bottom Actions (WA & Share)
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
                      final text = ShareService.buildNegatifShareText(_item);
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
                      final text = ShareService.buildNegatifShareText(_item);
                      ShareService.shareText('Temuan Negatif List', text);
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

  Widget _buildInfoCard({
    required String title,
    required IconData icon,
    required Color iconColor,
    required String content,
    bool highlight = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppConstants.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: highlight ? iconColor.withValues(alpha: 0.4) : Colors.white12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 16),
              const SizedBox(width: 6),
              Text(
                title,
                style: TextStyle(
                  color: iconColor,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
        ),
      ],
    );
  }
}
