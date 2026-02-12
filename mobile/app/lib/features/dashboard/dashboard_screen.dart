import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/chantier/data/chantier_api.dart';
import 'package:app/core/providers.dart';
import 'package:app/features/auth/presentation/providers/auth_controller.dart';
import 'package:app/features/chantier/chantier_list_screen.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/app_theme.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  Future<Map<String, num>> _loadStats() async {
    final api = ChantierApi(ref.read(dioClientProvider));
    final projects = await api.listChantiers();

    final totalProjects = projects.length;
    final completed = projects.where((p) => p.status == 'COMPLETED').length;
    final active = projects.where((p) => p.status == 'ACTIVE').length;
    final planned = projects.where((p) => p.status == 'PLANNED').length;
    final totalBudget = projects.fold<num>(0, (sum, p) => sum + (p.budget ?? 0));
    final avgProgress = projects.isEmpty
        ? 0
        : projects.map((p) => p.progress ?? 0).fold<num>(0, (sum, value) => sum + value) / projects.length;

    return {
      'totalProjects': totalProjects,
      'completed': completed,
      'active': active,
      'planned': planned,
      'totalBudget': totalBudget,
      'avgProgress': avgProgress,
    };
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final role = auth.user?.role;

    if (role == 'SUPERVISEUR') {
      return AppScaffold(
        title: 'Dashboard',
        currentRoute: '/dashboard',
        body: Center(
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ChantierListScreen()),
              );
            },
            child: const Text('Accéder aux chantiers'),
          ),
        ),
      );
    }

    return AppScaffold(
      title: 'Dashboard',
      currentRoute: '/dashboard',
      body: FutureBuilder<Map<String, num>>(
        future: _loadStats(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || !snapshot.hasData) {
            return const Center(child: Text('Erreur chargement dashboard'));
          }

          final stats = snapshot.data!;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Résumé', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    _statCard('Chantiers', stats['totalProjects']!.toInt().toString()),
                    _statCard('En cours', stats['active']!.toInt().toString(), highlight: true),
                    _statCard('Planifiés', stats['planned']!.toInt().toString()),
                    _statCard('Terminés', stats['completed']!.toInt().toString()),
                    _statCard('Budget total', '${stats['totalBudget']!.toInt()} F CFA'),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('Progression moyenne', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: (stats['avgProgress']!.toDouble() / 100).clamp(0, 1),
                  minHeight: 10,
                ),
                const SizedBox(height: 6),
                Text('${stats['avgProgress']!.toStringAsFixed(0)} %', style: const TextStyle(color: AppColors.textMuted)),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _statCard(String label, String value, {bool highlight = false}) {
    return SizedBox(
      width: 220,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: AppColors.textMuted)),
              const SizedBox(height: 6),
              Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: highlight ? AppColors.accent : AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
