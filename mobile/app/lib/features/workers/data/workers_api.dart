import 'package:app/core/network/dio_client.dart';
import 'package:app/features/workers/domain/models/worker.dart';

class WorkersApi {
  WorkersApi(this._client);
  final DioClient _client;

  Future<List<Worker>> listWorkers(String projectId) async {
    final res = await _client.dio.get('/projects/$projectId/workers');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Worker.fromJson).toList();
  }

  Future<Worker> createWorker(String projectId, Map<String, dynamic> payload) async {
    final res = await _client.dio.post('/projects/$projectId/workers', data: payload);
    return Worker.fromJson(res.data as Map<String, dynamic>);
  }
}
