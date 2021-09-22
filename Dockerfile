FROM node:14.17.4 as base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --unsafe-perms

FROM base as client

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

FROM base as server

COPY config ./config
COPY src/server ./src/server
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:server

CMD ["npm", "run", "serve:server"]

FROM base as socket-server

COPY config ./config
COPY src/socket-server ./src/socket-server
COPY src/shared src/shared
COPY tsconfig.json tsconfig.base.json ./

RUN npm run build:socket-server

CMD ["npm", "run", "serve:socket-server"]

FROM base as worker

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
