# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.1

# FROM zenika/alpine-chrome AS base
FROM node:${NODE_VERSION}-alpine AS base
# USER root
# RUN apk add nodejs-current
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /TeaHouse
WORKDIR /TeaHouse
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
#     --mount=type=cache,target=/root/.local/share/pnpm/store \
#     pnpm install --prod --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend

FROM base AS backend
COPY --from=build /prod/backend /backend
WORKDIR /backend
# RUN pnpm puppeteer browsers install chrome
EXPOSE 1234
CMD [ "node", "dist/main" ]

FROM base AS frontend
COPY --from=build /prod/frontend /frontend
WORKDIR /frontend
RUN pnpm install -d vite
EXPOSE 80
CMD [ "pnpm", "vite", "preview", "--host" ]