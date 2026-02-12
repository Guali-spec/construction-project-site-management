import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:app/features/auth/presentation/screens/login_screen.dart';
import 'package:app/features/auth/presentation/screens/register_screen.dart';
import 'package:app/features/auth/presentation/screens/pending_screen.dart';
import 'package:app/features/auth/presentation/screens/web_only_screen.dart';
import 'package:app/features/auth/presentation/providers/auth_controller.dart';
import 'package:app/features/dashboard/dashboard_screen.dart';
import 'package:app/features/chantier/chantier_list_screen.dart';
import 'package:app/features/chantier/chantier_module_screen.dart';

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}

final goRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authControllerProvider);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: GoRouterRefreshStream(
      ref.read(authControllerProvider.notifier).stream,
    ),
    redirect: (context, state) {
      final isLoading = authState.status == AuthStatus.unknown || authState.loading;
      final isAuth = authState.status == AuthStatus.authenticated;
      final isPending = authState.status == AuthStatus.pending;
      final role = authState.user?.role;
      final isMobileAllowed = role == 'CHEF_PROJET' || role == 'SUPERVISEUR';

      final goingToLogin = state.matchedLocation == '/login';
      final goingToRegister = state.matchedLocation == '/register';
      final goingToPending = state.matchedLocation == '/pending';
      final goingToWebOnly = state.matchedLocation == '/web-only';

      if (isLoading) return null;
      if (!isAuth && !isPending) {
        if (goingToLogin || goingToRegister) return null;
        return '/login';
      }
      if (isPending) return goingToPending ? null : '/pending';
      if (isAuth && !isMobileAllowed) return goingToWebOnly ? null : '/web-only';
      if (isAuth && (goingToLogin || goingToPending || goingToRegister || goingToWebOnly)) {
        if (role == 'SUPERVISEUR') return '/chantiers';
        return '/dashboard';
      }
      return null;
    },
    routes: <RouteBase>[
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/pending',
        builder: (context, state) => const PendingScreen(),
      ),
      GoRoute(
        path: '/web-only',
        builder: (context, state) => const WebOnlyScreen(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/chantiers',
        builder: (context, state) => const ChantierListScreen(),
      ),
      GoRoute(
        path: '/taches',
        builder: (context, state) => const ChantierModuleScreen(module: ChantierModule.tasks),
      ),
      GoRoute(
        path: '/photos',
        builder: (context, state) => const ChantierModuleScreen(module: ChantierModule.photos),
      ),
      GoRoute(
        path: '/suivi',
        builder: (context, state) => const ChantierModuleScreen(module: ChantierModule.suivi),
      ),
      GoRoute(
        path: '/ressources',
        builder: (context, state) => const ChantierModuleScreen(module: ChantierModule.ressources),
      ),
      GoRoute(
        path: '/finances',
        builder: (context, state) => const ChantierModuleScreen(module: ChantierModule.finances),
      ),
      GoRoute(
        path: '/rapports',
        builder: (context, state) => const ChantierModuleScreen(module: ChantierModule.rapports),
      ),
    ],
  );
});
