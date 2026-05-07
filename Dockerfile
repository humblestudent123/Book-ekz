# Статическая сборка React и раздача через nginx
FROM node:20-bookworm AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY public ./public
COPY src ./src

ARG REACT_APP_RECOMMENDATIONS_API_URL=http://localhost:4000
ENV REACT_APP_RECOMMENDATIONS_API_URL=$REACT_APP_RECOMMENDATIONS_API_URL

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
