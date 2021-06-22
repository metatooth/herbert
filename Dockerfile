FROM node:14.6

WORKDIR /app

COPY . .

RUN apt update \
  && apt install -y \
  bluetooth \
  bluez \
  libbluetooth-dev \
  libudev-dev \
  && npm install --unsafe-perms \
  && npm run build