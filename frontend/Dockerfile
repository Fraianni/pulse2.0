# Usa l'immagine Node.js per lo sviluppo
FROM node:16-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di package e installa le dipendenze
COPY package.json package-lock.json ./
RUN npm install

# Copia i file dell'app
COPY . .

# Esegui il server di sviluppo React
CMD ["npm", "start"]
