import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/finance/presentation/providers/expenses_controller.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/empty_state.dart';

class FinanceScreen extends ConsumerStatefulWidget {
  final String projectId;
  final String projectName;

  const FinanceScreen({super.key, required this.projectId, required this.projectName});

  @override
  ConsumerState<FinanceScreen> createState() => _FinanceScreenState();
}

class _FinanceScreenState extends ConsumerState<FinanceScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(expensesControllerProvider.notifier).load(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(expensesControllerProvider);

    return AppScaffold(
      title: 'Finances - ${widget.projectName}',
      currentRoute: '/finances',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Builder(
          builder: (context) {
            if (state.status == ExpensesStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state.status == ExpensesStatus.error) {
              return Center(child: Text(state.error ?? 'Erreur de chargement'));
            }
            if (state.items.isEmpty) {
              return const EmptyState(
                title: 'Aucune dépense',
                message: 'Ajoutez votre première dépense.',
              );
            }

            final total = state.items.fold<num>(0, (sum, e) => sum + e.amount);
            final pending = state.items.where((e) => e.status != 'APPROVED').length;
            final approved = state.items.where((e) => e.status == 'APPROVED').length;

            return Column(
              children: [
                Row(
                  children: [
                    Expanded(child: _statCard('Total', '${total.toInt()} F CFA')),
                    const SizedBox(width: 10),
                    Expanded(child: _statCard('Validées', '$approved')),
                    const SizedBox(width: 10),
                    Expanded(child: _statCard('En attente', '$pending')),
                  ],
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView.builder(
                    itemCount: state.items.length,
                    itemBuilder: (context, index) {
                      final e = state.items[index];
                      return Card(
                        child: ListTile(
                          leading: const Icon(Icons.receipt_long),
                          title: Text('${e.category} - ${e.amount} F CFA'),
                          subtitle: Text(e.description ?? '-'),
                          trailing: Chip(
                            label: Text(e.status),
                            backgroundColor: e.status == 'APPROVED' ? Colors.green[100] : Colors.orange[100],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
      actions: [
        IconButton(
          onPressed: () => _openCreate(context),
          icon: const Icon(Icons.add),
        ),
      ],
    );
  }

  void _openCreate(BuildContext context) {
    final category = TextEditingController();
    final amount = TextEditingController();
    final description = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nouvelle dépense'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: category, decoration: const InputDecoration(labelText: 'Catégorie')),
              TextField(
                controller: amount,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Montant (F CFA)'),
              ),
              TextField(controller: description, decoration: const InputDecoration(labelText: 'Description')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () {
              final value = num.tryParse(amount.text.trim()) ?? 0;
              ref.read(expensesControllerProvider.notifier).create(widget.projectId, {
                'category': category.text.trim(),
                'amount': value,
                'description': description.text.trim().isEmpty ? null : description.text.trim(),
              });
              Navigator.pop(context);
            },
            child: const Text('Créer'),
          ),
        ],
      ),
    );
  }

  Widget _statCard(String label, String value) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
