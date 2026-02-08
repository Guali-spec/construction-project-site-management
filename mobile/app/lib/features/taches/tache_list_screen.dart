import 'package:flutter/material.dart';
import 'models/tache.dart';
import 'widgets/tache_card.dart';
import 'add_tache_screen.dart';

class TacheListScreen extends StatefulWidget {
  final String chantierId;
  final String chantierName;

  const TacheListScreen({
    super.key,
    required this.chantierId,
    required this.chantierName,
  });

  @override
  State<TacheListScreen> createState() => _TacheListScreenState();
}

class _TacheListScreenState extends State<TacheListScreen> {
  late List<Tache> taches;

  @override
  void initState() {
    super.initState();
    taches = [
      Tache(
        id: '1',
        title: 'Fondations',
        status: 'terminee',
        progress: 100,
        chantierId: widget.chantierId,
      ),
      Tache(
        id: '2',
        title: 'Élévation murs',
        status: 'en_cours',
        progress: 50,
        chantierId: widget.chantierId,
      ),
      Tache(
        id: '3',
        title: 'Toiture',
        status: 'a_faire',
        progress: 0,
        chantierId: widget.chantierId,
      ),
    ];
  }

  // 🔹 Modifier une tâche
  void _editTache(Tache tache) {
    final statusOptions = ['a_faire', 'en_cours', 'terminee', 'bloquee'];
    int progressValue = tache.progress;
    String selectedStatus = tache.status;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder( // 🔹 permet de rafraîchir le slider dans le popup
          builder: (context, setStateDialog) {
            return AlertDialog(
              title: Text('Modifier "${tache.title}"'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: selectedStatus,
                    decoration: const InputDecoration(labelText: "Statut"),
                    items: statusOptions
                        .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                        .toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setStateDialog(() {
                          selectedStatus = value;
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Text("Progression :"),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Slider(
                          value: progressValue.toDouble(),
                          min: 0,
                          max: 100,
                          divisions: 20,
                          label: "$progressValue%",
                          onChanged: (value) {
                            setStateDialog(() {
                              progressValue = value.toInt();
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Annuler"),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      tache.status = selectedStatus;
                      tache.progress = progressValue;
                    });
                    Navigator.pop(context);
                  },
                  child: const Text("Sauvegarder"),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // 🔹 Supprimer une tâche
  void _deleteTache(Tache tache) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Supprimer la tâche"),
        content: Text("Voulez-vous vraiment supprimer \"${tache.title}\" ?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Annuler"),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                taches.removeWhere((element) => element.id == tache.id);
              });
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text("Supprimer"),
          ),
        ],
      ),
    );
  }

  // 🔹 Ajouter une nouvelle tâche
  void _addTache() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AddTacheScreen(
          chantierId: widget.chantierId,
          onAdd: (newTache) {
            setState(() {
              taches.add(newTache);
            });
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Tâches – ${widget.chantierName}")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: taches.length,
        itemBuilder: (context, index) {
          return TacheCard(
            tache: taches[index],
            onTapEdit: () => _editTache(taches[index]),
            onTapDelete: () => _deleteTache(taches[index]),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addTache,
        icon: const Icon(Icons.add),
        label: const Text("Ajouter une tâche"),
        backgroundColor: Colors.blue,
      ),
    );
  }
}