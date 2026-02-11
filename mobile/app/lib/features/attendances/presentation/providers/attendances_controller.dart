import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/attendances/data/attendances_api.dart';
import 'package:app/features/attendances/domain/models/attendance.dart';
import 'package:app/features/workers/data/workers_api.dart';
import 'package:app/features/workers/domain/models/worker.dart';

enum AttendancesStatus { idle, loading, error }

class AttendancesState {
  final AttendancesStatus status;
  final List<Attendance> items;
  final List<Worker> workers;
  final String? error;

  const AttendancesState({
    required this.status,
    this.items = const [],
    this.workers = const [],
    this.error,
  });

  AttendancesState copyWith({
    AttendancesStatus? status,
    List<Attendance>? items,
    List<Worker>? workers,
    String? error,
  }) {
    return AttendancesState(
      status: status ?? this.status,
      items: items ?? this.items,
      workers: workers ?? this.workers,
      error: error,
    );
  }

  static const initial = AttendancesState(status: AttendancesStatus.idle);
}

class AttendancesController extends StateNotifier<AttendancesState> {
  AttendancesController(this._ref) : super(AttendancesState.initial);

  final Ref _ref;

  Future<void> load(String projectId) async {
    state = state.copyWith(status: AttendancesStatus.loading, error: null);
    try {
      final api = AttendancesApi(_ref.read(dioClientProvider));
      final workersApi = WorkersApi(_ref.read(dioClientProvider));
      final items = await api.listAttendances(projectId);
      final workers = await workersApi.listWorkers(projectId);
      state = state.copyWith(status: AttendancesStatus.idle, items: items, workers: workers);
    } catch (_) {
      state = state.copyWith(status: AttendancesStatus.error, error: 'Erreur chargement presences');
    }
  }

  Future<void> checkIn(String projectId, String workerId) async {
    state = state.copyWith(status: AttendancesStatus.loading, error: null);
    try {
      final api = AttendancesApi(_ref.read(dioClientProvider));
      await api.createAttendance(projectId, workerId);
      await load(projectId);
    } catch (_) {
      state = state.copyWith(status: AttendancesStatus.error, error: 'Erreur check-in');
    }
  }

  Future<void> checkOut(String projectId, String attendanceId) async {
    state = state.copyWith(status: AttendancesStatus.loading, error: null);
    try {
      final api = AttendancesApi(_ref.read(dioClientProvider));
      await api.updateAttendance(projectId, attendanceId);
      await load(projectId);
    } catch (_) {
      state = state.copyWith(status: AttendancesStatus.error, error: 'Erreur check-out');
    }
  }
}

final attendancesControllerProvider = StateNotifierProvider<AttendancesController, AttendancesState>((ref) {
  return AttendancesController(ref);
});
