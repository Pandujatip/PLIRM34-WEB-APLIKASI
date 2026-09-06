import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portable_inspection_tool/core/utils/share_service.dart';
import 'package:portable_inspection_tool/data/models/models.dart';
import 'package:portable_inspection_tool/ui/core/widgets/equipment_history_chart.dart';
import 'package:portable_inspection_tool/ui/features/dashboard/widgets/carbon_brush_detail_sheet.dart';
import 'package:portable_inspection_tool/ui/features/dashboard/widgets/negatif_detail_sheet.dart';
import 'package:portable_inspection_tool/ui/features/service/widgets/service_detail_sheet.dart';
import 'package:portable_inspection_tool/ui/features/sparepart/widgets/sparepart_detail_sheet.dart';
import 'package:portable_inspection_tool/data/services/api_service.dart';
import 'package:portable_inspection_tool/ui/features/auth/login_screen.dart';
import 'package:portable_inspection_tool/ui/features/auth/profile_completion_dialog.dart';
import 'package:portable_inspection_tool/ui/features/overtime/widgets/overtime_detail_sheet.dart';

void main() {
  group('ShareService Format Tests', () {
    test('buildServiceShareText creates complete report', () {
      final item = ServiceItem(
        id: 'SRV-01',
        tanggal: '2026-09-04',
        equipment: '343FN4M01',
        kategori: 'Electrical',
        deskripsi: 'Inspeksi Carbon Brush',
        tindakan: 'Penggantian 2 unit',
        status: 'Done',
        teknisi: 'Tim Listrik',
        area: 'Raw Mill',
        recommendation: 'Cek getaran',
        stats: {'low': '1', 'medium': '2', 'high': '11', 'min': '32.5'},
      );

      final text = ShareService.buildServiceShareText(item);
      expect(text, contains('PLIRM34 - Hasil Inspeksi Service'));
      expect(text, contains('343FN4M01'));
      expect(text, contains('Tim Listrik'));
      expect(text, contains('Merah 1, Kuning 2, Hijau 11'));
    });

    test('buildNegatifShareText creates formatted alert', () {
      final item = NegatifItem(
        id: '1',
        equipment: '323BC2',
        temuan: 'drift switch patah',
        status: 'OPEN',
        statusTambahan: 'nunggu sparepart',
        area: 'Raw Mill',
        followUpPlan: 'Ganti switch baru',
        foundDate: '2026-09-01',
      );

      final text = ShareService.buildNegatifShareText(item);
      expect(text, contains('*PLIRM34 - Temuan Negatif List*'));
      expect(text, contains('323BC2 (Raw Mill)'));
      expect(text, contains('Ganti switch baru'));
    });

    test('buildCarbonBrushShareText includes threshold info', () {
      final item = CarbonBrushItem(
        equipment: '343FN4M01',
        statusLimit: '1/6 DEKAT LIMIT',
        estimasi: '15 Sep 2026 (10 hari)',
        tanggalUkur: '20 Agu 2026',
        nilai: '32.5 mm',
        keterangan: 'Dekat limit',
      );

      final text = ShareService.buildCarbonBrushShareText(item);
      expect(text, contains('*PLIRM34 - Early Warning Carbon Brush*'));
      expect(text, contains('343FN4M01'));
      expect(text, contains('Batas Limit: Merah < 30.0 mm'));
    });

    test('buildSparepartShareText includes stock and location', () {
      final item = SparepartItem(
        id: '1',
        kode: 'CB-634-SIEMENS',
        nama: 'Carbon Brush SIEMENS',
        stok: 24,
        satuan: 'PCS',
        lokasi: 'Rak A-02',
      );

      final text = ShareService.buildSparepartShareText(item);
      expect(text, contains('*PLIRM34 - Info Stok Sparepart*'));
      expect(text, contains('CB-634-SIEMENS'));
      expect(text, contains('24 PCS'));
      expect(text, contains('Rak A-02'));
    });
  });

  group('EquipmentHistoryChart Widget Tests', () {
    testWidgets('renders chart and allows point selection', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: EquipmentHistoryChart(
                equipmentName: '343FN4M01 - SIEMENS',
                initialPointKey: 'F4',
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('TREN HISTORICAL KEAUSAN'), findsOneWidget);
      expect(find.text('343FN4M01 - SIEMENS'), findsOneWidget);
      expect(find.text('Limit (< 30mm)'), findsOneWidget);
      expect(find.text('Normal (≥ 34mm)'), findsOneWidget);
      expect(find.textContaining('F4'), findsWidgets);
    });
  });

  group('Role Authorization & Detail Sheets Tests', () {
    testWidgets('NegatifDetailSheet allows close for Admin and Organik, but restricts Team', (WidgetTester tester) async {
      final item = NegatifItem(
        id: '101',
        equipment: '343BE1',
        temuan: 'Kabel sensor terkelupas',
        status: 'OPEN',
        statusTambahan: 'Urgent',
        area: 'Kiln',
        followUpPlan: 'Isolasi ulang & ganti conduit',
        foundDate: '2026-09-02',
      );

      // Test with Team role (Technician)
      final teamUser = UserModel(id: 3, username: 'team.plirm34', role: 'team');
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NegatifDetailSheet(item: item, currentUser: teamUser),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('DESKRIPSI TEMUAN'), findsOneWidget);
      expect(find.text('Kabel sensor terkelupas'), findsOneWidget);
      expect(find.text('Akses Khusus Pengawas'), findsOneWidget);
      expect(find.textContaining('Role Tim Teknisi hanya berwenang melapor'), findsOneWidget);
      // "Tutup Temuan" button should NOT be rendered for team
      expect(find.text('Tutup Temuan (Mark Closed)'), findsNothing);

      // Test with Organik role (Supervisor)
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final organikUser = UserModel(id: 2, username: 'organik.plirm34', role: 'organik');
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NegatifDetailSheet(item: item, currentUser: organikUser),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Otorisasi Penutupan Temuan'), findsOneWidget);
      expect(find.text('Tutup Temuan (Mark Closed)'), findsOneWidget);
    });

    testWidgets('CarbonBrushDetailSheet renders historical chart and action buttons', (WidgetTester tester) async {
      final item = CarbonBrushItem(
        equipment: '343FN4M01 - SIEMENS',
        statusLimit: '1/6 DEKAT LIMIT',
        estimasi: '15 Sep 2026 (10 hari)',
        tanggalUkur: '20 Agu 2026',
        nilai: '32.5 mm',
        keterangan: 'Dekat limit',
        points: [
          CarbonBrushPoint(
            pointKey: 'F4',
            currentValue: 32.5,
            countdownDays: 10,
            estimatedReplacementDate: '15 Sep 2026',
            lastInspectionDate: '20 Agu 2026',
            medianWearRate: 0.095,
          ),
        ],
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CarbonBrushDetailSheet(item: item),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('343FN4M01 - SIEMENS'), findsWidgets);
      expect(find.text('TREN HISTORICAL KEAUSAN'), findsOneWidget);
      expect(find.text('Kirim WA'), findsOneWidget);
      expect(find.text('Bagikan'), findsOneWidget);
    });

    testWidgets('ServiceDetailSheet displays service details and share buttons', (WidgetTester tester) async {
      final item = ServiceItem(
        id: 'SRV-09',
        tanggal: '2026-09-04',
        equipment: '341FN03M01',
        kategori: 'Electrical',
        deskripsi: 'Inspeksi & Cleaning Motor MV',
        tindakan: 'Pembersihan slip ring',
        status: 'Done',
        teknisi: 'Shift A',
        area: 'Raw Mill',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ServiceDetailSheet(item: item),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('341FN03M01'), findsOneWidget);
      expect(find.text('DESKRIPSI TEMUAN'), findsOneWidget);
      expect(find.text('TINDAKAN PERBAIKAN'), findsOneWidget);
      expect(find.textContaining('Kirim WA'), findsOneWidget);
      expect(find.text('Bagikan'), findsOneWidget);
    });

    testWidgets('SparepartDetailSheet displays stock level and requisition button', (WidgetTester tester) async {
      final item = SparepartItem(
        id: 'SP-1',
        kode: 'CB-634',
        nama: 'Carbon Brush SIEMENS 32x50',
        stok: 24,
        satuan: 'PCS',
        lokasi: 'Rak A-02',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SparepartDetailSheet(item: item),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('CB-634'), findsWidgets);
      expect(find.text('Carbon Brush SIEMENS 32x50'), findsWidgets);
      expect(find.text('24'), findsOneWidget);
      expect(find.text('Minta via WA'), findsOneWidget);
      expect(find.text('Bagikan'), findsOneWidget);
    });

    testWidgets('OvertimeDetailSheet displays hours quota and share actions', (WidgetTester tester) async {
      final item = OvertimeItem(
        employeeNo: '3401',
        employeeName: 'M. RIDWAN',
        groupType: 'Preventif',
        companyName: 'PT SBG',
        monthRawHours: 32.5,
        monthLiveHours: 42.0,
        contractLiveHours: 42.0,
        annualRemainingHours: 128.5,
        annualUsagePercent: 68.0,
        quotaStatus: 'Aman',
        monthStatus: 'Normal',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: OvertimeDetailSheet(item: item),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('M. RIDWAN'), findsWidgets);
      expect(find.text('JAM REAL'), findsOneWidget);
      expect(find.text('JAM DIAKUI'), findsOneWidget);
      expect(find.text('SISA KUOTA'), findsOneWidget);
      expect(find.text('Kirim WA'), findsOneWidget);
      expect(find.text('Bagikan'), findsOneWidget);
    });
  });

  group('Google Sign-In & Auth Tests', () {
    testWidgets('LoginScreen displays Google Sign-In button and field email option', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        MaterialApp(
          home: LoginScreen(
            apiService: ApiService(),
            onLoginSuccess: (_) {},
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Continue with Google'), findsOneWidget);
      expect(find.text('Opsi: Masuk Cepat Email Google Lapangan'), findsOneWidget);

      // Verify SIG logo is rendered
      expect(find.byType(Image), findsOneWidget);

      // Verify Quick Role Switcher is removed
      expect(find.text('PILIH ROLE UJI COBA (QUICK ROLE):'), findsNothing);
      expect(find.text('PILIH ROLE UJI COBA (QUICK ROLE)'), findsNothing);

      // Verify Offline button is removed
      expect(find.text('LIHAT DATA OFFLINE'), findsNothing);

      // Verify footer text is removed
      expect(find.text('SISTEM INFORMASI LAPANGAN PLIRM34 // VERSI FLUTTER'), findsNothing);

      // Tap on direct field email option
      await tester.tap(find.text('Opsi: Masuk Cepat Email Google Lapangan'));
      await tester.pumpAndSettle();

      expect(find.text('Masuk Akun Google'), findsOneWidget);
      expect(find.text('Verifikasi & Masuk'), findsOneWidget);
    });

    test('UserModel correctly parses Google SSO payload with roles', () {
      final user = UserModel.fromJson({
        'id': 35,
        'username': 'engineer.test@gmail.com',
        'role': 'team',
      }, token: 'test_token_123');

      expect(user.username, equals('engineer.test@gmail.com'));
      expect(user.role, equals('team'));
      expect(user.isTeam, isTrue);
      expect(user.isAdmin, isFalse);
      expect(user.roleBadgeLabel, equals('TIM TEKNISI'));
      expect(user.token, equals('test_token_123'));
    });

    test('UserModel handles admin and organik roles and permissions', () {
      final adminUser = UserModel(id: 1, username: 'admin.user', role: 'admin');
      expect(adminUser.isAdmin, isTrue);
      expect(adminUser.isOrganik, isFalse);
      expect(adminUser.isTeam, isFalse);
      expect(adminUser.roleBadgeLabel, equals('ADMIN'));

      final organikUser = UserModel(id: 2, username: 'organik.user', role: 'organik');
      expect(organikUser.isAdmin, isFalse);
      expect(organikUser.isOrganik, isTrue);
      expect(organikUser.isTeam, isFalse);
      expect(organikUser.roleBadgeLabel, equals('ORGANIK'));
    });
  });

  group('Service Edit and Delete Feature Tests', () {
    test('ServiceItem toJson and fromJson preserves ID and formType for update', () {
      final original = ServiceItem(
        id: 'service-test-12345',
        tanggal: '2026-09-05',
        equipment: '343FN4M01 - SIEMENS',
        kategori: 'Electrical',
        subtype: 'Motor MV Carbon Brush',
        formType: 'service-motor-mv-carbon-brush',
        area: 'Raw Mill',
        teknisi: 'Ahmad Sukri',
        status: 'Done',
        deskripsi: 'Inspeksi & Penggantian Carbon Brush',
        tindakan: 'Penggantian titik F1 & F2',
        recommendation: 'Cek kembali 2 minggu lagi',
        measurements: {'F1': 50.0, 'F2': 50.0, 'F3': 42.0},
        replacedPoints: ['F1', 'F2'],
        payload: {'carbonBrushStockKey': 'SI00005550|RC73/MR7 50X32X25'},
      );

      final json = original.toJson();
      expect(json['id'], equals('service-test-12345'));
      expect(json['equipmentName'], equals('343FN4M01 - SIEMENS'));
      expect(json['formType'], equals('service-motor-mv-carbon-brush'));
      expect(json['payload']['inspectionDate'], equals('2026-09-05'));
      expect(json['payload']['measurements']['F1'], equals(50.0));

      final restored = ServiceItem.fromJson(json);
      expect(restored.id, equals('service-test-12345'));
      expect(restored.equipment, equals('343FN4M01 - SIEMENS'));
      expect(restored.formType, equals('service-motor-mv-carbon-brush'));
      expect(restored.measurements['F1'], equals(50.0));
      expect(restored.replacedPoints, containsAll(['F1', 'F2']));
    });

    testWidgets('ServiceDetailSheet renders Edit and Delete buttons when callbacks provided', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final item = ServiceItem(
        id: 'service-001',
        tanggal: '2026-09-05',
        equipment: '343FN4M01 - SIEMENS',
        kategori: 'Electrical',
        subtype: 'Motor MV Carbon Brush',
        formType: 'service-motor-mv-carbon-brush',
        area: 'Raw Mill',
        teknisi: 'Tim Listrik Shift A',
        status: 'Done',
        deskripsi: 'Pemeriksaan rutin berkala',
        tindakan: 'Pembersihan slip ring',
      );

      bool editCalled = false;
      bool deleteCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () {
                  ServiceDetailSheet.show(
                    context,
                    item: item,
                    currentUser: UserModel(id: 1, username: 'admin', role: 'admin'),
                    onEdit: () => editCalled = true,
                    onDelete: () => deleteCalled = true,
                  );
                },
                child: const Text('Open Sheet'),
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Sheet'));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.edit_outlined), findsWidgets);
      expect(find.byIcon(Icons.delete_outline_rounded), findsOneWidget);

      await tester.tap(find.byIcon(Icons.edit_outlined).first);
      await tester.pumpAndSettle();
      expect(editCalled, isTrue);

      // Re-open sheet to test delete
      await tester.tap(find.text('Open Sheet'));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.delete_outline_rounded));
      await tester.pumpAndSettle();
      expect(deleteCalled, isTrue);
    });
  });

  group('Profile Completion & Unit Kerja Scoping Tests', () {
    test('UserModel handles Unit Kerja and Profile Completion attributes', () {
      final user = UserModel.fromJson({
        'id': 100,
        'username': 'teknisi1@gmail.com',
        'role': 'team',
        'fullName': 'Ahmad Teknisi',
        'badgeNumber': '98765',
        'employmentType': 'organik',
        'company': 'Gopo Tuban',
        'unitKerja': 'PLIRM12',
        'isProfileCompleted': 1,
      });

      expect(user.displayName, equals('Ahmad Teknisi'));
      expect(user.unitBadgeLabel, equals('PLIRM12'));
      expect(user.isProfileCompleted, isTrue);
      expect(user.needsProfileCompletion, isFalse);
    });

    test('UserModel marks incomplete profile for non-admin', () {
      final newUser = UserModel(
        id: 101,
        username: 'google_new_user',
        role: 'team',
        isProfileCompleted: false,
      );

      expect(newUser.needsProfileCompletion, isTrue);
      expect(newUser.unitBadgeLabel, equals('UNIT BELUM DISET'));

      final adminUser = UserModel(
        id: 1,
        username: 'admin',
        role: 'admin',
        isProfileCompleted: false,
      );
      // Admin never needs profile completion
      expect(adminUser.needsProfileCompletion, isFalse);
      expect(adminUser.unitBadgeLabel, equals('ALL UNITS'));
    });

    testWidgets('ProfileCompletionDialog renders form fields properly', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final user = UserModel(
        id: 105,
        username: 'new.teknisi@gmail.com',
        role: 'team',
        fullName: 'New Teknisi',
        isProfileCompleted: false,
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProfileCompletionDialog(
              apiService: ApiService(),
              currentUser: user,
              onProfileCompleted: (_) {},
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Kelengkapan Profil Akun'), findsOneWidget);
      expect(find.text('Nama Lengkap *'), findsOneWidget);
      expect(find.text('No. Badge / NIK *'), findsOneWidget);
      expect(find.text('Jenis Karyawan *'), findsOneWidget);
      expect(find.text('Unit Kerja Penugasan *'), findsOneWidget);
      expect(find.text('Simpan Profil & Mulai'), findsOneWidget);
    });

    test('ColleagueUser and SapEquipmentItem models parse and format correctly', () {
      final colleague = ColleagueUser.fromJson({
        'id': 12,
        'username': 'agus.wahyudi',
        'fullName': 'Agus Wahyudi',
        'badgeNumber': '88214',
        'unitKerja': 'HAR ELEKTRIK',
        'role': 'organik',
      });
      expect(colleague.fullName, equals('Agus Wahyudi'));
      expect(colleague.badgeNumber, equals('88214'));
      expect(colleague.unitKerja, equals('HAR ELEKTRIK'));

      final mainEquip = SapEquipmentItem(
        equipmentId: '10001234',
        tagNo: '231BF1',
        description: 'Belt Feeder 1',
        plantCode: 'PLANT3',
        subEquipmentCount: 3,
        isMainEquipment: true,
      );
      expect(mainEquip.typeBadge, equals('MAIN (3 Sub)'));
      expect(mainEquip.fullLabel, equals('231BF1 - Belt Feeder 1 [MAIN]'));

      final subEquip = SapEquipmentItem(
        equipmentId: '10001235',
        tagNo: '231BF1M01',
        description: 'Motor Belt Feeder 1',
        plantCode: 'PLANT3',
        parentEquipmentId: '10001234',
        isMainEquipment: false,
      );
      expect(subEquip.typeBadge, equals('SUB'));
      expect(subEquip.fullLabel, equals('231BF1M01 - Motor Belt Feeder 1 [SUB]'));
    });
  });
}

