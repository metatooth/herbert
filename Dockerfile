FROM node:18-alpine3.16 AS base

RUN apk update && apk add python3 make g++

RUN npm update -g npm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

FROM base AS client

COPY src/client ./src/client
COPY src/shared src/shared
COPY tsconfig.json \
  tsconfig.base.json \
  babel.config.js \
  .eslintrc.js \
  .eslintignore \
  jest.config.js \
  vue.config.js \
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

FROM base AS controller

COPY config ./config
COPY src/controller ./src/controller
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:controller

CMD ["npm", "run", "serve:controller"]

FROM base AS socket-server

COPY config ./config
COPY src/socket-server ./src/socket-server
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:socket-server

CMD ["npm", "run", "serve:socket-server"]

FROM base AS worker

RUN apk add gnome-bluetooth

COPY src/worker ./src/worker
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:worker

CMD ["npm", "run", "serve:worker"]
