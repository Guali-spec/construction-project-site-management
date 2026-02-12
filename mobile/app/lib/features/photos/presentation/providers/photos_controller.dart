import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/photos/data/photos_api.dart';
import 'package:app/features/photos/domain/models/photo.dart';

enum PhotosStatus { idle, loading, error }

class PhotosState {
  final PhotosStatus status;
  final List<PhotoItem> items;
  final String? error;

  const PhotosState({
    required this.status,
    this.items = const [],
    this.error,
  });

  PhotosState copyWith({
    PhotosStatus? status,
    List<PhotoItem>? items,
    String? error,
  }) {
    return PhotosState(
      status: status ?? this.status,
      items: items ?? this.items,
      error: error,
    );
  }

  static const initial = PhotosState(status: PhotosStatus.idle);
}

class PhotosController extends StateNotifier<PhotosState> {
  PhotosController(this._ref) : super(PhotosState.initial);

  final Ref _ref;

  Future<void> load(String projectId) async {
    state = state.copyWith(status: PhotosStatus.loading, error: null);
    try {
      final api = PhotosApi(_ref.read(dioClientProvider));
      final items = await api.listPhotos(projectId);
      state = state.copyWith(status: PhotosStatus.idle, items: items);
    } catch (_) {
      state = state.copyWith(status: PhotosStatus.error, error: 'Erreur chargement photos');
    }
  }

  Future<void> upload({
    required String projectId,
    required List<int> bytes,
    required String filename,
    String? caption,
    String? taskId,
  }) async {
    state = state.copyWith(status: PhotosStatus.loading, error: null);
    try {
      final api = PhotosApi(_ref.read(dioClientProvider));
      await api.uploadPhoto(
        projectId: projectId,
        bytes: bytes,
        filename: filename,
        caption: caption,
        taskId: taskId,
      );
      final items = await api.listPhotos(projectId);
      state = state.copyWith(status: PhotosStatus.idle, items: items);
    } catch (_) {
      state = state.copyWith(status: PhotosStatus.error, error: 'Erreur upload photo');
    }
  }
}

final photosControllerProvider = StateNotifierProvider<PhotosController, PhotosState>((ref) {
  return PhotosController(ref);
});
