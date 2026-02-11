import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/workers/data/workers_api.dart';
import 'package:app/features/workers/domain/models/worker.dart';

enum WorkersStatus { idle, loading, error }

class WorkersState {
  final WorkersStatus status;
  final List<Worker> items;
  final String? error;

  const WorkersState({
    required this.status,
    this.items = const [],
    this.error,
  });

  WorkersState copyWith({
    WorkersStatus? status,
    List<Worker>? items,
    String? error,
  }) {
    return WorkersState(
      status: status ?? this.status,
      items: items ?? this.items,
      error: error,
    );
  }

  static const initial = WorkersState(status: WorkersStatus.idle);
}

class WorkersController extends StateNotifier<WorkersState> {
  WorkersController(this._ref) : super(WorkersState.initial);

  final Ref _ref;

  Future<void> load(String projectId) async {
    state = state.copyWith(status: WorkersStatus.loading, error: null);
    try {
      final api = WorkersApi(_ref.read(dioClientProvider));
      final items = await api.listWorkers(projectId);
      state = state.copyWith(status: WorkersStatus.idle, items: items);
    } catch (_) {
      state = state.copyWith(status: WorkersStatus.error, error: 'Erreur chargement ouvriers');
    }
  }

  Future<void> create(String projectId, Map<String, dynamic> payload) async {
    state = state.copyWith(status: WorkersStatus.loading, error: null);
    try {
      final api = WorkersApi(_ref.read(dioClientProvider));
      await api.createWorker(projectId, payload);
      final items = await api.listWorkers(projectId);
      state = state.copyWith(status: WorkersStatus.idle, items: items);
    } catch (_) {
      state = state.copyWith(status: WorkersStatus.error, error: 'Erreur creation ouvrier');
    }
  }
}

final workersControllerProvider = StateNotifierProvider<WorkersController, WorkersState>((ref) {
  return WorkersController(ref);
});
