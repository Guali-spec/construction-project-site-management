import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/chantier/presentation/providers/chantier_controller.dart';
import 'widgets/chantier_card.dart';
import '../taches/tache_list_screen.dart';
import '../workers/presentation/screens/workers_screen.dart';
import '../attendances/presentation/screens/attendances_screen.dart';
import '../photos/presentation/screens/photos_screen.dart';

class ChantierListScreen extends ConsumerStatefulWidget {
  const ChantierListScreen({super.key});

  @override
  ConsumerState<ChantierListScreen> createState() => _ChantierListScreenState();
}

class _ChantierListScreenState extends ConsumerState<ChantierListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(chantierControllerProvider.notifier).load());
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(chantierControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Chantiers')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Builder(
          builder: (context) {
            if (state.status == ChantierStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state.status == ChantierStatus.error) {
              return Center(child: Text(state.error ?? 'Erreur'));
            }
            if (state.items.isEmpty) {
              return const Center(child: Text('Aucun chantier'));
            }

            return ListView.builder(
              itemCount: state.items.length,
              itemBuilder: (context, index) {
                final chantier = state.items[index];
                return ChantierCard(
                  chantier: chantier,
                  onTasks: () => _openTasks(context, chantier.id, chantier.name),
                  onWorkers: () => _openWorkers(context, chantier.id, chantier.name),
                  onAttendances: () => _openAttendances(context, chantier.id, chantier.name),
                  onPhotos: () => _openPhotos(context, chantier.id, chantier.name),
                );
              },
            );
          },
        ),
      ),
    );
  }

  void _openTasks(BuildContext context, String projectId, String projectName) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => TacheListScreen(
          chantierId: projectId,
          chantierName: projectName,
        ),
      ),
    );
  }

  void _openWorkers(BuildContext context, String projectId, String projectName) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => WorkersScreen(
          projectId: projectId,
          projectName: projectName,
        ),
      ),
    );
  }

  void _openAttendances(BuildContext context, String projectId, String projectName) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AttendancesScreen(
          projectId: projectId,
          projectName: projectName,
        ),
      ),
    );
  }

  void _openPhotos(BuildContext context, String projectId, String projectName) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PhotosScreen(
          projectId: projectId,
          projectName: projectName,
        ),
      ),
    );
  }
}
