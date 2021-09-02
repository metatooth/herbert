# Herbert

An environment control system with SwitchBot and WYZE devices.

## Getting Started

Using Ubuntu 20.04 or Raspberry Pi OS Lite 5.10 2021-05-07

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
- Add hosts for databases
    - Set vars listed under [databases:vars]

## Deployment Version

Deployment is performed using the `ci/Makefile` and `make` command. To choose
the version of Herbert to deploy, you must set the `HERBERT_BRANCH` var. To
use an Ansible inventory outside the source tree, you must set the
`ANSIBLE_INVENTORY` var. See examples below.

```bash
# deploy tagged version 0.18.0
cd ci && make deploy-all HERBERT_BRANCH=0.18.0 ANSIBLE_INVENTORY=~/inventory

# deploy main branch to only workers
cd ci && make deploy-workers HERBERT_BRANCH=main

# deploy local changes in current working directory to only servers
cd ci && make deploy-servers HERBERT_BRANCH=local

# deploy develop branch to only clients
cd ci && make deploy-clients HERBERT_BRANCH=develop

# deploy to only databases (No need to set HERBERT_BRANCH here)
cd ci && make deploy-databases
```

## Database Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image database using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add database hosts under `[databases]` section
    - Set vars under `[databases:vars]` section
- Run ansible databases deployment
    - `cd ci && make deploy-databases`

## Server Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image server using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add server hosts under `[servers]` section
- Run ansible servers deployment
    - `cd ci && make deploy-servers HERBERT_BRANCH=<branch_or_tag>`

## Worker Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image worker using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add worker hosts under `[workers]` section
- Run ansible workers deployment
    - `cd ci && make deploy-workers HERBERT_BRANCH=<branch_or_tag>`

Deploying to a single worker via ansible can be accomplished via the following:

```
cd ci/ansible
ansible-playbook --limit <target_worker_host_ip> worker.yml
```

## Client Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.10 2021-05-07

- Image client using `scripts/reimage.sh` script
- Update `ci/ansible/inventory`
    - Add client hosts under `[clients]` section
- Run ansible clients deployment
    - `cd ci && make deploy-clients HERBERT_BRANCH=<branch_or_tag>`

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

Scale up workers

```bash
# Create 3 worker containers
make scale-workers NUM_WORKERS=3
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
