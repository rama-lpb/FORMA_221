# FORMA 221 — Guide complet (API REST)

Ce document sert de **guide pas-à-pas** pour un utilisateur “lambda” : lancer l’application, exécuter quelques scénarios (formateur → formation → session → inscription), puis aller dans le dépôt Git pour explorer le reste du code.

## Sommaire

1. [Lien Git](#lien-git)
2. [Démarrage rapide](#démarrage-rapide)
3. [Démo pas-à-pas (10 minutes)](#démo-pas-à-pas-10-minutes)
4. [Règles métier (erreurs fréquentes)](#règles-métier-erreurs-fréquentes)
5. [Où regarder dans le code](#où-regarder-dans-le-code)
6. [Routes API](#routes-api)
7. [Exemples cURL](#exemples-curl)

---

## Lien Git

`https://github.com/rama-lpb/FORMA_221.git`

---

## Démarrage rapide

### Pré-requis
- Node.js + npm

### Installer + démarrer

```bash
git clone https://github.com/rama-lpb/FORMA_221.git
cd FORMA_221

npm install
npm start
```

- API : `http://localhost:3000/api`
- Swagger UI : `http://localhost:3000/api-docs`

### Format des réponses (REST)

- Les endpoints renvoient directement les **ressources** (ou une collection `{ count, items, _links }`).
- Chaque ressource contient des liens HATEOAS via `_links` (style HAL).
- Les erreurs sont au format `application/problem+json` (Problem Details).

### Mode dev (redémarrage auto)

```bash
npm run dev
```

### Tester tous les endpoints (sans serveur)

Ce test lance une suite de vérifications sur **toutes** les routes HTTP (CRUD + règles métier), sans ouvrir de port réseau.

```bash
npm run test:endpoints
```

---

## Démo pas-à-pas (10 minutes)

But : créer des données “de bout en bout” dans l’ordre logique :
1) Formateur → 2) Formation → 3) Session → 4) Inscription.

> Important : le stockage est **en mémoire** (tableaux dans les repositories). Si tu redémarres le serveur, tout est réinitialisé.

### Étape 0 — Ouvrir Swagger

Ouvre `http://localhost:3000/api-docs` puis utilise “Try it out” sur les endpoints ci-dessous.

Swagger est défini dans `src/config/swagger.js` (OpenAPI + schémas + paths).

### Étape 1 — Créer un formateur

Endpoint : `POST /api/formateurs`

Payload exemple :
```json
{
  "prenom": "Moussa",
  "nom": "Sarr",
  "email": "moussa.sarr@forma221.sn",
  "telephone": "771234567",
  "specialite": "Développement Web"
}
```

Ce qui se passe dans le code :
- Route → `src/routes/index.js`
  ```js
  router.post('/formateurs', (req, res) => controllers.formateurController.create(req, res));
  ```
- Controller → `src/controllers/FormateurController.js` (try/catch + réponse JSON)
- Service → `src/services/FormateurService.js` (validation + unicité email)
  ```js
  const email = Validator.validateEmail(data.email);
  const existingFormateur = this.formateurRepository.findByEmail(email);
  if (existingFormateur) {
    throw new ConflictError('Un formateur avec cet email existe déjà');
  }
  ```
- Repository → `src/repositories/FormateurRepository.js` (push dans un tableau)
  ```js
  save(formateur) { this.formateurs.push(formateur); return formateur; }
  ```

Récupère l’`id` retourné : tu en auras besoin plus tard (ex: `formateurId`).

### Étape 2 — Créer une formation

Endpoint : `POST /api/formations`

Payload exemple :
```json
{
  "code": "DEV001",
  "titre": "Développement Web Avancé",
  "duree": 40,
  "prix": 150000,
  "niveau": "INTERMEDIAIRE"
}
```

Dans le code (points clés) :
- Enum des niveaux → `src/entities/types.js`
  ```js
  const FormationLevel = { DEBUTANT: 'DEBUTANT', INTERMEDIAIRE: 'INTERMEDIAIRE', AVANCE: 'AVANCE' };
  ```
- Unicité du `code` formation → `src/services/FormationService.js`
  ```js
  const existingFormation = this.formationRepository.findByCode(code);
  if (existingFormation) {
    throw new ConflictError('Une formation avec ce code existe déjà');
  }
  ```

Récupère l’`id` retourné : tu en auras besoin comme `formationId`.

### Étape 3 — Créer une session

Endpoint : `POST /api/sessions`

Payload exemple (dates au format `YYYY-MM-DD`) :
```json
{
  "formationId": "UUID_FORMATION",
  "formateurId": "UUID_FORMATEUR",
  "dateDebut": "2026-04-20",
  "dateFin": "2026-04-25",
  "placesMax": 20
}
```

Dans le code (règles importantes) :
- Vérif dateFin > dateDebut → `src/services/SessionService.js`
  ```js
  const dateDebutObj = new Date(dateDebut);
  const dateFinObj = new Date(dateFin);
  if (dateFinObj <= dateDebutObj) {
    throw new ValidationError('La date de fin doit être postérieure à la date de début');
  }
  ```
- Vérif existence formateur/formation → `src/services/SessionService.js`
  ```js
  const formation = this.formationRepository.findById(formationId);
  if (!formation) {
    throw new NotFoundError('Formation', formationId);
  }

  const formateur = this.formateurRepository.findById(formateurId);
  if (!formateur) {
    throw new NotFoundError('Formateur', formateurId);
  }
  ```
- Anti-chevauchement (disponibilité formateur) → `src/services/SessionService.js`
  ```js
  const overlaps = newDateDebut < existingDateFin && newDateFin > existingDateDebut;
  if (overlaps) throw new ValidationError('Le formateur a déjà une session pendant cette période');
  ```

Récupère l’`id` retourné : tu en auras besoin comme `sessionId`.

### Étape 4 — Inscrire un participant

Endpoint (REST recommandé) : `POST /api/sessions/:sessionId/inscriptions`

Payload exemple (la date d’inscription est optionnelle) :
```json
{
  "nomParticipant": "Aminata Diallo",
  "email": "aminata.diallo@email.sn",
  "telephone": "771234567",
  "dateInscription": "2026-04-13"
}
```

Dans le code (règles importantes) :
- La session doit exister + être OUVERTE → `src/services/InscriptionService.js`
  ```js
  const session = this.sessionRepository.findById(sessionId);
  if (!session) throw new NotFoundError('Session', sessionId);
  if (session.statut !== 'OUVERTE') throw new ValidationError('La session doit être OUVERTE pour les inscriptions');
  ```
- Anti-doublon par email (même session) → `src/services/InscriptionService.js`
  ```js
  const existing = this.inscriptionRepository.findByEmailAndSession(email, sessionId);
  if (existing) throw new ConflictError('Cet email est déjà inscrit à cette session');
  ```
- Capacité max → `src/services/InscriptionService.js`
  ```js
  if (this.inscriptionRepository.countBySessionId(sessionId) >= session.placesMax) {
    throw new ValidationError('Plus de places disponibles pour cette session');
  }
  ```
- Lien inscription ↔ session (push dans `session.inscriptions`) → `src/repositories/InscriptionRepository.js`
  ```js
  const session = sessions.find(s => s.id === sessionId);
  if (session) session.inscriptions.push(inscription);
  ```

### Étape 5 — Vérifier les données

- `GET /api/formateurs`
- `GET /api/formations`
- `GET /api/sessions`
- `GET /api/inscriptions`
- `GET /api/sessions/:sessionId/inscriptions`

---

## Règles métier (erreurs fréquentes)

Ces règles sont volontairement “visibles” pendant la démo : si tu testes avec des données invalides, tu verras des erreurs `400/404/409`.

### Validations communes (400)
- Téléphone sénégalais 9 chiffres + préfixe (70/75/76/77/78) → `src/utils/Validator.js`
- Email valide → `src/utils/Validator.js`
- Chaîne obligatoire (min 2 caractères par défaut) → `src/utils/Validator.js`
- Dates valides → `src/utils/Validator.js`

### Conflits (409)
- Email formateur déjà existant → `src/services/FormateurService.js`
- Code formation déjà existant → `src/services/FormationService.js`
- Même email déjà inscrit à une session → `src/services/InscriptionService.js`

### Not found (404)
- Formateur/Formation/Session/Inscription introuvable par `id` → `src/errors/NotFoundError.js`

### Suppressions bloquées (400)
- Supprimer un formateur qui a des sessions → `src/services/FormateurService.js`
- Supprimer une formation qui a des sessions → `src/services/FormationService.js`
- Supprimer une session qui a des inscriptions confirmées → `src/services/SessionService.js` + `src/repositories/SessionRepository.js`

---

## Où regarder dans le code

Quand tu veux aller “voir dans Git”, voici la carte des fichiers importants :

- Démarrage Express + Swagger : `src/app.js`
- Définition des routes HTTP : `src/routes/index.js`
- “Injection” des dépendances (repos → services → controllers) : `src/config/index.js`
- Controllers (format des réponses, try/catch) : `src/controllers/*Controller.js`
- Services (règles métier, validations, erreurs) : `src/services/*Service.js`
- Repositories (stockage en mémoire) : `src/repositories/*Repository.js`
- Entités (modèles + UUID) : `src/entities/*.js`
- Types/Enums (niveaux, statuts) : `src/entities/types.js`
- Validations : `src/utils/Validator.js`
- Erreurs : `src/errors/*.js`
- Swagger/OpenAPI : `src/config/swagger.js`

Flux d’une requête (à suivre dans Git) :
`src/app.js` → `src/routes/index.js` → `src/controllers/*` → `src/services/*` → `src/repositories/*` → `src/entities/*`

---

## Routes API

### Formateurs
- `POST /api/formateurs` — créer
- `GET /api/formateurs` — lister
- `GET /api/formateurs/:id` — détail
- `PUT /api/formateurs/:id` — remplacer (update complet)
- `PATCH /api/formateurs/:id` — modifier (update partiel)
- `DELETE /api/formateurs/:id` — supprimer

### Formations
- `POST /api/formations` — créer
- `GET /api/formations` — lister
- `GET /api/formations/:id` — détail
- `PUT /api/formations/:id` — remplacer (update complet)
- `PATCH /api/formations/:id` — modifier (update partiel)
- `DELETE /api/formations/:id` — supprimer

### Sessions
- `POST /api/sessions` — créer
- `GET /api/sessions` — lister
- `GET /api/sessions/:id` — détail
- `PUT /api/sessions/:id` — remplacer (update complet)
- `PATCH /api/sessions/:id` — modifier (update partiel)
- `DELETE /api/sessions/:id` — supprimer

### Inscriptions
- `POST /api/sessions/:sessionId/inscriptions` — créer (REST recommandé)
- `GET /api/inscriptions` — lister
- `GET /api/inscriptions/:id` — détail
- `GET /api/sessions/:sessionId/inscriptions` — lister par session (REST recommandé)
- `PUT /api/inscriptions/:id` — remplacer (update complet)
- `PATCH /api/inscriptions/:id` — modifier (update partiel)
- `DELETE /api/inscriptions/:id` — supprimer


---

## Exemples cURL

> Remplace les `UUID_*` par les `id` retournés par l’API aux étapes précédentes.

### Créer un formateur
```bash
curl -X POST http://localhost:3000/api/formateurs \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Moussa","nom":"Sarr","email":"moussa.sarr@forma221.sn","telephone":"771234567","specialite":"Développement Web"}'
```

### Créer une formation
```bash
curl -X POST http://localhost:3000/api/formations \
  -H "Content-Type: application/json" \
  -d '{"code":"DEV001","titre":"Développement Web Avancé","duree":40,"prix":150000,"niveau":"INTERMEDIAIRE"}'
```

### Créer une session
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"formationId":"UUID_FORMATION","formateurId":"UUID_FORMATEUR","dateDebut":"2026-04-20","dateFin":"2026-04-25","placesMax":20}'
```

### Créer une inscription
```bash
curl -X POST http://localhost:3000/api/sessions/UUID_SESSION/inscriptions \
  -H "Content-Type: application/json" \
  -d '{"nomParticipant":"Aminata Diallo","email":"aminata.diallo@email.sn","telephone":"771234567","dateInscription":"2026-04-13"}'
```

### Modifier partiellement une formation (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/formations/UUID_FORMATION \
  -H "Content-Type: application/json" \
  -d '{"prix":160000}'
```
