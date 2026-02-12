class Attendance {
  final String id;
  final String workerId;
  final String date;
  final bool? present;
  final String? notes;

  Attendance({
    required this.id,
    required this.workerId,
    required this.date,
    this.present,
    this.notes,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'] as String,
      workerId: json['workerId'] as String,
      date: (json['date'] as String?) ?? '',
      present: json['present'] as bool?,
      notes: json['notes'] as String?,
    );
  }
}
