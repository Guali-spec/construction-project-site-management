import 'package:flutter/material.dart';
import 'package:app/features/chantier/domain/models/chantier.dart';
import 'package:app/features/photos/presentation/screens/photos_screen.dart';
import 'package:app/features/taches/tache_list_screen.dart';
import 'package:app/features/attendances/presentation/screens/attendances_screen.dart';
import 'package:app/features/workers/presentation/screens/workers_screen.dart';
import 'package:app/features/finance/presentation/screens/finance_screen.dart';
import 'package:app/features/reports/reports_screen.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/app_theme.dart';

class ChantierDetailsScreen extends StatelessWidget {
  final Chantier chantier;

  const ChantierDetailsScreen({super.key, required this.chantier});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: chantier.name,
      currentRoute: '/chantiers',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _headerCard(),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _infoCard('Localisation', chantier.location ?? '-'),
                _infoCard('Dates', _formatDates()),
                _infoCard('Budget', _formatBudget()),
              ],
            ),
            const SizedBox(height: 16),
            _progressCard(),
            const SizedBox(height: 16),
            const Text(
              'Actions rapides',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _actionsGrid(context),
          ],
        ),
      ),
    );
  }

  Widget _headerCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              radius: 22,
              backgroundColor: AppColors.accent.withOpacity(0.2),
              child: const Icon(Icons.apartment, color: AppColors.accent),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(chantier.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(chantier.description ?? '-', style: const TextStyle(color: AppColors.textMuted)),
                  const SizedBox(height: 8),
                  _statusPill(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statusPill() {
    String label;
    Color color;
    switch (chantier.status) {
      case 'ACTIVE':
        label = 'En cours';
        color = Colors.green;
        break;
      case 'ON_HOLD':
        label = 'En pause';
        color = Colors.orange;
        break;
      case 'COMPLETED':
        label = 'Terminé';
        color = Colors.blueGrey;
        break;
      case 'ARCHIVED':
        label = 'Archivé';
        color = Colors.grey;
        break;
      default:
        label = 'Planifié';
        color = AppColors.accent;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(20)),
      child: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
    );
  }

  Widget _infoCard(String label, String value) {
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
              Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _progressCard() {
    final progress = (chantier.progress ?? 0).toDouble().clamp(0, 100);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Progression', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: progress / 100,
              minHeight: 8,
              backgroundColor: const Color(0xFFE5E7EB),
              color: AppColors.accent,
            ),
            const SizedBox(height: 6),
            Text('${progress.toInt()} %', style: const TextStyle(color: AppColors.textMuted)),
          ],
        ),
      ),
    );
  }

  Widget _actionsGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _actionTile(
          icon: Icons.checklist,
          label: 'Tâches',
          onTap: () => _open(context, TacheListScreen(chantierId: chantier.id, chantierName: chantier.name)),
        ),
        _actionTile(
          icon: Icons.photo_camera,
          label: 'Photos',
          onTap: () => _open(context, PhotosScreen(projectId: chantier.id, projectName: chantier.name)),
        ),
        _actionTile(
          icon: Icons.track_changes,
          label: "Suivi d'avancement",
          onTap: () => _open(context, AttendancesScreen(projectId: chantier.id, projectName: chantier.name)),
        ),
        _actionTile(
          icon: Icons.people,
          label: 'Ressources',
          onTap: () => _open(context, WorkersScreen(projectId: chantier.id, projectName: chantier.name)),
        ),
        _actionTile(
          icon: Icons.account_balance_wallet,
          label: 'Finances',
          onTap: () => _open(context, FinanceScreen(projectId: chantier.id, projectName: chantier.name)),
        ),
        _actionTile(
          icon: Icons.article,
          label: 'Rapports',
          onTap: () => _open(context, ReportsScreen(projectId: chantier.id, projectName: chantier.name)),
        ),
      ],
    );
  }

  Widget _actionTile({required IconData icon, required String label, required VoidCallback onTap}) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: AppColors.accent),
              const SizedBox(height: 8),
              Text(label, textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDates() {
    final start = _parseDate(chantier.startDate);
    final end = _parseDate(chantier.endDate);
    if (start == null && end == null) return '-';
    String fmt(DateTime d) => '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
    if (start != null && end != null) return '${fmt(start)} → ${fmt(end)}';
    if (start != null) return fmt(start);
    return fmt(end!);
  }

  DateTime? _parseDate(String? value) {
    if (value == null || value.isEmpty) return null;
    return DateTime.tryParse(value);
  }

  String _formatBudget() {
    final budget = chantier.budget;
    if (budget == null) return '-';
    return '${budget.toInt()} F CFA';
  }

  void _open(BuildContext context, Widget screen) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
  }
}
