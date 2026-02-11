class Tache {
  final String id;
  final String name;
  final String status;
  final int progress;
  final String priority;

  Tache({
    required this.id,
    required this.name,
    required this.status,
    required this.progress,
    required this.priority,
  });

  factory Tache.fromJson(Map<String, dynamic> json) {
    return Tache(
      id: json['id'] as String,
      name: json['name'] as String,
      status: (json['status'] as String?) ?? 'TODO',
      progress: (json['progress'] as int?) ?? 0,
      priority: (json['priority'] as String?) ?? 'MEDIUM',
    );
  }
}
