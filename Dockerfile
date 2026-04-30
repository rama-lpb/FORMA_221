# Étape 1 : image de base légère Node.js
FROM node:20-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# Copier le reste du code source
COPY src/ ./src/

# Exposer le port de l'application
EXPOSE 3000

# Lancer l'application
CMD ["node", "src/app.js"]
