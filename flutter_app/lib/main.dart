import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:shared_preferences/shared_preferences.dart";
import "core/constants/app_constants.dart";
import "core/theme/app_theme.dart";
import "data/services/api_service.dart";
import "ui/core/widgets/bottom_nav_bar.dart";
import "ui/features/auth/login_screen.dart";
import "ui/features/dashboard/overview_screen.dart";
import "ui/features/service/service_screen.dart";
import "ui/features/sparepart/sparepart_screen.dart";
import "ui/features/overtime/overtime_screen.dart";

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: AppTheme.background,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppTheme.background,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  final prefs = await SharedPreferences.getInstance();
  final savedToken = prefs.getString(AppConstants.prefToken);

  runApp(PortableInspectionApp(initialToken: savedToken));
}

class PortableInspectionApp extends StatelessWidget {
  final String? initialToken;

  const PortableInspectionApp({super.key, this.initialToken});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: AppRoot(initialToken: initialToken),
    );
  }
}

class AppRoot extends StatefulWidget {
  final String? initialToken;

  const AppRoot({super.key, this.initialToken});

  @override
  State<AppRoot> createState() => _AppRootState();
}

class _AppRootState extends State<AppRoot> {
  static const MethodChannel _authChannel = MethodChannel("id.plirm34/auth");
  final ApiService _apiService = ApiService();
  bool _isLoggedIn = false;
  String _selectedArea = "Semua Area";

  @override
  void initState() {
    super.initState();
    if (widget.initialToken != null && widget.initialToken!.isNotEmpty) {
      _apiService.setSessionToken(widget.initialToken);
      _isLoggedIn = true;
    }
    _setupDeepLinkChannel();
  }

  void _setupDeepLinkChannel() {
    try {
      _authChannel.invokeMethod<String>("getInitialToken").then((token) {
        if (token != null && token.isNotEmpty) {
          _onLoginSuccess(token);
        }
      });
    } catch (_) {}

    _authChannel.setMethodCallHandler((call) async {
      if (call.method == "onTokenReceived") {
        final token = call.arguments as String?;
        if (token != null && token.isNotEmpty) {
          _onLoginSuccess(token);
        }
      }
    });
  }

  void _onLoginSuccess([String? token]) async {
    final prefs = await SharedPreferences.getInstance();
    final effectiveToken = (token != null && token.isNotEmpty) ? token : "logged_in_session";
    await prefs.setString(AppConstants.prefToken, effectiveToken);
    _apiService.setSessionToken(effectiveToken);
    if (mounted) {
      setState(() => _isLoggedIn = true);
    }
  }

  void _onLogout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.prefToken);
    _apiService.setSessionToken(null);
    if (mounted) {
      setState(() => _isLoggedIn = false);
    }
  }

  void _onAreaChanged(String newArea) {
    setState(() => _selectedArea = newArea);
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoggedIn) {
      return LoginScreen(
        apiService: _apiService,
        onLoginSuccess: _onLoginSuccess,
      );
    }

    return MainShell(
      apiService: _apiService,
      onLogout: _onLogout,
      selectedArea: _selectedArea,
      onAreaChanged: _onAreaChanged,
    );
  }
}

class MainShell extends StatefulWidget {
  final ApiService apiService;
  final VoidCallback onLogout;
  final String selectedArea;
  final Function(String) onAreaChanged;

  const MainShell({
    super.key,
    required this.apiService,
    required this.onLogout,
    required this.selectedArea,
    required this.onAreaChanged,
  });

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentTab = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      OverviewScreen(
        apiService: widget.apiService,
        onLogout: widget.onLogout,
        selectedArea: widget.selectedArea,
        onAreaChanged: widget.onAreaChanged,
      ),
      ServiceScreen(
        apiService: widget.apiService,
        selectedArea: widget.selectedArea,
      ),
      SparepartScreen(
        apiService: widget.apiService,
        selectedArea: widget.selectedArea,
      ),
      OvertimeScreen(
        apiService: widget.apiService,
      ),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentTab,
        children: screens,
      ),
      bottomNavigationBar: FloatingBottomNavBar(
        currentIndex: _currentTab,
        onTap: (index) => setState(() => _currentTab = index),
      ),
    );
  }
}
