import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/chantier/data/chantier_api.dart';
import 'package:app/features/chantier/domain/models/chantier.dart';

enum ChantierStatus { idle, loading, error }

class ChantierState {
  final ChantierStatus status;
  final List<Chantier> items;
  final String? error;

  const ChantierState({
    required this.status,
    this.items = const [],
    this.error,
  });

  ChantierState copyWith({
    ChantierStatus? status,
    List<Chantier>? items,
    String? error,
  }) {
    return ChantierState(
      status: status ?? this.status,
      items: items ?? this.items,
      error: error,
    );
  }

  static const initial = ChantierState(status: ChantierStatus.idle);
}

class ChantierController extends StateNotifier<ChantierState> {
  ChantierController(this._ref) : super(ChantierState.initial);

  final Ref _ref;

  Future<void> load() async {
    state = state.copyWith(status: ChantierStatus.loading, error: null);
    try {
      final api = ChantierApi(_ref.read(dioClientProvider));
      final items = await api.listChantiers();
      state = state.copyWith(status: ChantierStatus.idle, items: items);
    } catch (e) {
      if (e is DioException) {
        final status = e.response?.statusCode;
        if (status == 401 || status == 403) {
          state = state.copyWith(status: ChantierStatus.error, error: 'Non autorise. Reconnectez-vous.');
          return;
        }
        state = state.copyWith(
          status: ChantierStatus.error,
          error: 'Erreur de chargement (${status ?? 'reseau'})',
        );
        return;
      }
      state = state.copyWith(status: ChantierStatus.error, error: 'Erreur de chargement');
    }
  }
}

final chantierControllerProvider = StateNotifierProvider<ChantierController, ChantierState>((ref) {
  return ChantierController(ref);
});
