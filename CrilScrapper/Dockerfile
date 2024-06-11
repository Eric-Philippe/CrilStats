# Utiliser une image de base Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Construire le projet (si vous utilisez un compilateur comme TypeScript)
RUN npm run build

# Exécuter le script
CMD ["node", "./dist/scraper.js"]
