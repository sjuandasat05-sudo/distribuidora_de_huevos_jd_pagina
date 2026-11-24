# Imagen base: Node.js LTS liviana
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 1. Instala las dependencias del servidor
COPY backend/package*.json ./backend/
RUN npm --prefix backend ci --omit=dev

# 2. Copia el código del servidor y de la página
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 3. Puerto en el que escucha Express
ENV NODE_ENV=production
EXPOSE 3000

# 4. Arranca el servidor
CMD ["node", "backend/server.js"]