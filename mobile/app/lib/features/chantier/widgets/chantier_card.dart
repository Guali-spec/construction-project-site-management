import 'package:flutter/material.dart';
import 'package:app/features/chantier/domain/models/chantier.dart';
import 'package:app/ui/app_theme.dart';

class ChantierCard extends StatelessWidget {
  final Chantier chantier;
  final VoidCallback? onTap;
  final VoidCallback? onTasks;
  final VoidCallback? onWorkers;
  final VoidCallback? onAttendances;
  final VoidCallback? onPhotos;
  final VoidCallback? onFinance;
  final String? primaryActionLabel;

  const ChantierCard({
    super.key,
    required this.chantier,
    this.onTap,
    this.onTasks,
    this.onWorkers,
    this.onAttendances,
    this.onPhotos,
    this.onFinance,
    this.primaryActionLabel,
  });

  Color _statusColor(String status) {
    switch (status) {
      case 'ACTIVE':
        return Colors.green;
      case 'ON_HOLD':
        return Colors.orange;
      case 'COMPLETED':
        return Colors.blueGrey;
      case 'ARCHIVED':
        return Colors.grey;
      default:
        return AppColors.accent;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'ACTIVE':
        return 'En cours';
      case 'ON_HOLD':
        return 'En pause';
      case 'COMPLETED':
        return 'Terminé';
      case 'ARCHIVED':
        return 'Archivé';
      case 'PLANNED':
      default:
        return 'Planifié';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.accent.withOpacity(0.15),
                  child: const Icon(Icons.apartment, color: AppColors.accent),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(chantier.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 4),
                      Text(chantier.location ?? '-', style: const TextStyle(color: AppColors.textMuted)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: _statusColor(chantier.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _statusLabel(chantier.status),
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (chantier.budget != null)
              Text('Budget: ${chantier.budget!.toInt()} F CFA', style: const TextStyle(color: AppColors.textMuted)),
            if (chantier.progress != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Row(
                  children: [
                    const Text('Progression', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: LinearProgressIndicator(
                        value: (chantier.progress!.toDouble() / 100).clamp(0, 1),
                        minHeight: 6,
                        backgroundColor: const Color(0xFFE5E7EB),
                        color: AppColors.accent,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text('${chantier.progress!.toInt()}%', style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  ],
                ),
              ),
            const SizedBox(height: 8),
            if (primaryActionLabel != null && onTap != null)
              Align(
                alignment: Alignment.centerLeft,
                child: ElevatedButton.icon(
                  onPressed: onTap,
                  icon: const Icon(Icons.arrow_forward),
                  label: Text(primaryActionLabel!),
                ),
              )
            else if (onTasks != null || onWorkers != null || onAttendances != null || onPhotos != null || onFinance != null)
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: [
                  if (onTasks != null)
                    OutlinedButton.icon(
                      onPressed: onTasks,
                      icon: const Icon(Icons.checklist, size: 18),
                      label: const Text('Tâches'),
                    ),
                  if (onWorkers != null)
                    OutlinedButton.icon(
                      onPressed: onWorkers,
                      icon: const Icon(Icons.people, size: 18),
                      label: const Text('Ressources'),
                    ),
                  if (onAttendances != null)
                    OutlinedButton.icon(
                      onPressed: onAttendances,
                      icon: const Icon(Icons.track_changes, size: 18),
                      label: const Text('Suivi'),
                    ),
                  if (onPhotos != null)
                    OutlinedButton.icon(
                      onPressed: onPhotos,
                      icon: const Icon(Icons.photo_camera, size: 18),
                      label: const Text('Photos'),
                    ),
                  if (onFinance != null)
                    OutlinedButton.icon(
                      onPressed: onFinance,
                      icon: const Icon(Icons.account_balance_wallet, size: 18),
                      label: const Text('Finances'),
                    ),
                ],
              ),
          ],
          ),
        ),
      ),
    );
  }
}
