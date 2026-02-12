import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:app/features/auth/presentation/providers/auth_controller.dart';
import 'package:app/core/config/env.dart';

class WebOnlyScreen extends ConsumerWidget {
  const WebOnlyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).user;
    final role = user?.role ?? '';

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.web, size: 56, color: Colors.orange),
                    const SizedBox(height: 12),
                    const Text('Accès réservé au web', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(
                      'Votre rôle ($role) ne permet pas l’accès mobile. Veuillez vous connecter via la plateforme web.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          final uri = Uri.parse(Env.webBaseUrl);
                          await launchUrl(uri, mode: LaunchMode.externalApplication);
                        },
                        child: const Text('Ouvrir la plateforme web'),
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: TextButton(
                        onPressed: () => ref.read(authControllerProvider.notifier).logout(),
                        child: const Text('Se déconnecter'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
