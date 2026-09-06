import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/offline_service.dart';
import '../../../../data/models/models.dart';
import '../../../../data/services/api_service.dart';
import 'carbon_brush_stock_sheet.dart';

class ServiceFormSheet extends StatefulWidget {
  final ApiService apiService;
  final UserModel? currentUser;
  final String? initialArea;
  final String? initialCategory;
  final String? initialSubtype;
  final List<ServiceItem>? existingServices;
  final ServiceItem? itemToEdit;
  final VoidCallback onSuccess;

  const ServiceFormSheet({
    super.key,
    required this.apiService,
    required this.currentUser,
    this.initialArea,
    this.initialCategory,
    this.initialSubtype,
    this.existingServices,
    this.itemToEdit,
    required this.onSuccess,
  });

  static Future<void> show(
    BuildContext context, {
    required ApiService apiService,
    UserModel? currentUser,
    String? initialArea,
    String? initialCategory,
    String? initialSubtype,
    List<ServiceItem>? existingServices,
    ServiceItem? itemToEdit,
    required VoidCallback onSuccess,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ServiceFormSheet(
        apiService: apiService,
        currentUser: currentUser,
        initialArea: initialArea,
        initialCategory: initialCategory,
        initialSubtype: initialSubtype,
        existingServices: existingServices,
        itemToEdit: itemToEdit,
        onSuccess: onSuccess,
      ),
    );
  }

  @override
  State<ServiceFormSheet> createState() => _ServiceFormSheetState();
}

class _ServiceFormSheetState extends State<ServiceFormSheet> {
  final _formKey = GlobalKey<FormState>();

  static const Map<String, List<Map<String, String>>> _categoryOptions = {
    'Electrical': [
      {'label': 'Motor MV Carbon Brush', 'type': 'service-motor-mv-carbon-brush'},
      {'label': 'Motor MV Umum', 'type': 'service-motor-mv'},
      {'label': 'Motor MSO', 'type': 'service-motor-mso'},
      {'label': 'MCC & Cubicle', 'type': 'service-mcc'},
      {'label': 'Electrical Room', 'type': 'service-electrical-room'},
      {'label': 'Transformator', 'type': 'service-transformator'},
      {'label': 'EHCA', 'type': 'service-ehca'},
    ],
    'Instrumentasi': [
      {'label': 'Instrument Lapangan', 'type': 'service-instrument'},
      {'label': 'CEMS (Continuous Emission)', 'type': 'service-cems'},
      {'label': 'Opacity Meter', 'type': 'service-opacity-meter'},
    ],
    'DCS': [
      {'label': 'UPS & Battery', 'type': 'service-ups'},
      {'label': 'DCS Controller & I/O', 'type': 'service-dcs'},
      {'label': 'Server & Network DCS', 'type': 'service-server-network'},
      {'label': 'PLC System', 'type': 'service-plc'},
    ],
  };

  static const List<String> _areas = [
    'Raw Mill',
    'Kiln',
    'Crusher',
    'Finish Mill',
    'Packing Plant',
    'Jetty & Pelabuhan',
    'Utility',
  ];

  static const List<String> _statuses = ['Done', 'In Progress', 'Pending'];

  String _selectedCategory = 'Electrical';
  late String _selectedSubtype;
  late String _selectedFormType;
  late String _selectedArea;
  String _selectedStatus = 'Done';
  DateTime _selectedDate = DateTime.now();

  // Common controllers & focus
  final _equipmentCtrl = TextEditingController();
  final _equipmentFocusNode = FocusNode();
  final _teknisiCtrl = TextEditingController();
  final _deskripsiCtrl = TextEditingController();
  final _tindakanCtrl = TextEditingController();
  final _rekomendasiCtrl = TextEditingController();

  // Autocomplete & History state
  List<String> _equipmentOptions = [];
  List<ServiceItem> _serviceHistory = [];
  List<CarbonBrushStockItem> _stockItems = CarbonBrushStockItem.defaultItems();
  Map<String, double?> _previousMeasurements = {};
  String _previousInspectionDate = '';
  // Colleague Tagging State
  List<ColleagueUser> _availableColleagues = [];
  final List<String> _taggedColleagues = [];
  bool _isLoadingColleagues = false;

  // Inline Equipment & Sub-Equipment Search State
  List<SapEquipmentItem> _sapEquipmentSuggestions = [];
  List<String> _cbEquipmentSuggestions = [];
  bool _isSearchingEquipment = false;
  bool _showEquipmentSuggestions = false;
  Timer? _equipmentDebounceTimer;
  // --- Subcategory: Electrical Room ---
  String _erPanelDoorCondition = 'OK';
  String _erFloorCleanliness = 'Bersih';
  String _erRoomTemperature = 'Dingin';
  final _erBatteryVdc = TextEditingController();
  final _erBatteryAmpere = TextEditingController();
  final _erBatteryTotalVdc = TextEditingController();
  final _erBattery1 = TextEditingController();
  final _erBattery2 = TextEditingController();
  final _erTrafoEquipment = TextEditingController();
  final _erTrafoWindingTemp = TextEditingController();
  final _erTrafoOilTemp = TextEditingController();
  final _erTrafoOilLevel = TextEditingController();
  String _erTrafoSilicaGel = 'OK';

  // --- Subcategory: Motor MSO ---
  String _msoCondition = 'GOOD';
  final _msoInspIdCtrl = TextEditingController();
  final _msoIdAmtransCtrl = TextEditingController();
  final _msoCreatorCtrl = TextEditingController();
  final _msoMplantCtrl = TextEditingController();
  final _msoEquipmentDescCtrl = TextEditingController();
  final _msoTemperaturDsCtrl = TextEditingController();
  final _msoTemperaturNdsCtrl = TextEditingController();
  final _msoKelengkapanCtrl = TextEditingController();
  final _msoNoteCtrl = TextEditingController();
  final _msoGeDsVertBeforeCtrl = TextEditingController();
  final _msoGeDsHorBeforeCtrl = TextEditingController();
  final _msoVibDsVertBeforeCtrl = TextEditingController();
  final _msoVibDsHorBeforeCtrl = TextEditingController();
  final _msoGeNdsVertBeforeCtrl = TextEditingController();
  final _msoGeNdsHorBeforeCtrl = TextEditingController();
  final _msoVibNdsVertBeforeCtrl = TextEditingController();
  final _msoVibNdsHorBeforeCtrl = TextEditingController();
  final _msoRegreaseDeCtrl = TextEditingController();
  final _msoRegreaseNdeCtrl = TextEditingController();
  final _msoGeDsVertAfterCtrl = TextEditingController();
  final _msoGeDsHorAfterCtrl = TextEditingController();
  final _msoGeNdsVertAfterCtrl = TextEditingController();
  final _msoGeNdsHorAfterCtrl = TextEditingController();

  // --- Subcategory: Motor MV Umum ---
  final _mvMotorCurrentCtrl = TextEditingController();
  final _mvVibrationDeCtrl = TextEditingController();
  final _mvVibrationNdeCtrl = TextEditingController();
  final _mvWindingTempCtrl = TextEditingController();
  final _mvBearingCondCtrl = TextEditingController();

  // --- Subcategory: Motor MV Carbon Brush ---
  String _cbStockKey = 'SI00005550|RC73/MR7 50X32X25';
  final _cbReplacementCtrl = TextEditingController();
  final _cbMeggerCtrl = TextEditingController();
  final _cbPicCtrl = TextEditingController();
  final Map<String, double?> _measurements = {
    'F1': null, 'F2': null, 'F3': null, 'F4': null, 'F5': null, 'F6': null,
    'E1': null, 'E2': null, 'E3': null, 'E4': null, 'E5': null, 'E6': null,
    'C1': null, 'C2': null, 'C3': null, 'C4': null, 'C5': null, 'C6': null,
    'D1': null, 'D2': null, 'D3': null, 'D4': null, 'D5': null, 'D6': null,
  };
  final Set<String> _replacedPoints = {};

  // --- Subcategory: MCC ---
  String _mccTestFunction = 'OK';
  String _mccVisualCondition = 'OK';
  String _mccPartCleanliness = 'OK';

  // --- Subcategory: EH/CA ---
  final _ehcaSystemPressureCtrl = TextEditingController();
  final _ehcaFluidLevelCtrl = TextEditingController();
  final _ehcaFilterConditionCtrl = TextEditingController();
  final _ehcaLeakConditionCtrl = TextEditingController();
  final _ehcaUnitConditionCtrl = TextEditingController();

  // --- Subcategory: Instrument ---
  final _insSensorConditionCtrl = TextEditingController();

  // --- Subcategory: CEMS ---
  final _cemsInspectorCtrl = TextEditingController();
  final String _cemsO2Status = 'OK';
  final _cemsO2ValueCtrl = TextEditingController();
  final _cemsO2UnitCtrl = TextEditingController(text: '%');
  final _cemsO2NoteCtrl = TextEditingController();

  final String _cemsCoStatus = 'OK';
  final _cemsCoValueCtrl = TextEditingController();
  final _cemsCoUnitCtrl = TextEditingController(text: 'mg/Nm3');
  final _cemsCoNoteCtrl = TextEditingController();

  final String _cemsNoxStatus = 'OK';
  final _cemsNoxValueCtrl = TextEditingController();
  final _cemsNoxUnitCtrl = TextEditingController(text: 'mg/Nm3');
  final _cemsNoxNoteCtrl = TextEditingController();

  final String _cemsSo2Status = 'OK';
  final _cemsSo2ValueCtrl = TextEditingController();
  final _cemsSo2UnitCtrl = TextEditingController(text: 'mg/Nm3');
  final _cemsSo2NoteCtrl = TextEditingController();

  final String _cemsDustStatus = 'OK';
  final _cemsDustValueCtrl = TextEditingController();
  final _cemsDustUnitCtrl = TextEditingController(text: 'mg/Nm3');
  final _cemsDustNoteCtrl = TextEditingController();

  final String _cemsFlowStatus = 'OK';
  final _cemsFlowValueCtrl = TextEditingController();
  final _cemsFlowUnitCtrl = TextEditingController(text: 'Nm3/h');
  final _cemsFlowNoteCtrl = TextEditingController();

  final String _cemsTempStatus = 'OK';
  final _cemsTempValueCtrl = TextEditingController();
  final _cemsTempUnitCtrl = TextEditingController(text: 'C');
  final _cemsTempNoteCtrl = TextEditingController();

  final String _cemsPressureStatus = 'OK';
  final _cemsPressureValueCtrl = TextEditingController();
  final _cemsPressureUnitCtrl = TextEditingController(text: 'kPa');
  final _cemsPressureNoteCtrl = TextEditingController();

  final String _cemsAnalyzerPower = 'OK';
  final String _cemsAnalyzerStatus = 'OK';
  final String _cemsAnalyzerAlarm = 'OK';
  final String _cemsSamplingProbe = 'OK';
  final String _cemsSamplingFilter = 'OK';
  final String _cemsSamplingPump = 'OK';
  final String _cemsCalibrationCylinder = 'OK';
  final String _cemsDataDasScada = 'OK';
  final String _cemsSupportPowerSupply = 'OK';
  String _cemsUrgencyLevel = 'Low';
  final _cemsFindingIssueCtrl = TextEditingController();
  final _cemsPossibleCauseCtrl = TextEditingController();
  final _cemsEmissionImpactCtrl = TextEditingController();

