import "package:flutter/material.dart";
import "../../../core/theme/app_theme.dart";
import "../../../data/services/api_service.dart";

class OvertimeScreen extends StatelessWidget {
  final ApiService apiService;

  const OvertimeScreen({super.key, required this.apiService});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Monitoring Overtime / Lembur"),
      ),
      body: ListView(
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
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "TOTAL JAM LEMBUR TIM (BULAN INI)",
                  style: TextStyle(color: AppTheme.teal, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.8),
                ),
                SizedBox(height: 8),
                Text(
                  "48.5 Jam",
                  style: TextStyle(color: AppTheme.text, fontSize: 28, fontWeight: FontWeight.w900),
                ),
                SizedBox(height: 6),
                Text(
                  "Berdasarkan surat perintah kerja & checklist pemeliharaan mesin",
                  style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            "Riwayat Lembur Terakhir",
            style: TextStyle(color: AppTheme.text, fontSize: 15, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          _overtimeCard("03 Sep 2026", "Perbaikan Pull Cord Conveyor Crusher", "4.0 Jam", "Agus S. & Budi H.", "Disetujui"),
          _overtimeCard("29 Agu 2026", "Emergency Inspection Motor MV Kiln", "5.5 Jam", "Tim Listrik Shift 2", "Disetujui"),
          _overtimeCard("21 Agu 2026", "Penggantian Modul Profibus DCS Tuban", "3.0 Jam", "Pandu P.", "Disetujui"),
        ],
      ),
    );
  }

  Widget _overtimeCard(String tanggal, String pekerjaan, String durasi, String teknisi, String status) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(tanggal, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12, fontWeight: FontWeight.w600)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.greenSurface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.green),
                ),
                child: Text(status, style: const TextStyle(color: AppTheme.green, fontSize: 10, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(pekerjaan, style: const TextStyle(color: AppTheme.text, fontSize: 15, fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(teknisi, style: const TextStyle(color: AppTheme.textSubtle, fontSize: 12)),
              Text(durasi, style: const TextStyle(color: AppTheme.teal, fontSize: 14, fontWeight: FontWeight.w800)),
            ],
          ),
        ],
      ),
    );
  }
}
