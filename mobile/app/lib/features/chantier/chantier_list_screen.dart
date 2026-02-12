import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/features/chantier/presentation/providers/chantier_controller.dart';
import 'package:app/ui/app_scaffold.dart';
import 'package:app/ui/app_theme.dart';
import 'package:app/ui/empty_state.dart';
import 'package:app/features/auth/presentation/providers/auth_controller.dart';
import 'widgets/chantier_card.dart';
import 'chantier_details_screen.dart';
import 'package:app/features/chantier/domain/models/chantier.dart';

class ChantierListScreen extends ConsumerStatefulWidget {
  const ChantierListScreen({super.key});

  @override
  ConsumerState<ChantierListScreen> createState() => _ChantierListScreenState();
}

class _ChantierListScreenState extends ConsumerState<ChantierListScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(chantierControllerProvider.notifier).load());
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(chantierControllerProvider);
    final auth = ref.watch(authControllerProvider);
    final role = auth.user?.role ?? 'PENDING';
    final canCreate = role == 'SUPER_ADMIN' || role == 'ADMIN_ENTREPRISE' || role == 'CHEF_PROJET';

    return AppScaffold(
      title: 'Chantiers',
      currentRoute: '/chantiers',
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Builder(
          builder: (context) {
            if (state.status == ChantierStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state.status == ChantierStatus.error) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.warning_amber_rounded, size: 32, color: Colors.orange),
                    const SizedBox(height: 8),
                    Text(state.error ?? 'Erreur de chargement'),
                    const SizedBox(height: 8),
                    OutlinedButton(
                      onPressed: () => ref.read(chantierControllerProvider.notifier).load(),
                      child: const Text('Réessayer'),
                    ),
                  ],
                ),
              );
            }
            if (state.items.isEmpty) {
              return const EmptyState(
                title: 'Aucun chantier',
                message: 'Aucun chantier disponible pour le moment.',
              );
            }

            final query = _searchController.text.trim().toLowerCase();
            final filtered = query.isEmpty
                ? state.items
                : state.items
                    .where((c) =>
                        c.name.toLowerCase().contains(query) ||
                        (c.location ?? '').toLowerCase().contains(query))
                    .toList();

            return Column(
              children: [
                _buildSearchRow(),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView.builder(
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final chantier = filtered[index];
                      return ChantierCard(
                        chantier: chantier,
                        onTap: () => _openDetails(context, chantier),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
      actions: [
        if (canCreate)
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {},
          ),
      ],
    );
  }

  Widget _buildSearchRow() {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _searchController,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: 'Rechercher chantier...',
              prefixIcon: const Icon(Icons.search),
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Container(
          decoration: BoxDecoration(
            color: AppColors.accent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: IconButton(
            icon: const Icon(Icons.filter_list, color: Colors.black),
            onPressed: () {},
          ),
        ),
      ],
    );
  }

  void _openDetails(BuildContext context, Chantier chantier) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChantierDetailsScreen(chantier: chantier),
      ),
    );
  }
}
