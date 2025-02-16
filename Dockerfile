FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build with production environment
ARG VITE_API_URL=https://youtube-clone-backend-dqkx.onrender.com
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add environment variable handling for runtime
RUN apk add --no-cache bash
COPY ./env.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 