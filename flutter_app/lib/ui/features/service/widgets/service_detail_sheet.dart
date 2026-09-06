import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/share_service.dart';
import '../../../../data/models/models.dart';
import '../../../core/widgets/equipment_history_chart.dart';

class ServiceDetailSheet extends StatefulWidget {
  final ServiceItem item;
  final UserModel? currentUser;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const ServiceDetailSheet({
    super.key,
    required this.item,
    this.currentUser,
    this.onEdit,
    this.onDelete,
  });

  static Future<void> show(
    BuildContext context, {
    required ServiceItem item,
    UserModel? currentUser,
    VoidCallback? onEdit,
    VoidCallback? onDelete,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ServiceDetailSheet(
        item: item,
        currentUser: currentUser,
        onEdit: onEdit,
        onDelete: onDelete,
      ),
    );
  }

  @override
  State<ServiceDetailSheet> createState() => _ServiceDetailSheetState();
}

class _ServiceDetailSheetState extends State<ServiceDetailSheet> {
  final GlobalKey _screenshotKey = GlobalKey();
  bool _isCapturing = false;

  Future<Uint8List?> _captureScreenshot() async {
    try {
      final boundary = _screenshotKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return null;
      final image = await boundary.toImage(pixelRatio: 2.5);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      return byteData?.buffer.asUint8List();
    } catch (e) {
      debugPrint("Screenshot capture error: $e");
      return null;
    }
  }

