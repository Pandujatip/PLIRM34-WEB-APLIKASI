import "package:flutter/material.dart";
import "package:url_launcher/url_launcher.dart";
import "../../../core/constants/app_constants.dart";
import "../../../core/theme/app_theme.dart";
import "../../../data/services/api_service.dart";

class LoginScreen extends StatefulWidget {
  final ApiService apiService;
  final VoidCallback onLoginSuccess;

  const LoginScreen({
    super.key,
    required this.apiService,
    required this.onLoginSuccess,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameCtrl = TextEditingController(text: "admin.plirm34");
  final _passwordCtrl = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  Future<void> _handleLogin() async {
    final username = _usernameCtrl.text.trim();
    final password = _passwordCtrl.text;
    if (username.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = "Harap masukkan username dan kata sandi");
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await widget.apiService.login(username, password);
      if (mounted) widget.onLoginSuccess();
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll("Exception: ", "");
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleGoogleSignIn() async {
    final uri = Uri.parse(AppConstants.ssoUrl);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        setState(() => _errorMessage = "Tidak dapat membuka halaman login Google");
      }
    } catch (err) {
      setState(() => _errorMessage = "Gagal membuka SSO: $err");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceFloat,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.teal.withValues(alpha: 0.4)),
                    ),
                    child: const Icon(Icons.engineering_rounded, color: AppTheme.teal, size: 24),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          AppConstants.appName,
                          style: TextStyle(
                            color: AppTheme.text,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.3,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          AppConstants.appTagline,
                          style: TextStyle(
                            color: AppTheme.textMuted,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.teal.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.teal.withValues(alpha: 0.4)),
                    ),
                    child: const Text(
                      "LIVE",
                      style: TextStyle(
                        color: AppTheme.teal,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Sign In Info Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.teal.withValues(alpha: 0.35)),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.teal.withValues(alpha: 0.06),
                      blurRadius: 16,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Sign In",
                      style: TextStyle(
                        color: AppTheme.text,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      "Dashboard, service, sparepart, dan monitoring overtime untuk pekerja lapangan.",
                      style: TextStyle(
                        color: AppTheme.textMuted,
                        fontSize: 13,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _featureChip(Icons.warning_amber_rounded, "Early warning"),
                        const SizedBox(width: 8),
                        _featureChip(Icons.list_alt_rounded, "Service log"),
                        const SizedBox(width: 8),
                        _featureChip(Icons.inventory_2_outlined, "Stock"),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Main Auth Form Card
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Google Sign-In Button
                    ElevatedButton(
                      onPressed: _handleGoogleSignIn,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4285F4),
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.g_mobiledata_rounded, size: 28),
                          SizedBox(width: 8),
                          Text(
                            "Continue with Google",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Divider
                    const Row(
                      children: [
                        Expanded(child: Divider(color: AppTheme.borderMuted)),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 14),
                          child: Text(
                            "ATAU",
                            style: TextStyle(
                              color: AppTheme.textSubtle,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        Expanded(child: Divider(color: AppTheme.borderMuted)),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Form Inputs
                    TextField(
                      controller: _usernameCtrl,
                      decoration: const InputDecoration(
                        labelText: "USERNAME",
                        prefixIcon: Icon(Icons.person_outline_rounded, color: AppTheme.textMuted, size: 20),
                      ),
                    ),
                    const SizedBox(height: 14),
                    TextField(
                      controller: _passwordCtrl,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: "PASSWORD",
                        prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.textMuted, size: 20),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                            color: AppTheme.textMuted,
                            size: 20,
                          ),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

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
                          style: const TextStyle(color: AppTheme.red, fontSize: 13),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    ElevatedButton(
                      onPressed: _isLoading ? null : _handleLogin,
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF03181B)),
                            )
                          : const Text("MASUK"),
                    ),
                    const SizedBox(height: 16),

                    const Text(
                      "* Masuk untuk sinkron data.",
                      style: TextStyle(color: AppTheme.teal, fontSize: 12),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),

                    // Offline Button
                    OutlinedButton(
                      onPressed: widget.onLoginSuccess,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.textMuted,
                        minimumSize: const Size.fromHeight(48),
                        side: const BorderSide(color: AppTheme.borderMuted),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        "LIHAT DATA OFFLINE",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                "SISTEM INFORMASI LAPANGAN PLIRM34 // VERSI FLUTTER",
                style: TextStyle(
                  color: AppTheme.textSubtle,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _featureChip(IconData icon, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: AppTheme.surfaceFloat,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.borderMuted),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppTheme.teal, size: 18),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                color: AppTheme.textMuted,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
