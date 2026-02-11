class Attendance {
  final String id;
  final String workerId;
  final String? checkIn;
  final String? checkOut;
  final String? note;

  Attendance({
    required this.id,
    required this.workerId,
    this.checkIn,
    this.checkOut,
    this.note,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'] as String,
      workerId: json['workerId'] as String,
      checkIn: json['checkIn'] as String?,
      checkOut: json['checkOut'] as String?,
      note: json['note'] as String?,
    );
  }
}
