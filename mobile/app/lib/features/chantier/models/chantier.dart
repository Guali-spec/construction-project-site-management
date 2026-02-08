class Chantier {
  final String id;
  final String name;
  final String status;
  final String location;

  // ⚡ Nouveau champ temporaire pour le nombre de tâches
  final int taskCount;

  Chantier({
    required this.id,
    required this.name,
    required this.status,
    required this.location,
    this.taskCount = 0,
  });
}
