import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/finance/data/expenses_api.dart';
import 'package:app/features/finance/domain/models/expense.dart';

enum ExpensesStatus { idle, loading, error }

class ExpensesState {
  final ExpensesStatus status;
  final List<Expense> items;
  final String? error;

  const ExpensesState({
    required this.status,
    this.items = const [],
    this.error,
  });

  ExpensesState copyWith({
    ExpensesStatus? status,
    List<Expense>? items,
    String? error,
  }) {
    return ExpensesState(
      status: status ?? this.status,
      items: items ?? this.items,
      error: error,
    );
  }

  static const initial = ExpensesState(status: ExpensesStatus.idle);
}

class ExpensesController extends StateNotifier<ExpensesState> {
  ExpensesController(this._ref) : super(ExpensesState.initial);

  final Ref _ref;

  Future<void> load(String projectId) async {
    state = state.copyWith(status: ExpensesStatus.loading, error: null);
    try {
      final api = ExpensesApi(_ref.read(dioClientProvider));
      final items = await api.listExpenses(projectId);
      state = state.copyWith(status: ExpensesStatus.idle, items: items);
    } catch (_) {
      state = state.copyWith(status: ExpensesStatus.error, error: 'Erreur de chargement des dépenses');
    }
  }

  Future<void> create(String projectId, Map<String, dynamic> payload) async {
    state = state.copyWith(status: ExpensesStatus.loading, error: null);
    try {
      final api = ExpensesApi(_ref.read(dioClientProvider));
      await api.createExpense(projectId, payload);
      final items = await api.listExpenses(projectId);
      state = state.copyWith(status: ExpensesStatus.idle, items: items);
    } catch (_) {
      state = state.copyWith(status: ExpensesStatus.error, error: 'Erreur de création de la dépense');
    }
  }
}

final expensesControllerProvider = StateNotifierProvider<ExpensesController, ExpensesState>((ref) {
  return ExpensesController(ref);
});
