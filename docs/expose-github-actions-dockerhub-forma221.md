# Expose Complet - GitHub Actions + Docker Hub (FORMA_221)

## 1) Script oral (10 minutes)

### 0:00 - 1:00 | Problématique
Bonjour, aujourd'hui je vous presente la mise en place d'une CI avec GitHub Actions pour automatiser le build et la publication d'image Docker sur Docker Hub.

Le probleme de depart est simple: sans automatisation, le build Docker et le push sont faits a la main. Cela cree trois risques majeurs:
- erreurs humaines,
- difference d'environnement entre les membres de l'equipe,
- manque de tracabilite sur ce qui a ete vraiment livre.

Notre objectif est donc d'avoir un pipeline reproductible, qui se lance automatiquement a chaque nouveau commit sur la branche principale.

### 1:00 - 2:00 | Introduction et contexte
Le projet utilise est FORMA_221, une application Node.js/Express.

Le but DevOps ici est de standardiser la livraison technique: chaque commit sur `main` doit produire une image Docker versionnee et publiee sur Docker Hub.

Cela permet a n'importe qui de recuperer exactement la version correspondant a un commit Git donne.

### 2:00 - 3:30 | Concepts fondamentaux
Je rappelle rapidement les briques:
- **GitHub Actions**: outil d'automatisation CI/CD integre a GitHub.
- **Workflow**: fichier YAML qui definit les etapes du pipeline.
- **Trigger**: evenement qui declenche le workflow, ici `push` sur `main`.
- **Job**: groupe d'etapes executees sur un runner.
- **Step**: action unitaire dans le job.
- **Runner**: machine d'execution, ici `ubuntu-latest`.

Cote Docker:
- **Dockerfile**: recette de construction de l'image.
- **Image**: artefact executable.
- **Registry**: stockage distant des images, ici Docker Hub.
- **Tag**: etiquette de version, ici on utilise le SHA Git pour assurer la tracabilite.

Point important: ici on fait de la **CI avec publication d'image**. Ce n'est pas encore du deploiement production automatique.

### 3:30 - 5:00 | Secrets et variables
Le workflow utilise 2 secrets GitHub:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Ils sont stockes dans `Settings > Secrets and variables > Actions`.

Difference essentielle:
- **Secret**: valeur sensible masquee dans les logs.
- **Variable**: valeur non sensible, visible.

Bonne pratique securite:
- ne jamais afficher un token dans une capture d'ecran,
- revoquer et regenerer immediatement un token expose,
- limiter les permissions du token a ce qui est necessaire.

### 5:00 - 7:30 | Demo technique (implementation reelle)
#### Dockerfile
Le Dockerfile suit une logique simple et optimisee:
- base `node:20-alpine` (image legere),
- `WORKDIR /app`,
- copie des `package*.json` d'abord pour profiter du cache Docker,
- `npm ci --omit=dev` pour installer les dependances de production,
- copie du code source `src`,
- `EXPOSE 3000`,
- demarrage avec `node src/app.js`.

#### Workflow GitHub Actions
Dans `.github/workflows/ci.yml`:
- trigger sur `push` vers `main` + declenchement manuel `workflow_dispatch`,
- checkout du code via `actions/checkout@v4`,
- verification explicite des secrets pour echouer rapidement avec message clair,
- login Docker Hub via `docker/login-action@v3`,
- build et push via `docker/build-push-action@v5`,
- tag de l'image: `${{ github.sha }}`.

Le tag SHA garantit qu'on peut relier une image Docker a un commit exact.

### 7:30 - 8:30 | Lien avec la grille d'evaluation
Le travail couvre les points demandes:
- creation de branches avec convention `feature/...`,
- commits propres et explicites,
- merge vers `main` via Pull Request,
- workflow GitHub Actions fonctionnel,
- presence de l'image sur Docker Hub apres execution.

### 8:30 - 9:30 | Erreurs frequentes et corrections
Erreurs typiques:
- `Username and password required`: secrets absents, mal nommes, ou mis dans Variables au lieu de Secrets.
- Token Docker avec mauvais droits: impossible de push.
- Token expose publiquement: il faut le revoquer/regenerer.

Correctif methode:
1. verifier les noms exacts des secrets,
2. verifier le token Docker Hub,
3. relancer le workflow,
4. verifier le tag sur Docker Hub.

### 9:30 - 10:00 | Conclusion
Aujourd'hui, la chaine CI est en place et automatise la production d'image conteneurisee a chaque commit `main`.

Prochaine etape logique: ajouter un vrai CD pour deploiement automatique sur une plateforme cible (VM, PaaS, Kubernetes, etc.).

---

## 2) Plan de demo live (ordre d'execution)
1. Montrer `Dockerfile` et expliquer les instructions principales.
2. Montrer `.github/workflows/ci.yml` step par step.
3. Montrer les noms des secrets GitHub (sans les valeurs).
4. Faire un commit sur une branche `feature/...`.
5. Ouvrir une PR vers `main`, puis merger.
6. Aller dans l'onglet Actions et suivre le workflow.
7. Ouvrir Docker Hub et verifier le tag SHA pousse.
8. Capturer les preuves: PR merge, run success, image visible.

---

## 3) Checklist d'evaluation (a cocher)
- [ ] Branche creee avec convention correcte (`feature/...`).
- [ ] Commits lisibles, atomiques, avec messages clairs.
- [ ] Passage par Pull Request pour merger sur `main`.
- [ ] Workflow execute avec statut `Success`.
- [ ] Image visible dans Docker Hub apres execution.
- [ ] Tag de l'image correspond au SHA du commit.

---

## 4) Q/R rapides (si le jury pose des questions)
**Q: Pourquoi utiliser le SHA en tag au lieu de `latest` seulement ?**
R: Le SHA donne une version immutable et tracable. `latest` peut bouger et perdre la precision historique.

**Q: Quelle difference entre CI et CD dans votre cas ?**
R: Ici on construit et publie l'image (CI + packaging). Le deploiement auto en environnement runtime n'est pas encore active.

**Q: Pourquoi stocker les credentials en secrets GitHub ?**
R: Pour eviter l'exposition de credentials dans le code et les logs, et centraliser la gestion securisee.

**Q: Comment avez-vous gere l'erreur de login Docker ?**
R: Verification des secrets, correction des noms exacts, regeneration du token Docker, puis re-run du workflow.
