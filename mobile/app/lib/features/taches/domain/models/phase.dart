class Phase {
  final String id;
  final String name;
  final int? order;

  Phase({required this.id, required this.name, this.order});

  factory Phase.fromJson(Map<String, dynamic> json) {
    return Phase(
      id: json['id'] as String,
      name: json['name'] as String,
      order: json['order'] as int?,
    );
  }
}
