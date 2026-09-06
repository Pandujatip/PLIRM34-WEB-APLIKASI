import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portable_inspection_tool/core/theme/app_theme.dart';
import 'package:portable_inspection_tool/data/models/models.dart';
import 'package:portable_inspection_tool/data/services/api_service.dart';
import 'package:portable_inspection_tool/ui/features/dashboard/widgets/user_management_sheet.dart';

class MockApiService extends ApiService {
  final List<UserModel> mockUsers;
  MockApiService(this.mockUsers);

  @override
  Future<List<UserModel>> fetchUsers() async {
    return mockUsers;
  }
}

void main() {
  testWidgets('UserManagementSheet renders user list and buttons properly', (tester) async {
    final mockService = MockApiService([
      UserModel(id: 22, username: 'adiii', role: 'team'),
      UserModel(id: 32, username: 'admin', role: 'team'),
      UserModel(id: 4, username: 'admin.plirm34', role: 'admin'),
      UserModel(id: 16, username: 'butar.butar', role: 'organik'),
    ]);

    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.darkTheme,
        home: Scaffold(
          body: Builder(
            builder: (context) => ElevatedButton(
              onPressed: () => UserManagementSheet.show(context, apiService: mockService),
              child: const Text('Open Sheet'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Open Sheet'));
    await tester.pumpAndSettle();

    // Check if sheet title is visible
    expect(find.text('Kelola Hak Akses Pengguna'), findsOneWidget);

    // Check if usernames are displayed
    expect(find.text('adiii'), findsOneWidget);
    expect(find.text('admin'), findsOneWidget);
    expect(find.text('admin.plirm34'), findsOneWidget);
    expect(find.text('butar.butar'), findsOneWidget);

    // Check role labels
    expect(find.text('TIM TEKNISI'), findsNWidgets(2));
    expect(find.text('ADMIN'), findsOneWidget);
    expect(find.text('ORGANIK'), findsOneWidget);

    // Check action buttons
    expect(find.text('Naikkan ke Organik'), findsNWidgets(2));
    expect(find.text('Turunkan ke Teknisi'), findsOneWidget);
  });
}
