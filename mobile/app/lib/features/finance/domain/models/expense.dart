class Expense {
  final String id;
  final String category;
  final num amount;
  final String status;
  final String? description;

  Expense({
    required this.id,
    required this.category,
    required this.amount,
    required this.status,
    this.description,
  });

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'] as String,
      category: (json['category'] as String?) ?? '-',
      amount: (json['amount'] as num?) ?? 0,
      status: (json['status'] as String?) ?? 'PENDING',
      description: json['description'] as String?,
    );
  }
}
