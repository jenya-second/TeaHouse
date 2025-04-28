# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.1

# FROM zenika/alpine-chrome AS base
FROM node:${NODE_VERSION}-alpine AS base
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /TeaHouse
WORKDIR /TeaHouse
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=backend /prod/backend
# RUN pnpm deploy --filter=frontend /prod/frontend

FROM base AS backend 
COPY --from=build /prod/backend /backend
WORKDIR /backend
# RUN pnpm puppeteer browsers install chrome@134.0.6998.35
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN pnpm build-back
RUN apk add chromium
EXPOSE 1234
CMD [ "node", "dist/main" ]

FROM nginx:alpine AS frontend
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /prod/frontend /frontend
WORKDIR /frontend
RUN pnpm build
RUN cp -r /prod/frontend/dist /usr/share/nginx/html
RUN mkdir -p /var/www/certbot
VOLUME ["/var/www/certbot", "/etc/letsencrypt"]
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
