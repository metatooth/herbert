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

SERVER_HOST=$(cat ${INVENTORY} | grep -C 1 '\[servers\]' | awk 'NR==3')
API_PORT=$(cat ${INVENTORY} | grep api_port= | awk -F= 'NR==1 { print $2 }')
WS_PORT=$(cat ${INVENTORY} | grep ws_port= | awk -F= 'NR==1 { print $2 }')
VUE_APP_API_URL=http://${SERVER_HOST}:${API_PORT}
VUE_APP_WS_URL=ws://${SERVER_HOST}:${WS_PORT}

TMP_DIR=/tmp/herbert
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

npm install

VUE_APP_API_URL=$VUE_APP_API_URL \
  VUE_APP_WS_URL=$VUE_APP_WS_URL\
  npm run build:${SERVICE}

rm -rf $DEPLOYMENT_DIR
mkdir -p $DEPLOYMENT_DIR

cp -R dist $DEPLOYMENT_DIR
cp package.json package-lock.json $DEPLOYMENT_DIR

if [ "${SERVICE}" = "client" ]; then
  cp index.js $DEPLOYMENT_DIR
else
  cp -R config $DEPLOYMENT_DIR
fi
