import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portable_inspection_tool/core/theme/app_theme.dart';
import 'package:portable_inspection_tool/data/models/models.dart';
import 'package:portable_inspection_tool/data/services/api_service.dart';
import 'package:portable_inspection_tool/ui/features/dashboard/widgets/cement_plant_flow_widget.dart';
import 'package:portable_inspection_tool/ui/features/dashboard/widgets/equipment_health_sheet.dart';

class MockApiService extends ApiService {
  @override
  Future<List<CarbonBrushItem>> fetchCarbonBrush() async => [];
  @override
  Future<List<NegatifItem>> fetchNegatifList({String? status, String? area}) async => [];
  @override
  Future<List<ServiceItem>> fetchServices({
    String? area,
    String? kategori,
    String? startDate,
    String? endDate,
  }) async => [];
}

void main() {
  group('Equipment Health Model & Generator Tests', () {
    test('generatePlantNodes produces 8 main equipments in correct manufacturing sequence', () {
      final nodes = PlantEquipmentNode.generatePlantNodes(
        selectedArea: 'Tuban 3',
        carbonBrushes: [],
        negatifItems: [],
        serviceItems: [],
      );

      expect(nodes.length, 8);
      expect(nodes[0].type, EquipmentType.crusher);
      expect(nodes[0].code, 'CR');
      expect(nodes[1].type, EquipmentType.rawmill);
      expect(nodes[1].code, 'RM');
      expect(nodes[2].type, EquipmentType.coalmill);
      expect(nodes[2].code, 'CM');
      expect(nodes[3].type, EquipmentType.preheater);
      expect(nodes[3].code, 'PH');
      expect(nodes[4].type, EquipmentType.kiln);
      expect(nodes[4].code, 'KL');
      expect(nodes[5].type, EquipmentType.cooler);
      expect(nodes[5].code, 'CL');
      expect(nodes[6].type, EquipmentType.finishmill);
      expect(nodes[6].code, 'FM');
      expect(nodes[7].type, EquipmentType.packer);
      expect(nodes[7].code, 'PK');
    });

    test('generatePlantNodes detects critical carbon brush and reduces health score', () {
      final mockCb = [
        CarbonBrushItem(
          equipment: 'Raw Mill Main Motor 343RM1M01',
          statusLimit: 'Kritis',
          estimasi: '5 hari',
          tanggalUkur: '01 Sep 2026',
          nilai: '28.0 mm',
          keterangan: 'Tebal 28.0 mm < 30 mm (Kritis)',
        ),
      ];

      final mockNeg = [
        NegatifItem(
          id: 'neg-1',
          equipment: 'Raw Mill 343RM1',
          temuan: 'Vibrasi fan separator tinggi',
          status: 'OPEN',
          statusTambahan: 'Menunggu shutdown',
          area: 'Tuban 3',
        ),
      ];

      final nodes = PlantEquipmentNode.generatePlantNodes(
        selectedArea: 'Tuban 3',
        carbonBrushes: mockCb,
        negatifItems: mockNeg,
        serviceItems: [],
      );

      final rmNode = nodes.firstWhere((n) => n.type == EquipmentType.rawmill);
      expect(rmNode.status, HealthStatus.critical);
      expect(rmNode.healthScore, lessThanOrEqualTo(60.0));
      expect(rmNode.openNegatifCount, 1);
      expect(rmNode.lowestCbVal, 28.0);
    });
  });

  group('CementPlantFlowWidget Widget Tests', () {
    testWidgets('renders horizontal track with all 8 main equipment cards', (tester) async {
      final nodes = PlantEquipmentNode.generatePlantNodes(
        selectedArea: 'Tuban 3',
        carbonBrushes: [],
        negatifItems: [],
        serviceItems: [],
      );

      PlantEquipmentNode? tappedNode;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.darkTheme,
          home: Scaffold(
            body: SingleChildScrollView(
              child: CementPlantFlowWidget(
                nodes: nodes,
                selectedArea: 'Tuban 3',
                onEquipmentTapped: (node) {
                  tappedNode = node;
                },
              ),
            ),
          ),
        ),
      );

      await tester.pump(const Duration(milliseconds: 200));

      // Header labels
      expect(find.text('LIVE 2D PLANT FLOW'), findsOneWidget);
      expect(find.text('TUBAN 3'), findsOneWidget);

      // Verify equipment cards are rendered
      expect(find.text('CRUSHER'), findsOneWidget);
      expect(find.text('RAW MILL'), findsOneWidget);
      expect(find.text('COAL MILL'), findsOneWidget);
      expect(find.text('PREHEATER'), findsOneWidget);

      // Tap on the first equipment card (CRUSHER)
      await tester.tap(find.text('CRUSHER'));
      await tester.pump();

      expect(tappedNode, isNotNull);
      expect(tappedNode!.type, EquipmentType.crusher);
    });
  });

  group('EquipmentHealthSheet Modal Tests', () {
    testWidgets('renders equipment diagnostic health metrics and actions', (tester) async {
      final mockService = MockApiService();
      final node = PlantEquipmentNode(
        type: EquipmentType.rawmill,
        stepOrder: 2,
        code: 'RM',
        title: 'RAW MILL (343-RM1)',
        subtitle: 'Vertical Roller Mill // Raw Meal Grinding',
        area: 'Tuban 3',
        healthScore: 82.0,
        status: HealthStatus.normal,
        statusLabel: 'NORMAL / AMAN',
        metricValue: 'Vib: 3.2 mm/s',
        metricLabel: 'VIBRASI NORMAL',
        vibration: 3.2,
        bearingTemp: 68.0,
        motorCurrent: 210.0,
      );

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.darkTheme,
          home: Scaffold(
            body: Builder(
              builder: (ctx) => ElevatedButton(
                onPressed: () {
                  EquipmentHealthSheet.show(
                    ctx,
                    node: node,
                    apiService: mockService,
                    currentUser: UserModel(id: 1, username: 'tester', role: 'admin'),
                    onRefresh: () {},
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

      // Check header and node title
      expect(find.text('RAW MILL (343-RM1)'), findsOneWidget);
      expect(find.text('82%'), findsOneWidget);
      expect(find.text('NORMAL / AMAN'), findsOneWidget);

      // Check telemetry metrics
      expect(find.text('GETARAN (VIBRATION)'), findsOneWidget);
      expect(find.text('SUHU BEARING (TEMP)'), findsOneWidget);
      expect(find.text('3.2 mm/s RMS'), findsOneWidget);
      expect(find.text('68.0 °C'), findsOneWidget);

      // Scroll to bottom of sheet to reveal action button
      await tester.drag(find.byType(ListView).last, const Offset(0, -400));
      await tester.pumpAndSettle();

      // Check Action Button
      expect(find.text('Input Service Baru'), findsOneWidget);
    });
  });
}
