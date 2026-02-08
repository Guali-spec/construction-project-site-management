import 'package:flutter/material.dart';
import 'models/dashboard_stats.dart';
import 'widgets/dashboard_card.dart';
import '../chantier/chantier_list_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final stats = DashboardStats(
      totalProjects: 3,
      totalTasks: 8,
      tasksToDo: 3,
      tasksInProgress: 2,
      tasksDone: 3,
      totalExpenses: 1250000,
    );

    if (stats.totalProjects == 0) {
      return const Scaffold(
        body: Center(
          child: Text(
            "Aucune donnée disponible",
            style: TextStyle(color: Colors.grey, fontSize: 16),
          ),
        ),
      );
    }

    final double progress =
        stats.totalTasks == 0 ? 0 : stats.tasksDone / stats.totalTasks;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/login');
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Bienvenue 👋",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            DashboardCard(
              title: "Projets",
              value: stats.totalProjects.toString(),
              icon: Icons.location_city,
              color: Colors.blue,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ChantierListScreen(),
                  ),
                );
              },
            ),

            DashboardCard(
              title: "Tâches",
              value: stats.totalTasks.toString(),
              icon: Icons.task_alt,
              color: Colors.green,
              onTap: () {},
            ),

            DashboardCard(
              title: "Dépenses (FCFA)",
              value: stats.totalExpenses.toString(),
              icon: Icons.attach_money,
              color: Colors.orange,
              onTap: () {},
            ),

            const SizedBox(height: 20),
            const Text(
              "Progression des tâches",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            LinearProgressIndicator(
              value: progress,
              minHeight: 10,
              backgroundColor: Colors.grey.shade300,
              color: Colors.green,
            ),

            const SizedBox(height: 8),
            Text(
              "${(progress * 100).toInt()} % terminées",
              style: const TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
