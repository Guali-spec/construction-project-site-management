import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/auth/data/auth_api.dart';
import 'package:app/features/auth/domain/models/user.dart';

enum AuthStatus { unknown, unauthenticated, authenticated, pending }

class AuthState {
  final AuthStatus status;
  final AuthUser? user;
  final bool loading;
  final String? error;

  const AuthState({
    required this.status,
    this.user,
    this.loading = false,
    this.error,
  });

  AuthState copyWith({
    AuthStatus? status,
    AuthUser? user,
    bool? loading,
    String? error,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      loading: loading ?? this.loading,
      error: error,
    );
  }

  static const initial = AuthState(status: AuthStatus.unknown, loading: true);
}

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._ref) : super(AuthState.initial) {
    init();
  }

  final Ref _ref;

  Future<void> init() async {
    final storage = _ref.read(secureStorageProvider);
    final access = await storage.readAccessToken();
    final refresh = await storage.readRefreshToken();

    if (access == null && refresh == null) {
      state = const AuthState(status: AuthStatus.unauthenticated, loading: false);
      return;
    }

    try {
      final api = AuthApi(_ref.read(dioClientProvider));
      final user = await api.me();
      state = AuthState(
        status: user.role == 'PENDING' ? AuthStatus.pending : AuthStatus.authenticated,
        user: user,
        loading: false,
      );
    } catch (_) {
      if (refresh == null) {
        state = const AuthState(status: AuthStatus.unauthenticated, loading: false);
        return;
      }
      try {
        final api = AuthApi(_ref.read(dioClientProvider));
        final tokens = await api.refresh(refresh);
        await storage.writeAccessToken(tokens.accessToken);
        await storage.writeRefreshToken(tokens.refreshToken);
        final user = await api.me();
        state = AuthState(
          status: user.role == 'PENDING' ? AuthStatus.pending : AuthStatus.authenticated,
          user: user,
          loading: false,
        );
      } catch (_) {
        await storage.clear();
        state = const AuthState(status: AuthStatus.unauthenticated, loading: false);
      }
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(loading: true, error: null);
    try {
      final api = AuthApi(_ref.read(dioClientProvider));
      final tokens = await api.login(email, password);
      final storage = _ref.read(secureStorageProvider);
      await storage.writeAccessToken(tokens.accessToken);
      await storage.writeRefreshToken(tokens.refreshToken);
      final user = await api.me();
      state = AuthState(
        status: user.role == 'PENDING' ? AuthStatus.pending : AuthStatus.authenticated,
        user: user,
        loading: false,
      );
    } catch (_) {
      state = state.copyWith(loading: false, error: 'Identifiants invalides');
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? requestedRole,
  }) async {
    state = state.copyWith(loading: true, error: null);
    try {
      final api = AuthApi(_ref.read(dioClientProvider));
      final tokens = await api.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        requestedRole: requestedRole,
      );
      final storage = _ref.read(secureStorageProvider);
      await storage.writeAccessToken(tokens.accessToken);
      await storage.writeRefreshToken(tokens.refreshToken);
      final user = await api.me();
      state = AuthState(
        status: user.role == 'PENDING' ? AuthStatus.pending : AuthStatus.authenticated,
        user: user,
        loading: false,
      );
    } catch (_) {
      state = state.copyWith(loading: false, error: 'Inscription impossible');
    }
  }

  Future<void> logout() async {
    final storage = _ref.read(secureStorageProvider);
    await storage.clear();
    state = const AuthState(status: AuthStatus.unauthenticated, loading: false);
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref);
});
