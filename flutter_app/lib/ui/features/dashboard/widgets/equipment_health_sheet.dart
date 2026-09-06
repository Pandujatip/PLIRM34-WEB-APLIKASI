import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../data/models/models.dart';
import '../../../../data/services/api_service.dart';
import '../../service/widgets/service_form_sheet.dart';

class EquipmentHealthSheet extends StatelessWidget {
  final PlantEquipmentNode node;
  final ApiService apiService;
  final UserModel? currentUser;
  final VoidCallback onRefresh;

  const EquipmentHealthSheet({
    super.key,
    required this.node,
    required this.apiService,
    required this.currentUser,
    required this.onRefresh,
  });

  static Future<void> show(
    BuildContext context, {
    required PlantEquipmentNode node,
    required ApiService apiService,
    UserModel? currentUser,
    required VoidCallback onRefresh,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => EquipmentHealthSheet(
        node: node,
        apiService: apiService,
        currentUser: currentUser,
        onRefresh: onRefresh,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = node.statusColor;

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: AppConstants.bgDark,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
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
          const SizedBox(height: 14),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Icon Box
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: statusColor.withValues(alpha: 0.4)),
                  ),
                  child: Icon(
                    _getEquipmentIcon(node.type),
                    color: statusColor,
                    size: 26,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              node.title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            decoration: BoxDecoration(
                              color: node.badgeBgColor,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: node.badgeBorderColor),
                            ),
                            child: Text(
                              node.statusLabel,
                              style: TextStyle(
                                color: statusColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            node.area,
                            style: const TextStyle(color: Colors.white54, fontSize: 11),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Health Score Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: statusColor.withValues(alpha: 0.4)),
                  ),
                  child: Column(
                    children: [
                      Text(
                        "${node.healthScore.toStringAsFixed(0)}%",
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const Text(
                        "HEALTH",
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: Colors.white60),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Divider(color: Colors.white12, height: 1),

          // Scrollable Content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(
                  node.subtitle,
                  style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.4),
                ),
                const SizedBox(height: 16),

                // Telemetry Diagnostic Grid (4 Cards)
                const Text(
                  "PARAMETER DIAGNOSTIK & TELEMETRI",
                  style: TextStyle(
                    color: AppConstants.accentCyan,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 10),

                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.6,
                  children: [
                    _buildMetricCard(
                      title: "KONDISI CARBON BRUSH",
                      value: node.carbonBrushSummary,
                      subValue: node.lowestCbVal != null
                          ? "Terendah: ${node.lowestCbVal!.toStringAsFixed(1)} mm (Limit < 30)"
                          : "Status keausan aman",
                      isAlert: node.carbonBrushSummary.toLowerCase().contains("kritis") ||
                          node.carbonBrushSummary.toLowerCase().contains("dekat limit"),
                      color: node.carbonBrushSummary.toLowerCase().contains("kritis")
                          ? AppConstants.alertRed
                          : (node.carbonBrushSummary.toLowerCase().contains("dekat limit")
                              ? AppConstants.warningYellow
                              : AppConstants.successGreen),
                      icon: Icons.electric_meter_outlined,
                    ),
                    _buildMetricCard(
                      title: "GETARAN (VIBRATION)",
                      value: "${node.vibration.toStringAsFixed(1)} mm/s RMS",
                      subValue: node.vibration < 4.5 ? "Normal (< 4.5 mm/s)" : "Vibrasi Tinggi",
                      isAlert: node.vibration >= 4.5,
                      color: node.vibration < 4.5 ? AppConstants.successGreen : AppConstants.warningYellow,
                      icon: Icons.vibration_rounded,
                    ),
                    _buildMetricCard(
                      title: "SUHU BEARING (TEMP)",
                      value: "${node.bearingTemp.toStringAsFixed(1)} °C",
                      subValue: node.bearingTemp < 75.0 ? "Pelumasan Optimal" : "Perhatian Suhu",
                      isAlert: node.bearingTemp >= 75.0 && node.type != EquipmentType.preheater,
                      color: AppConstants.successGreen,
                      icon: Icons.thermostat_rounded,
                    ),
                    _buildMetricCard(
                      title: "NEGATIF LIST OPEN",
                      value: "${node.openNegatifCount} Temuan",
                      subValue: node.openNegatifCount > 0 ? "Perlu tindak lanjut" : "Tidak ada temuan open",
                      isAlert: node.openNegatifCount > 0,
                      color: node.openNegatifCount > 0 ? AppConstants.warningYellow : AppConstants.successGreen,
                      icon: Icons.report_problem_outlined,
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Riwayat Service & Inspeksi Terakhir
                Container(
                  padding: const EdgeInsets.all(14),
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
                          Icon(Icons.history_rounded, color: AppConstants.accentCyan, size: 16),
                          SizedBox(width: 8),
                          Text(
                            "STATUS SERVICE & PEMELIHARAAN TERAKHIR",
                            style: TextStyle(
                              color: AppConstants.accentCyan,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Tanggal Inspeksi:", style: TextStyle(color: Colors.white54, fontSize: 12)),
                          Text(node.lastServiceDate, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("Tindakan / Hasil:", style: TextStyle(color: Colors.white54, fontSize: 12)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              node.lastServiceTindakan,
                              textAlign: TextAlign.end,
                              style: const TextStyle(color: AppConstants.primaryTeal, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Temuan Negatif Open List (Jika Ada)
                if (node.openNegatifItems.isNotEmpty) ...[
                  Row(
                    children: [
                      const Icon(Icons.warning_amber_rounded, color: AppConstants.warningYellow, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        "TEMUAN NEGATIF TERBUKA (${node.openNegatifItems.length})",
                        style: const TextStyle(
                          color: AppConstants.warningYellow,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...node.openNegatifItems.map((neg) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppConstants.warningYellow.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppConstants.warningYellow.withValues(alpha: 0.3)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              neg.temuan,
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            if (neg.statusTambahan.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(neg.statusTambahan, style: const TextStyle(color: Colors.white60, fontSize: 11)),
                            ],
                          ],
                        ),
                      )),
                  const SizedBox(height: 12),
                ],

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppConstants.primaryTeal,
                          foregroundColor: const Color(0xFF021619),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.add_task_rounded, size: 18),
                        label: const Text(
                          "Input Service Baru",
                          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                          ServiceFormSheet.show(
                            context,
                            apiService: apiService,
                            currentUser: currentUser,
                            initialArea: node.area,
                            initialCategory: _mapToCategory(node.type),
                            initialSubtype: _mapToSubtype(node.type),
                            onSuccess: onRefresh,
                          );
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subValue,
    required bool isAlert,
    required Color color,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppConstants.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isAlert ? color.withValues(alpha: 0.5) : Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 13, color: color),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(color: Colors.white54, fontSize: 9, fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w800),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          Text(
            subValue,
            style: const TextStyle(color: Colors.white38, fontSize: 9),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  static IconData _getEquipmentIcon(EquipmentType type) {
    switch (type) {
      case EquipmentType.crusher:
        return Icons.hardware_rounded;
      case EquipmentType.rawmill:
        return Icons.settings_backup_restore_rounded;
      case EquipmentType.coalmill:
        return Icons.local_fire_department_rounded;
      case EquipmentType.preheater:
        return Icons.filter_drama_rounded;
      case EquipmentType.kiln:
        return Icons.whatshot_rounded;
      case EquipmentType.cooler:
        return Icons.ac_unit_rounded;
      case EquipmentType.finishmill:
        return Icons.precision_manufacturing_rounded;
      case EquipmentType.packer:
        return Icons.all_inbox_rounded;
    }
  }

  static String _mapToCategory(EquipmentType type) {
    switch (type) {
      case EquipmentType.crusher:
      case EquipmentType.rawmill:
      case EquipmentType.coalmill:
      case EquipmentType.kiln:
      case EquipmentType.cooler:
      case EquipmentType.finishmill:
        return "Electrical";
      case EquipmentType.preheater:
      case EquipmentType.packer:
        return "Instrumentasi";
    }
  }

  static String _mapToSubtype(EquipmentType type) {
    switch (type) {
      case EquipmentType.rawmill:
      case EquipmentType.finishmill:
        return "Motor MV Carbon Brush";
      case EquipmentType.kiln:
      case EquipmentType.cooler:
      case EquipmentType.crusher:
        return "Motor MV Umum";
      case EquipmentType.coalmill:
        return "MCC & Cubicle";
      case EquipmentType.preheater:
        return "CEMS (Continuous Emission)";
      case EquipmentType.packer:
        return "Instrument Lapangan";
    }
  }
}
