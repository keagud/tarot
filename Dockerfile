# syntax=docker/dockerfile:1
##  Build Stage

FROM node:20-bookworm-slim as build
ENV PNPM_HOME="./pnpm"
ENV PATH="$PNPM_HOME:$PATH"

LABEL fly_launch_runtime="Vite"

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python3

RUN npm install -g pnpm vite typescript
WORKDIR /build

# install dependencies for the server
WORKDIR /build/server/
COPY server/package*.json .
RUN pnpm install


# install dependencies for the frontend
WORKDIR /build/web/
COPY --link web/package*.json .
RUN pnpm install 

# copy common deps
WORKDIR /build/common
COPY ./common/ .
WORKDIR /build
COPY tsconfig.json  .


# build server
WORKDIR /build
COPY --link ./server/ /build/server
WORKDIR /build/server
RUN pnpm build
RUN pnpm prune


#build frontend
WORKDIR /build
COPY web/ /build/web
WORKDIR /build/web
RUN vite build
RUN pnpm prune



## Runtime
FROM nginx:1.24.0-alpine-slim
WORKDIR /app
RUN apk add nodejs 

#copy static files
COPY --link ./server/static /app/static
ENV STATIC_DIR="/app/static"

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# copy generated js for the server
COPY --link --from=build /build/server/dist /app/server

# copy frontend build assets
COPY --link --from=build /build/web/dist /usr/share/nginx/html

# setup runtime node environment
COPY --link ./server/package.json .
COPY --link ./server/pnpm-lock.yaml .
COPY --link --from=build /build/server/node_modules /app/node_modules

EXPOSE 80

# copy and run the startup script
COPY ./run.sh .
RUN chmod +x run.sh
#CMD ["./run.sh"]

