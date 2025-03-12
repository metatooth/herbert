#!/bin/bash

SERVICE=$1
BRANCH=$2
INVENTORY=$3

if [ -z "${SERVICE}" ] || [ -z "${BRANCH}" ] || [ -z "${INVENTORY}" ]; then
  echo "usage: ./build.sh SERVICE BRANCH INVENTORY"
  exit 1
fi

HERE=$( cd $( dirname "${BASH_SOURCE[0]}" ) >/dev/null 2>&1 && pwd )
TOPDIR=$( dirname ${HERE} )

API_HOST=$(cat ${INVENTORY} | grep -C 1 '\[servers\]' | awk 'NR==3')
API_PORT=$(cat ${INVENTORY} | grep api_port= | awk -F= 'NR==1 { print $2 }')
WSS_HOST=$(cat ${INVENTORY} | grep -C 1 '\[socket_servers\]' | awk 'NR==3')
WSS_PORT=$(cat ${INVENTORY} | grep wss_port= | awk -F= 'NR==2 { print $2 }')
APP_API_URL=http://${API_HOST}:${API_PORT}
APP_WS_URL=ws://${WSS_HOST}:${WSS_PORT}

TMP_DIR=/tmp/herbert
rm -rf $TMP_DIR
mkdir -p $TMP_DIR

BUILD_DIR=${TMP_DIR}/${BRANCH}
DEPLOYMENT_DIR=${TMP_DIR}/deployment

cleanup() {
  rm -rfv $BUILD_DIR
}

trap "cleanup" EXIT

if [ "${BRANCH}" = "local" ]; then
  ln -sf ${TOPDIR} ${BUILD_DIR}
else
  git clone https://github.com/metatooth/herbert.git $BUILD_DIR
  cd $BUILD_DIR
  git checkout $BRANCH
fi

cd $BUILD_DIR

rm -rf $DEPLOYMENT_DIR
mkdir -p $DEPLOYMENT_DIR

if [ "${SERVICE}" = "server" ]; then
  docker compose build api
  docker save herbert_server:latest | gzip > $DEPLOYMENT_DIR/herbert_server_latest.tar.gz
elif [ "${SERVICE}" = "socket-server" ]; then
  docker compose build socket_server
  docker save herbert_socket:latest | gzip > $DEPLOYMENT_DIR/herbert_socket_latest.tar.gz
elif [ "${SERVICE}" = "controller" ]; then
  docker compose build controller
  docker save herbert_controller:latest | gzip > $DEPLOYMENT_DIR/herbert_controller_latest.tar.gz
elif [ "${SERVICE}" = "client" ]; then
  docker compose build \
         --build-arg "API_URL=http://thermos.metatooth.com:5000" \
         --build-arg "WSS_URL=ws://thermos.metatooth.com:2929" \
         client
  docker save herbert_client:latest | gzip > $DEPLOYMENT_DIR/herbert_client_latest.tar.gz
elif [ "${SERVICE}" = "worker" ]; then
  npm install
  npm run build:worker

  cp -R dist $DEPLOYMENT_DIR
  cp -R config $DEPLOYMENT_DIR
  cp package.json package-lock.json $DEPLOYMENT_DIR

  mkdir $DEPLOYMENT_DIR/scripts
  cp scripts/AKB73016012.licrd.conf $DEPLOYMENT_DIR/scripts/AKB73016012.licrd.conf
  cp scripts/810900812A.licrd.conf $DEPLOYMENT_DIR/scripts/810900812A.licrd.conf
fi
