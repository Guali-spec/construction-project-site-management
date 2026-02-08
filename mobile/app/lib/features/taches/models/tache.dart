class Tache {
  final String id;
  final String title;
  String status; // a_faire, en_cours, terminee, bloquee
  int progress;  // 0 à 100
  final String chantierId;

  Tache({
    required this.id,
    required this.title,
    required this.status,
    required this.progress,
    required this.chantierId,
  });
}
