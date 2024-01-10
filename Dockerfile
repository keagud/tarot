##  Build Stage

FROM node:20-bookworm-slim as build
ENV PNPM_HOME="./pnpm"
ENV PATH="$PNPM_HOME:$PATH"

LABEL fly_launch_runtime="Vite"

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python3

RUN npm install -g pnpm vite typescript


# copy common deps
WORKDIR /app
COPY tsconfig.json /app/ 
COPY common/ /app/common/ 


# install dependencies for the server

WORKDIR /app
COPY tarot-backend/package*.json ./server/
WORKDIR /app/server/
RUN pnpm install


# install dependencies for the frontend
WORKDIR /app
COPY tarot-frontend/package*.json ./web/
WORKDIR /app/web/
RUN pnpm install 


# build server
WORKDIR /app
COPY tarot-backend/ ./server/
WORKDIR /app/server
RUN pnpm build


#build frontend
WORKDIR /app
COPY tarot-frontend/ ./web/
WORKDIR /app/web
RUN vite build



## Runtime
FROM nginx:1.24.0-alpine-slim

WORKDIR /app/server


# copy frontend build assets

COPY --from=build /app/web/dist /usr/share/nginx/html

