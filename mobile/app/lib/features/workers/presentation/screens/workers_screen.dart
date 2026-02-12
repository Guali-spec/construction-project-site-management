import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/workers/presentation/providers/workers_controller.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/empty_state.dart';

class WorkersScreen extends ConsumerStatefulWidget {
  final String projectId;
  final String projectName;

  const WorkersScreen({super.key, required this.projectId, required this.projectName});

  @override
  ConsumerState<WorkersScreen> createState() => _WorkersScreenState();
}

class _WorkersScreenState extends ConsumerState<WorkersScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(workersControllerProvider.notifier).load(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(workersControllerProvider);

    return AppScaffold(
      title: 'Ressources - ${widget.projectName}',
      currentRoute: '/ressources',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Builder(
          builder: (context) {
            if (state.status == WorkersStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state.status == WorkersStatus.error) {
              return Center(child: Text(state.error ?? 'Erreur de chargement'));
            }
            if (state.items.isEmpty) {
              return const EmptyState(
                title: 'Aucun ouvrier',
                message: 'Ajoutez votre première ressource.',
              );
            }
            return Column(
              children: [
                _statsRow(state.items.length),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView.builder(
                    itemCount: state.items.length,
                    itemBuilder: (context, index) {
                      final w = state.items[index];
                      return Card(
                        child: ListTile(
                          leading: const CircleAvatar(child: Icon(Icons.person)),
                          title: Text('${w.firstName} ${w.lastName}'),
                          subtitle: Text('${w.trade ?? '-'} | Salaire journalier: ${w.dailyRate ?? 0} F CFA'),
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
          icon: const Icon(Icons.add),
          onPressed: () => _openCreate(context),
        ),
      ],
    );
  }

  Widget _statsRow(int count) {
    return Row(
      children: [
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Total ouvriers', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 6),
                  Text('$count', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _openCreate(BuildContext context) {
    final firstName = TextEditingController();
    final lastName = TextEditingController();
    final trade = TextEditingController();
    final phone = TextEditingController();
    final dailyRate = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: MediaQuery.of(context).viewInsets.bottom + 16,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.black12, borderRadius: BorderRadius.circular(8))),
            const SizedBox(height: 12),
            const Text('Nouvel ouvrier', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(controller: firstName, decoration: const InputDecoration(labelText: 'Prénom')),
            TextField(controller: lastName, decoration: const InputDecoration(labelText: 'Nom')),
            TextField(controller: trade, decoration: const InputDecoration(labelText: 'Métier')),
            TextField(controller: phone, decoration: const InputDecoration(labelText: 'Téléphone')),
            TextField(
              controller: dailyRate,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Salaire journalier (F CFA)'),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  final rate = num.tryParse(dailyRate.text.trim());
                  ref.read(workersControllerProvider.notifier).create(widget.projectId, {
                    'firstName': firstName.text.trim(),
                    'lastName': lastName.text.trim(),
                    'trade': trade.text.trim(),
                    'phone': phone.text.trim(),
                    if (rate != null) 'dailyRate': rate,
                  });
                  Navigator.pop(context);
                },
                child: const Text('Créer'),
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Annuler'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
