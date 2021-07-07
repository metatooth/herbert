# Herbert

An environment control system with SwitchBot and WYZE devices.

## Getting Started

Using Ubuntu 20.04 or Raspberry Pi OS Lite 5.4 2020-08-09

```
$ sudo apt remove npm nodejs
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
$ sudo apt-get install -y nodejs
$ sudo apt-get install -y git bluetooth bluez libbluetooth-dev libudev-dev
$ git clone https://github.com/metatooth/herbert.git
```

## Build Setup

``` bash
# install dependencies
npm install

# compile and watch the server
npm run serve:server

# compile and watch the worker
npm run serve:worker

# serve with hot reload at localhost:8080
npm run serve:client

# build all
npm run build

# build client
npm run build:client

# build server
npm run build:server

# build worker
npm run build:worker

# run all tests
npm test
```

## Worker Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.4 2020-08-20

- Add device configuration to ~/herbert/config/production.json
- Install script and add to system defaults
- Start and check status

```
$ sudo cp scripts/herbert /etc/init.d/herbert
$ sudo nano /etc/init.d/herbert
$ sudo chmod 755 /etc/init.d/herbert
$ sudo update-rc.d herbert defaults
$ sudo /etc/init.d/herbert start
$ sudo /etc/init.d/herbert status
```

## Docker / Docker Compose

If you want to spin up the entire ecosystem locally for development you can
use the included "docker compose" setup.

Install Docker for Mac: https://docs.docker.com/docker-for-mac/install/

Bring up all containers

```bash
docker compose up
# Then navigate to http://localhost:8080 in your browser
```

Tear down all containers

```
docker compose down
```

## License

Copyright 2021 Metatooth LLC. See the [LICENSE](LICENSE).
