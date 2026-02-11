import 'package:dio/dio.dart';
import 'package:app/core/network/dio_client.dart';
import '../domain/models/phase.dart';
import '../domain/models/lot.dart';
import '../domain/models/tache.dart';

class TacheApi {
  TacheApi(this._client);

  final DioClient _client;

  Future<List<Phase>> listPhases(String projectId) async {
    final res = await _client.dio.get('/projects/$projectId/phases');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Phase.fromJson).toList();
  }

  Future<List<Lot>> listLots(String projectId, String phaseId) async {
    final res = await _client.dio.get('/projects/$projectId/phases/$phaseId/lots');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Lot.fromJson).toList();
  }

  Future<List<Tache>> listTasks(String projectId, String lotId) async {
    final res = await _client.dio.get('/projects/$projectId/lots/$lotId/tasks');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Tache.fromJson).toList();
  }

  Future<void> updateStatus(String projectId, String lotId, String taskId, String status, int progress) async {
    await _client.dio.patch('/projects/$projectId/lots/$lotId/tasks/$taskId/status', data: {
      'status': status,
      'progress': progress,
    });
  }
}
