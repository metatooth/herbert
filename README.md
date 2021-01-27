# Herbert

An environmental control system using BLE devices and Node.js

## Getting Started

Using Ubuntu 20.04 or Raspberry Pi OS Lite 5.4 2020-08-09

```
$ sudo apt-get update && sudo apt-get install git nodejs npm -y
$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev -y
$ git clone https://github.com/metatooth/herbert.git
$ cd herbert
$ npm install
$ npm run build
$ sudo npm run client
```

## Deployment

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
