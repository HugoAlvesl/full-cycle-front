# =========================
# Stage 1 - Build Angular
# =========================
FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production


# =========================
# Stage 2 - Nginx
# =========================
FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Config Nginx SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Angular build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
