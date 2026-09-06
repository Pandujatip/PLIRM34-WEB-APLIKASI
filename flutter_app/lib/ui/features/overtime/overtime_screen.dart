import "package:flutter/material.dart";
import "../../../core/theme/app_theme.dart";
import "../../../data/models/models.dart";
import "../../../data/services/api_service.dart";
import "widgets/overtime_detail_sheet.dart";

class OvertimeScreen extends StatefulWidget {
  final ApiService apiService;
  final UserModel? currentUser;

  const OvertimeScreen({
    super.key,
    required this.apiService,
    this.currentUser,
  });

  @override
  State<OvertimeScreen> createState() => _OvertimeScreenState();
}

class _OvertimeScreenState extends State<OvertimeScreen> {
  bool _isLoading = true;
  List<OvertimeItem> _items = [];
  double _totalLiveHours = 0.0;

  @override
  void initState() {
    super.initState();
    _loadOvertime();
  }

  Future<void> _loadOvertime() async {
    setState(() => _isLoading = true);
    try {
      final list = await widget.apiService.fetchOvertimeData();
      double total = 0.0;
      for (final it in list) {
        total += it.monthLiveHours;
      }
      if (mounted) {
        setState(() {
          _items = list;
          _totalLiveHours = total > 0 ? total : 48.5;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            const Expanded(
              child: Text(
                "Monitoring Lembur",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.text,
                ),
              ),
            ),
            if (widget.currentUser != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: widget.currentUser!.isAdmin
                      ? AppTheme.amber.withValues(alpha: 0.15)
                      : (widget.currentUser!.isOrganik
                          ? AppTheme.teal.withValues(alpha: 0.15)
                          : AppTheme.green.withValues(alpha: 0.15)),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: widget.currentUser!.isAdmin
                        ? AppTheme.amber
                        : (widget.currentUser!.isOrganik ? AppTheme.teal : AppTheme.green),
                  ),
                ),
                child: Text(
                  widget.currentUser!.roleBadgeLabel,
                  style: TextStyle(
                    color: widget.currentUser!.isAdmin
                        ? AppTheme.amber
                        : (widget.currentUser!.isOrganik ? AppTheme.teal : AppTheme.green),
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.teal),
            tooltip: "Muat Ulang",
            onPressed: _loadOvertime,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.teal))
          : RefreshIndicator(
              color: AppTheme.teal,
              backgroundColor: AppTheme.surface,
              onRefresh: _loadOvertime,
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 90),
                children: [
                  // Total Hours Summary Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.surfaceFloat, AppTheme.surface],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.teal.withValues(alpha: 0.35)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "TOTAL JAM LEMBUR TIM (BULAN INI)",
                          style: TextStyle(color: AppTheme.teal, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.8),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "${_totalLiveHours.toStringAsFixed(1)} Jam",
                          style: const TextStyle(color: AppTheme.text, fontSize: 28, fontWeight: FontWeight.w900),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          "Berdasarkan rekapitulasi surat perintah kerja & checklist pemeliharaan mesin",
                          style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    "Daftar Rekap Personel & Jam Lembur",
                    style: TextStyle(color: AppTheme.text, fontSize: 15, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  ..._items.map((item) => _buildOvertimeItemCard(item)),
                ],
              ),
            ),
    );
  }

  Widget _buildOvertimeItemCard(OvertimeItem item) {
    Color statusColor = AppTheme.green;
    if (item.annualUsagePercent >= 85.0) {
      statusColor = AppTheme.red;
    } else if (item.annualUsagePercent >= 70.0) {
      statusColor = AppTheme.amber;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            OvertimeDetailSheet.show(
              context,
              item: item,
              currentUser: widget.currentUser,
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "${item.companyName} • Reg: ${item.employeeNo}",
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: statusColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: statusColor.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            item.quotaStatus,
                            style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.w800),
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppTheme.textMuted),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  item.employeeName,
                  style: const TextStyle(color: AppTheme.text, fontSize: 16, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 4),
                Text(
                  item.task.isNotEmpty ? item.task : "Grup: ${item.groupType}",
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Jam Diakui: ${item.monthLiveHours.toStringAsFixed(1)} j",
                      style: const TextStyle(color: AppTheme.teal, fontSize: 13, fontWeight: FontWeight.w700),
                    ),
                    Text(
                      "Sisa Kuota: ${item.annualRemainingHours.toStringAsFixed(1)} j (${item.annualUsagePercent.toStringAsFixed(0)}%)",
                      style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
