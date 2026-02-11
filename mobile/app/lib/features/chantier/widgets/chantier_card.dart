import 'package:flutter/material.dart';
import 'package:app/features/chantier/domain/models/chantier.dart';

class ChantierCard extends StatelessWidget {
  final Chantier chantier;
  final VoidCallback? onTap;
  final VoidCallback? onTasks;
  final VoidCallback? onWorkers;
  final VoidCallback? onAttendances;
  final VoidCallback? onPhotos;

  const ChantierCard({
    super.key,
    required this.chantier,
    this.onTap,
    this.onTasks,
    this.onWorkers,
    this.onAttendances,
    this.onPhotos,
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
        return Colors.blue;
    }
  }

  Color _cardColor(String status) {
    switch (status) {
      case 'ACTIVE':
        return Colors.green[50]!;
      case 'ON_HOLD':
        return Colors.orange[50]!;
      case 'COMPLETED':
        return Colors.blueGrey[50]!;
      case 'ARCHIVED':
        return Colors.grey[200]!;
      default:
        return Colors.blue[50]!;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'ACTIVE':
        return 'En cours';
      case 'ON_HOLD':
        return 'En pause';
      case 'COMPLETED':
        return 'Termine';
      case 'ARCHIVED':
        return 'Archive';
      case 'PLANNED':
      default:
        return 'Planifie';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: _cardColor(chantier.status),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        children: [
          ListTile(
            onTap: onTap,
            leading: const Icon(Icons.home_work, color: Colors.blue),
            title: Text(
              chantier.name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(chantier.location ?? '-'),
            trailing: Chip(
              label: Text(
                _statusLabel(chantier.status),
                style: const TextStyle(color: Colors.white),
              ),
              backgroundColor: _statusColor(chantier.status),
            ),
          ),
          if (onTasks != null || onWorkers != null || onAttendances != null || onPhotos != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Wrap(
                spacing: 8,
                runSpacing: 6,
                children: [
                  if (onTasks != null)
                    OutlinedButton.icon(
                      onPressed: onTasks,
                      icon: const Icon(Icons.checklist, size: 18),
                      label: const Text('Taches'),
                    ),
                  if (onWorkers != null)
                    OutlinedButton.icon(
                      onPressed: onWorkers,
                      icon: const Icon(Icons.people, size: 18),
                      label: const Text('Ouvriers'),
                    ),
                  if (onAttendances != null)
                    OutlinedButton.icon(
                      onPressed: onAttendances,
                      icon: const Icon(Icons.fact_check, size: 18),
                      label: const Text('Presences'),
                    ),
                  if (onPhotos != null)
                    OutlinedButton.icon(
                      onPressed: onPhotos,
                      icon: const Icon(Icons.photo_camera, size: 18),
                      label: const Text('Photos'),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