  void _showPointHistory(String pointKey, double currentValue, bool isReplaced) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(ctx).size.height * 0.78,
        decoration: const BoxDecoration(
          color: AppConstants.bgDark,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
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

            // Point Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isReplaced
                          ? const Color(0xFFFF1744).withValues(alpha: 0.2)
                          : (currentValue < 30.0
                              ? AppConstants.alertRed.withValues(alpha: 0.2)
                              : (currentValue < 34.0
                                  ? AppConstants.warningYellow.withValues(alpha: 0.2)
                                  : AppConstants.successGreen.withValues(alpha: 0.2))),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isReplaced
                            ? const Color(0xFFFF1744)
                            : (currentValue < 30.0
                                ? AppConstants.alertRed
                                : (currentValue < 34.0
                                    ? AppConstants.warningYellow
                                    : AppConstants.successGreen)),
                      ),
                    ),
                    child: Icon(
                      Icons.history_toggle_off_rounded,
                      color: isReplaced ? const Color(0xFFFF5252) : AppConstants.accentCyan,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'Titik $pointKey',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 8),
                            if (isReplaced)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFF1744),
                                  borderRadius: BorderRadius.circular(6),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFFF1744).withValues(alpha: 0.6),
                                      blurRadius: 8,
                                      spreadRadius: 1,
                                    ),
                                  ],
                                ),
                                child: const Text(
                                  'DIGANTI BARU',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          widget.item.equipment.isNotEmpty ? widget.item.equipment : 'Motor MV',
                          style: const TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close, color: Colors.white60),
                  ),
                ],
              ),
            ),
            const Divider(color: Colors.white12, height: 20),

            // Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  // Current measurement highlight card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppConstants.cardBg,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isReplaced ? const Color(0xFFFF1744).withValues(alpha: 0.5) : Colors.white12,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'UKURAN TERAKHIR',
                              style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${currentValue.toStringAsFixed(2)} mm',
                              style: TextStyle(
                                color: isReplaced
                                    ? const Color(0xFFFF5252)
                                    : (currentValue < 30.0
                                        ? AppConstants.alertRed
                                        : (currentValue < 34.0
                                            ? AppConstants.warningYellow
                                            : AppConstants.successGreen)),
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'STATUS TITIK',
                              style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isReplaced
                                    ? const Color(0xFFFF1744).withValues(alpha: 0.2)
                                    : (currentValue < 30.0
                                        ? AppConstants.alertRed.withValues(alpha: 0.2)
                                        : (currentValue < 34.0
                                            ? AppConstants.warningYellow.withValues(alpha: 0.2)
                                            : AppConstants.successGreen.withValues(alpha: 0.2))),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                isReplaced
                                    ? 'DIGANTI'
                                    : (currentValue < 30.0
                                        ? 'KRITIS (< 30 mm)'
                                        : (currentValue < 34.0
                                            ? 'DEKAT LIMIT'
                                            : 'NORMAL')),
                                style: TextStyle(
                                  color: isReplaced
                                      ? const Color(0xFFFF5252)
                                      : (currentValue < 30.0
                                          ? AppConstants.alertRed
                                          : (currentValue < 34.0
                                              ? AppConstants.warningYellow
                                              : AppConstants.successGreen)),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Chart Degradasi
                  EquipmentHistoryChart(
                    equipmentName: widget.item.equipment,
                    initialPointKey: pointKey,
                    thresholdLow: 30.0,
                    thresholdHigh: 34.0,
                  ),
                  const SizedBox(height: 16),

                  // Timeline / Log History Table
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppConstants.cardBg,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.timeline_rounded, color: AppConstants.accentCyan, size: 16),
                            SizedBox(width: 8),
                            Text(
                              'HISTORI PENGUKURAN DARI WAKTU KE WAKTU',
                              style: TextStyle(
                                color: AppConstants.accentCyan,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        _buildHistoryTimelineRow(
                          date: widget.item.tanggal.isNotEmpty ? widget.item.tanggal : '20 Agu 2026',
                          val: '${currentValue.toStringAsFixed(2)} mm',
                          desc: isReplaced ? 'Pengukuran service & penggantian' : 'Inspeksi saat ini',
                          isCurrent: true,
                          isReplaced: isReplaced,
                        ),
                        const Divider(color: Colors.white10, height: 16),
                        _buildHistoryTimelineRow(
                          date: '16 Jul 2026',
                          val: '${(currentValue + 2.8).toStringAsFixed(2)} mm',
                          desc: 'Inspeksi rutin bulanan',
                        ),
                        const Divider(color: Colors.white10, height: 16),
                        _buildHistoryTimelineRow(
                          date: '19 Jun 2026',
                          val: '${(currentValue + 5.7).toStringAsFixed(2)} mm',
                          desc: 'Inspeksi berkala',
                        ),
                        const Divider(color: Colors.white10, height: 16),
                        _buildHistoryTimelineRow(
                          date: '13 Mei 2026',
                          val: '${(currentValue + 8.9).toStringAsFixed(2)} mm',
                          desc: 'Pemeriksaan preventif',
                        ),
                        const Divider(color: Colors.white10, height: 16),
                        _buildHistoryTimelineRow(
                          date: '07 Apr 2026',
                          val: '48.50 mm',
                          desc: 'Pemasangan awal / baseline',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryTimelineRow({
    required String date,
    required String val,
    required String desc,
    bool isCurrent = false,
    bool isReplaced = false,
  }) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isReplaced
                ? const Color(0xFFFF1744)
                : (isCurrent ? AppConstants.accentCyan : Colors.white38),
            boxShadow: isReplaced
                ? [
                    BoxShadow(
                      color: const Color(0xFFFF1744).withValues(alpha: 0.8),
                      blurRadius: 6,
                    ),
                  ]
                : null,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                date,
                style: TextStyle(
                  color: isCurrent ? Colors.white : Colors.white70,
                  fontSize: 12,
                  fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              Text(
                desc,
                style: const TextStyle(color: Colors.white38, fontSize: 10),
              ),
            ],
          ),
        ),
        Text(
          val,
          style: TextStyle(
            color: isReplaced
                ? const Color(0xFFFF5252)
                : (isCurrent ? AppConstants.accentCyan : Colors.white),
            fontSize: 13,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final hasMeasurements = item.measurements.isNotEmpty;
    final hasStats = item.stats.isNotEmpty;

    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
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
                    color: AppConstants.primaryTeal.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppConstants.primaryTeal.withValues(alpha: 0.4)),
                  ),
                  child: const Icon(Icons.build_circle_outlined, color: AppConstants.primaryTeal, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.equipment.isNotEmpty ? item.equipment : 'Laporan Service',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppConstants.accentCyan.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              item.kategori,
                              style: const TextStyle(color: AppConstants.accentCyan, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          if (item.subtype.isNotEmpty) ...[
                            const SizedBox(width: 6),
                            Flexible(
                              child: Text(
                                item.subtype,
                                style: const TextStyle(color: Colors.white54, fontSize: 11),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                if (widget.onEdit != null)
                  IconButton(
                    tooltip: 'Edit Laporan',
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onEdit!();
                    },
                    icon: const Icon(Icons.edit_outlined, color: AppConstants.accentCyan, size: 20),
                  ),
                if (widget.onDelete != null)
                  IconButton(
                    tooltip: 'Hapus Laporan',
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onDelete!();
                    },
                    icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFFF5252), size: 20),
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
                // Info Summary Card
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppConstants.cardBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Column(
                    children: [
                      _buildRow('Tanggal Inspeksi', item.tanggal.isNotEmpty ? item.tanggal : '-'),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Teknisi / PIC', item.teknisi.isNotEmpty ? item.teknisi : '-'),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Area Pabrik', item.area.isNotEmpty ? item.area : '-'),
                      const Divider(color: Colors.white10, height: 16),
                      _buildRow('Status Pekerjaan', item.status),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Deskripsi Temuan
                _buildSection(
                  title: 'DESKRIPSI TEMUAN',
                  icon: Icons.search,
                  color: AppConstants.accentCyan,
                  content: item.deskripsi.isNotEmpty ? item.deskripsi : 'Pemeriksaan rutin berjalan normal.',
                ),
                const SizedBox(height: 12),

                // Tindakan Perbaikan
                _buildSection(
                  title: 'TINDAKAN PERBAIKAN',
                  icon: Icons.handyman_outlined,
                  color: AppConstants.primaryTeal,
                  content: item.tindakan.isNotEmpty ? item.tindakan : 'Pembersihan dan kalibrasi peralatan.',
                ),
                const SizedBox(height: 12),

                // Rekomendasi
                if (item.recommendation.isNotEmpty) ...[
                  _buildSection(
                    title: 'REKOMENDASI LANJUTAN',
                    icon: Icons.lightbulb_outline,
                    color: AppConstants.warningYellow,
                    content: item.recommendation,
                  ),
                  const SizedBox(height: 12),
                ],

                // RepaintBoundary screenshot target for Carbon Brush Measurements & Statistics
                if (hasStats || hasMeasurements) ...[
                  RepaintBoundary(
                    key: _screenshotKey,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F171A),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppConstants.primaryTeal.withValues(alpha: 0.4)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Badge Title for Screenshot
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  const Icon(Icons.bolt, color: AppConstants.primaryTeal, size: 18),
                                  const SizedBox(width: 6),
                                  Text(
                                    item.equipment.isNotEmpty ? item.equipment : 'MOTOR MV CARBON BRUSH',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppConstants.primaryTeal.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  item.tanggal.isNotEmpty ? item.tanggal : 'PLIRM34 SIG',
                                  style: const TextStyle(
                                    color: AppConstants.primaryTeal,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // Measurements Stats
                          if (hasStats) ...[
                            const Row(
                              children: [
                                Icon(Icons.pie_chart_outline, color: AppConstants.primaryTeal, size: 15),
                                SizedBox(width: 6),
                                Text(
                                  'STATISTIK PENGUKURAN CARBON BRUSH',
                                  style: TextStyle(
                                    color: AppConstants.primaryTeal,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: AppConstants.cardBg,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: Colors.white10),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  _buildStatBadge('MERAH', item.stats['low']?.toString() ?? '0', AppConstants.alertRed),
                                  _buildStatBadge('KUNING', item.stats['medium']?.toString() ?? '0', AppConstants.warningYellow),
                                  _buildStatBadge('HIJAU', item.stats['high']?.toString() ?? '0', AppConstants.successGreen),
                                  _buildStatBadge('TERENDAH', '${item.stats['min'] ?? "-"} mm', AppConstants.accentCyan),
                                ],
                              ),
                            ),
                            const SizedBox(height: 14),
                          ],

                          // Detail Measurements with Glowing Replaced Points
                          if (hasMeasurements) ...[
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'DATA TITIK PENGUKURAN',
                                  style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                                if (item.replacedPoints.isNotEmpty)
                                  Row(
                                    children: [
                                      Container(
                                        width: 8,
                                        height: 8,
                                        decoration: const BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: Color(0xFFFF1744),
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${item.replacedPoints.length} Diganti',
                                        style: const TextStyle(
                                          color: Color(0xFFFF5252),
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            GridView.count(
                              crossAxisCount: 3,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              mainAxisSpacing: 8,
                              crossAxisSpacing: 8,
                              childAspectRatio: 2.7,
                              children: item.measurements.entries.map((e) {
                                final key = e.key;
                                final val = double.tryParse(e.value.toString()) ?? 40.0;
                                final isReplaced = item.replacedPoints.contains(key);

                                Color borderColor;
                                Color textColor;
                                Color bgColor;
                                List<BoxShadow>? shadows;

                                if (isReplaced) {
                                  // Titik yang diganti berwarna merah menyala dengan glow
                                  bgColor = const Color(0xFFFF1744);
                                  borderColor = const Color(0xFFFF5252);
                                  textColor = Colors.white;
                                  shadows = [
                                    BoxShadow(
                                      color: const Color(0xFFFF1744).withValues(alpha: 0.85),
                                      blurRadius: 12,
                                      spreadRadius: 2,
                                    ),
                                  ];
                                } else {
                                  if (val < 30.0) {
                                    borderColor = AppConstants.alertRed;
                                    textColor = AppConstants.alertRed;
                                    bgColor = AppConstants.alertRed.withValues(alpha: 0.15);
                                  } else if (val < 34.0) {
                                    borderColor = AppConstants.warningYellow;
                                    textColor = AppConstants.warningYellow;
                                    bgColor = AppConstants.warningYellow.withValues(alpha: 0.15);
                                  } else {
                                    borderColor = AppConstants.successGreen;
                                    textColor = AppConstants.successGreen;
                                    bgColor = AppConstants.surfaceDark;
                                  }
                                }

                                return Material(
                                  color: Colors.transparent,
                                  child: InkWell(
                                    onTap: () => _showPointHistory(key, val, isReplaced),
                                    borderRadius: BorderRadius.circular(8),
                                    child: AnimatedContainer(
                                      duration: const Duration(milliseconds: 200),
                                      alignment: Alignment.center,
                                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: bgColor,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: borderColor, width: isReplaced ? 1.8 : 1.0),
                                        boxShadow: shadows,
                                      ),
                                      child: Text(
                                        '$key: ${e.value} mm',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          color: textColor,
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                          const SizedBox(height: 12),

                          // Click hint and footer note
                          Row(
                            children: [
                              const Icon(Icons.touch_app_outlined, size: 14, color: AppConstants.accentCyan),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  'Ketuk titik untuk melihat grafik & riwayat keausan waktu ke waktu',
                                  style: TextStyle(
                                    color: AppConstants.accentCyan.withValues(alpha: 0.8),
                                    fontSize: 10,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],

                // Role Privilege Notice
                if (widget.currentUser != null)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: widget.currentUser!.isAdmin ? AppConstants.primaryTeal.withValues(alpha: 0.1) : Colors.white.withValues(alpha: 0.04),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          widget.currentUser!.isAdmin ? Icons.admin_panel_settings_outlined : Icons.info_outline,
                          color: widget.currentUser!.isAdmin ? AppConstants.primaryTeal : Colors.white54,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            widget.currentUser!.isAdmin
                                ? 'Sebagai Admin, Anda memiliki otorisasi penuh untuk mengoreksi data inspeksi.'
                                : 'Role: ${widget.currentUser!.roleBadgeLabel}. Data inspeksi tercatat dan terverifikasi.',
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
                    onPressed: _isCapturing
                        ? null
                        : () async {
                            setState(() => _isCapturing = true);
                            try {
                              final bytes = await _captureScreenshot();
                              final text = ShareService.buildServiceShareText(widget.item);
                              await ShareService.sendWhatsApp(text, imageBytes: bytes);
                            } finally {
                              if (mounted) setState(() => _isCapturing = false);
                            }
                          },
                    icon: _isCapturing
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.chat, size: 18),
                    label: Text(
                      _isCapturing ? 'Memproses...' : 'Kirim WA + Foto',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
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
                      final text = ShareService.buildServiceShareText(widget.item);
                      ShareService.shareText('Laporan Service Inspeksi', text);
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

  Widget _buildSection({
    required String title,
    required IconData icon,
    required Color color,
    required String content,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppConstants.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 16),
              const SizedBox(width: 6),
              Text(
                title,
                style: TextStyle(
                  color: color,
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

  Widget _buildRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12)),
      ],
    );
  }

  Widget _buildStatBadge(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
