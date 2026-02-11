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

  Future<void> createPhoto(String projectId, String url, String? caption) async {
    await _client.dio.post('/projects/$projectId/photos', data: {
      'url': url,
      if (caption != null) 'caption': caption,
    });
  }
}
