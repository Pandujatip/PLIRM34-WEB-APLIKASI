import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/share_service.dart';
import '../../../../data/models/models.dart';
import '../../../core/widgets/equipment_history_chart.dart';

class CarbonBrushDetailSheet extends StatefulWidget {
  final CarbonBrushItem item;

  const CarbonBrushDetailSheet({
    super.key,
    required this.item,
  });

  static Future<void> show(BuildContext context, CarbonBrushItem item) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CarbonBrushDetailSheet(item: item),
    );
  }

  @override
  State<CarbonBrushDetailSheet> createState() => _CarbonBrushDetailSheetState();
}

class _CarbonBrushDetailSheetState extends State<CarbonBrushDetailSheet> {
  CarbonBrushPoint? _selectedPoint;

  @override
  void initState() {
    super.initState();
    if (widget.item.points.isNotEmpty) {
      _selectedPoint = widget.item.points.first;
    }
  }

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final points = item.points;

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
                    color: AppConstants.warningYellow.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppConstants.warningYellow.withValues(alpha: 0.4)),
                  ),
                  child: const Icon(Icons.flash_on, color: AppConstants.warningYellow, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.equipment,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Peringatan Dini Keausan Carbon Brush',
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

          // Scrollable Content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                // Equipment Historical Degradation Chart
                EquipmentHistoryChart(
                  equipmentName: item.equipment,
                  initialPointKey: _selectedPoint?.pointKey ?? 'F4',
                  thresholdLow: item.thresholdLow,
                  thresholdHigh: item.thresholdHigh,
                  thresholdLegend: item.thresholdLegend,
                ),
                const SizedBox(height: 16),

                // Countdown Summary Banner
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppConstants.warningYellow.withValues(alpha: 0.15),
                        AppConstants.cardBg,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppConstants.warningYellow.withValues(alpha: 0.4)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.timer_outlined, color: AppConstants.warningYellow, size: 24),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Estimasi Penggantian Terdekat',
                              style: TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                            Text(
                              item.estimasi,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppConstants.warningYellow,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          item.statusLimit,
                          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 10),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Table of Alert Points
                if (points.isNotEmpty) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'RINCIAN TITIK PENGUKURAN (${points.length})',
                        style: const TextStyle(
                          color: AppConstants.accentCyan,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                      Text(
                        item.thresholdLegend,
                        style: const TextStyle(color: Colors.white38, fontSize: 9),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...points.map((p) {
                    final isSel = _selectedPoint?.pointKey == p.pointKey;
                    Color badgeColor = AppConstants.successGreen;
                    if (p.currentValue < item.thresholdLow) {
                      badgeColor = AppConstants.alertRed;
                    } else if (p.currentValue < item.thresholdHigh) {
                      badgeColor = AppConstants.warningYellow;
                    }

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      decoration: BoxDecoration(
                        color: isSel ? AppConstants.primaryTeal.withValues(alpha: 0.15) : AppConstants.cardBg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSel ? AppConstants.primaryTeal : Colors.white12,
                        ),
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: ListTile(
                          dense: true,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          leading: CircleAvatar(
                            radius: 18,
                            backgroundColor: badgeColor.withValues(alpha: 0.2),
                            child: Text(
                              p.pointKey,
                              style: TextStyle(
                                color: badgeColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          title: Row(
                            children: [
                              Text(
                                '${p.currentValue.toStringAsFixed(2)} mm',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: badgeColor.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  p.countdownDays > 0 ? '${p.countdownDays} hr' : 'LIMIT',
                                  style: TextStyle(
                                    color: badgeColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          subtitle: Text(
                            'Est: ${p.estimatedReplacementDate} • Aus: ${p.medianWearRate.toStringAsFixed(4)} mm/hr',
                            style: const TextStyle(color: Colors.white54, fontSize: 11),
                          ),
                          trailing: Icon(
                            isSel ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                            color: isSel ? AppConstants.accentCyan : Colors.white24,
                            size: 18,
                          ),
                          onTap: () {
                            setState(() {
                              _selectedPoint = p;
                            });
                          },
                        ),
                      ),
                    );
                  }),
                ],
                const SizedBox(height: 20),
              ],
            ),
          ),

          // Bottom Action Buttons
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
                      final text = ShareService.buildCarbonBrushShareText(item, _selectedPoint);
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
                      final text = ShareService.buildCarbonBrushShareText(item, _selectedPoint);
                      ShareService.shareText('Early Warning Carbon Brush', text);
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
}
