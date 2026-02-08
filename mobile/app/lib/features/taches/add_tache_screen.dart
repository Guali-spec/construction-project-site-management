import 'package:flutter/material.dart';
import 'models/tache.dart';

class AddTacheScreen extends StatefulWidget {
  final String chantierId;
  final Function(Tache) onAdd;

  const AddTacheScreen({
    super.key,
    required this.chantierId,
    required this.onAdd,
  });

  @override
  State<AddTacheScreen> createState() => _AddTacheScreenState();
}

class _AddTacheScreenState extends State<AddTacheScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  String _selectedStatus = 'a_faire';
  int _progressValue = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Nouvelle tâche")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: "Titre de la tâche"),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return "Veuillez entrer un titre";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _selectedStatus,
                decoration: const InputDecoration(labelText: "Statut"),
                items: ['a_faire', 'en_cours', 'terminee', 'bloquee']
                    .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                    .toList(),
                onChanged: (value) {
                  if (value != null) setState(() => _selectedStatus = value);
                },
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  const Text("Progression :"),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Slider(
                      value: _progressValue.toDouble(),
                      min: 0,
                      max: 100,
                      divisions: 20,
                      label: "$_progressValue%",
                      onChanged: (value) {
                        setState(() {
                          _progressValue = value.toInt();
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              ElevatedButton.icon(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    final newTache = Tache(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      title: _titleController.text.trim(),
                      status: _selectedStatus,
                      progress: _progressValue,
                      chantierId: widget.chantierId,
                    );
                    widget.onAdd(newTache);
                    Navigator.pop(context);
                  }
                },
                icon: const Icon(Icons.check),
                label: const Text("Ajouter la tâche"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  textStyle: const TextStyle(fontSize: 18),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}