# Cannabis

## TODO: Come up with better name.

## Getting Started

Using Ubuntu 20.04

```
$ sudo apt-get update && sudo apt-get install nodejs npm -y
$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev -y
$ git clone https://github.com/metatooth/cannabis.git
$ cd cannabis
$ npm install
$ npm run build
$ sudo node src/index.js
```

## Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.4 2020-08-20

```
$ sudo /etc/init.d/cannabis status
```

## License

Copyright 2020 Metatooth LLC. See the [LICENSE](LICENSE).
