class Lot {
  final String id;
  final String name;
  final int? order;

  Lot({required this.id, required this.name, this.order});

  factory Lot.fromJson(Map<String, dynamic> json) {
    return Lot(
      id: json['id'] as String,
      name: json['name'] as String,
      order: json['order'] as int?,
    );
  }
}
