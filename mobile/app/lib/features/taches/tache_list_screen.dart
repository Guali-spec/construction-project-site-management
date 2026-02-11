import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/taches/presentation/providers/tache_controller.dart';
import 'widgets/tache_card.dart';

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
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(tacheControllerProvider.notifier).loadPhases(widget.chantierId));
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(tacheControllerProvider);

    return Scaffold(
      appBar: AppBar(title: Text('Taches - ${widget.chantierName}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            DropdownButtonFormField<String>(
              value: state.selectedPhaseId,
              decoration: const InputDecoration(labelText: 'Phase'),
              items: state.phases
                  .map((p) => DropdownMenuItem(value: p.id, child: Text(p.name)))
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                ref.read(tacheControllerProvider.notifier).selectPhase(widget.chantierId, value);
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: state.selectedLotId,
              decoration: const InputDecoration(labelText: 'Lot'),
              items: state.lots
                  .map((l) => DropdownMenuItem(value: l.id, child: Text(l.name)))
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                ref.read(tacheControllerProvider.notifier).selectLot(widget.chantierId, value);
              },
            ),
            const SizedBox(height: 16),
            if (state.status == TacheStatus.loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (state.status == TacheStatus.error)
              Expanded(child: Center(child: Text(state.error ?? 'Erreur')))
            else if (state.taches.isEmpty)
              const Expanded(child: Center(child: Text('Aucune tache')))
            else
              Expanded(
                child: ListView.builder(
                  itemCount: state.taches.length,
                  itemBuilder: (context, index) {
                    final tache = state.taches[index];
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
