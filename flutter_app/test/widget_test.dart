// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:portable_inspection_tool/main.dart';

void main() {
  testWidgets('App smoke test - renders Login Screen when logged out', (WidgetTester tester) async {
    await tester.pumpWidget(const PortableInspectionApp());
    await tester.pumpAndSettle();

    expect(find.text('Portable Inspection Tool'), findsOneWidget);
    expect(find.text('Continue with Google'), findsOneWidget);
  });
}
