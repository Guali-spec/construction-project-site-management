import 'package:dio/dio.dart';
import 'package:app/core/network/dio_client.dart';
import 'package:app/features/photos/domain/models/photo.dart';

class PhotosApi {
  PhotosApi(this._client);
  final DioClient _client;

  Future<List<PhotoItem>> listPhotos(String projectId) async {
    final res = await _client.dio.get('/projects/$projectId/photos');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(PhotoItem.fromJson).toList();
  }

  Future<void> uploadPhoto({
    required String projectId,
    required List<int> bytes,
    required String filename,
    String? caption,
    String? taskId,
  }) async {
    final form = FormData.fromMap({
      'file': MultipartFile.fromBytes(bytes, filename: filename),
      if (caption != null && caption.isNotEmpty) 'caption': caption,
      if (taskId != null && taskId.isNotEmpty) 'taskId': taskId,
    });

    await _client.dio.post(
      '/projects/$projectId/photos/upload',
      data: form,
      options: Options(contentType: 'multipart/form-data'),
    );
  }
}
