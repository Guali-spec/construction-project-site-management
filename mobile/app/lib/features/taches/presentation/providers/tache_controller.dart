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

  Future<void> loadPhases(String projectId) async {
    state = state.copyWith(status: TacheStatus.loading, error: null);
    try {
      final api = TacheApi(_ref.read(dioClientProvider));
      final phases = await api.listPhases(projectId);
      state = state.copyWith(status: TacheStatus.idle, phases: phases, lots: [], taches: []);
    } catch (_) {
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur chargement phases');
    }
  }

  Future<void> selectPhase(String projectId, String phaseId) async {
    state = state.copyWith(status: TacheStatus.loading, selectedPhaseId: phaseId, selectedLotId: null, error: null);
    try {
      final api = TacheApi(_ref.read(dioClientProvider));
      final lots = await api.listLots(projectId, phaseId);
      state = state.copyWith(status: TacheStatus.idle, lots: lots, taches: []);
    } catch (_) {
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur chargement lots');
    }
  }

  Future<void> selectLot(String projectId, String lotId) async {
    state = state.copyWith(status: TacheStatus.loading, selectedLotId: lotId, error: null);
    try {
      final api = TacheApi(_ref.read(dioClientProvider));
      final taches = await api.listTasks(projectId, lotId);
      state = state.copyWith(status: TacheStatus.idle, taches: taches);
    } catch (_) {
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur chargement taches');
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
      state = state.copyWith(status: TacheStatus.error, error: 'Erreur mise a jour');
    }
  }
}

final tacheControllerProvider = StateNotifierProvider<TacheController, TacheState>((ref) {
  return TacheController(ref);
});
