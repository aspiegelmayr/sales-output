FROM node:lts-alpine as build-stage
 WORKDIR /app
 COPY package*.json ./
 RUN npm ci
 COPY . .
 EXPOSE 4200
 CMD ["npm", "start"]