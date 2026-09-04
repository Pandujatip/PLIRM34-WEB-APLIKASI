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
    return ServiceItem(
      id: json['id']?.toString() ?? '',
      tanggal: json['tanggal']?.toString() ?? json['date']?.toString() ?? '',
      equipment: json['equipment']?.toString() ?? json['nama_alat']?.toString() ?? '',
      kategori: json['kategori']?.toString() ?? json['category']?.toString() ?? 'Electrical',
      deskripsi: json['deskripsi']?.toString() ?? json['keterangan']?.toString() ?? '',
      tindakan: json['tindakan']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Done',
      teknisi: json['teknisi']?.toString() ?? json['pic']?.toString() ?? '',
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
      temuan: json['temuan']?.toString() ?? json['deskripsi']?.toString() ?? '',
      status: json['status']?.toString() ?? 'OPEN',
      statusTambahan: json['status_tambahan']?.toString() ?? '',
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
