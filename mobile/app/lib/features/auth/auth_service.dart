import 'dart:async';

class AuthService {
  /// LOGIN SIMULÉ (TEMPORAIRE)
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    // Simulation d’un appel réseau (2 secondes)
    await Future.delayed(const Duration(seconds: 2));

    // Identifiants FAKE autorisés
    const fakeEmail = "test@chantier.com";
    const fakePassword = "123456";

    if (email == fakeEmail && password == fakePassword) {
      return true; // login réussi
    } else {
      return false; // login échoué
    }
  }
}
