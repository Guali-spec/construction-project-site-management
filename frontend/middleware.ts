import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Récupérer le chemin demandé
  const { pathname } = request.nextUrl;
  
  // 2. Définir les routes publiques (pas besoin d'authentification)
  const publicRoutes = ['/login', '/forgot-password', '/api'];
  
  // 3. Si c'est une route publique, autoriser l'accès
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // 4. Vérifier si l'utilisateur est authentifié
  // Pour l'instant, vérifions un cookie ou un token dans localStorage
  // Note: localStorage n'est pas accessible dans le middleware
  const token = request.cookies.get('auth_token')?.value;
  
  // 5. Si pas de token, rediriger vers login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // 6. Si token présent, continuer
  return NextResponse.next();
}

// Configuration : sur quelles routes appliquer le middleware
export const config = {
  matcher: [
    /*
     * Appliquer à toutes les routes SAUF :
     * - api (routes API)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};