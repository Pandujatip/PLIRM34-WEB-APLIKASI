import 'package:flutter/material.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/models.dart';
import '../../../data/services/api_service.dart';

class ProfileCompletionDialog extends StatefulWidget {
  final ApiService apiService;
  final UserModel currentUser;
  final Function(UserModel updatedUser) onProfileCompleted;

  const ProfileCompletionDialog({
    super.key,
    required this.apiService,
    required this.currentUser,
    required this.onProfileCompleted,
  });

  static Future<void> show(
    BuildContext context, {
    required ApiService apiService,
    required UserModel currentUser,
    required Function(UserModel updatedUser) onProfileCompleted,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => PopScope(
        canPop: false,
        child: ProfileCompletionDialog(
          apiService: apiService,
          currentUser: currentUser,
          onProfileCompleted: onProfileCompleted,
        ),
      ),
    );
  }

  @override
  State<ProfileCompletionDialog> createState() => _ProfileCompletionDialogState();
}

class _ProfileCompletionDialogState extends State<ProfileCompletionDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _fullNameCtrl;
  late final TextEditingController _badgeCtrl;
  late final TextEditingController _companyCtrl;

  String _employmentType = 'outsourcing';
  String _selectedUnit = 'PLIRM34';
  bool _isSaving = false;
  String? _errorMessage;

  static const List<Map<String, String>> unitKerjaList = [
    {'code': 'PLICR12', 'label': 'PLICR12 - Crusher Tuban 1-2'},
    {'code': 'PLIRM12', 'label': 'PLIRM12 - Raw Mill Tuban 1-2'},
    {'code': 'PLIKC12', 'label': 'PLIKC12 - Kiln & Coal Mill Tuban 1-2'},
    {'code': 'PLIFM12', 'label': 'PLIFM12 - Finish Mill Tuban 1-2'},
    {'code': 'PLIPC', 'label': 'PLIPC - Packing Cement Tuban 1-4'},
    {'code': 'PLICR34', 'label': 'PLICR34 - Crusher Tuban 3-4'},
    {'code': 'PLIRM34', 'label': 'PLIRM34 - Raw Mill Tuban 3-4'},
    {'code': 'PLIKC34', 'label': 'PLIKC34 - Kiln & Coal Mill Tuban 3-4'},
    {'code': 'PLIFM34', 'label': 'PLIFM34 - Finish Mill Tuban 3-4'},
  ];

  @override
  void initState() {
    super.initState();
    _fullNameCtrl = TextEditingController(text: widget.currentUser.fullName ?? '');
    _badgeCtrl = TextEditingController(text: widget.currentUser.badgeNumber ?? '');
    
    _employmentType = (widget.currentUser.employmentType == 'organik') ? 'organik' : 'outsourcing';
    final defaultCompany = _employmentType == 'organik' ? 'Gopo Tuban' : (widget.currentUser.company ?? '');
    _companyCtrl = TextEditingController(text: defaultCompany);

    if (widget.currentUser.unitKerja != null && widget.currentUser.unitKerja!.isNotEmpty) {
      if (unitKerjaList.any((u) => u['code'] == widget.currentUser.unitKerja)) {
        _selectedUnit = widget.currentUser.unitKerja!;
      }
    }
  }

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _badgeCtrl.dispose();
    _companyCtrl.dispose();
    super.dispose();
  }

  void _onEmploymentTypeChanged(String? type) {
    if (type == null) return;
    setState(() {
      _employmentType = type;
      if (type == 'organik') {
        _companyCtrl.text = 'Gopo Tuban';
      } else {
        if (_companyCtrl.text == 'Gopo Tuban') {
          _companyCtrl.text = '';
        }
      }
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSaving = true;
      _errorMessage = null;
    });

    try {
      final updatedUser = await widget.apiService.completeProfile(
        fullName: _fullNameCtrl.text.trim(),
        badgeNumber: _badgeCtrl.text.trim(),
        employmentType: _employmentType,
        company: _companyCtrl.text.trim(),
        unitKerja: _selectedUnit,
      );

      if (mounted) {
        Navigator.of(context, rootNavigator: true).pop();
        widget.onProfileCompleted(updatedUser);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll('Exception: ', '');
          _isSaving = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppTheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: AppTheme.border, width: 1.2),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 480),
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppConstants.accentCyan.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppConstants.accentCyan.withOpacity(0.3)),
                      ),
                      child: const Icon(Icons.assignment_ind_rounded, color: AppConstants.accentCyan, size: 28),
                    ),
                    const SizedBox(width: 14),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Kelengkapan Profil Akun',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Wajib diisi untuk menentukan hak akses unit kerja',
                            style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Full Name
                TextFormField(
                  controller: _fullNameCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    labelText: 'Nama Lengkap *',
                    labelStyle: const TextStyle(color: AppTheme.textSubtle),
                    prefixIcon: const Icon(Icons.person_outline, color: AppConstants.accentCyan, size: 20),
                    filled: true,
                    fillColor: AppTheme.surfaceFloat,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Nama lengkap wajib diisi' : null,
                ),
                const SizedBox(height: 14),

                // Badge Number
                TextFormField(
                  controller: _badgeCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    labelText: 'No. Badge / NIK *',
                    labelStyle: const TextStyle(color: AppTheme.textSubtle),
                    prefixIcon: const Icon(Icons.badge_outlined, color: AppConstants.accentCyan, size: 20),
                    filled: true,
                    fillColor: AppTheme.surfaceFloat,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'No. Badge wajib diisi' : null,
                ),
                const SizedBox(height: 14),

                // Employment Type
                DropdownButtonFormField<String>(
                  value: _employmentType,
                  dropdownColor: AppTheme.surface,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    labelText: 'Jenis Karyawan *',
                    labelStyle: const TextStyle(color: AppTheme.textSubtle),
                    prefixIcon: const Icon(Icons.work_outline, color: AppConstants.accentCyan, size: 20),
                    filled: true,
                    fillColor: AppTheme.surfaceFloat,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'outsourcing', child: Text('Outsourcing')),
                    DropdownMenuItem(value: 'organik', child: Text('Organik')),
                  ],
                  onChanged: _onEmploymentTypeChanged,
                ),
                const SizedBox(height: 14),

                // Company
                TextFormField(
                  controller: _companyCtrl,
                  readOnly: _employmentType == 'organik',
                  style: TextStyle(
                    color: _employmentType == 'organik' ? AppTheme.textMuted : Colors.white,
                    fontSize: 14,
                  ),
                  decoration: InputDecoration(
                    labelText: _employmentType == 'organik' ? 'Perusahaan (Otomatis)' : 'Nama PT / Vendor *',
                    labelStyle: const TextStyle(color: AppTheme.textSubtle),
                    prefixIcon: Icon(
                      Icons.business_outlined,
                      color: _employmentType == 'organik' ? AppTheme.textMuted : AppConstants.accentCyan,
                      size: 20,
                    ),
                    filled: true,
                    fillColor: _employmentType == 'organik' ? Colors.white.withOpacity(0.04) : AppTheme.surfaceFloat,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    helperText: _employmentType == 'organik' ? 'Karyawan organik otomatis terdaftar di Gopo Tuban' : null,
                    helperStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                  ),
                  validator: (v) {
                    if (_employmentType == 'outsourcing' && (v == null || v.trim().isEmpty)) {
                      return 'Nama PT / Vendor wajib diisi';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // Unit Kerja (9 units)
                DropdownButtonFormField<String>(
                  value: _selectedUnit,
                  isExpanded: true,
                  dropdownColor: AppTheme.surface,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    labelText: 'Unit Kerja Penugasan *',
                    labelStyle: const TextStyle(color: AppTheme.textSubtle),
                    prefixIcon: const Icon(Icons.location_city_outlined, color: AppConstants.accentCyan, size: 20),
                    filled: true,
                    fillColor: AppTheme.surfaceFloat,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.border)),
                    helperText: 'Menentukan pabrik, area, dan equipment yang dapat Anda input & lihat',
                    helperStyle: const TextStyle(color: AppConstants.accentCyan, fontSize: 11),
                  ),
                  items: unitKerjaList.map((unit) {
                    return DropdownMenuItem<String>(
                      value: unit['code']!,
                      child: Text(
                        unit['label']!,
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedUnit = val);
                  },
                ),
                const SizedBox(height: 16),

                // Error Banner
                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppConstants.alertRed.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppConstants.alertRed.withOpacity(0.4)),
                    ),
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(color: AppConstants.alertRed, fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],

                // Submit Button
                ElevatedButton(
                  onPressed: _isSaving ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.teal,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 4,
                  ),
                  child: _isSaving
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2.2, color: Colors.white),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.check_circle_outline, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Simpan Profil & Mulai',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
