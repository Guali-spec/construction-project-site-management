class Worker {
  final String id;
  final String firstName;
  final String lastName;
  final String? trade;
  final String? phone;
  final num? dailyRate;

  Worker({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.trade,
    this.phone,
    this.dailyRate,
  });

  factory Worker.fromJson(Map<String, dynamic> json) {
    return Worker(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      trade: json['trade'] as String?,
      phone: json['phone'] as String?,
      dailyRate: json['dailyRate'] as num?,
    );
  }
}
