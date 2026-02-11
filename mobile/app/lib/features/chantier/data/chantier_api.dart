import 'package:dio/dio.dart';
import 'package:app/core/network/dio_client.dart';
import '../domain/models/chantier.dart';

class ChantierApi {
  ChantierApi(this._client);

  final DioClient _client;

  Future<List<Chantier>> listChantiers() async {
    final res = await _client.dio.get('/projects');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Chantier.fromJson).toList();
  }
}
