import "package:flutter/material.dart";
import "package:flutter/foundation.dart";
import "package:flutter/services.dart";
import "package:shared_preferences/shared_preferences.dart";
import "core/constants/app_constants.dart";
import "core/theme/app_theme.dart";
import "data/models/models.dart";
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
  UserModel? _currentUser;

  @override
  void initState() {
    super.initState();
    _loadSavedUser();
    _setupDeepLinkChannel();
    _checkWebQueryToken();
  }

  void _checkWebQueryToken() {
    if (kIsWeb) {
      final uri = Uri.base;
      final token = uri.queryParameters["token"];
      if (token != null && token.isNotEmpty) {
        final role = uri.queryParameters["role"] ?? "team";
        final username = uri.queryParameters["username"] ?? "google_user";
        _handleIncomingAuth(token, fallbackRole: role, fallbackUsername: username);
      }
    }
  }

  Future<void> _handleIncomingAuth(
    String token, {
    String fallbackRole = "team",
    String fallbackUsername = "google_user",
  }) async {
    _apiService.setSessionToken(token);

    // Fetch verified profile from /api/auth/me on live server
    UserModel? verifiedUser;
    try {
      verifiedUser = await _apiService.fetchCurrentUser(token: token);
    } catch (_) {}

    final finalUser = verifiedUser ?? UserModel(
      id: 1,
      username: fallbackUsername,
      role: fallbackRole,
      token: token,
    );

    _onLoginSuccess(finalUser);
  }

  Future<void> _loadSavedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConstants.prefToken) ?? widget.initialToken;
    final role = prefs.getString("pref_user_role") ?? "admin";
    final uname = prefs.getString("pref_username") ?? "admin.plirm34";
    if (token != null && token.isNotEmpty) {
      _apiService.setSessionToken(token);
      if (mounted) {
        setState(() {
          _currentUser = UserModel(id: 1, username: uname, role: role, token: token);
          _isLoggedIn = true;
        });
      }
    }
  }

  void _setupDeepLinkChannel() {
    try {
      _authChannel.invokeMethod<Map>("getInitialAuth").then((auth) {
        if (auth != null && auth["token"] != null) {
          final token = auth["token"] as String;
          final role = (auth["role"] as String?) ?? "team";
          final username = (auth["username"] as String?) ?? "google_user";
          _handleIncomingAuth(token, fallbackRole: role, fallbackUsername: username);
        } else {
          _authChannel.invokeMethod<String>("getInitialToken").then((token) {
            if (token != null && token.isNotEmpty) {
              _handleIncomingAuth(token);
            }
          });
        }
      });
    } catch (_) {
      try {
        _authChannel.invokeMethod<String>("getInitialToken").then((token) {
          if (token != null && token.isNotEmpty) {
            _handleIncomingAuth(token);
          }
        });
      } catch (_) {}
    }

    _authChannel.setMethodCallHandler((call) async {
      if (call.method == "onAuthReceived") {
        final auth = call.arguments as Map?;
        if (auth != null && auth["token"] != null) {
          final token = auth["token"] as String;
          final role = (auth["role"] as String?) ?? "team";
          final username = (auth["username"] as String?) ?? "google_user";
          _handleIncomingAuth(token, fallbackRole: role, fallbackUsername: username);
        }
      } else if (call.method == "onTokenReceived") {
        final token = call.arguments as String?;
        if (token != null && token.isNotEmpty) {
          _handleIncomingAuth(token);
        }
      }
    });
  }

  void _onLoginSuccess(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    final effectiveToken = user.token ?? "logged_in_session";
    await prefs.setString(AppConstants.prefToken, effectiveToken);
    await prefs.setString("pref_user_role", user.role);
    await prefs.setString("pref_username", user.username);
    _apiService.setSessionToken(effectiveToken);
    if (mounted) {
      setState(() {
        _currentUser = user;
        _isLoggedIn = true;
      });
    }
  }

  void _onLogout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.prefToken);
    await prefs.remove("pref_user_role");
    await prefs.remove("pref_username");
    _apiService.setSessionToken(null);
    if (mounted) {
      setState(() {
        _currentUser = null;
        _isLoggedIn = false;
      });
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
      currentUser: _currentUser,
    );
  }
}

class MainShell extends StatefulWidget {
  final ApiService apiService;
  final VoidCallback onLogout;
  final String selectedArea;
  final Function(String) onAreaChanged;
  final UserModel? currentUser;

  const MainShell({
    super.key,
    required this.apiService,
    required this.onLogout,
    required this.selectedArea,
    required this.onAreaChanged,
    this.currentUser,
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
        currentUser: widget.currentUser,
      ),
      ServiceScreen(
        apiService: widget.apiService,
        selectedArea: widget.selectedArea,
        currentUser: widget.currentUser,
      ),
      SparepartScreen(
        apiService: widget.apiService,
        selectedArea: widget.selectedArea,
        currentUser: widget.currentUser,
      ),
      OvertimeScreen(
        apiService: widget.apiService,
        currentUser: widget.currentUser,
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
