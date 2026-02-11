import 'package:app/core/network/dio_client.dart';
import 'package:app/features/attendances/domain/models/attendance.dart';

class AttendancesApi {
  AttendancesApi(this._client);
  final DioClient _client;

  Future<List<Attendance>> listAttendances(String projectId) async {
    final res = await _client.dio.get('/projects/$projectId/attendances');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Attendance.fromJson).toList();
  }

  Future<void> createAttendance(String projectId, String workerId) async {
    await _client.dio.post('/projects/$projectId/attendances', data: {
      'workerId': workerId,
    });
  }

  Future<void> updateAttendance(String projectId, String id) async {
    await _client.dio.patch('/projects/$projectId/attendances/$id', data: {
      'checkOut': DateTime.now().toIso8601String(),
    });
  }
}
