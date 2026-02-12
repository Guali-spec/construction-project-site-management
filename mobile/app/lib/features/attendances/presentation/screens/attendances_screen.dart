import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/attendances/presentation/providers/attendances_controller.dart';
import 'package:app/features/workers/domain/models/worker.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/empty_state.dart';

class AttendancesScreen extends ConsumerStatefulWidget {
  final String projectId;
  final String projectName;

  const AttendancesScreen({super.key, required this.projectId, required this.projectName});

  @override
  ConsumerState<AttendancesScreen> createState() => _AttendancesScreenState();
}

class _AttendancesScreenState extends ConsumerState<AttendancesScreen> {
  String? _selectedWorkerId;
  bool _present = true;
  final _notesController = TextEditingController();
  final _dateController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _dateController.text = DateTime.now().toIso8601String().split('T').first;
    Future.microtask(() => ref.read(attendancesControllerProvider.notifier).load(widget.projectId));
  }

  @override
  void dispose() {
    _notesController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(attendancesControllerProvider);
    final workers = state.workers;

    return AppScaffold(
      title: 'Suivi - ${widget.projectName}',
      currentRoute: '/suivi',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    DropdownButtonFormField<String>(
                      value: _selectedWorkerId,
                      decoration: const InputDecoration(labelText: 'Ouvrier'),
                      items: workers
                          .map((w) => DropdownMenuItem(value: w.id, child: Text('${w.firstName} ${w.lastName}')))
                          .toList(),
                      onChanged: (value) => setState(() => _selectedWorkerId = value),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _dateController,
                      decoration: const InputDecoration(labelText: 'Date (YYYY-MM-DD)'),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        const Text('Présence'),
                        const SizedBox(width: 12),
                        Switch(
                          value: _present,
                          onChanged: (value) => setState(() => _present = value),
                        ),
                        Text(_present ? 'Présent' : 'Absent'),
                      ],
                    ),
                    TextField(
                      controller: _notesController,
                      decoration: const InputDecoration(labelText: 'Notes (optionnel)'),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: state.status == AttendancesStatus.loading ? null : _submit,
                        child: const Text('Enregistrer la présence'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (state.status == AttendancesStatus.loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (state.status == AttendancesStatus.error)
              Expanded(child: Center(child: Text(state.error ?? 'Erreur de chargement')))
            else if (state.items.isEmpty)
              const Expanded(
                child: EmptyState(
                  title: 'Aucune présence',
                  message: 'Enregistrez la première présence du chantier.',
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: state.items.length,
                  itemBuilder: (context, index) {
                    final a = state.items[index];
                    final worker = workers.firstWhere(
                      (w) => w.id == a.workerId,
                      orElse: () => Worker(id: a.workerId, firstName: '-', lastName: '-'),
                    );
                    final workerName = '${worker.firstName} ${worker.lastName}';
                    return Card(
                      child: ListTile(
                        title: Text(workerName),
                        subtitle: Text('Date: ${a.date} | ${a.present == true ? 'Présent' : 'Absent'}'),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _submit() {
    final workerId = _selectedWorkerId;
    if (workerId == null || workerId.isEmpty) return;
    ref.read(attendancesControllerProvider.notifier).create(
          projectId: widget.projectId,
          workerId: workerId,
          date: _dateController.text.trim(),
          present: _present,
          notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
        );
  }
}
