class Chantier {
  final String id;
  final String name;
  final String? description;
  final String? location;
  final String status;
  final String? startDate;
  final String? endDate;
  final num? budget;
  final num? progress;

  Chantier({
    required this.id,
    required this.name,
    required this.status,
    this.description,
    this.location,
    this.startDate,
    this.endDate,
    this.budget,
    this.progress,
  });

  factory Chantier.fromJson(Map<String, dynamic> json) {
    return Chantier(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      location: json['location'] as String?,
      status: (json['status'] as String?) ?? 'PLANNED',
      startDate: json['startDate'] as String?,
      endDate: json['endDate'] as String?,
      budget: json['budget'] is num
          ? json['budget'] as num
          : num.tryParse(json['budget']?.toString() ?? ''),
      progress: json['progress'] as num?,
    );
  }
}
