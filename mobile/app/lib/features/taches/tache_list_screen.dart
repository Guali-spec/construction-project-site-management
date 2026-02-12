import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/taches/presentation/providers/tache_controller.dart';
import 'package:app/ui/app_scaffold.dart';
import 'widgets/tache_card.dart';
import 'package:app/ui/empty_state.dart';

class TacheListScreen extends ConsumerStatefulWidget {
  final String chantierId;
  final String chantierName;

  const TacheListScreen({
    super.key,
    required this.chantierId,
    required this.chantierName,
  });

  @override
  ConsumerState<TacheListScreen> createState() => _TacheListScreenState();
}

class _TacheListScreenState extends ConsumerState<TacheListScreen> {
  String _filter = 'ALL';

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(tacheControllerProvider.notifier).loadForProject(widget.chantierId));
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(tacheControllerProvider);

    return AppScaffold(
      title: 'Tâches - ${widget.chantierName}',
      currentRoute: '/taches',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _filterRow(),
            const SizedBox(height: 12),
            if (state.status == TacheStatus.loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (state.status == TacheStatus.error)
              Expanded(child: Center(child: Text(state.error ?? 'Erreur')))
            else if (state.taches.isEmpty)
              const Expanded(
                child: EmptyState(
                  title: 'Aucune tâche',
                  message: 'Ajoutez une première tâche pour ce chantier.',
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: _filtered(state.taches).length,
                  itemBuilder: (context, index) {
                    final tache = _filtered(state.taches)[index];
                    return TacheCard(
                      tache: tache,
                      onTapEdit: () => _editTache(tache),
                    );
                  },
                ),
              ),
          ],
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

  Widget _filterRow() {
    return Row(
      children: [
        _filterChip('Tous', 'ALL'),
        const SizedBox(width: 8),
        _filterChip('En cours', 'IN_PROGRESS'),
        const SizedBox(width: 8),
        _filterChip('Terminées', 'DONE'),
      ],
    );
  }

  Widget _filterChip(String label, String value) {
    final selected = _filter == value;
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => setState(() => _filter = value),
    );
  }

  List<dynamic> _filtered(List<dynamic> items) {
    if (_filter == 'ALL') return items;
    return items.where((t) => t.status == _filter).toList();
  }

  void _openCreate(BuildContext context) {
    final name = TextEditingController();
    final description = TextEditingController();
    String priority = 'MEDIUM';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nouvelle tâche'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: name, decoration: const InputDecoration(labelText: 'Titre')),
              TextField(controller: description, decoration: const InputDecoration(labelText: 'Description')),
              DropdownButtonFormField<String>(
                value: priority,
                decoration: const InputDecoration(labelText: 'Priorité'),
                items: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                    .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                    .toList(),
                onChanged: (value) => priority = value ?? 'MEDIUM',
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () {
              ref.read(tacheControllerProvider.notifier).createTask(widget.chantierId, {
                'name': name.text.trim(),
                'description': description.text.trim().isEmpty ? null : description.text.trim(),
                'status': 'TODO',
                'priority': priority,
                'progress': 0,
              });
              Navigator.pop(context);
            },
            child: const Text('Créer'),
          ),
        ],
      ),
    );
  }

  void _editTache(tache) {
    final statusOptions = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
    int progressValue = tache.progress;
    String selectedStatus = tache.status;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setStateDialog) {
            return AlertDialog(
              title: Text('Modifier "${tache.name}"'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: selectedStatus,
                    decoration: const InputDecoration(labelText: 'Statut'),
                    items: statusOptions
                        .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                        .toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setStateDialog(() => selectedStatus = value);
                      }
                    },
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Text('Progression :'),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Slider(
                          value: progressValue.toDouble(),
                          min: 0,
                          max: 100,
                          divisions: 20,
                          label: '$progressValue%',
                          onChanged: (value) {
                            setStateDialog(() => progressValue = value.toInt());
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Annuler'),
                ),
                ElevatedButton(
                  onPressed: () {
                    final lotId = ref.read(tacheControllerProvider).selectedLotId;
                    if (lotId != null) {
                      ref.read(tacheControllerProvider.notifier).updateStatus(
                        widget.chantierId,
                        lotId,
                        tache.id,
                        selectedStatus,
                        progressValue,
                      );
                    }
                    Navigator.pop(context);
                  },
                  child: const Text('Sauvegarder'),
                ),
              ],
            );
          },
        );
      },
    );
  }
}
