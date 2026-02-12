import 'package:flutter/material.dart';
import 'package:app/ui/app_scaffold.dart';

class ReportsScreen extends StatelessWidget {
  final String projectId;
  final String projectName;

  const ReportsScreen({super.key, required this.projectId, required this.projectName});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Rapports - $projectName',
      currentRoute: '/rapports',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: const [
                Expanded(
                  child: Text(
                    'Génération de rapports',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.picture_as_pdf),
                title: const Text('Rapport PDF'),
                subtitle: const Text('Résumé du chantier'),
                trailing: ElevatedButton(
                  onPressed: null,
                  child: Text('Générer'),
                ),
              ),
            ),
            Card(
              child: ListTile(
                leading: const Icon(Icons.table_chart),
                title: const Text('Rapport CSV'),
                subtitle: const Text('Dépenses, tâches, ressources'),
                trailing: ElevatedButton(
                  onPressed: null,
                  child: Text('Exporter'),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Center(
                child: Text('Rapports en cours de préparation'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
