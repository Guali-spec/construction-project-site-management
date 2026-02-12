import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_controller.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  bool _obscure = true;
  String _requestedRole = 'SUPERVISEUR';
  bool _showForm = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 120), () {
      if (mounted) setState(() => _showForm = true);
    });
  }

  Future<void> _submit() async {
    final notifier = ref.read(authControllerProvider.notifier);
    await notifier.register(
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
      firstName: _firstNameController.text.trim(),
      lastName: _lastNameController.text.trim(),
      requestedRole: _requestedRole,
    );

    if (!mounted) return;
    final state = ref.read(authControllerProvider);
    if (state.status == AuthStatus.authenticated) {
      context.go('/dashboard');
    } else if (state.status == AuthStatus.pending) {
      context.go('/pending');
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);

    return Scaffold(
      body: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFFF8FAFC), Color(0xFFEFF4FF)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Center(
            child: SingleChildScrollView(
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 350),
                opacity: _showForm ? 1 : 0,
                child: TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0.04, end: 0),
                  duration: const Duration(milliseconds: 350),
                  curve: Curves.easeOutCubic,
                  builder: (context, value, child) {
                    return Transform.translate(
                      offset: Offset(0, 30 * value),
                      child: child,
                    );
                  },
                  child: Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 36,
                                height: 36,
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF59E0B),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: SvgPicture.asset(
                                  'assets/buildtrack-logo.svg',
                                  colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn),
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Text('BuildTrack', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text('Cr?ation de compte', style: TextStyle(color: Colors.grey)),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _firstNameController,
                            decoration: const InputDecoration(labelText: 'Prénom'),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _lastNameController,
                            decoration: const InputDecoration(labelText: 'Nom'),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: const InputDecoration(labelText: 'Email'),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _passwordController,
                            obscureText: _obscure,
                            decoration: InputDecoration(
                              labelText: 'Mot de passe',
                              suffixIcon: IconButton(
                                icon: Icon(_obscure ? Icons.visibility : Icons.visibility_off),
                                onPressed: () => setState(() => _obscure = !_obscure),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          DropdownButtonFormField<String>(
                            value: _requestedRole,
                            decoration: const InputDecoration(labelText: 'Rôle souhaité'),
                            items: const [
                              DropdownMenuItem(value: 'CHEF_PROJET', child: Text('Chef de projet')),
                              DropdownMenuItem(value: 'SUPERVISEUR', child: Text('Superviseur')),
                              DropdownMenuItem(value: 'COMPTABLE', child: Text('Comptable')),
                              DropdownMenuItem(value: 'CONSULTANT', child: Text('Consultant')),
                            ],
                            onChanged: (value) {
                              if (value != null) setState(() => _requestedRole = value);
                            },
                          ),
                          if (authState.error != null) ...[
                            const SizedBox(height: 12),
                            Text(authState.error!, style: const TextStyle(color: Colors.red)),
                          ],
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: authState.loading ? null : _submit,
                              child: authState.loading
                                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                                  : const Text('S’inscrire'),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('Déjà un compte ? '),
                              TextButton(
                                onPressed: () => context.go('/login'),
                                child: const Text('Se connecter'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
