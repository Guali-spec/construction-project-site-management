import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/workers/presentation/providers/workers_controller.dart';

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

    return Scaffold(
      appBar: AppBar(title: Text('Ouvriers - ${widget.projectName}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Builder(
          builder: (context) {
            if (state.status == WorkersStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state.status == WorkersStatus.error) {
              return Center(child: Text(state.error ?? 'Erreur'));
            }
            if (state.items.isEmpty) {
              return const Center(child: Text('Aucun ouvrier'));
            }
            return ListView.builder(
              itemCount: state.items.length,
              itemBuilder: (context, index) {
                final w = state.items[index];
                return ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.person)),
                  title: Text('${w.firstName} ${w.lastName}'),
                  subtitle: Text(w.trade ?? '-'),
                );
              },
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openCreate(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _openCreate(BuildContext context) {
    final firstName = TextEditingController();
    final lastName = TextEditingController();
    final trade = TextEditingController();
    final phone = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nouvel ouvrier'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: firstName, decoration: const InputDecoration(labelText: 'Prenom')),
              TextField(controller: lastName, decoration: const InputDecoration(labelText: 'Nom')),
              TextField(controller: trade, decoration: const InputDecoration(labelText: 'Metier')),
              TextField(controller: phone, decoration: const InputDecoration(labelText: 'Telephone')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () {
              ref.read(workersControllerProvider.notifier).create(widget.projectId, {
                'firstName': firstName.text.trim(),
                'lastName': lastName.text.trim(),
                'trade': trade.text.trim(),
                'phone': phone.text.trim(),
              });
              Navigator.pop(context);
            },
            child: const Text('Creer'),
          ),
        ],
      ),
    );
  }
}
