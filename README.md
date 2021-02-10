# Herbert

An environmental control system using BLE devices and Node.js

## Getting Started

Using Ubuntu 20.04 or Raspberry Pi OS Lite 5.4 2020-08-09

```
$ sudo apt remove npm nodejs
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
$ sudo apt-get install -y nodejs
$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev -y
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

# build for production with minification
npm run build:client

# run all tests
npm test
```

## Client Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.4 2020-08-20

- Add device configuration to ~/herbert/config/production.json
- Install script and add to system defaults
- Start and check status

```
$ sudo cp scripts/herbert /etc/init.d/herbert
$ sudo update-rc.d herbert defaults
$ sudo /etc/init.d/herbert start
$ sudo /etc/init.d/herbert status
```

## License

Copyright 2021 Metatooth LLC. See the [LICENSE](LICENSE).
