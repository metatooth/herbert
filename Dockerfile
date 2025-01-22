FROM node:20.18.1 AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --unsafe-perms

FROM base AS client

COPY src/client ./src/client
COPY src/shared src/shared
COPY tsconfig.json \
  tsconfig.base.json \
  babel.config.js \
  eslint.config.js \
  jest.config.js \
  vue.config.js \
  vite.config.mjs \
  ./

RUN npm run build:client

CMD ["npm", "run", "serve:client"]

FROM base AS server

COPY config ./config
COPY src/server ./src/server
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:server

CMD ["npm", "run", "serve:server"]

FROM base AS socket-server

COPY config ./config
COPY src/socket-server ./src/socket-server
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:socket-server

CMD ["npm", "run", "serve:socket-server"]

FROM base AS worker

RUN apt update \
  && apt install -y \
  bluetooth \
  bluez \
  libbluetooth-dev \
  libudev-dev

COPY src/worker ./src/worker
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:worker

CMD ["npm", "run", "serve:worker"]
