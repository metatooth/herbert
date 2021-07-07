FROM node:14.6

WORKDIR /app

RUN apt update \
  && apt install -y \
  bluetooth \
  bluez \
  libbluetooth-dev \
  libudev-dev

COPY . .

RUN npm install --unsafe-perms

RUN npm run build
