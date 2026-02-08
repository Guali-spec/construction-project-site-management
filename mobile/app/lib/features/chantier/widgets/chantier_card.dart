import 'package:flutter/material.dart';
import '../models/chantier.dart';

class ChantierCard extends StatelessWidget {
  final Chantier chantier;
  final VoidCallback? onTap;

  const ChantierCard({
    super.key,
    required this.chantier,
    this.onTap,
  });

  // Couleur du statut pour le Chip
  Color _statusColor(String status) {
    switch (status) {
      case 'en cours':
        return Colors.green;
      case 'suspendu':
        return Colors.orange;
      case 'terminé':
        return Colors.grey;
      default:
        return Colors.blue;
    }
  }

  // Couleur de fond de la carte selon le statut
  Color _cardColor(String status) {
    switch (status) {
      case 'en cours':
        return Colors.green[50]!;
      case 'suspendu':
        return Colors.orange[50]!;
      case 'terminé':
        return Colors.grey[200]!;
      default:
        return Colors.blue[50]!;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: _cardColor(chantier.status),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        onTap: onTap,
        leading: const Icon(Icons.home_work, color: Colors.blue),
        title: Text(
          chantier.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Row(
          children: [
            Text(chantier.location),
            const SizedBox(width: 12),
            Chip(
              label: Text('${chantier.taskCount} tâches'),
              backgroundColor: Colors.blue[100],
              visualDensity: VisualDensity.compact,
            ),
          ],
        ),
        trailing: Chip(
          label: Text(
            chantier.status,
            style: const TextStyle(color: Colors.white),
          ),
          backgroundColor: _statusColor(chantier.status),
        ),
      ),
    );
  }
}
