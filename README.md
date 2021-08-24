# Herbert

An environment control system with SwitchBot and WYZE devices.

## Getting Started

Using Ubuntu 20.04 or Raspberry Pi OS Lite 5.10 2021-05-07

```
$ sudo apt remove npm nodejs
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
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

## Re-imaging script

```bash
# Prerequisite
sudo apt update && sudo apt install -y qemu-user-static
```

A script is provided to add some initial configuration when setting up
a raspberry pi for the herbert system for the first time. Once your SD card
is mounted, run `scripts/reimage.sh` and follow the prompts. This script will
set a static IP, hostname, and configure wifi settings. When prompted for the
block device to image, be sure to enter the parent block device not a partition.

You can also pass in each option as a command line argument instead of being
prompted for input. See `scripts/reimage.sh -h` for details.

Block device must have single, free partition.

Note: This script has only been tested on Linux, more work may be needed to
get this to work on OSX.

## Deployment Prequisites

The following must be installed in order to run ansible deployments:

- Python3
- Ansible
    - pip install ansible
- Ansible Role Dependencies
    - `ansible-galaxy install geerlingguy.postgresql`
    - `ansible-galaxy install geerlingguy.nodejs`

## Deployment Inventory

We are currently using ansible for deployments. To get started you need to
create an inventory file. A sample inventory file has been provided in
`ci/ansible/inventory.sample`. First copy the sample file to
`ci/ansible/inventory`.

- Set the SSH user, password, ans herbert_version in the [all:vars] section
    - If you want to deploy a local version of herbert, set
      `herbert_version=local`
- Add IPs / hosts for databases
    - Set vars listed under [databases:vars]
- Add IPs / hosts for servers
    - Set the vars listed under [servers:vars]
- Add IPs / hosts for clients
    - Set the vars listed under [clients:vars]
- Add IPs / hosts for workers
    - Set config_path and config_name per worker IP

## Database Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image database using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add database IP under `[databases]` section
    - Set vars under `[databases:vars]` section
- Run ansible databases deployment
    - `cd ci/ansible && ansible-playbook -i inventory database.yml`

## Server Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image server using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add server IP under `[servers]` section
    - Set vars under `[servers:vars]` section
- Run ansible servers deployment
    - `cd ci/ansible && ansible-playbook -i inventory server.yml`

## Worker Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image worker using `scripts/reimage.sh` script
- Create configuration json file for worker
- Update `ci/ansible/inventory`
    - Add worker IP under `[workers]` section
    - Set `config_path` and `config_name` for this worker
    - Set vars under `[workers:vars]` section
- Run ansible workers deployment
    - `cd ci/ansible && ansible-playbook -i inventory worker.yml`

Deploying to a single worker via ansible can be accomplished via the following:

```
cd ci/ansible
ansible-playbook --limit <target_worker_host_ip> worker.yml
```

TODO: In the future we can probably use a jinja2 template for configs similar
to what we are doing for service definition files now

## Client Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image client using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add client IP under `[clients]` section
    - Set vars under `[clients:vars]` section
- Run ansible clients deployment
    - `cd ci/ansible && ansible-playbook -i inventory client.yml`

## Deployment Logs
Logs for production deployments are all managed by journald. Each service's
logs can be accessed by running the command `journalctl -u <service_name>`
i.e. `journalctl -u herbert-worker`

Current production services:
    - herbert-server
    - herbert-worker
    - herbert-client

## Docker / Docker Compose

If you want to spin up the entire ecosystem locally for development you can
use the included "docker compose" setup.

- Install Docker for Mac: https://docs.docker.com/docker-for-mac/install/
- Install Make
    - Ubuntu: `sudo apt update && sudo apt install -y make`
    - OSX: `brew install make`

Bring up all containers

```bash
make docker
make up
# Then navigate to http://localhost:8080 in your browser
```

Tear down all containers

```bash
make down
# to remove all data from dockerized database
make down-data
```

See all container logs

```bash
make logs
```

## License

Copyright 2021 Metatooth LLC. See the [LICENSE](LICENSE).
