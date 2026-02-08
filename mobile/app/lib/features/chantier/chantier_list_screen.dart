import 'package:flutter/material.dart';
import 'models/chantier.dart';
import 'widgets/chantier_card.dart';
import '../taches/tache_list_screen.dart';

class ChantierListScreen extends StatelessWidget {
  const ChantierListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final chantiers = [
  Chantier(
    id: '1',
    name: 'Immeuble R+3',
    status: 'en cours',
    location: 'Ouagadougou',
    taskCount: 5,
  ),
  Chantier(
    id: '2',
    name: 'Villa Duplex',
    status: 'suspendu',
    location: 'Koudougou',
    taskCount: 2,
  ),
  Chantier(
    id: '3',
    name: 'École primaire',
    status: 'terminé',
    location: 'Bobo-Dioulasso',
    taskCount: 8,
  ),
];

    return Scaffold(
      appBar: AppBar(title: const Text("Chantiers")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔹 Message de bienvenue
            const Text(
              "Bienvenue sur vos chantiers 👷‍♂️",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            // 🔹 Liste des chantiers
            Expanded(
              child: ListView.builder(
                itemCount: chantiers.length,
                itemBuilder: (context, index) {
                  final chantier = chantiers[index];

                  return ChantierCard(
                    chantier: chantier,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => TacheListScreen(
                            chantierId: chantier.id,
                            chantierName: chantier.name,
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
