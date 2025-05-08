# Use the official Node.js image as the base image
FROM node:22-alpine as build

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run db:generate
RUN npm run build

# Use a smaller base image for the runtime
FROM node:22-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/generated ./generated
EXPOSE 2000

# Command to run the application
CMD ["node", "dist/main"]