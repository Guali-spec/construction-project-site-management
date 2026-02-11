import 'package:dio/dio.dart';
import '../../../core/network/dio_client.dart';
import '../domain/models/auth_tokens.dart';
import '../domain/models/user.dart';

class AuthApi {
  AuthApi(this._client);

  final DioClient _client;

  Future<AuthTokens> login(String email, String password) async {
    final res = await _client.dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return AuthTokens.fromJson(res.data as Map<String, dynamic>);
  }

  Future<AuthTokens> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? requestedRole,
  }) async {
    final res = await _client.dio.post('/auth/register', data: {
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
      if (requestedRole != null) 'requestedRole': requestedRole,
    });
    return AuthTokens.fromJson(res.data as Map<String, dynamic>);
  }

  Future<AuthTokens> refresh(String refreshToken) async {
    final res = await _client.dio.post('/auth/refresh', data: {
      'refreshToken': refreshToken,
    });
    return AuthTokens.fromJson(res.data as Map<String, dynamic>);
  }

  Future<AuthUser> me() async {
    final res = await _client.dio.get('/auth/me');
    return AuthUser.fromJson(res.data as Map<String, dynamic>);
  }
}
