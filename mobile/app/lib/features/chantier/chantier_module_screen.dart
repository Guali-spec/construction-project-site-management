import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/chantier/presentation/providers/chantier_controller.dart';
import 'package:app/features/chantier/widgets/chantier_card.dart';
import 'package:app/ui/app_scaffold.dart';
import '../taches/tache_list_screen.dart';
import '../workers/presentation/screens/workers_screen.dart';
import '../attendances/presentation/screens/attendances_screen.dart';
import '../photos/presentation/screens/photos_screen.dart';
import '../finance/presentation/screens/finance_screen.dart';
import '../reports/reports_screen.dart';

enum ChantierModule {
  tasks,
  photos,
  suivi,
  ressources,
  finances,
  rapports,
}

extension ChantierModuleX on ChantierModule {
  String get title {
    switch (this) {
      case ChantierModule.tasks:
        return 'Tâches';
      case ChantierModule.photos:
        return 'Photos';
      case ChantierModule.suivi:
        return "Suivi d'avancement";
      case ChantierModule.ressources:
        return 'Ressources';
      case ChantierModule.finances:
        return 'Finances';
      case ChantierModule.rapports:
        return 'Rapports';
    }
  }

  String get route {
    switch (this) {
      case ChantierModule.tasks:
        return '/taches';
      case ChantierModule.photos:
        return '/photos';
      case ChantierModule.suivi:
        return '/suivi';
      case ChantierModule.ressources:
        return '/ressources';
      case ChantierModule.finances:
        return '/finances';
      case ChantierModule.rapports:
        return '/rapports';
    }
  }
}

class ChantierModuleScreen extends ConsumerStatefulWidget {
  final ChantierModule module;

  const ChantierModuleScreen({super.key, required this.module});

  @override
  ConsumerState<ChantierModuleScreen> createState() => _ChantierModuleScreenState();
}

class _ChantierModuleScreenState extends ConsumerState<ChantierModuleScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(chantierControllerProvider.notifier).load());
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(chantierControllerProvider);

    return AppScaffold(
      title: widget.module.title,
      currentRoute: widget.module.route,
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
                  primaryActionLabel: 'Ouvrir',
                  onTap: () => _openModule(context, chantier.id, chantier.name),
                );
              },
            );
          },
        ),
      ),
    );
  }

  void _openModule(BuildContext context, String projectId, String projectName) {
    switch (widget.module) {
      case ChantierModule.tasks:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => TacheListScreen(
              chantierId: projectId,
              chantierName: projectName,
            ),
          ),
        );
        break;
      case ChantierModule.photos:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PhotosScreen(
              projectId: projectId,
              projectName: projectName,
            ),
          ),
        );
        break;
      case ChantierModule.suivi:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AttendancesScreen(
              projectId: projectId,
              projectName: projectName,
            ),
          ),
        );
        break;
      case ChantierModule.ressources:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => WorkersScreen(
              projectId: projectId,
              projectName: projectName,
            ),
          ),
        );
        break;
      case ChantierModule.finances:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => FinanceScreen(
              projectId: projectId,
              projectName: projectName,
            ),
          ),
        );
        break;
      case ChantierModule.rapports:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ReportsScreen(projectId: projectId, projectName: projectName),
          ),
        );
        break;
    }
  }
}
