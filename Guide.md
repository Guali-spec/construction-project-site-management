# Guide de travail en équipe – Git & GitHub

Ce document explique **pas à pas** comment chaque membre de l’équipe doit :
- cloner le dépôt
- récupérer sa branche de travail
- développer correctement
- faire des commits propres
- ouvrir une Pull Request
- collaborer sans conflit

Le respect de ce guide est **obligatoire** pour le bon déroulement du projet.

---

## 1. Pré-requis

Avant de commencer, assurez-vous d’avoir installé :
- Git
- Node.js (v18+)
- Docker
- Flutter SDK (pour l’équipe mobile)

Vérification :
```bash
git --version
```

---

## 2. Cloner le dépôt (une seule fois)

Chaque membre clone le dépôt sur sa machine :

```bash
git clone https://github.com/<organisation-ou-user>/<nom-du-repo>.git
cd <nom-du-repo>
```

Ne clonez le dépôt **qu’une seule fois**.

---

## 3. Récupérer les branches du projet

Après le clonage :

```bash
git fetch --all
```

Lister les branches disponibles :
```bash
git branch -a
```

Vous devez voir :
- `main`
- `develop`
- `feature/backend-bootstrap`
- `feature/web-bootstrap`
- `feature/mobile-bootstrap`

---

## 4. Se placer sur sa branche de travail

Chaque membre travaille **uniquement** sur sa branche `feature/*`.

### Exemples

Backend :
```bash
git checkout feature/backend-bootstrap
```

Frontend Web :
```bash
git checkout feature/web-bootstrap
```

Mobile :
```bash
git checkout feature/mobile-bootstrap
```

Il est **interdit** de travailler directement sur `main` ou `develop`.

---

## 5. Mettre sa branche à jour (à faire régulièrement)

Avant chaque session de travail :

```bash
git checkout develop
git pull
git checkout feature/ma-branche
git merge develop
```

Cela permet de réduire fortement les conflits.

---

## 6. Développer sur sa branche

- Travaillez uniquement dans les dossiers qui vous concernent :
  - `backend/`
  - `frontend/`
  - `mobile/`
- Respectez la structure existante
- Ne commitez jamais :
  - `.env`
  - `node_modules`
  - `build`
  - fichiers générés automatiquement

---

## 7. Faire des commits propres

Vérifier les fichiers modifiés :
```bash
git status
```

Ajouter les fichiers :
```bash
git add .
```

Faire un commit :
```bash
git commit -m "type(scope): description claire"
```

### Exemples de bons commits
```text
feat(auth): add JWT authentication
fix(api): handle invalid project id
docs: update backend README
chore: configure postgres connection
```

Mauvais exemples :
```text
update
fix
test
```

---

## 8. Envoyer son travail sur GitHub

```bash
git push
```

(Si c’est la première fois, Git affichera la commande exacte à utiliser.)

---

## 9. Ouvrir une Pull Request (PR)

1. Aller sur GitHub
2. Cliquer sur **Compare & Pull Request**
3. Vérifier :
   - Branche source : `feature/*`
   - Branche cible : `develop`
4. Remplir le template de Pull Request
5. Soumettre la Pull Request

Il est **interdit** d’ouvrir une Pull Request vers `main`.

---

## 10. Revue et validation

Avant qu’une Pull Request soit fusionnée :
- au moins **un autre membre** doit relire
- le code doit fonctionner
- les règles du projet doivent être respectées

Après validation :
- la Pull Request est fusionnée dans `develop`

---

## 11. Synchronisation après merge

Après qu’une Pull Request a été fusionnée :

```bash
git checkout develop
git pull
git checkout feature/ma-branche
git merge develop
```

Optionnel :
```bash
git branch -d feature/ma-branche
```

---

## 12. Règles strictes à respecter

Interdictions :
- Commit direct sur `main`
- Commit direct sur `develop`
- Commit de fichiers `.env`
- Commit de code non testé

Obligations :
- Une branche = une fonctionnalité
- Des commits clairs et lisibles
- Une Pull Request pour chaque fusion
- Communication en cas de blocage

---

## 13. En cas de problème

- Ne pas paniquer
- Ne pas forcer avec `git push --force` sans accord
- Demander de l’aide à l’équipe
- Toujours expliquer clairement la situation

---

## 14. Philosophie du projet

Ce projet se développe avec :
- rigueur
- collaboration
- respect des règles

Un bon projet n’est pas seulement un projet qui fonctionne,
c’est un projet que toute l’équipe comprend et peut maintenir.

---

Fin du guide.
