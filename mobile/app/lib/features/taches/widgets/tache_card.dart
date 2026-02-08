import 'package:flutter/material.dart';
import '../models/tache.dart';

class TacheCard extends StatelessWidget {
  final Tache tache;
  final VoidCallback? onTapEdit;
  final VoidCallback? onTapDelete;

  const TacheCard({
    super.key,
    required this.tache,
    this.onTapEdit,
    this.onTapDelete,
  });

  Color _statusColor(String status) {
    switch (status) {
      case 'a_faire':
        return Colors.grey;
      case 'en_cours':
        return Colors.blue;
      case 'terminee':
        return Colors.green;
      case 'bloquee':
        return Colors.red;
      default:
        return Colors.grey;
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
            // 🔹 Titre
            Text(
              tache.title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),

            // 🔹 Statut + Chip
            Row(
              children: [
                Chip(
                  label: Text(
                    tache.status,
                    style: const TextStyle(color: Colors.white),
                  ),
                  backgroundColor: _statusColor(tache.status),
                ),
                const Spacer(),
                Text("Progression : ${tache.progress}%"),
              ],
            ),

            const SizedBox(height: 8),

            // 🔹 Barre de progression visuelle
            LinearProgressIndicator(
              value: tache.progress / 100,
              backgroundColor: Colors.grey[300],
              color: _statusColor(tache.status),
              minHeight: 8,
            ),

            const SizedBox(height: 8),

            // 🔹 Actions (éditer + supprimer)
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit, color: Colors.orange),
                  onPressed: onTapEdit,
                  tooltip: "Modifier",
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: onTapDelete,
                  tooltip: "Supprimer",
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}