  // --- Subcategory: Opacity Meter ---
  final _opTimeCtrl = TextEditingController();
  final _opBrandModelCtrl = TextEditingController();
  final _opShiftCtrl = TextEditingController();
  final _opOpacityValCtrl = TextEditingController();
  String _opOpacityStatus = 'OK';
  final _opTransmittanceValCtrl = TextEditingController();
  String _opTransmittanceStatus = 'OK';
  final _opAlarmValCtrl = TextEditingController();
  final String _opAlarmCondition = 'OK';
  final String _opVisualHousing = 'OK';
  final String _opVisualMounting = 'OK';
  final String _opOpticLens = 'OK';
  final String _opOpticReflector = 'OK';
  final String _opPurgeActive = 'OK';
  final String _opElectricalPower = 'OK';
  bool _opRecCleaning = false;
  bool _opRecAlignment = false;
  bool _opRecCalibration = false;
  final bool _opRecSparePart = false;

  // --- Subcategory: DCS / PLC ---
  final _dcsEquipDescCtrl = TextEditingController();
  final _dcsPlcPowerSupplyCtrl = TextEditingController();
  final _dcsPlcCommCtrl = TextEditingController();
  final _dcsPlcProcessorCtrl = TextEditingController();
  final _dcsPlcDiCtrl = TextEditingController();
  final _dcsPlcDoCtrl = TextEditingController();
  final _dcsPlcAiCtrl = TextEditingController();
  final _dcsPlcAoCtrl = TextEditingController();
  final _dcsFiberOpticCtrl = TextEditingController();
  final _dcsGroundingEeEaCtrl = TextEditingController();
  final _dcsGroundingEePeCtrl = TextEditingController();
  final _dcsGroundingEaPeCtrl = TextEditingController();
  final _dcsCableTerminationCtrl = TextEditingController();
  final _dcsUpsOutputCtrl = TextEditingController();
  final _dcsPdbOutputCtrl = TextEditingController();
  final _dcsRoomAcCtrl = TextEditingController();
  final _dcsRoomCleanlinessCtrl = TextEditingController();
  final _dcsDamagedPartCtrl = TextEditingController();
  final _dcsAdjustmentRepairCtrl = TextEditingController();

  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    if (widget.itemToEdit != null) {
      final item = widget.itemToEdit!;
      if (_categoryOptions.containsKey(item.kategori)) {
        _selectedCategory = item.kategori;
      }
      final subList = _categoryOptions[_selectedCategory] ?? _categoryOptions['Electrical']!;
      final found = subList.firstWhere(
        (e) => e['type'] == item.formType || e['label']!.toLowerCase() == item.subtype.toLowerCase(),
        orElse: () => subList.first,
      );
      _selectedSubtype = found['label']!;
      _selectedFormType = found['type']!;
      _selectedArea = _areas.contains(item.area) ? item.area : 'Raw Mill';
      _selectedStatus = _statuses.contains(item.status) ? item.status : 'Done';
      if (item.tanggal.isNotEmpty) {
        _selectedDate = DateTime.tryParse(item.tanggal) ?? DateTime.now();
      }
      _equipmentCtrl.text = item.equipment;
      _teknisiCtrl.text = item.teknisi;
      if (item.teknisi.isNotEmpty) {
        final parts = item.teknisi.split(',').map((s) => s.trim()).where((s) => s.isNotEmpty).toList();
        if (parts.length > 1) {
          _taggedColleagues.addAll(parts.sublist(1));
        }
      }
      _deskripsiCtrl.text = item.deskripsi;
      _tindakanCtrl.text = item.tindakan;
      _rekomendasiCtrl.text = item.recommendation;

      // Carbon brush
      if (item.measurements.isNotEmpty) {
        item.measurements.forEach((k, v) {
          if (_measurements.containsKey(k)) {
            _measurements[k] = double.tryParse(v.toString());
          }
        });
      }
      if (item.replacedPoints.isNotEmpty) {
        _replacedPoints.addAll(item.replacedPoints);
        _cbReplacementCtrl.text = '${_replacedPoints.length} pcs';
      }
      if (item.payload['megger'] != null) {
        _cbMeggerCtrl.text = item.payload['megger'].toString();
      }
      if (item.payload['carbonBrushStockKey'] != null && item.payload['carbonBrushStockKey'].toString().isNotEmpty) {
        _cbStockKey = item.payload['carbonBrushStockKey'].toString();
      } else if (item.payload['stockKey'] != null && item.payload['stockKey'].toString().isNotEmpty) {
        _cbStockKey = item.payload['stockKey'].toString();
      }

      // Populate other subcategory controllers from payload
      final p = item.payload;
      if (p.isNotEmpty) {
        if (p['motorCurrent'] != null) _mvMotorCurrentCtrl.text = p['motorCurrent'].toString();
        if (p['vibrationDe'] != null) _mvVibrationDeCtrl.text = p['vibrationDe'].toString();
        if (p['vibrationNde'] != null) _mvVibrationNdeCtrl.text = p['vibrationNde'].toString();
        if (p['windingTemperature'] != null) _mvWindingTempCtrl.text = p['windingTemperature'].toString();
        if (p['bearingCondition'] != null) _mvBearingCondCtrl.text = p['bearingCondition'].toString();

        if (p['batteryVdc'] != null) _erBatteryVdc.text = p['batteryVdc'].toString();
        if (p['batteryAmpere'] != null) _erBatteryAmpere.text = p['batteryAmpere'].toString();
        if (p['batteryTotalVdc'] != null) _erBatteryTotalVdc.text = p['batteryTotalVdc'].toString();
        if (p['trafoEquipment'] != null) _erTrafoEquipment.text = p['trafoEquipment'].toString();

        if (p['systemPressure'] != null) _ehcaSystemPressureCtrl.text = p['systemPressure'].toString();
        if (p['fluidLevel'] != null) _ehcaFluidLevelCtrl.text = p['fluidLevel'].toString();

        if (p['sensorCondition'] != null) _insSensorConditionCtrl.text = p['sensorCondition'].toString();

        if (p['inspectorName'] != null) _cemsInspectorCtrl.text = p['inspectorName'].toString();
        if (p['findingIssue'] != null) _cemsFindingIssueCtrl.text = p['findingIssue'].toString();

        if (p['equipmentDescription'] != null) _dcsEquipDescCtrl.text = p['equipmentDescription'].toString();
      }
    } else {
      if (widget.initialCategory != null && _categoryOptions.containsKey(widget.initialCategory)) {
        _selectedCategory = widget.initialCategory!;
      }
      final subList = _categoryOptions[_selectedCategory]!;
      if (widget.initialSubtype != null) {
        final found = subList.firstWhere(
          (e) => e['label']!.toLowerCase().contains(widget.initialSubtype!.toLowerCase()),
          orElse: () => subList.first,
        );
        _selectedSubtype = found['label']!;
        _selectedFormType = found['type']!;
      } else {
        _selectedSubtype = subList.first['label']!;
        _selectedFormType = subList.first['type']!;
      }
      _selectedArea = (widget.initialArea != null && _areas.contains(widget.initialArea))
          ? widget.initialArea!
          : 'Raw Mill';
      final myName = (widget.currentUser?.fullName != null && widget.currentUser!.fullName!.trim().isNotEmpty)
          ? widget.currentUser!.fullName!.trim()
          : (widget.currentUser?.username ?? 'Teknisi Lapangan');
      _teknisiCtrl.text = myName;
    }

