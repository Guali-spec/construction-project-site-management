import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:app/features/auth/presentation/providers/auth_controller.dart';
import 'app_theme.dart';

class AppScaffold extends ConsumerWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final String? currentRoute;

  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions,
    this.currentRoute,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final role = auth.user?.role ?? 'PENDING';
    final userEmail = auth.user?.email ?? '';
    final isWide = MediaQuery.of(context).size.width >= 980;

    return Scaffold(
      appBar: isWide
          ? null
          : AppBar(
              title: Text(title),
              actions: actions,
            ),
      drawer: isWide ? null : _AppDrawer(role: role, currentRoute: currentRoute, userEmail: userEmail),
      body: Row(
        children: [
          if (isWide)
            _SideNav(
              role: role,
              currentRoute: currentRoute,
              userEmail: userEmail,
            ),
          Expanded(
            child: Column(
              children: [
                if (isWide)
                  _TopBar(
                    title: title,
                    actions: actions,
                    userEmail: userEmail,
                  ),
                Expanded(child: body),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AppDrawer extends ConsumerWidget {
  final String role;
  final String? currentRoute;
  final String userEmail;
  const _AppDrawer({required this.role, required this.currentRoute, required this.userEmail});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = _navItemsForRole(role);

    return Drawer(
      child: Container(
        color: AppColors.navy,
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 16),
              Row(
                children: [
                  const SizedBox(width: 16),
                  Container(
                    width: 40,
                    height: 40,
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: SvgPicture.asset('assets/buildtrack-logo.svg', colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn)),
                  ),
                  const SizedBox(width: 12),
                  const Text('BuildTrack', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600)),
                ],
              ),
              const SizedBox(height: 24),
              Expanded(
                child: ListView(
                  children: items
                      .map((item) => ListTile(
                            leading: Icon(item.icon, color: item.route == currentRoute ? Colors.white : Colors.white70),
                            title: Text(
                              item.label,
                              style: TextStyle(
                                color: item.route == currentRoute ? Colors.white : Colors.white70,
                                fontWeight: item.route == currentRoute ? FontWeight.w600 : FontWeight.normal,
                              ),
                            ),
                            onTap: () {
                              Navigator.pop(context);
                              context.go(item.route);
                            },
                          ))
                      .toList(),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const CircleAvatar(radius: 16, backgroundColor: Colors.white24, child: Icon(Icons.person, color: Colors.white)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(userEmail, style: const TextStyle(color: Colors.white70), overflow: TextOverflow.ellipsis),
                    ),
                  ],
                ),
              ),
              const Divider(color: Colors.white24),
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.white70),
                title: const Text('Déconnexion', style: TextStyle(color: Colors.white70)),
                onTap: () {
                  ref.read(authControllerProvider.notifier).logout();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SideNav extends ConsumerWidget {
  final String role;
  final String? currentRoute;
  final String userEmail;

  const _SideNav({
    required this.role,
    required this.currentRoute,
    required this.userEmail,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = _navItemsForRole(role);
    return Container(
      width: 260,
      color: AppColors.navy,
      child: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 20),
            Row(
              children: [
                const SizedBox(width: 16),
                Container(
                  width: 40,
                  height: 40,
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: SvgPicture.asset('assets/buildtrack-logo.svg', colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn)),
                ),
                const SizedBox(width: 12),
                const Text('BuildTrack', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView(
                children: items
                    .map((item) => Container(
                          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: item.route == currentRoute ? AppColors.accent : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: ListTile(
                            leading: Icon(item.icon, color: item.route == currentRoute ? Colors.black : Colors.white70),
                            title: Text(
                              item.label,
                              style: TextStyle(
                                color: item.route == currentRoute ? Colors.black : Colors.white70,
                                fontWeight: item.route == currentRoute ? FontWeight.w600 : FontWeight.normal,
                              ),
                            ),
                            onTap: () => context.go(item.route),
                          ),
                        ))
                    .toList(),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const CircleAvatar(radius: 16, backgroundColor: Colors.white24, child: Icon(Icons.person, color: Colors.white)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(userEmail, style: const TextStyle(color: Colors.white70), overflow: TextOverflow.ellipsis),
                  ),
                ],
              ),
            ),
            const Divider(color: Colors.white24),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.white70),
              title: const Text('Déconnexion', style: TextStyle(color: Colors.white70)),
              onTap: () => ref.read(authControllerProvider.notifier).logout(),
            ),
          ],
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  final String title;
  final List<Widget>? actions;
  final String userEmail;

  const _TopBar({
    required this.title,
    required this.actions,
    required this.userEmail,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.fromLTRB(24, 18, 24, 12),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Rechercher chantier, tâche...',
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
          const SizedBox(width: 16),
          ...?actions,
          const SizedBox(width: 12),
          const Icon(Icons.notifications_none, color: AppColors.textMuted),
          const SizedBox(width: 12),
          CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.navySoft,
            child: Text(
              userEmail.isNotEmpty ? userEmail[0].toUpperCase() : 'U',
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem {
  final String label;
  final String route;
  final IconData icon;
  const _NavItem(this.label, this.route, this.icon);
}

List<_NavItem> _navItemsForRole(String role) {
  if (role == 'SUPER_ADMIN' || role == 'ADMIN_ENTREPRISE' || role == 'CHEF_PROJET') {
    return const [
      _NavItem('Dashboard', '/dashboard', Icons.dashboard),
      _NavItem('Chantiers', '/chantiers', Icons.apartment),
      _NavItem('Tâches', '/taches', Icons.checklist),
      _NavItem('Photos', '/photos', Icons.photo_camera),
      _NavItem("Suivi d'avancement", '/suivi', Icons.track_changes),
      _NavItem('Ressources', '/ressources', Icons.people),
      _NavItem('Finances', '/finances', Icons.account_balance_wallet),
      _NavItem('Rapports', '/rapports', Icons.article),
    ];
  }
  if (role == 'SUPERVISEUR') {
    return const [
      _NavItem('Chantiers', '/chantiers', Icons.apartment),
      _NavItem('Tâches', '/taches', Icons.checklist),
      _NavItem('Photos', '/photos', Icons.photo_camera),
      _NavItem("Suivi d'avancement", '/suivi', Icons.track_changes),
      _NavItem('Ressources', '/ressources', Icons.people),
      _NavItem('Finances', '/finances', Icons.account_balance_wallet),
      _NavItem('Rapports', '/rapports', Icons.article),
    ];
  }
  return const [
    _NavItem('Chantiers', '/chantiers', Icons.apartment),
  ];
}



