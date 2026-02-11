class PhotoItem {
  final String id;
  final String url;
  final String? caption;

  PhotoItem({required this.id, required this.url, this.caption});

  factory PhotoItem.fromJson(Map<String, dynamic> json) {
    return PhotoItem(
      id: json['id'] as String,
      url: json['url'] as String,
      caption: json['caption'] as String?,
    );
  }
}
