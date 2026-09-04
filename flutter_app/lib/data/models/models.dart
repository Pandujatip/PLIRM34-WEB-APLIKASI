class UserModel {
  final int id;
  final String username;
  final String role;
  final String? token;

  UserModel({
    required this.id,
    required this.username,
    required this.role,
    this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      username: json['username']?.toString() ?? '',
      role: json['role']?.toString() ?? 'team',
      token: token ?? json['token']?.toString(),
    );
  }
}

class ServiceItem {
  final String id;
  final String tanggal;
  final String equipment;
  final String kategori; // Electrical, Instrumentasi, DCS
  final String deskripsi;
  final String tindakan;
  final String status;
  final String teknisi;
  final String area;

  ServiceItem({
    required this.id,
    required this.tanggal,
    required this.equipment,
    required this.kategori,
    required this.deskripsi,
    required this.tindakan,
    required this.status,
    required this.teknisi,
    required this.area,
  });

  factory ServiceItem.fromJson(Map<String, dynamic> json) {
    final payload = json['payload'] is Map<String, dynamic> ? json['payload'] as Map<String, dynamic> : null;
    return ServiceItem(
      id: json['id']?.toString() ?? '',
      tanggal: json['tanggal']?.toString() ?? payload?['inspectionDate']?.toString() ?? json['date']?.toString() ?? '',
      equipment: json['equipmentName']?.toString() ?? json['equipment']?.toString() ?? json['nama_alat']?.toString() ?? '',
      kategori: json['type']?.toString() ?? json['kategori']?.toString() ?? json['category']?.toString() ?? 'Electrical',
      deskripsi: json['description']?.toString() ?? json['deskripsi']?.toString() ?? json['subtype']?.toString() ?? '',
      tindakan: json['detail']?.toString() ?? json['tindakan']?.toString() ?? payload?['recommendation']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Done',
      teknisi: json['teknisi']?.toString() ?? payload?['pic']?.toString() ?? '',
      area: json['area']?.toString() ?? '',
    );
  }
}

class CarbonBrushItem {
  final String equipment;
  final String statusLimit;
  final String estimasi;
  final String tanggalUkur;
  final String nilai;
  final String keterangan;

  CarbonBrushItem({
    required this.equipment,
    required this.statusLimit,
    required this.estimasi,
    required this.tanggalUkur,
    required this.nilai,
    required this.keterangan,
  });

  factory CarbonBrushItem.fromJson(Map<String, dynamic> json) {
    return CarbonBrushItem(
      equipment: json['equipment']?.toString() ?? json['nama']?.toString() ?? '',
      statusLimit: json['status']?.toString() ?? 'DEKAT LIMIT',
      estimasi: json['estimasi']?.toString() ?? '15 Sep 2026 (10 hari)',
      tanggalUkur: json['tanggal_ukur']?.toString() ?? '20 Agu 2026',
      nilai: json['nilai']?.toString() ?? '32.5 mm',
      keterangan: json['keterangan']?.toString() ?? 'Dekat limit | Tuban 3 limit merah < 30 mm',
    );
  }

  factory CarbonBrushItem.fromAlert(Map<String, dynamic> json) {
    final displayPoints = json['displayAlertPoints'] as List? ?? [];
    final firstPoint = displayPoints.isNotEmpty && displayPoints[0] is Map<String, dynamic>
        ? displayPoints[0] as Map<String, dynamic>
        : null;

    final equip = json['equipment']?.toString() ?? '';
    final count = json['totalAlertPointCount'] ?? 1;
    final pointKey = firstPoint?['pointKey']?.toString() ?? 'F4';
    final currentVal = firstPoint?['currentValue']?.toString() ?? '32.5';
    final estDate = firstPoint?['estimatedReplacementDate']?.toString() ?? '15 Sep 2026';
    final days = firstPoint?['countdownDays']?.toString() ?? '10';
    final lastInsp = firstPoint?['lastInspectionDate']?.toString() ?? '20 Agu 2026';

    return CarbonBrushItem(
      equipment: equip,
      statusLimit: "$count TITIK DEKAT LIMIT",
      estimasi: "$estDate ($days hari)",
      tanggalUkur: "$lastInsp | $pointKey = $currentVal mm",
      nilai: "$currentVal mm",
      keterangan: "Dekat limit | Tuban 3 limit merah < 30 mm | Prediksi stabil",
    );
  }
}

class NegatifItem {
  final String id;
  final String equipment;
  final String temuan;
  final String status;
  final String statusTambahan;
  final String area;

  NegatifItem({
    required this.id,
    required this.equipment,
    required this.temuan,
    required this.status,
    required this.statusTambahan,
    required this.area,
  });

  factory NegatifItem.fromJson(Map<String, dynamic> json) {
    return NegatifItem(
      id: json['id']?.toString() ?? '',
      equipment: json['equipment']?.toString() ?? '',
      temuan: json['damageDescription']?.toString() ?? json['temuan']?.toString() ?? json['deskripsi']?.toString() ?? '',
      status: json['workStatus']?.toString() ?? json['status']?.toString() ?? 'OPEN',
      statusTambahan: json['pendingMark']?.toString() ?? json['followUpPlan']?.toString() ?? json['status_tambahan']?.toString() ?? '',
      area: json['area']?.toString() ?? '',
    );
  }
}

class SparepartItem {
  final String id;
  final String kode;
  final String nama;
  final int stok;
  final String satuan;
  final String lokasi;

  SparepartItem({
    required this.id,
    required this.kode,
    required this.nama,
    required this.stok,
    required this.satuan,
    required this.lokasi,
  });

  factory SparepartItem.fromJson(Map<String, dynamic> json) {
    return SparepartItem(
      id: json['id']?.toString() ?? '',
      kode: json['kode']?.toString() ?? json['part_number']?.toString() ?? '',
      nama: json['nama']?.toString() ?? json['description']?.toString() ?? '',
      stok: json['stok'] is int ? json['stok'] : int.tryParse(json['stok'].toString()) ?? 0,
      satuan: json['satuan']?.toString() ?? 'PCS',
      lokasi: json['lokasi']?.toString() ?? '',
    );
  }
}
