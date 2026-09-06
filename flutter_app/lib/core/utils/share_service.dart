import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../data/models/models.dart';

class ShareService {
  static const MethodChannel _channel = MethodChannel('id.plirm34/auth');

  static String buildServiceShareText(ServiceItem item) {
    final buffer = StringBuffer();
    buffer.writeln('PLIRM34 - Hasil Inspeksi Service');
    buffer.writeln('Tipe: ${item.kategori.isNotEmpty ? item.kategori : "-"}');
    if (item.subtype.isNotEmpty) {
      buffer.writeln('Sub menu: ${item.subtype}');
    }
    buffer.writeln('Equipment: ${item.equipment.isNotEmpty ? item.equipment : "-"}');
    if (item.tanggal.isNotEmpty) {
      buffer.writeln('Tanggal: ${item.tanggal}');
    }
    if (item.teknisi.isNotEmpty) {
      buffer.writeln('Teknisi: ${item.teknisi}');
    }
    buffer.writeln('Temuan: ${item.deskripsi.isNotEmpty ? item.deskripsi : "-"}');
    if (item.tindakan.isNotEmpty) {
      buffer.writeln('Tindakan: ${item.tindakan}');
    }
    if (item.recommendation.isNotEmpty) {
      buffer.writeln('Rekomendasi: ${item.recommendation}');
    }
    if (item.stats.isNotEmpty) {
      final m = item.stats['low'] ?? '0';
      final k = item.stats['medium'] ?? '0';
      final h = item.stats['high'] ?? '0';
      final min = item.stats['min'] ?? '-';
      buffer.writeln('Carbon Brush: Merah $m, Kuning $k, Hijau $h, Terendah $min mm');
    }
    if (item.replacedPoints.isNotEmpty) {
      buffer.writeln('Titik diganti: ${item.replacedPoints.join(", ")}');
    }
    return buffer.toString().trim();
  }

  static String buildNegatifShareText(NegatifItem item) {
    final buffer = StringBuffer();
    buffer.writeln('*PLIRM34 - Temuan Negatif List*');
    buffer.writeln('Equipment: ${item.equipment.isNotEmpty ? item.equipment : "-"} (${item.area})');
    buffer.writeln('Status: ${item.status}');
    buffer.writeln('Temuan: ${item.temuan.isNotEmpty ? item.temuan : "-"}');
    if (item.followUpPlan.isNotEmpty) {
      buffer.writeln('Rencana Tindak Lanjut: ${item.followUpPlan}');
    }
    if (item.foundDate.isNotEmpty) {
      buffer.writeln('Tanggal Ditemukan: ${item.foundDate}');
    }
    if (item.pendingMark.isNotEmpty) {
      buffer.writeln('Keterangan: ${item.pendingMark}');
    }
    return buffer.toString().trim();
  }

  static String buildCarbonBrushShareText(CarbonBrushItem item, [CarbonBrushPoint? point]) {
    final buffer = StringBuffer();
    buffer.writeln('*PLIRM34 - Early Warning Carbon Brush*');
    buffer.writeln('Equipment: ${item.equipment}');
    buffer.writeln('Status: ${item.statusLimit}');
    buffer.writeln('Estimasi Penggantian: ${item.estimasi}');
    buffer.writeln('Pengukuran Terakhir: ${item.tanggalUkur}');
    if (point != null) {
      buffer.writeln('Titik Terpilih: ${point.pointKey} = ${point.currentValue.toStringAsFixed(2)} mm');
      buffer.writeln('Countdown: ${point.countdownDays} hari (Est. ${point.estimatedReplacementDate})');
      buffer.writeln('Wear Rate: ${point.medianWearRate.toStringAsFixed(4)} mm/hari');
      if (point.actionLabel.isNotEmpty) {
        buffer.writeln('Aksi: ${point.actionLabel}');
      }
    }
    buffer.writeln('Batas Limit: Merah < 30.0 mm | Kuning 30.0-33.99 | Hijau >= 34.0 mm');
    return buffer.toString().trim();
  }

  static String buildSparepartShareText(SparepartItem item) {
    final buffer = StringBuffer();
    buffer.writeln('*PLIRM34 - Info Stok Sparepart*');
    buffer.writeln('Kode: ${item.kode}');
    buffer.writeln('Nama Barang: ${item.nama}');
    buffer.writeln('Stok Tersedia: ${item.stok} ${item.satuan}');
    buffer.writeln('Lokasi: ${item.lokasi}');
    return buffer.toString().trim();
  }

  static Future<void> sendWhatsApp(String text, {Uint8List? imageBytes}) async {
    try {
      final res = await _channel.invokeMethod<bool>('shareWhatsApp', {
        'text': text,
        if (imageBytes != null) 'imageBytes': imageBytes,
      });
      if (res == true) return;
    } catch (_) {}

    final encoded = Uri.encodeComponent(text);
    final waUri = Uri.parse('whatsapp://send?text=$encoded');
    final webUri = Uri.parse('https://wa.me/?text=$encoded');

    try {
      if (await canLaunchUrl(waUri)) {
        await launchUrl(waUri, mode: LaunchMode.externalApplication);
      } else {
        await launchUrl(webUri, mode: LaunchMode.externalApplication);
      }
    } catch (_) {}
  }

  static Future<void> shareText(String title, String text) async {
    try {
      final res = await _channel.invokeMethod<bool>('shareText', {'title': title, 'text': text});
      if (res == true) return;
    } catch (_) {}

    final encoded = Uri.encodeComponent(text);
    final fallbackUri = Uri.parse('https://wa.me/?text=$encoded');
    try {
      await launchUrl(fallbackUri, mode: LaunchMode.externalApplication);
    } catch (_) {}
  }
}