    _equipmentCtrl.addListener(_onEquipmentInputChanged);
    _initData();
    _loadColleagues();
  }

  @override
  void dispose() {
    _equipmentDebounceTimer?.cancel();
    _equipmentCtrl.removeListener(_onEquipmentInputChanged);
    _equipmentCtrl.dispose();
    _equipmentFocusNode.dispose();
    _teknisiCtrl.dispose();
    _deskripsiCtrl.dispose();
    _tindakanCtrl.dispose();
    _rekomendasiCtrl.dispose();

    // ER
    _erBatteryVdc.dispose();
    _erBatteryAmpere.dispose();
    _erBatteryTotalVdc.dispose();
    _erBattery1.dispose();
    _erBattery2.dispose();
    _erTrafoEquipment.dispose();
    _erTrafoWindingTemp.dispose();
    _erTrafoOilTemp.dispose();
    _erTrafoOilLevel.dispose();

    // MSO
    _msoInspIdCtrl.dispose();
    _msoIdAmtransCtrl.dispose();
    _msoCreatorCtrl.dispose();
    _msoMplantCtrl.dispose();
    _msoEquipmentDescCtrl.dispose();
    _msoTemperaturDsCtrl.dispose();
    _msoTemperaturNdsCtrl.dispose();
    _msoKelengkapanCtrl.dispose();
    _msoNoteCtrl.dispose();
    _msoGeDsVertBeforeCtrl.dispose();
    _msoGeDsHorBeforeCtrl.dispose();
    _msoVibDsVertBeforeCtrl.dispose();
    _msoVibDsHorBeforeCtrl.dispose();
    _msoGeNdsVertBeforeCtrl.dispose();
    _msoGeNdsHorBeforeCtrl.dispose();
    _msoVibNdsVertBeforeCtrl.dispose();
    _msoVibNdsHorBeforeCtrl.dispose();
    _msoRegreaseDeCtrl.dispose();
    _msoRegreaseNdeCtrl.dispose();
    _msoGeDsVertAfterCtrl.dispose();
    _msoGeDsHorAfterCtrl.dispose();
    _msoGeNdsVertAfterCtrl.dispose();
    _msoGeNdsHorAfterCtrl.dispose();

    // MV
    _mvMotorCurrentCtrl.dispose();
    _mvVibrationDeCtrl.dispose();
    _mvVibrationNdeCtrl.dispose();
    _mvWindingTempCtrl.dispose();
    _mvBearingCondCtrl.dispose();

    // CB
    _cbReplacementCtrl.dispose();
    _cbMeggerCtrl.dispose();
    _cbPicCtrl.dispose();

    // EHCA
    _ehcaSystemPressureCtrl.dispose();
    _ehcaFluidLevelCtrl.dispose();
    _ehcaFilterConditionCtrl.dispose();
    _ehcaLeakConditionCtrl.dispose();
    _ehcaUnitConditionCtrl.dispose();

    // Instrument
    _insSensorConditionCtrl.dispose();

    // CEMS
    _cemsInspectorCtrl.dispose();
    _cemsO2ValueCtrl.dispose();
    _cemsO2UnitCtrl.dispose();
    _cemsO2NoteCtrl.dispose();
    _cemsCoValueCtrl.dispose();
    _cemsCoUnitCtrl.dispose();
    _cemsCoNoteCtrl.dispose();
    _cemsNoxValueCtrl.dispose();
    _cemsNoxUnitCtrl.dispose();
    _cemsNoxNoteCtrl.dispose();
    _cemsSo2ValueCtrl.dispose();
    _cemsSo2UnitCtrl.dispose();
    _cemsSo2NoteCtrl.dispose();
    _cemsDustValueCtrl.dispose();
    _cemsDustUnitCtrl.dispose();
    _cemsDustNoteCtrl.dispose();
    _cemsFlowValueCtrl.dispose();
    _cemsFlowUnitCtrl.dispose();
    _cemsFlowNoteCtrl.dispose();
    _cemsTempValueCtrl.dispose();
    _cemsTempUnitCtrl.dispose();
    _cemsTempNoteCtrl.dispose();
    _cemsPressureValueCtrl.dispose();
    _cemsPressureUnitCtrl.dispose();
    _cemsPressureNoteCtrl.dispose();
    _cemsFindingIssueCtrl.dispose();
    _cemsPossibleCauseCtrl.dispose();
    _cemsEmissionImpactCtrl.dispose();

    // Opacity
    _opTimeCtrl.dispose();
    _opBrandModelCtrl.dispose();
    _opShiftCtrl.dispose();
    _opOpacityValCtrl.dispose();
    _opTransmittanceValCtrl.dispose();
    _opAlarmValCtrl.dispose();

    // DCS
    _dcsEquipDescCtrl.dispose();
    _dcsPlcPowerSupplyCtrl.dispose();
    _dcsPlcCommCtrl.dispose();
    _dcsPlcProcessorCtrl.dispose();
    _dcsPlcDiCtrl.dispose();
    _dcsPlcDoCtrl.dispose();
    _dcsPlcAiCtrl.dispose();
    _dcsPlcAoCtrl.dispose();
    _dcsFiberOpticCtrl.dispose();
    _dcsGroundingEeEaCtrl.dispose();
    _dcsGroundingEePeCtrl.dispose();
    _dcsGroundingEaPeCtrl.dispose();
    _dcsCableTerminationCtrl.dispose();
    _dcsUpsOutputCtrl.dispose();
    _dcsPdbOutputCtrl.dispose();
    _dcsRoomAcCtrl.dispose();
    _dcsRoomCleanlinessCtrl.dispose();
    _dcsDamagedPartCtrl.dispose();
    _dcsAdjustmentRepairCtrl.dispose();

    super.dispose();
  }

  void _onEquipmentInputChanged() {
    final text = _equipmentCtrl.text;
    _autoDetectArea(text);
    if (_selectedFormType == 'service-motor-mv-carbon-brush') {
      _autoMatchStockKey(text);
      _lookupEquipmentHistory(text);
    }
    _searchEquipmentSuggestions(text);
  }

  void _searchEquipmentSuggestions(String query) {
    _equipmentDebounceTimer?.cancel();
    _equipmentDebounceTimer = Timer(const Duration(milliseconds: 250), () async {
      final q = query.trim();
      if (q.isEmpty) {
        if (mounted) {
          setState(() {
            _sapEquipmentSuggestions = [];
            _cbEquipmentSuggestions = [];
            _showEquipmentSuggestions = false;
            _isSearchingEquipment = false;
          });
        }
        return;
      }

      if (_selectedFormType == 'service-motor-mv-carbon-brush') {
        final matches = _equipmentOptions
            .where((opt) => opt.toLowerCase().contains(q.toLowerCase()))
            .take(15)
            .toList();
        if (mounted) {
          setState(() {
            _cbEquipmentSuggestions = matches;
            _sapEquipmentSuggestions = [];
            _showEquipmentSuggestions = matches.isNotEmpty;
            _isSearchingEquipment = false;
          });
        }
        return;
      }

      if (mounted) {
        setState(() {
          _isSearchingEquipment = true;
          _showEquipmentSuggestions = true;
        });
      }

      try {
        final results = await widget.apiService.searchSapEquipments(q, limit: 30);
        if (mounted) {
          setState(() {
            _sapEquipmentSuggestions = results;
            _cbEquipmentSuggestions = [];
            _isSearchingEquipment = false;
            _showEquipmentSuggestions = results.isNotEmpty;
          });
        }
      } catch (_) {
        if (mounted) {
          final matches = _equipmentOptions
              .where((opt) => opt.toLowerCase().contains(q.toLowerCase()))
              .take(15)
              .toList();
          setState(() {
            _cbEquipmentSuggestions = matches;
            _sapEquipmentSuggestions = [];
            _isSearchingEquipment = false;
            _showEquipmentSuggestions = matches.isNotEmpty;
          });
        }
      }
    });
  }

  Future<void> _initData() async {
    // 1. Load services history
    if (widget.existingServices != null && widget.existingServices!.isNotEmpty) {
      _serviceHistory = widget.existingServices!;
    } else {
      try {
        final list = await widget.apiService.fetchServices();
        if (mounted) _serviceHistory = list;
      } catch (_) {}
    }

    // 2. Load stock items
    try {
      final stocks = await widget.apiService.fetchCarbonBrushStockItems();
      if (mounted && stocks.isNotEmpty) {
        setState(() {
          _stockItems = stocks;
          if (_stockItems.isNotEmpty && !_stockItems.any((i) => i.stockKey == _cbStockKey)) {
            _cbStockKey = _stockItems.first.stockKey;
          }
        });
      }
    } catch (_) {}

    // 3. Build equipment options
    _updateEquipmentOptions();

    // 4. Initial lookup if equipment not empty
    if (_equipmentCtrl.text.isNotEmpty && _selectedFormType == 'service-motor-mv-carbon-brush') {
      _lookupEquipmentHistory(_equipmentCtrl.text);
      _autoMatchStockKey(_equipmentCtrl.text);
    }
    // 5. Load colleagues for tagging
    _loadColleagues();
  }

  void _updateEquipmentOptions() {
    final Set<String> options = {};

    if (_selectedCategory == 'Electrical') {
      options.addAll([
        '343FN4M01 - SIEMENS',
        '343FN5M01 - SIEMENS',
        '343RM1M01 - SIEMENS',
        '343RM1M01 - ABB',
        '344RM01M01 - ABB',
        '344FN03M01 - ABB',
        '341FN03M01 - ABB',
        'ER17',
        'ER23C',
        'ER24',
        'ER25',
        'MCC 343-RM1',
        'MCC 344-RM1',
        'MCC 323-RC1',
        '323BC2 - Conveyor',
        '324BC1 - Conveyor',
        '333BC1 - Conveyor',
        '353BC1 - Transport',
        'EHCA Unit Rawmill 343',
        'EHCA Unit Rawmill 344',
      ]);
    } else if (_selectedCategory == 'Instrumentasi') {
      options.addAll([
        'CEMS Rawmill Tuban 3',
        'CEMS Rawmill Tuban 4',
        'CEMS Kiln Tuban 3',
        'CEMS Kiln Tuban 4',
        'Opacity Meter Tuban 3',
        'Opacity Meter Tuban 4',
        '323BC2 - Conveyor',
        '324BC1 - Conveyor',
      ]);
    } else {
      options.addAll([
        'UPS Room Tuban 3',
        'UPS Room Tuban 4',
        'Battery Bank 110V DC',
        'DCS Controller 01',
        'DCS Controller 02',
        'DCS Server Main A',
        'PLC Rack Rawmill 343',
        'PLC Rack Rawmill 344',
      ]);
    }

    // Include all items from history
    for (final s in _serviceHistory) {
      if (s.equipment.isNotEmpty) {
        options.add(s.equipment);
      }
    }

    final sorted = options.toList()..sort();
    if (mounted) {
      setState(() {
        _equipmentOptions = sorted;
      });
    }
  }

  Future<void> _loadColleagues() async {
    setState(() => _isLoadingColleagues = true);
    try {
      final list = await widget.apiService.getColleagues();
      final myId = widget.currentUser?.id.toString();
      final myName = widget.currentUser?.fullName?.trim().toLowerCase();
      final myUsername = widget.currentUser?.username.trim().toLowerCase();
      if (mounted) {
        setState(() {
          _availableColleagues = list.where((c) {
            if (myId != null && c.id == myId) return false;
            if (myName != null && myName.isNotEmpty && c.fullName.trim().toLowerCase() == myName) return false;
            if (myUsername != null && c.username.trim().toLowerCase() == myUsername) return false;
            return true;
          }).toList();
          _isLoadingColleagues = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoadingColleagues = false);
    }
  }

  void _syncTeknisiField() {
    final myName = (widget.currentUser?.fullName != null && widget.currentUser!.fullName!.trim().isNotEmpty)
        ? widget.currentUser!.fullName!.trim()
        : (widget.currentUser?.username ?? 'Teknisi Lapangan');
    final allNames = [myName, ..._taggedColleagues].where((s) => s.isNotEmpty).toSet().toList();
    _teknisiCtrl.text = allNames.join(', ');
  }

  void _addColleagueTag(String name) {
    if (!_taggedColleagues.contains(name)) {
      setState(() {
        _taggedColleagues.add(name);
        _syncTeknisiField();
      });
    }
  }

  void _removeColleagueTag(String name) {
    setState(() {
      _taggedColleagues.remove(name);
      _syncTeknisiField();
    });
  }

  void _showTagColleagueDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
              constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.55),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.group_add_rounded, color: AppConstants.accentCyan, size: 22),
                          const SizedBox(width: 10),
                          Text(
                            'Tag Rekan Kerja (${widget.currentUser?.unitBadgeLabel ?? "Unit"})',
                            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white70, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Pilih rekan satu unit kerja untuk ditambahkan sebagai pelaksana inspeksi:',
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  ),
                  const SizedBox(height: 12),
                  if (_isLoadingColleagues)
                    const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator()))
                  else if (_availableColleagues.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceFloat,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline, color: AppConstants.accentCyan, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Belum ada rekan lain yang terdaftar di Unit Kerja ${widget.currentUser?.unitBadgeLabel ?? ""}.',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    Expanded(
                      child: ListView.separated(
                        shrinkWrap: true,
                        itemCount: _availableColleagues.length,
                        separatorBuilder: (_, __) => const Divider(color: AppTheme.border, height: 1),
                        itemBuilder: (context, idx) {
                          final colleague = _availableColleagues[idx];
                          final isAlreadyTagged = _taggedColleagues.contains(colleague.displayName);
                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            leading: CircleAvatar(
                              backgroundColor: isAlreadyTagged ? AppTheme.teal : AppConstants.accentCyan.withOpacity(0.15),
                              child: Icon(
                                isAlreadyTagged ? Icons.check : Icons.person_outline,
                                color: isAlreadyTagged ? Colors.black : AppConstants.accentCyan,
                                size: 18,
                              ),
                            ),
                            title: Text(
                              colleague.displayName,
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: isAlreadyTagged ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                            subtitle: Text(
                              'Badge: ${colleague.badgeNumber.isNotEmpty ? colleague.badgeNumber : "-"} • ${colleague.unitKerja}',
                              style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                            ),
                            trailing: isAlreadyTagged
                                ? const Text('Ditag', style: TextStyle(color: AppTheme.teal, fontSize: 12, fontWeight: FontWeight.bold))
                                : const Text('+ Tambah', style: TextStyle(color: AppConstants.accentCyan, fontSize: 12)),
                            onTap: () {
                              if (isAlreadyTagged) {
                                _removeColleagueTag(colleague.displayName);
                              } else {
                                _addColleagueTag(colleague.displayName);
                              }
                              setModalState(() {});
                            },
                          );
                        },
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  String _normalizeEquipment(String val) {
    return val.toUpperCase().replaceAll(RegExp(r'\([^)]*\)'), '').replaceAll(RegExp(r'\s+'), '');
  }

  void _lookupEquipmentHistory(String rawEquipment) {
    if (rawEquipment.trim().isEmpty) {
      setState(() {
        _previousMeasurements = {};
        _previousInspectionDate = '';
      });
      return;
    }
    final normalized = _normalizeEquipment(rawEquipment);
    final matches = _serviceHistory.where((s) {
      if (s.formType != 'service-motor-mv-carbon-brush') return false;
      final sNorm = _normalizeEquipment(s.equipment);
      return sNorm == normalized || sNorm.startsWith(normalized) || normalized.startsWith(sNorm);
    }).toList();

    if (matches.isNotEmpty) {
      matches.sort((a, b) => b.tanggal.compareTo(a.tanggal));
      final latest = matches.first;
      final prevMap = <String, double?>{};
      for (final entry in latest.measurements.entries) {
        final val = double.tryParse(entry.value.toString());
        if (val != null) {
          prevMap[entry.key] = val;
        }
      }
      setState(() {
        _previousMeasurements = prevMap;
        _previousInspectionDate = latest.tanggal;
      });
    } else {
      setState(() {
        _previousMeasurements = {};
        _previousInspectionDate = '';
      });
    }
  }

  void _autoMatchStockKey(String rawEquipment) {
    final norm = _normalizeEquipment(rawEquipment);
    String? matchedKey;
    if (norm.contains('344RM01') && norm.contains('ABB')) {
      matchedKey = 'SI00028389|RC53 50X32X25';
    } else if (norm.contains('344FN03')) {
      matchedKey = 'SI00028389|RC53 50X32X25';
    } else if (norm.contains('343RM1') && norm.contains('SIEMENS')) {
      matchedKey = 'SI00005550|RC73/MR7 50X32X25';
    } else if (norm.contains('343FN4') || norm.contains('343FN5')) {
      matchedKey = 'SI00005550|RC73/MR7 50X32X25';
    } else if (norm.contains('344RM01')) {
      matchedKey = 'SI00028394|RC67 50X32X25';
    } else if (norm.contains('343RM1') && norm.contains('ABB')) {
      matchedKey = 'SI00005549|RC73 50X32X20';
    } else {
      for (final item in _stockItems) {
        final uses = item.useLabel.split(',').map((u) => _normalizeEquipment(u));
        if (uses.any((u) => u.contains(norm) || norm.contains(u))) {
          matchedKey = item.stockKey;
          break;
        }
      }
    }
    if (matchedKey != null && _stockItems.any((i) => i.stockKey == matchedKey)) {
      setState(() {
        _cbStockKey = matchedKey!;
      });
    }
  }

  void _autoDetectArea(String equipment) {
    final upper = equipment.toUpperCase();
    if (upper.contains('343') || upper.contains('344') || upper.contains('341') || upper.contains('RM') || upper.contains('RAWMILL')) {
      if (_areas.contains('Raw Mill')) setState(() => _selectedArea = 'Raw Mill');
    } else if (upper.contains('323') || upper.contains('324') || upper.contains('CRUSHER')) {
      if (_areas.contains('Crusher')) setState(() => _selectedArea = 'Crusher');
    } else if (upper.contains('333') || upper.contains('334') || upper.contains('MIXB')) {
      if (_areas.contains('Raw Mill')) setState(() => _selectedArea = 'Raw Mill');
    } else if (upper.contains('353') || upper.contains('354') || upper.contains('KILN')) {
      if (_areas.contains('Kiln')) setState(() => _selectedArea = 'Kiln');
    } else if (upper.contains('JETTY')) {
      if (_areas.contains('Jetty & Pelabuhan')) setState(() => _selectedArea = 'Jetty & Pelabuhan');
    }
  }

  void _onEquipmentSelected(String equipment) {
    _equipmentCtrl.text = equipment;
    _autoDetectArea(equipment);
    if (_selectedFormType == 'service-motor-mv-carbon-brush') {
      _autoMatchStockKey(equipment);
      _lookupEquipmentHistory(equipment);
    }
  }

  void _onCategoryChanged(String newCat) {
    setState(() {
      _selectedCategory = newCat;
      final subList = _categoryOptions[newCat]!;
      _selectedSubtype = subList.first['label']!;
      _selectedFormType = subList.first['type']!;
    });
    _updateEquipmentOptions();
    if (_selectedFormType == 'service-motor-mv-carbon-brush') {
      _autoMatchStockKey(_equipmentCtrl.text);
      _lookupEquipmentHistory(_equipmentCtrl.text);
    }
  }

  void _onSubtypeChanged(String label) {
    final match = _categoryOptions[_selectedCategory]!.firstWhere((e) => e['label'] == label);
    setState(() {
      _selectedSubtype = label;
      _selectedFormType = match['type']!;
    });
    if (_selectedFormType == 'service-motor-mv-carbon-brush') {
      _autoMatchStockKey(_equipmentCtrl.text);
      _lookupEquipmentHistory(_equipmentCtrl.text);
    }
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppTheme.teal,
              onPrimary: Color(0xFF03181B),
              surface: AppTheme.surface,
              onSurface: AppTheme.text,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Map<String, dynamic> _computeCarbonBrushStats() {
    int low = 0;
    int med = 0;
    int high = 0;
    int empty = 0;
    double minVal = 999.0;

    for (final val in _measurements.values) {
      if (val == null) {
        empty++;
        continue;
      }
      if (val < minVal) minVal = val;
      if (val < 30.0) {
        low++;
      } else if (val < 34.0) {
        med++;
      } else {
        high++;
      }
    }
    return {
      'low': low,
      'medium': med,
      'high': high,
      'empty': empty,
      'min': minVal == 999.0 ? '-' : minVal.toStringAsFixed(1),
    };
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      final isCarbonBrush = _selectedFormType == 'service-motor-mv-carbon-brush';
      final isMso = _selectedFormType == 'service-motor-mso';
      final isMv = _selectedFormType == 'service-motor-mv';
      final isER = _selectedFormType == 'service-electrical-room';
      final isMcc = _selectedFormType == 'service-mcc';
      final isEhca = _selectedFormType == 'service-ehca';
      final isIns = _selectedFormType == 'service-instrument';
      final isCems = _selectedFormType == 'service-cems';
      final isOpacity = _selectedFormType == 'service-opacity-meter';
      final isDcs = _selectedFormType == 'service-dcs' || _selectedFormType == 'service-plc';

      final stats = isCarbonBrush ? _computeCarbonBrushStats() : <String, dynamic>{};
      final measurements = isCarbonBrush
          ? {
              for (final entry in _measurements.entries)
                if (entry.value != null) entry.key: entry.value!.toStringAsFixed(1),
            }
          : <String, dynamic>{};
      final replaced = isCarbonBrush ? _replacedPoints.toList() : <String>[];

      // Build specific custom payload matching web PLIRM34tuban.id
      final customPayload = <String, dynamic>{
        'inspectionDate': DateFormat('yyyy-MM-dd').format(_selectedDate),
        'pic': _teknisiCtrl.text.trim(),
        'area': _selectedArea,
      };

      if (isER) {
        customPayload.addAll({
          'panelDoorCondition': _erPanelDoorCondition,
          'floorCleanliness': _erFloorCleanliness,
          'roomTemperature': _erRoomTemperature,
          'batteryVdc': _erBatteryVdc.text.trim(),
          'batteryAmpere': _erBatteryAmpere.text.trim(),
          'batteryTotalVdc': _erBatteryTotalVdc.text.trim(),
          'battery1': _erBattery1.text.trim(),
          'battery2': _erBattery2.text.trim(),
          'transformerEquipment': _erTrafoEquipment.text.trim(),
          'transformerWindingTemperature': _erTrafoWindingTemp.text.trim(),
          'transformerOilTemperature': _erTrafoOilTemp.text.trim(),
          'transformerOilLevel': _erTrafoOilLevel.text.trim(),
          'transformerSilicaGel': _erTrafoSilicaGel,
        });
      } else if (isMso) {
        customPayload.addAll({
          'condition': _msoCondition,
          'inspId': _msoInspIdCtrl.text.trim(),
          'idAmtrans': _msoIdAmtransCtrl.text.trim(),
          'creator': _msoCreatorCtrl.text.trim(),
          'mplant': _msoMplantCtrl.text.trim(),
          'equipmentDesc': _msoEquipmentDescCtrl.text.trim(),
          'temperaturDs': _msoTemperaturDsCtrl.text.trim(),
          'temperaturNds': _msoTemperaturNdsCtrl.text.trim(),
          'kelengkapanMotor': _msoKelengkapanCtrl.text.trim(),
          'inspectionNote': _msoNoteCtrl.text.trim(),
          'geDsVertBefore': _msoGeDsVertBeforeCtrl.text.trim(),
          'geDsHorBefore': _msoGeDsHorBeforeCtrl.text.trim(),
          'vibrasiDsVertBefore': _msoVibDsVertBeforeCtrl.text.trim(),
          'vibrasiDsHorBefore': _msoVibDsHorBeforeCtrl.text.trim(),
          'geNdsVertBefore': _msoGeNdsVertBeforeCtrl.text.trim(),
          'geNdsHorBefore': _msoGeNdsHorBeforeCtrl.text.trim(),
          'vibrasiNdsVertBefore': _msoVibNdsVertBeforeCtrl.text.trim(),
          'vibrasiNdsHorBefore': _msoVibNdsHorBeforeCtrl.text.trim(),
          'regreaseDe': _msoRegreaseDeCtrl.text.trim(),
          'regreaseNde': _msoRegreaseNdeCtrl.text.trim(),
          'geDsVertAfter': _msoGeDsVertAfterCtrl.text.trim(),
          'geDsHorAfter': _msoGeDsHorAfterCtrl.text.trim(),
          'geNdsVertAfter': _msoGeNdsVertAfterCtrl.text.trim(),
          'geNdsHorAfter': _msoGeNdsHorAfterCtrl.text.trim(),
        });
      } else if (isMv) {
        customPayload.addAll({
          'motorCurrent': _mvMotorCurrentCtrl.text.trim(),
          'vibrationDe': _mvVibrationDeCtrl.text.trim(),
          'vibrationNde': _mvVibrationNdeCtrl.text.trim(),
          'windingTemperature': _mvWindingTempCtrl.text.trim(),
          'bearingCondition': _mvBearingCondCtrl.text.trim(),
        });
      } else if (isCarbonBrush) {
        customPayload.addAll({
          'carbonBrushStockKey': _cbStockKey,
          'replacement': _cbReplacementCtrl.text.trim(),
          'megger': _cbMeggerCtrl.text.trim(),
          'pic': _cbPicCtrl.text.trim(),
        });
      } else if (isMcc) {
        customPayload.addAll({
          'testFunction': _mccTestFunction,
          'visualCondition': _mccVisualCondition,
          'partCleanliness': _mccPartCleanliness,
        });
      } else if (isEhca) {
        customPayload.addAll({
          'systemPressure': _ehcaSystemPressureCtrl.text.trim(),
          'fluidLevel': _ehcaFluidLevelCtrl.text.trim(),
          'filterCondition': _ehcaFilterConditionCtrl.text.trim(),
          'leakCondition': _ehcaLeakConditionCtrl.text.trim(),
          'unitCondition': _ehcaUnitConditionCtrl.text.trim(),
        });
      } else if (isIns) {
        customPayload.addAll({
          'sensorCondition': _insSensorConditionCtrl.text.trim(),
        });
      } else if (isCems) {
        customPayload.addAll({
          'inspectorName': _cemsInspectorCtrl.text.trim(),
          'o2Status': _cemsO2Status, 'o2Value': _cemsO2ValueCtrl.text.trim(), 'o2Unit': _cemsO2UnitCtrl.text.trim(), 'o2Note': _cemsO2NoteCtrl.text.trim(),
          'coStatus': _cemsCoStatus, 'coValue': _cemsCoValueCtrl.text.trim(), 'coUnit': _cemsCoUnitCtrl.text.trim(), 'coNote': _cemsCoNoteCtrl.text.trim(),
          'noxStatus': _cemsNoxStatus, 'noxValue': _cemsNoxValueCtrl.text.trim(), 'noxUnit': _cemsNoxUnitCtrl.text.trim(), 'noxNote': _cemsNoxNoteCtrl.text.trim(),
          'so2Status': _cemsSo2Status, 'so2Value': _cemsSo2ValueCtrl.text.trim(), 'so2Unit': _cemsSo2UnitCtrl.text.trim(), 'so2Note': _cemsSo2NoteCtrl.text.trim(),
          'dustStatus': _cemsDustStatus, 'dustValue': _cemsDustValueCtrl.text.trim(), 'dustUnit': _cemsDustUnitCtrl.text.trim(), 'dustNote': _cemsDustNoteCtrl.text.trim(),
          'flowStatus': _cemsFlowStatus, 'flowValue': _cemsFlowValueCtrl.text.trim(), 'flowUnit': _cemsFlowUnitCtrl.text.trim(), 'flowNote': _cemsFlowNoteCtrl.text.trim(),
          'temperatureStatus': _cemsTempStatus, 'temperatureValue': _cemsTempValueCtrl.text.trim(), 'temperatureUnit': _cemsTempUnitCtrl.text.trim(), 'temperatureNote': _cemsTempNoteCtrl.text.trim(),
          'pressureStatus': _cemsPressureStatus, 'pressureValue': _cemsPressureValueCtrl.text.trim(), 'pressureUnit': _cemsPressureUnitCtrl.text.trim(), 'pressureNote': _cemsPressureNoteCtrl.text.trim(),
          'analyzerPower': _cemsAnalyzerPower, 'analyzerStatus': _cemsAnalyzerStatus, 'analyzerAlarm': _cemsAnalyzerAlarm,
          'samplingProbe': _cemsSamplingProbe, 'samplingFilter': _cemsSamplingFilter, 'samplingPump': _cemsSamplingPump,
          'calibrationCylinder': _cemsCalibrationCylinder,
          'dataDasScada': _cemsDataDasScada,
          'supportPowerSupply': _cemsSupportPowerSupply,
          'urgencyLevel': _cemsUrgencyLevel,
          'findingIssue': _cemsFindingIssueCtrl.text.trim(),
          'possibleCause': _cemsPossibleCauseCtrl.text.trim(),
          'emissionImpact': _cemsEmissionImpactCtrl.text.trim(),
        });
      } else if (isOpacity) {
        customPayload.addAll({
          'inspectionTime': _opTimeCtrl.text.trim(),
          'brandModel': _opBrandModelCtrl.text.trim(),
          'shift': _opShiftCtrl.text.trim(),
          'opacityValue': _opOpacityValCtrl.text.trim(),
          'opacityStatus': _opOpacityStatus,
          'transmittanceValue': _opTransmittanceValCtrl.text.trim(),
          'transmittanceStatus': _opTransmittanceStatus,
          'alarmStatusValue': _opAlarmValCtrl.text.trim(),
          'alarmStatusCondition': _opAlarmCondition,
          'visualHousingClean': _opVisualHousing,
          'visualMounting': _opVisualMounting,
          'opticLens': _opOpticLens,
          'opticReflector': _opOpticReflector,
          'purgeActive': _opPurgeActive,
          'electricalPowerSupply': _opElectricalPower,
          'recommendationCleaning': _opRecCleaning,
          'recommendationRealignment': _opRecAlignment,
          'recommendationCalibration': _opRecCalibration,
          'recommendationSparePart': _opRecSparePart,
        });
      } else if (isDcs) {
        customPayload.addAll({
          'equipmentDescription': _dcsEquipDescCtrl.text.trim(),
          'plcPowerSupplyModule': _dcsPlcPowerSupplyCtrl.text.trim(),
          'plcCommunicationModule': _dcsPlcCommCtrl.text.trim(),
          'plcProcessorModule': _dcsPlcProcessorCtrl.text.trim(),
          'plcDigitalInputModule': _dcsPlcDiCtrl.text.trim(),
          'plcDigitalOutputModule': _dcsPlcDoCtrl.text.trim(),
          'plcAnalogInputModule': _dcsPlcAiCtrl.text.trim(),
          'plcAnalogOutputModule': _dcsPlcAoCtrl.text.trim(),
          'fiberOpticEthernetCommunication': _dcsFiberOpticCtrl.text.trim(),
          'groundingEeEa': _dcsGroundingEeEaCtrl.text.trim(),
          'groundingEePe': _dcsGroundingEePeCtrl.text.trim(),
          'groundingEaPe': _dcsGroundingEaPeCtrl.text.trim(),
          'cableTermination': _dcsCableTerminationCtrl.text.trim(),
          'upsOutput': _dcsUpsOutputCtrl.text.trim(),
          'pdbOutput': _dcsPdbOutputCtrl.text.trim(),
          'roomAcCondition': _dcsRoomAcCtrl.text.trim(),
          'roomCleanliness': _dcsRoomCleanlinessCtrl.text.trim(),
          'damagedPartReplacement': _dcsDamagedPartCtrl.text.trim(),
          'adjustmentRepair': _dcsAdjustmentRepairCtrl.text.trim(),
        });
      }

      final isEditMode = widget.itemToEdit != null;
      final item = ServiceItem(
        id: isEditMode ? widget.itemToEdit!.id : 'service-${DateTime.now().millisecondsSinceEpoch}',
        tanggal: DateFormat('yyyy-MM-dd').format(_selectedDate),
        equipment: _equipmentCtrl.text.trim(),
        kategori: _selectedCategory,
        subtype: _selectedSubtype,
        formType: _selectedFormType,
        area: _selectedArea,
        teknisi: _teknisiCtrl.text.trim(),
        status: _selectedStatus,
        deskripsi: _deskripsiCtrl.text.trim(),
        tindakan: _tindakanCtrl.text.trim(),
        recommendation: _rekomendasiCtrl.text.trim(),
        detail: _tindakanCtrl.text.trim(),
        measurements: measurements,
        stats: stats,
        replacedPoints: replaced,
        payload: customPayload,
      );

      // Deduct stock in offline cache so device balances are immediately up to date
      if (!isEditMode && _selectedFormType == 'service-motor-mv-carbon-brush' && replaced.isNotEmpty) {
        await OfflineService.deductOfflineCarbonBrushStock(_cbStockKey, replaced.length);
      }

      // Attempt sending to database server
      bool isOnlineSuccess = false;
      try {
        if (isEditMode) {
          isOnlineSuccess = await widget.apiService.updateServiceItem(item);
        } else {
          isOnlineSuccess = await widget.apiService.createServiceItem(item);
        }
      } catch (_) {
        isOnlineSuccess = false;
      }

      if (isOnlineSuccess) {
        if (mounted) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      isEditMode
                          ? 'Laporan service ${_equipmentCtrl.text} berhasil diperbarui!'
                          : 'Laporan service ${_equipmentCtrl.text} berhasil dicatat ke server!',
                    ),
                  ),
                ],
              ),
              backgroundColor: const Color(0xFF25D366),
              behavior: SnackBarBehavior.floating,
            ),
          );
          widget.onSuccess();
        }
      } else {
        // Fallback: simpan offline di perangkat untuk auto-sync
        await OfflineService.saveOfflineServiceItem(item);
        if (mounted) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.cloud_off_rounded, color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      isEditMode
                          ? 'Perubahan disimpan OFFLINE di perangkat. Otomatis sync saat ada sinyal!'
                          : 'Tersimpan OFFLINE di perangkat. Otomatis masuk database saat ada sinyal!',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              backgroundColor: const Color(0xFFFF9800),
              behavior: SnackBarBehavior.floating,
              duration: const Duration(seconds: 4),
            ),
          );
          widget.onSuccess();
        }
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
        _isSubmitting = false;
      });
    }
  }

  // Helper methods for uniform UI inputs
  Widget _buildSectionHead(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 18),
        Row(
          children: [
            Container(
              width: 3,
              height: 14,
              decoration: BoxDecoration(color: AppTheme.teal, borderRadius: BorderRadius.circular(2)),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                softWrap: true,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 11), softWrap: true),
        const SizedBox(height: 10),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    String? hint,
    String? helperText,
    int maxLines = 1,
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
          softWrap: true,
        ),
        if (helperText != null && helperText.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(
            helperText,
            style: const TextStyle(color: AppTheme.teal, fontSize: 10, fontWeight: FontWeight.w600),
            softWrap: true,
          ),
        ],
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: AppTheme.surfaceFloat,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildSelectField({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
          softWrap: true,
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: AppTheme.surfaceFloat,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.border),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              isExpanded: true,
              dropdownColor: AppTheme.surface,
              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: onChanged,
            ),
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildCarbonBrushStockSelector() {
    final items = _stockItems.isNotEmpty ? _stockItems : CarbonBrushStockItem.defaultItems();
    final currentItem = items.firstWhere(
      (s) => s.stockKey == _cbStockKey,
      orElse: () => items.first,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'TYPE STOCK CARBON BRUSH',
              style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
            ),
            InkWell(
              onTap: () {
                CarbonBrushStockSheet.show(
                  context,
                  apiService: widget.apiService,
                  preselectedStockKey: _cbStockKey,
                  onStockChanged: () async {
                    try {
                      final updated = await widget.apiService.fetchCarbonBrushStockItems();
                      if (mounted && updated.isNotEmpty) {
                        setState(() => _stockItems = updated);
                      }
                    } catch (_) {}
                  },
                );
              },
              borderRadius: BorderRadius.circular(6),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.teal.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppTheme.teal.withValues(alpha: 0.4)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.inventory_2_rounded, size: 13, color: AppTheme.teal),
                    SizedBox(width: 4),
                    Text(
                      'Kelola Stok',
                      style: TextStyle(color: AppTheme.teal, fontSize: 10.5, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          decoration: BoxDecoration(
            color: AppTheme.surfaceFloat,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.border),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: items.any((i) => i.stockKey == _cbStockKey) ? _cbStockKey : items.first.stockKey,
              isExpanded: true,
              dropdownColor: AppTheme.surface,
              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
              items: items.map((stock) {
                return DropdownMenuItem<String>(
                  value: stock.stockKey,
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          stock.brushName.isNotEmpty ? stock.brushName : stock.stockKey,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12.5),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: stock.currentStock <= 10
                              ? AppConstants.alertRed.withValues(alpha: 0.2)
                              : AppTheme.teal.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: stock.currentStock <= 10 ? AppConstants.alertRed : AppTheme.teal.withValues(alpha: 0.5),
                            width: 0.8,
                          ),
                        ),
                        child: Text(
                          '${stock.currentStock} pcs',
                          style: TextStyle(
                            color: stock.currentStock <= 10 ? AppConstants.alertRed : AppTheme.teal,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() => _cbStockKey = val);
                }
              },
            ),
          ),
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'SAP: ${currentItem.sapNo}',
              style: const TextStyle(color: Colors.white38, fontSize: 10),
            ),
            if (currentItem.useLabel.isNotEmpty) ...[
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Tipe: ${currentItem.useLabel}',
                  textAlign: TextAlign.end,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.white38, fontSize: 10),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 10),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final isCarbonBrush = _selectedFormType == 'service-motor-mv-carbon-brush';
    final isMso = _selectedFormType == 'service-motor-mso';
    final isMv = _selectedFormType == 'service-motor-mv';
    final isER = _selectedFormType == 'service-electrical-room';
    final isMcc = _selectedFormType == 'service-mcc';
    final isEhca = _selectedFormType == 'service-ehca';
    final isIns = _selectedFormType == 'service-instrument';
    final isCems = _selectedFormType == 'service-cems';
    final isOpacity = _selectedFormType == 'service-opacity-meter';
    final isDcs = _selectedFormType == 'service-dcs' || _selectedFormType == 'service-plc';

    return Container(
      height: MediaQuery.of(context).size.height * 0.94,
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

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: (widget.itemToEdit != null ? AppTheme.teal : AppConstants.primaryTeal).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: (widget.itemToEdit != null ? AppTheme.teal : AppConstants.primaryTeal).withValues(alpha: 0.4)),
                  ),
                  child: Icon(
                    widget.itemToEdit != null ? Icons.edit_note_rounded : Icons.playlist_add_rounded,
                    color: widget.itemToEdit != null ? AppTheme.teal : AppConstants.primaryTeal,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.itemToEdit != null ? 'Edit Laporan Service' : 'Input Laporan Service Lapangan',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.itemToEdit != null
                            ? 'Mode edit aktif - Perubahan langsung tersimpan ke server'
                            : 'Bisa disimpan offline & auto-sync ke server saat ada sinyal',
                        style: const TextStyle(color: Colors.white54, fontSize: 11),
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

          Expanded(
            child: Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  // Kategori Utama Chips
                  const Text(
                    'KATEGORI UTAMA',
                    style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: _categoryOptions.keys.map((cat) {
                      final isSelected = _selectedCategory == cat;
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 3),
                          child: ChoiceChip(
                            label: Center(
                              child: Text(
                                cat,
                                style: TextStyle(
                                  color: isSelected ? const Color(0xFF03181B) : Colors.white70,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                            selected: isSelected,
                            selectedColor: AppTheme.teal,
                            backgroundColor: AppTheme.surfaceFloat,
                            side: BorderSide(
                              color: isSelected ? AppTheme.teal : AppTheme.borderMuted,
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            onSelected: (selected) {
                              if (selected) _onCategoryChanged(cat);
                            },
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 14),

                  // Sub Kategori Dropdown
                  const Text(
                    'SUB KATEGORI SERVICE',
                    style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceFloat,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.border),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedSubtype,
                        isExpanded: true,
                        dropdownColor: AppTheme.surface,
                        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                        items: _categoryOptions[_selectedCategory]!.map((item) {
                          return DropdownMenuItem<String>(
                            value: item['label'],
                            child: Text(item['label']!),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) _onSubtypeChanged(val);
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Equipment & Sub Equipment (Full Width)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'EQUIPMENT / SUB-EQUIPMENT',
                            style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                          ),
                          Text(
                            _selectedFormType == 'service-motor-mv-carbon-brush' ? '(Motor Carbon Brush)' : '(Master SAP & Sub-Eq)',
                            style: const TextStyle(color: AppTheme.teal, fontSize: 10, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _equipmentCtrl,
                        focusNode: _equipmentFocusNode,
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Ketik nama equipment atau sub-equipment...',
                          hintStyle: const TextStyle(color: Colors.white30),
                          filled: true,
                          fillColor: AppTheme.surfaceFloat,
                          prefixIcon: const Icon(Icons.build_rounded, color: AppConstants.accentCyan, size: 18),
                          suffixIcon: _equipmentCtrl.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, color: Colors.white54, size: 18),
                                  onPressed: () {
                                    _equipmentCtrl.clear();
                                    setState(() {
                                      _showEquipmentSuggestions = false;
                                      _sapEquipmentSuggestions = [];
                                      _cbEquipmentSuggestions = [];
                                    });
                                  },
                                )
                              : null,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Wajib diisi' : null,
                      ),
                      if (_showEquipmentSuggestions) ...[
                        const SizedBox(height: 6),
                        Container(
                          width: double.infinity,
                          constraints: const BoxConstraints(maxHeight: 220),
                          decoration: BoxDecoration(
                            color: const Color(0xFF132328),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.teal.withOpacity(0.6)),
                            boxShadow: const [
                              BoxShadow(color: Colors.black54, blurRadius: 10, offset: Offset(0, 4)),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: const BoxDecoration(
                                  color: AppTheme.surfaceFloat,
                                  borderRadius: BorderRadius.vertical(top: Radius.circular(11)),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        const Icon(Icons.manage_search_rounded, size: 16, color: AppTheme.teal),
                                        const SizedBox(width: 6),
                                        Text(
                                          _isSearchingEquipment
                                              ? 'MENCARI DATA EQUIPMENT...'
                                              : 'HASIL PENCARIAN (${_sapEquipmentSuggestions.isNotEmpty ? _sapEquipmentSuggestions.length : _cbEquipmentSuggestions.length})',
                                          style: const TextStyle(color: AppTheme.teal, fontSize: 10, fontWeight: FontWeight.bold),
                                        ),
                                      ],
                                    ),
                                    InkWell(
                                      onTap: () => setState(() => _showEquipmentSuggestions = false),
                                      child: const Padding(
                                        padding: EdgeInsets.symmetric(horizontal: 4),
                                        child: Text('Tutup', style: TextStyle(color: Colors.white60, fontSize: 11)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (_isSearchingEquipment)
                                const Padding(
                                  padding: EdgeInsets.all(16),
                                  child: Center(
                                    child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.teal)),
                                  ),
                                )
                              else if (_sapEquipmentSuggestions.isEmpty && _cbEquipmentSuggestions.isEmpty)
                                const Padding(
                                  padding: EdgeInsets.all(16),
                                  child: Center(
                                    child: Text('Equipment tidak ditemukan', style: TextStyle(color: Colors.white54, fontSize: 12)),
                                  ),
                                )
                              else
                                Flexible(
                                  child: ListView.separated(
                                    padding: EdgeInsets.zero,
                                    shrinkWrap: true,
                                    itemCount: _sapEquipmentSuggestions.isNotEmpty
                                        ? _sapEquipmentSuggestions.length
                                        : _cbEquipmentSuggestions.length,
                                    separatorBuilder: (_, __) => Divider(color: Colors.white.withOpacity(0.06), height: 1),
                                    itemBuilder: (context, index) {
                                      if (_sapEquipmentSuggestions.isNotEmpty) {
                                        final item = _sapEquipmentSuggestions[index];
                                        final isMain = item.isMainEquipment;
                                        final badgeText = item.typeBadge;
                                        return InkWell(
                                          onTap: () {
                                            _onEquipmentSelected(item.displayName);
                                            setState(() => _showEquipmentSuggestions = false);
                                            FocusScope.of(context).unfocus();
                                          },
                                          child: Padding(
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
                                            child: Row(
                                              children: [
                                                Icon(
                                                  isMain ? Icons.precision_manufacturing_rounded : Icons.account_tree_rounded,
                                                  size: 16,
                                                  color: isMain ? AppTheme.teal : AppConstants.warningYellow,
                                                ),
                                                const SizedBox(width: 8),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Text(
                                                        item.tagNo.isNotEmpty ? item.tagNo : item.equipmentId,
                                                        style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                                      ),
                                                      Text(
                                                        item.description,
                                                        style: const TextStyle(color: Colors.white70, fontSize: 11),
                                                        maxLines: 1,
                                                        overflow: TextOverflow.ellipsis,
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: (isMain ? AppTheme.teal : AppConstants.warningYellow).withOpacity(0.15),
                                                    borderRadius: BorderRadius.circular(6),
                                                    border: Border.all(
                                                      color: (isMain ? AppTheme.teal : AppConstants.warningYellow).withOpacity(0.5),
                                                    ),
                                                  ),
                                                  child: Text(
                                                    badgeText,
                                                    style: TextStyle(
                                                      color: isMain ? AppTheme.teal : AppConstants.warningYellow,
                                                      fontSize: 9,
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      } else {
                                        final opt = _cbEquipmentSuggestions[index];
                                        return InkWell(
                                          onTap: () {
                                            _onEquipmentSelected(opt);
                                            setState(() => _showEquipmentSuggestions = false);
                                            FocusScope.of(context).unfocus();
                                          },
                                          child: Padding(
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                            child: Row(
                                              children: [
                                                const Icon(Icons.bolt_rounded, size: 16, color: AppTheme.teal),
                                                const SizedBox(width: 8),
                                                Expanded(
                                                  child: Text(
                                                    opt,
                                                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      }
                                    },
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Area & Status Pekerjaan (Row)
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'AREA OPERASIONAL',
                              style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                              softWrap: true,
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceFloat,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.border),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  value: _selectedArea,
                                  isExpanded: true,
                                  dropdownColor: AppTheme.surface,
                                  style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                                  items: _areas.map((a) {
                                    return DropdownMenuItem<String>(
                                      value: a,
                                      child: Text(a),
                                    );
                                  }).toList(),
                                  onChanged: (val) {
                                    if (val != null) setState(() => _selectedArea = val);
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'STATUS PEKERJAAN',
                              style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                              softWrap: true,
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              decoration: BoxDecoration(
                                color: AppTheme.surfaceFloat,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.border),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  value: _selectedStatus,
                                  isExpanded: true,
                                  dropdownColor: AppTheme.surface,
                                  style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                                  items: _statuses.map((s) {
                                    return DropdownMenuItem<String>(
                                      value: s,
                                      child: Text(s),
                                    );
                                  }).toList(),
                                  onChanged: (val) {
                                    if (val != null) setState(() => _selectedStatus = val);
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Tanggal Inspeksi
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'TANGGAL INSPEKSI',
                        style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                        softWrap: true,
                      ),
                      const SizedBox(height: 6),
                      InkWell(
                        onTap: _pickDate,
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceFloat,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.border),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.calendar_month_rounded, color: AppTheme.teal, size: 18),
                              const SizedBox(width: 8),
                              Text(
                                DateFormat('dd MMM yyyy').format(_selectedDate),
                                style: const TextStyle(color: Colors.white, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Teknisi / PIC & Tag Rekan
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'TEKNISI / PIC',
                            style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                          ),
                          InkWell(
                            onTap: _showTagColleagueDialog,
                            borderRadius: BorderRadius.circular(6),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppConstants.accentCyan.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppConstants.accentCyan.withOpacity(0.4)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.person_add_alt_1, color: AppConstants.accentCyan, size: 12),
                                  const SizedBox(width: 4),
                                  Text(
                                    '+ Tag Rekan (${widget.currentUser?.unitBadgeLabel ?? "Unit"})',
                                    style: const TextStyle(color: AppConstants.accentCyan, fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _teknisiCtrl,
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Nama Teknisi Lapangan',
                          hintStyle: const TextStyle(color: Colors.white30),
                          filled: true,
                          fillColor: AppTheme.surfaceFloat,
                          prefixIcon: const Icon(Icons.person_outline_rounded, color: AppTheme.teal, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Wajib diisi' : null,
                      ),
                      if (_taggedColleagues.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: _taggedColleagues.map((name) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.teal.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.teal.withOpacity(0.4)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.people_outline, size: 14, color: AppTheme.teal),
                                  const SizedBox(width: 6),
                                  Text(name, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500)),
                                  const SizedBox(width: 6),
                                  InkWell(
                                    onTap: () => _removeColleagueTag(name),
                                    child: const Icon(Icons.close, size: 14, color: Colors.white60),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ],
                  ),

                  // ==========================================
                  // SPECIFIC SUB-CATEGORY FIELDS (WEB-PARITY)
                  // ==========================================

                  // 1. ELECTRICAL ROOM
                  if (isER) ...[
                    _buildSectionHead('Inspeksi Electrical Room', 'Pintu panel, kebersihan lantai, temperatur & battery trafo'),
                    Row(
                      children: [
                        Expanded(
                          child: _buildSelectField(
                            label: 'Pintu Panel',
                            value: _erPanelDoorCondition,
                            items: ['OK', 'NOT OK'],
                            onChanged: (v) => setState(() => _erPanelDoorCondition = v!),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Kebersihan',
                            value: _erFloorCleanliness,
                            items: ['Bersih', 'Kotor'],
                            onChanged: (v) => setState(() => _erFloorCleanliness = v!),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Suhu Ruang',
                            value: _erRoomTemperature,
                            items: ['Dingin', 'Tidak dingin'],
                            onChanged: (v) => setState(() => _erRoomTemperature = v!),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _erBatteryVdc, label: 'Batt VDC', helperText: '(Nominal: 125 VDC)', hint: 'VDC')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _erBatteryAmpere, label: 'Batt Amper', helperText: '(Nominal: 4 A)', hint: 'Ampere')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _erBatteryTotalVdc, label: 'Total VDC', helperText: '(Standar: 120-130 VDC)', hint: 'VDC')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _erBattery1, label: 'Battery 1', helperText: '(Nominal: 12.5 VDC)', hint: 'VDC')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _erBattery2, label: 'Battery 2', helperText: '(Nominal: 12.5 VDC)', hint: 'VDC')),
                      ],
                    ),
                    _buildTextField(controller: _erTrafoEquipment, label: 'Equipment Trafo', helperText: '(Contoh: TR-RM-01)', hint: 'TR-RM-01'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _erTrafoWindingTemp, label: 'Temp Winding (C)', helperText: '(Batas: < 90°C)', hint: 'Contoh: 74')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _erTrafoOilTemp, label: 'Temp Oil (C)', helperText: '(Batas: < 75°C)', hint: 'Contoh: 58')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _erTrafoOilLevel, label: 'Oil Level (%)', helperText: '(Standar: > 70%)', hint: 'Contoh: 85')),
                      ],
                    ),
                    _buildSelectField(
                      label: 'Silica Gel',
                      value: _erTrafoSilicaGel,
                      items: ['OK', 'NOT OK'],
                      onChanged: (v) => setState(() => _erTrafoSilicaGel = v!),
                    ),
                  ],

                  // 2. MOTOR MSO
                  if (isMso) ...[
                    _buildSectionHead('Inspeksi Motor MSO', 'Parameter MSO, vibrasi before & after, regrease'),
                    Row(
                      children: [
                        Expanded(
                          child: _buildSelectField(
                            label: 'Condition',
                            value: _msoCondition,
                            items: ['GOOD', 'BAD', 'WARNING'],
                            onChanged: (v) => setState(() => _msoCondition = v!),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoMplantCtrl, label: 'MPlant', helperText: '(Contoh: 2304)', hint: '2304')),
                      ],
                    ),
                    _buildTextField(controller: _msoEquipmentDescCtrl, label: 'Deskripsi Equipment', hint: 'Deskripsi motor...'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _msoTemperaturDsCtrl, label: 'Temp DS (C)', helperText: '(Batas: < 70°C)', hint: 'Contoh: 46')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoTemperaturNdsCtrl, label: 'Temp NDS (C)', helperText: '(Batas: < 70°C)', hint: 'Contoh: 44')),
                      ],
                    ),
                    _buildSectionHead('Vibrasi Before', 'Nilai vibrasi sebelum regrease / tindakan'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _msoGeDsVertBeforeCtrl, label: 'gE DS Vert', helperText: '(Contoh: 2.1)', hint: 'gE')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoVibDsVertBeforeCtrl, label: 'Vib DS Vert', helperText: '(Contoh: 1.3)', hint: 'mm/s')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoGeNdsVertBeforeCtrl, label: 'gE NDS Vert', helperText: '(Contoh: 2.0)', hint: 'gE')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoVibNdsVertBeforeCtrl, label: 'Vib NDS Vert', helperText: '(Contoh: 0.9)', hint: 'mm/s')),
                      ],
                    ),
                    _buildSectionHead('Regrease & gE After', 'Jumlah spet regrease dan nilai gE after'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _msoRegreaseDeCtrl, label: 'Regrease DE', helperText: '(Jumlah spet)', hint: 'Contoh: 15')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoRegreaseNdeCtrl, label: 'Regrease NDE', helperText: '(Jumlah spet)', hint: 'Contoh: 15')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoGeDsVertAfterCtrl, label: 'gE DS After', helperText: '(Contoh: 2.0)', hint: 'gE')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _msoGeNdsVertAfterCtrl, label: 'gE NDS After', helperText: '(Contoh: 1.9)', hint: 'gE')),
                      ],
                    ),
                  ],

                  // 3. MOTOR MV UMUM
                  if (isMv) ...[
                    _buildSectionHead('Parameter Motor MV Umum', 'Arus, vibrasi DE/NDE, suhu winding & bearing'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _mvMotorCurrentCtrl, label: 'Arus Motor', helperText: '(Contoh: 128 A)', hint: 'Ampere')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _mvWindingTempCtrl, label: 'Suhu Winding', helperText: '(Batas: < 95°C)', hint: 'Contoh: 72 C')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _mvVibrationDeCtrl, label: 'Vibrasi DE', helperText: '(Batas: < 4.5 mm/s)', hint: 'Contoh: 2.4 mm/s')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _mvVibrationNdeCtrl, label: 'Vibrasi NDE', helperText: '(Batas: < 4.5 mm/s)', hint: 'Contoh: 2.1 mm/s')),
                      ],
                    ),
                    _buildTextField(controller: _mvBearingCondCtrl, label: 'Kondisi Bearing', helperText: '(Contoh: normal / noisy / panas)', hint: 'Kondisi bearing...'),
                  ],

                  // 4. MOTOR MV CARBON BRUSH
                  if (isCarbonBrush) ...[
                    _buildSectionHead('Identitas & Pengukuran Carbon Brush', 'Type stock, megger, penggantian dan titik pengukuran'),
                    _buildCarbonBrushStockSelector(),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _cbReplacementCtrl, label: 'Replacement', helperText: '(Contoh: 6 ea / 3)', hint: 'Jumlah / set')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _cbMeggerCtrl, label: 'Megger Test', helperText: '(Standar: > 1.0 GΩ)', hint: 'Contoh: 1.15 Gohm')),
                      ],
                    ),
                    _buildTextField(controller: _cbPicCtrl, label: 'PIC Carbon Brush', helperText: '(Contoh: Purwanto, Rudi, Hasan)', hint: 'Nama teknisi...'),

                    // Grid Pengukuran Titik
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F1B1E),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppConstants.primaryTeal.withValues(alpha: 0.4)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.brush_rounded, color: AppTheme.teal, size: 18),
                              const SizedBox(width: 8),
                              const Expanded(
                                child: Text(
                                  'PENGUKURAN TITIK CARBON BRUSH (mm)',
                                  style: TextStyle(color: AppTheme.teal, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                                ),
                              ),
                              Text('${_measurements.length} Titik', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.black38,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.white10),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'AMBANG BATAS KONDISI UKURAN (mm):',
                                  style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  '• Merah (Kritis): T3 < 30 mm | T4 < 35 mm\n• Kuning (Waspada): T3 30-33.9 mm | T4 35-37.9 mm\n• Hijau (Aman): T3 >= 34 mm | T4 >= 38 mm\n• Standar Baru: 48 - 50 mm (Ganti = Merah Menyala)',
                                  style: TextStyle(color: Colors.white54, fontSize: 10, height: 1.3),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Ketuk untuk input/edit ukuran mm atau tandai titik yang diganti baru.',
                            style: TextStyle(color: Colors.white60, fontSize: 11),
                          ),
                          const SizedBox(height: 12),

                          if (_previousInspectionDate.isNotEmpty && _previousMeasurements.isNotEmpty) ...[
                            Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              decoration: BoxDecoration(
                                color: AppTheme.teal.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.teal.withValues(alpha: 0.4)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.history_rounded, color: AppTheme.teal, size: 16),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      'Histori Ditemukan: Inspeksi $_previousInspectionDate (${_previousMeasurements.length} titik)',
                                      style: const TextStyle(color: AppTheme.teal, fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],

                          GridView.count(
                            crossAxisCount: 3,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            mainAxisSpacing: 8,
                            crossAxisSpacing: 8,
                            childAspectRatio: 2.1,
                            children: _measurements.keys.map((key) {
                              final val = _measurements[key];
                              final prevVal = _previousMeasurements[key];
                              final isReplaced = _replacedPoints.contains(key);

                              Color bgColor;
                              Color borderColor;
                              Color textColor;

                              if (isReplaced) {
                                bgColor = const Color(0xFFFF1744);
                                borderColor = const Color(0xFFFF5252);
                                textColor = Colors.white;
                              } else if (val == null) {
                                bgColor = AppTheme.surfaceFloat;
                                borderColor = AppTheme.borderMuted;
                                textColor = Colors.white38;
                              } else if (val < 30.0) {
                                bgColor = AppConstants.alertRed.withValues(alpha: 0.2);
                                borderColor = AppConstants.alertRed;
                                textColor = AppConstants.alertRed;
                              } else if (val < 34.0) {
                                bgColor = AppConstants.warningYellow.withValues(alpha: 0.2);
                                borderColor = AppConstants.warningYellow;
                                textColor = AppConstants.warningYellow;
                              } else {
                                bgColor = AppTheme.surfaceFloat;
                                borderColor = AppTheme.teal.withValues(alpha: 0.5);
                                textColor = AppTheme.teal;
                              }

                              return InkWell(
                                onTap: () => _showCarbonBrushPointDialog(key, val, isReplaced),
                                borderRadius: BorderRadius.circular(8),
                                child: Container(
                                  alignment: Alignment.center,
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: bgColor,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: borderColor, width: isReplaced ? 1.8 : 1.0),
                                    boxShadow: isReplaced
                                        ? [
                                            BoxShadow(
                                              color: const Color(0xFFFF1744).withValues(alpha: 0.85),
                                              blurRadius: 10,
                                              spreadRadius: 2,
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        val == null ? '$key: -' : '$key: ${val.toStringAsFixed(1)} mm',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 11.5),
                                      ),
                                      if (prevVal != null) ...[
                                        const SizedBox(height: 2),
                                        Text(
                                          'Prev: ${prevVal.toStringAsFixed(1)} mm',
                                          style: TextStyle(
                                            color: isReplaced ? Colors.white70 : Colors.white54,
                                            fontSize: 9.5,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                  ],

                  // 5. MCC
                  if (isMcc) ...[
                    _buildSectionHead('Poin Pengecekan MCC', 'Test fungsi, visual kondisi dan kebersihan part'),
                    Row(
                      children: [
                        Expanded(
                          child: _buildSelectField(
                            label: 'Test Fungsi',
                            value: _mccTestFunction,
                            items: ['OK', 'NOT OK'],
                            onChanged: (v) => setState(() => _mccTestFunction = v!),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Visual',
                            value: _mccVisualCondition,
                            items: ['OK', 'NOT OK'],
                            onChanged: (v) => setState(() => _mccVisualCondition = v!),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Kebersihan',
                            value: _mccPartCleanliness,
                            items: ['OK', 'NOT OK'],
                            onChanged: (v) => setState(() => _mccPartCleanliness = v!),
                          ),
                        ),
                      ],
                    ),
                  ],

                  // 6. EHCA
                  if (isEhca) ...[
                    _buildSectionHead('Inspeksi EHCA', 'Tekanan sistem, level fluida, filter, kebocoran & pompa EHCA'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _ehcaSystemPressureCtrl, label: 'Tekanan Sistem', hint: '135 bar', helperText: '(Standar: 120-150 bar)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _ehcaFluidLevelCtrl, label: 'Level Fluida', hint: 'Normal / Low', helperText: '(Contoh: Normal)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _ehcaFilterConditionCtrl, label: 'Kondisi Filter', hint: 'Bersih / Perlu Ganti', helperText: '(Contoh: Bersih)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _ehcaLeakConditionCtrl, label: 'Kebocoran', hint: 'Tidak ada / Rembes', helperText: '(Contoh: Tidak ada)')),
                      ],
                    ),
                    _buildTextField(controller: _ehcaUnitConditionCtrl, label: 'Kondisi Pompa / Unit', hint: 'Normal / Noisy / Overheating', helperText: '(Contoh: Normal)'),
                  ],

                  // 7. INSTRUMENT LAPANGAN
                  if (isIns) ...[
                    _buildSectionHead('Inspeksi Instrument Lapangan', 'Kondisi sensor, stabilitas sinyal dan loop transmitter'),
                    _buildTextField(controller: _insSensorConditionCtrl, label: 'Kondisi Sensor', hint: 'Stabil / Drift / Rusak', helperText: '(Contoh: Stabil)'),
                  ],

                  // 8. CEMS
                  if (isCems) ...[
                    _buildSectionHead('Parameter Monitoring CEMS', 'O₂, CO, NOx, SO₂, Dust, Flow, Temp & Pressure'),
                    _buildTextField(controller: _cemsInspectorCtrl, label: 'Nama Inspektor CEMS', hint: 'Petugas inspeksi...', helperText: '(Petugas CEMS)'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _cemsO2ValueCtrl, label: 'O₂ Nilai (%)', hint: '8.5', helperText: '(Batas: 6-12%)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _cemsCoValueCtrl, label: 'CO (mg/Nm3)', hint: '95', helperText: '(Batas: < 200)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _cemsNoxValueCtrl, label: 'NOx (mg/Nm3)', hint: '210', helperText: '(Batas: < 400)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _cemsSo2ValueCtrl, label: 'SO₂ (mg/Nm3)', hint: '180', helperText: '(Batas: < 300)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _cemsDustValueCtrl, label: 'Dust/PM (mg/Nm3)', hint: '38', helperText: '(Batas: < 50)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _cemsFlowValueCtrl, label: 'Flow (Nm3/h)', hint: '250000', helperText: '(Contoh: 250000)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _cemsTempValueCtrl, label: 'Temp (C)', hint: '145', helperText: '(Contoh: 145)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _cemsPressureValueCtrl, label: 'Pressure (kPa)', hint: '-2.3', helperText: '(Contoh: -2.3)')),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Level Urgensi',
                            value: _cemsUrgencyLevel,
                            items: ['Low', 'Medium', 'High'],
                            onChanged: (v) => setState(() => _cemsUrgencyLevel = v!),
                          ),
                        ),
                      ],
                    ),
                    _buildTextField(controller: _cemsFindingIssueCtrl, label: 'Temuan Masalah', hint: 'Temuan utama pada CEMS...', helperText: '(Bila ada)'),
                  ],

                  // 9. OPACITY METER
                  if (isOpacity) ...[
                    _buildSectionHead('Inspeksi Opacity Meter', 'Nilai opacity, transmittance, zero/span check & optik'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _opTimeCtrl, label: 'Waktu', hint: '09:30', helperText: '(JJ:MM)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _opBrandModelCtrl, label: 'Merk / Model', hint: 'SICK / OMS420', helperText: '(Contoh: SICK)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _opShiftCtrl, label: 'Shift', hint: 'Shift A', helperText: '(Contoh: Shift A)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _opOpacityValCtrl, label: 'Opacity (%)', hint: '12.5', helperText: '(Batas: < 20%)')),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Status Opacity',
                            value: _opOpacityStatus,
                            items: ['OK', 'NG'],
                            onChanged: (v) => setState(() => _opOpacityStatus = v!),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _opTransmittanceValCtrl, label: 'Transmittance (%)', hint: '87.5', helperText: '(Standar: > 80%)')),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildSelectField(
                            label: 'Status Transm.',
                            value: _opTransmittanceStatus,
                            items: ['OK', 'NG'],
                            onChanged: (v) => setState(() => _opTransmittanceStatus = v!),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Checkbox(value: _opRecCleaning, onChanged: (v) => setState(() => _opRecCleaning = v ?? false)),
                        const Text('Cleaning', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(width: 12),
                        Checkbox(value: _opRecAlignment, onChanged: (v) => setState(() => _opRecAlignment = v ?? false)),
                        const Text('Re-alignment', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(width: 12),
                        Checkbox(value: _opRecCalibration, onChanged: (v) => setState(() => _opRecCalibration = v ?? false)),
                        const Text('Kalibrasi', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      ],
                    ),
                  ],

                  // 10. DCS & PLC
                  if (isDcs) ...[
                    _buildSectionHead('Inspeksi Sistem DCS / PLC', 'Kondisi modul I/O, processor, jaringan optik, grounding & UPS'),
                    _buildTextField(controller: _dcsEquipDescCtrl, label: 'Deskripsi Equipment DCS', hint: 'Deskripsi controller/rack...', helperText: '(Contoh: Rack / Panel)'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _dcsPlcPowerSupplyCtrl, label: 'Power Supply', hint: 'hijau normal', helperText: '(Contoh: normal)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsPlcCommCtrl, label: 'Comm Module', hint: 'hijau normal', helperText: '(Contoh: normal)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsPlcProcessorCtrl, label: 'Processor', hint: 'hijau normal', helperText: '(Contoh: normal)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _dcsPlcDiCtrl, label: 'DI Module', hint: 'hijau normal', helperText: '(Contoh: normal)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsPlcDoCtrl, label: 'DO Module', hint: 'hijau normal', helperText: '(Contoh: normal)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsPlcAiCtrl, label: 'AI Module', hint: 'normal', helperText: '(Contoh: normal)')),
                      ],
                    ),
                    _buildTextField(controller: _dcsFiberOpticCtrl, label: 'Fiber Optic & Ethernet Communication', hint: 'hijau / scanning normal', helperText: '(Contoh: normal)'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _dcsGroundingEeEaCtrl, label: 'Grounding EE-EA', hint: '1.2 Ohm', helperText: '(Batas: < 1.0 Ω)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsGroundingEePeCtrl, label: 'Grounding EE-PE', hint: '0.9 Ohm', helperText: '(Batas: < 1.0 Ω)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsGroundingEaPeCtrl, label: 'Grounding EA-PE', hint: '1.1 Ohm', helperText: '(Batas: < 1.0 Ω)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _dcsUpsOutputCtrl, label: 'Output UPS', hint: '220 VAC', helperText: '(Nominal: 220 VAC)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsPdbOutputCtrl, label: 'Output PDB', hint: '218 VAC', helperText: '(Nominal: 220 VAC)')),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(controller: _dcsRoomAcCtrl, label: 'AC Ruang PLC', hint: 'dingin 23 C', helperText: '(Batas: 20-24°C)')),
                        const SizedBox(width: 8),
                        Expanded(child: _buildTextField(controller: _dcsRoomCleanlinessCtrl, label: 'Kebersihan Panel', hint: 'bersih', helperText: '(Contoh: Bersih)')),
                      ],
                    ),
                    _buildTextField(controller: _dcsDamagedPartCtrl, label: 'Kondisi Rusak - Penggantian Part', hint: 'tidak ada / part yang diganti', helperText: '(Bila ada)'),
                  ],

                  // Common Detail Fields
                  _buildSectionHead('Catatan, Tindakan & Rekomendasi', 'Ringkasan temuan dan perbaikan lapangan'),
                  _buildTextField(controller: _deskripsiCtrl, label: 'Deskripsi Kondisi / Temuan', hint: 'Catatan kondisi alat saat inspeksi...', maxLines: 2, helperText: '(Opsional)'),
                  _buildTextField(controller: _tindakanCtrl, label: 'Tindakan Yang Dilakukan', hint: 'Tindakan yang telah dilakukan teknisi...', maxLines: 2, helperText: '(Opsional)'),
                  _buildTextField(controller: _rekomendasiCtrl, label: 'Rekomendasi Lanjutan', hint: 'Rekomendasi tindakan atau sparepart selanjutnya...', maxLines: 2, helperText: '(Opsional)'),

                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.redSurface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.red.withValues(alpha: 0.4)),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: AppTheme.red, fontSize: 12),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  ElevatedButton(
                    onPressed: _isSubmitting ? null : _handleSubmit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.teal,
                      foregroundColor: const Color(0xFF03181B),
                      minimumSize: const Size.fromHeight(50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF03181B)),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(widget.itemToEdit != null ? Icons.update_rounded : Icons.save_rounded, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                widget.itemToEdit != null
                                    ? 'PERBARUI LAPORAN SERVICE'
                                    : 'SIMPAN DATA SERVICE (ONLINE / OFFLINE)',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ],
                          ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showCarbonBrushPointDialog(String key, double? currentVal, bool isReplaced) {
    final textController = TextEditingController(
      text: currentVal != null ? currentVal.toString() : '',
    );
    bool replaced = isReplaced;
    final prevVal = _previousMeasurements[key];

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: AppTheme.border),
              ),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.teal.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppTheme.teal.withValues(alpha: 0.5)),
                    ),
                    child: Text(
                      key,
                      style: const TextStyle(color: AppTheme.teal, fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Input Titik Ukur',
                      style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (prevVal != null) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: AppTheme.teal.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppTheme.teal.withValues(alpha: 0.4)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.history_rounded, color: AppTheme.teal, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Ukuran Sebelumnya: ${prevVal.toStringAsFixed(1)} mm',
                                    style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                  ),
                                  if (_previousInspectionDate.isNotEmpty)
                                    Text(
                                      'Tanggal: $_previousInspectionDate',
                                      style: const TextStyle(color: Colors.white54, fontSize: 10),
                                    ),
                                ],
                              ),
                            ),
                            InkWell(
                              onTap: () {
                                textController.text = prevVal.toStringAsFixed(1);
                              },
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.teal,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  'Salin',
                                  style: TextStyle(color: Color(0xFF03181B), fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const Text(
                      'UKURAN PANJANG (mm)',
                      style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: textController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      autofocus: true,
                      style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                      decoration: InputDecoration(
                        hintText: 'Contoh: 38.5',
                        hintStyle: const TextStyle(color: Colors.white24),
                        suffixText: 'mm',
                        suffixStyle: const TextStyle(color: AppTheme.teal, fontWeight: FontWeight.bold),
                        filled: true,
                        fillColor: AppTheme.surfaceFloat,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: const BorderSide(color: AppTheme.border),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: const BorderSide(color: AppTheme.teal),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black26,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Standar Baru: 48 - 50 mm', style: TextStyle(color: Colors.white60, fontSize: 11)),
                          Text('Aman: >= 34 mm (T3) / >= 38 mm (T4)', style: TextStyle(color: AppTheme.teal, fontSize: 11)),
                          Text('Waspada: 30 - 33.9 mm (T3) / 35 - 37.9 mm (T4)', style: TextStyle(color: AppConstants.warningYellow, fontSize: 11)),
                          Text('Kritis: < 30 mm (T3) / < 35 mm (T4)', style: TextStyle(color: AppConstants.alertRed, fontSize: 11)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    InkWell(
                      onTap: () {
                        setDialogState(() {
                          replaced = !replaced;
                        });
                      },
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: replaced
                              ? const Color(0xFFFF1744).withValues(alpha: 0.15)
                              : AppTheme.surfaceFloat,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: replaced ? const Color(0xFFFF1744) : AppTheme.border,
                            width: replaced ? 1.5 : 1.0,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              replaced ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                              color: replaced ? const Color(0xFFFF1744) : Colors.white38,
                              size: 20,
                            ),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Titik Baru Diganti',
                                    style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    'Ditandai warna merah menyala',
                                    style: TextStyle(color: Colors.white54, fontSize: 10),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              actionsPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              actions: [
                if (currentVal != null || isReplaced)
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _measurements[key] = null;
                        _replacedPoints.remove(key);
                        _cbReplacementCtrl.text = _replacedPoints.isEmpty ? '' : '${_replacedPoints.length} pcs';
                      });
                      Navigator.pop(ctx);
                    },
                    child: const Text('Kosongkan', style: TextStyle(color: Colors.white54, fontSize: 12)),
                  ),
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Batal', style: TextStyle(color: Colors.white70)),
                ),
                ElevatedButton(
                  onPressed: () {
                    final valText = textController.text.trim();
                    final parsed = double.tryParse(valText.replaceAll(',', '.'));
                    setState(() {
                      _measurements[key] = parsed;
                      if (replaced) {
                        _replacedPoints.add(key);
                      } else {
                        _replacedPoints.remove(key);
                      }
                      _cbReplacementCtrl.text = _replacedPoints.isEmpty ? '' : '${_replacedPoints.length} pcs';
                    });
                    Navigator.pop(ctx);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.teal,
                    foregroundColor: const Color(0xFF03181B),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Simpan', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            );
          },
        );
      },
    );
  }
}

