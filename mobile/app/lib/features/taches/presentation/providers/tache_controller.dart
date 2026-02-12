import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/taches/data/tache_api.dart';
import 'package:app/features/taches/domain/models/phase.dart';
import 'package:app/features/taches/domain/models/lot.dart';
import 'package:app/features/taches/domain/models/tache.dart';

enum TacheStatus { idle, loading, error }

class TacheState {
  final TacheStatus status;
  final List<Phase> phases;
  final List<Lot> lots;
  final List<Tache> taches;
  final String? selectedPhaseId;
  final String? selectedLotId;
  final String? error;

  const TacheState({
    required this.status,
    this.phases = const [],
    this.lots = const [],
    this.taches = const [],
    this.selectedPhaseId,
    this.selectedLotId,
    this.error,
  });

  TacheState copyWith({
    TacheStatus? status,
    List<Phase>? phases,
    List<Lot>? lots,
    List<Tache>? taches,
    String? selectedPhaseId,
    String? selectedLotId,
    String? error,
  }) {
    return TacheState(
      status: status ?? this.status,
      phases: phases ?? this.phases,
      lots: lots ?? this.lots,
      taches: taches ?? this.taches,
      selectedPhaseId: selectedPhaseId ?? this.selectedPhaseId,
      selectedLotId: selectedLotId ?? this.selectedLotId,
      error: error,
    );
  }

  static const initial = TacheState(status: TacheStatus.idle);
}

class TacheController extends StateNotifier<TacheState> {
  TacheController(this._ref) : super(TacheState.initial);

  final Ref _ref;

  Future<void> loadForProject(String projectId) async {
    state = state.copyWith(status: TacheStatus.loading, error: null);
    try {
      final api = TacheApi(_ref.read(dioClientProvider));
      var phases = await api.listPhases(projectId);
      if (phases.isEmpty) {
        final created = await api.createPhase(projectId, 'Phase generale', 1);
        phases = [created];
      }
      final phaseId = phases.first.id;

      var lots = await api.listLots(projectId, phaseId);
      if (lots.isEmpty) {
        final createdLot = await api.createLot(projectId, phaseId, 'Lot principal', 1);
        lots = [createdLot];
      }
      final lotId = lots.first.id;

      final taches = await api.listTasks(projectId, lotId);
      state = state.copyWith(
        status: TacheStatus.idle,
        phases: phases,
        lots: lots,
        selectedPhaseId: phaseId,
        selectedLotId: lotId,
        taches: taches,
      );
    } catch (_) {
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur de chargement des tâches');
    }
  }

  Future<void> updateStatus(String projectId, String lotId, String taskId, String status, int progress) async {
    state = state.copyWith(status: TacheStatus.loading, error: null);
    try {
      final api = TacheApi(_ref.read(dioClientProvider));
      await api.updateStatus(projectId, lotId, taskId, status, progress);
      final taches = await api.listTasks(projectId, lotId);
      state = state.copyWith(status: TacheStatus.idle, taches: taches);
    } catch (_) {
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur de mise à jour');
    }
  }

  Future<void> createTask(String projectId, Map<String, dynamic> payload) async {
    final lotId = state.selectedLotId;
    if (lotId == null) return;
    state = state.copyWith(status: TacheStatus.loading, error: null);
    try {
      final api = TacheApi(_ref.read(dioClientProvider));
      await api.createTask(projectId, lotId, payload);
      final taches = await api.listTasks(projectId, lotId);
      state = state.copyWith(status: TacheStatus.idle, taches: taches);
    } catch (_) {
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur de création de tâche');
    }
  }
}

final tacheControllerProvider = StateNotifierProvider<TacheController, TacheState>((ref) {
  return TacheController(ref);
});
