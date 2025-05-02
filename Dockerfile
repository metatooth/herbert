FROM node:20.18.2-bullseye AS base

WORKDIR /code

COPY apps/ ./
COPY package.json package-lock.json ./

RUN npm install --unsafe-perms

FROM base AS shared

COPY tsconfig.json tsconfig.base.json ./
RUN npm run build --workspace=apps/shared

FROM shared AS client

COPY apps/client apps/client

ARG API_URL
ARG WSS_URL

RUN VITE_API_URL=$API_URL VITE_WSS_URL=$WSS_URL npm run build --workspace=apps/client

FROM nginx:stable-alpine AS runner
WORKDIR /code
COPY --from=client /code/apps/client/nginx /etc/nginx/conf.d
COPY --from=client /code/apps/client/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM shared AS api

COPY config ./config
COPY apps/api ./apps/api

RUN npm run build --workspace=apps/api

CMD ["npm", "run", "serve", "--workspace=apps/api"]

FROM shared AS socket

COPY config ./config
COPY apps/socket ./apps/socket
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build --workspace=apps/socket

CMD ["npm", "run", "serve:socket-server"]

FROM shared AS controller

COPY config ./config
COPY apps/controller ./apps/controller
COPY apps/shared apps/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:controller

CMD ["npm", "run", "serve:controller"]

FROM shared AS worker

RUN apt update \
  && apt install -y \
  bluetooth \
  bluez \
  dbus \
  libbluetooth-dev \
  libudev-dev

COPY apps/worker ./apps/worker
COPY apps/shared apps/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:worker

COPY worker-entrypoint.sh entrypoint.sh

CMD ./entrypoint.sh
