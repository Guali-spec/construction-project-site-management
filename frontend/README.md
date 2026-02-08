# SiteManager — Frontend Web

Interface web **React/Next.js** pour la gestion et le pilotage des chantiers (rôle : frontend + intégration).

✅ **Intégration backend** : Les modules Auth et Chantiers sont connectés au backend. Voir [INTEGRATION.md](./INTEGRATION.md) pour les détails.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Stack** : Next.js 15, React 18, Tailwind CSS 4, TypeScript.
- **API** : `NEXT_PUBLIC_API_URL` (défaut `http://localhost:3000`). Client dans `src/services/api-client.ts`.

## Configuration

Avant de démarrer l'application, créez un fichier `.env.local` dans le dossier `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

⚠️ **Note importante** : 
- Le backend écoute sur le port **3000** par défaut (pas 3001)
- Le backend n'utilise pas de préfixe `/api`, les routes sont directement `/auth`, `/projects`, etc.

Remplacez l'URL par celle de votre serveur backend si nécessaire.

**Important** : Assurez-vous que le backend est démarré et accessible avant de lancer le frontend.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
