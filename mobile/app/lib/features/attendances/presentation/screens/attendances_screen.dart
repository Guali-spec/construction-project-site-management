import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/attendances/presentation/providers/attendances_controller.dart';

class AttendancesScreen extends ConsumerStatefulWidget {
  final String projectId;
  final String projectName;

  const AttendancesScreen({super.key, required this.projectId, required this.projectName});

  @override
  ConsumerState<AttendancesScreen> createState() => _AttendancesScreenState();
}

class _AttendancesScreenState extends ConsumerState<AttendancesScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(attendancesControllerProvider.notifier).load(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(attendancesControllerProvider);

    return Scaffold(
      appBar: AppBar(title: Text('Presences - ${widget.projectName}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Ouvrier'),
              items: state.workers
                  .map((w) => DropdownMenuItem(value: w.id, child: Text('${w.firstName} ${w.lastName}')))
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                ref.read(attendancesControllerProvider.notifier).checkIn(widget.projectId, value);
              },
            ),
            const SizedBox(height: 16),
            if (state.status == AttendancesStatus.loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (state.status == AttendancesStatus.error)
              Expanded(child: Center(child: Text(state.error ?? 'Erreur')))
            else if (state.items.isEmpty)
              const Expanded(child: Center(child: Text('Aucune presence')))
            else
              Expanded(
                child: ListView.builder(
                  itemCount: state.items.length,
                  itemBuilder: (context, index) {
                    final a = state.items[index];
                    return ListTile(
                      title: Text('Ouvrier: ${a.workerId}'),
                      subtitle: Text('CheckIn: ${a.checkIn ?? '-'}  CheckOut: ${a.checkOut ?? '-'}'),
                      trailing: a.checkOut == null
                          ? TextButton(
                              onPressed: () => ref.read(attendancesControllerProvider.notifier).checkOut(widget.projectId, a.id),
                              child: const Text('Check-out'),
                            )
                          : null,
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
