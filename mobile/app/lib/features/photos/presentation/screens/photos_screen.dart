import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:app/features/photos/presentation/providers/photos_controller.dart';
import 'package:app/core/config/env.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/empty_state.dart';

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

    return AppScaffold(
      title: 'Photos - ${widget.projectName}',
      currentRoute: '/photos',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Galerie du chantier',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                IconButton(
                  tooltip: 'Rafraîchir',
                  onPressed: () => ref.read(photosControllerProvider.notifier).load(widget.projectId),
                  icon: const Icon(Icons.refresh),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (state.status == PhotosStatus.loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (state.status == PhotosStatus.error)
              Expanded(child: Center(child: Text(state.error ?? 'Erreur de chargement')))
            else if (state.items.isEmpty)
              const Expanded(
                child: EmptyState(
                  title: 'Aucune photo',
                  message: 'Ajoutez la première photo du chantier.',
                ),
              )
            else
              Expanded(
                child: GridView.builder(
                  itemCount: state.items.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1,
                  ),
                  itemBuilder: (context, index) {
                    final p = state.items[index];
                    final url = _resolveUrl(p.url);
                    return GestureDetector(
                      onTap: () => _openViewer(context, url, p.caption ?? ''),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.network(
                              url,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => const Center(child: Icon(Icons.broken_image)),
                            ),
                            if ((p.caption ?? '').isNotEmpty)
                              Align(
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                                  color: Colors.black54,
                                  child: Text(
                                    p.caption!,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(color: Colors.white, fontSize: 12),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.add_a_photo),
          onPressed: () => _openCreate(context),
        ),
      ],
    );
  }

  String _resolveUrl(String url) {
    if (url.startsWith('http')) return url;
    final base = Env.apiBaseUrl.replaceAll('/api/v1', '');
    return '$base$url';
  }

  void _openCreate(BuildContext context) {
    final caption = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: MediaQuery.of(context).viewInsets.bottom + 16,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.black12, borderRadius: BorderRadius.circular(8))),
            const SizedBox(height: 12),
            const Text('Ajouter une photo', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(controller: caption, decoration: const InputDecoration(labelText: 'Légende')),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.photo_library),
                label: const Text('Choisir une image'),
                onPressed: () async {
                  final picker = ImagePicker();
                  final file = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
                  if (file == null) return;
                  final bytes = await file.readAsBytes();
                  await ref.read(photosControllerProvider.notifier).upload(
                        projectId: widget.projectId,
                        bytes: bytes,
                        filename: file.name,
                        caption: caption.text.trim(),
                      );
                  if (context.mounted) Navigator.pop(context);
                },
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Annuler'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openViewer(BuildContext context, String url, String caption) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        insetPadding: const EdgeInsets.all(12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AspectRatio(
              aspectRatio: 1,
              child: InteractiveViewer(
                child: Image.network(url, fit: BoxFit.cover),
              ),
            ),
            if (caption.isNotEmpty)
              Padding(
                padding: const EdgeInsets.all(12),
                child: Text(caption),
              ),
          ],
        ),
      ),
    );
  }
}
