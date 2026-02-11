class AuthUser {
  final String id;
  final String email;
  final String role;

  AuthUser({required this.id, required this.email, required this.role});

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['sub'] as String? ?? json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? 'PENDING',
    );
  }
}
