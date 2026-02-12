import 'package:flutter/material.dart';
import 'package:app/features/taches/domain/models/tache.dart';

class TacheCard extends StatelessWidget {
  final Tache tache;
  final VoidCallback? onTapEdit;

  const TacheCard({
    super.key,
    required this.tache,
    this.onTapEdit,
  });

  Color _statusColor(String status) {
    switch (status) {
      case 'IN_PROGRESS':
        return Colors.blue;
      case 'DONE':
        return Colors.green;
      case 'BLOCKED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'IN_PROGRESS':
        return 'En cours';
      case 'DONE':
        return 'Terminée';
      case 'BLOCKED':
        return 'Bloquée';
      default:
        return 'À faire';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              tache.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Chip(
                  label: Text(
                    _statusLabel(tache.status),
                    style: const TextStyle(color: Colors.white),
                  ),
                  backgroundColor: _statusColor(tache.status),
                ),
                const Spacer(),
                Text('Progression : ${tache.progress}%'),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: tache.progress / 100,
              backgroundColor: Colors.grey[300],
              color: _statusColor(tache.status),
              minHeight: 8,
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: onTapEdit,
                child: const Text('Modifier'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
