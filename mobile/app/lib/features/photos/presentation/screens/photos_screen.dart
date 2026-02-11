import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/photos/presentation/providers/photos_controller.dart';

class PhotosScreen extends ConsumerStatefulWidget {
  final String projectId;
  final String projectName;

  const PhotosScreen({super.key, required this.projectId, required this.projectName});

  @override
  ConsumerState<PhotosScreen> createState() => _PhotosScreenState();
}

class _PhotosScreenState extends ConsumerState<PhotosScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(photosControllerProvider.notifier).load(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(photosControllerProvider);

    return Scaffold(
      appBar: AppBar(title: Text('Photos - ${widget.projectName}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            if (state.status == PhotosStatus.loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (state.status == PhotosStatus.error)
              Expanded(child: Center(child: Text(state.error ?? 'Erreur')))
            else if (state.items.isEmpty)
              const Expanded(child: Center(child: Text('Aucune photo')))
            else
              Expanded(
                child: ListView.builder(
                  itemCount: state.items.length,
                  itemBuilder: (context, index) {
                    final p = state.items[index];
                    return ListTile(
                      title: Text(p.caption ?? 'Photo'),
                      subtitle: Text(p.url),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openCreate(context),
        child: const Icon(Icons.add_a_photo),
      ),
    );
  }

  void _openCreate(BuildContext context) {
    final url = TextEditingController();
    final caption = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Ajouter une photo (URL)'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: url, decoration: const InputDecoration(labelText: 'URL')),
              TextField(controller: caption, decoration: const InputDecoration(labelText: 'Legende')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () {
              ref.read(photosControllerProvider.notifier).create(widget.projectId, url.text.trim(), caption.text.trim());
              Navigator.pop(context);
            },
            child: const Text('Ajouter'),
          ),
        ],
      ),
    );
  }
}
