FROM node:18-alpine

WORKDIR /app

# Instalamos las herramientas necesarias para compilar paquetes nativos como bcrypt en Alpine
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]