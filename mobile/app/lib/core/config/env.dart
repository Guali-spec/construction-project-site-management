class Env {
  // Emulator Android: 10.0.2.2 points to host
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3001/api/v1',
  );
}
