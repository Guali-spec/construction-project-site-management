import 'package:flutter/material.dart';

class DashboardStats extends StatelessWidget {
  final int totalProjects;
  final int totalTasks;
  final int tasksInProgress;
  final int tasksToDo;
  final int tasksDone;
  final double totalExpenses; // en F CFA ou unité locale

  const DashboardStats({
    super.key,
    required this.totalProjects,
    required this.totalTasks,
    required this.tasksInProgress,
    required this.tasksToDo,
    required this.tasksDone,
    required this.totalExpenses,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Carte Projets
        Card(
          color: Colors.blue.shade100,
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            title: const Text(
              "Projets",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text("$totalProjects projets"),
            leading: const Icon(Icons.business),
          ),
        ),

        // Carte Tâches
        Card(
          color: Colors.green.shade100,
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            title: const Text(
              "Tâches",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
                "Total: $totalTasks | À faire: $tasksToDo | En cours: $tasksInProgress | Terminées: $tasksDone"),
            leading: const Icon(Icons.checklist_rtl),
          ),
        ),

        // Carte Dépenses
        Card(
          color: Colors.orange.shade100,
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            title: const Text(
              "Dépenses",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text("Total: $totalExpenses F CFA"),
            leading: const Icon(Icons.attach_money),
          ),
        ),
      ],
    );
  }
}
