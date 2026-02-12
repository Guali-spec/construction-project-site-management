import 'package:app/core/network/dio_client.dart';
import 'package:app/features/finance/domain/models/expense.dart';

class ExpensesApi {
  ExpensesApi(this._client);
  final DioClient _client;

  Future<List<Expense>> listExpenses(String projectId) async {
    final res = await _client.dio.get('/projects/$projectId/expenses');
    final data = res.data as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Expense.fromJson).toList();
  }

  Future<Expense> createExpense(String projectId, Map<String, dynamic> payload) async {
    final res = await _client.dio.post('/projects/$projectId/expenses', data: payload);
    return Expense.fromJson(res.data as Map<String, dynamic>);
  }
}
