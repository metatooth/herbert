#!/bin/bash

set -euo pipefail

IMAGE_BASE_URL=https://downloads.raspberrypi.org
IMAGE_URL_PATH=raspios_lite_armhf/images/raspios_lite_armhf-2021-05-28
IMAGE_NAME_BASE=2021-05-07-raspios-buster-armhf-lite

IMAGE_ARCHIVE=${IMAGE_NAME_BASE}.zip
IMAGE_URL="${IMAGE_BASE_URL}/${IMAGE_URL_PATH}/${IMAGE_ARCHIVE}"

IMAGE_DEST=~/Downloads
IMAGE_ARCHIVE_LOCATION=${IMAGE_DEST}/${IMAGE_ARCHIVE}
IMAGE=${IMAGE_NAME_BASE}.img
IMAGE_LOCATION=${IMAGE_DEST}/${IMAGE}

FILESYSTEM_MOUNT=~/Downloads/raspi_mnt
BOOT_MOUNT=~/Downloads/raspi_boot_mnt

log() {
  echo -e "\033[1;95m$@\033[0;0m"
}

download_image() {
  log "Downloading ${IMAGE_ARCHIVE}"
  curl -L -o ${IMAGE_ARCHIVE_LOCATION} ${IMAGE_URL}
}

extract_image() {
  log "Extracting ${IMAGE_ARCHIVE_LOCATION}"
  unzip -d ${IMAGE_DEST} ${IMAGE_ARCHIVE_LOCATION}
}

clean_up() {
  sudo umount ${FILESYSTEM_MOUNT} >/dev/null 2>&1 || true
  sudo umount ${BOOT_MOUNT} >/dev/null 2>&1 || true
  rm -f ${IMAGE_LOCATION}
  rm -rf ${FILESYSTEM_MOUNT}
  rm -rf ${BOOT_MOUNT}
}

enable_ssh() {
  log "Enabling SSH"
  sudo touch ${BOOT_MOUNT}/ssh
}

add_wifi_settings() {
  log "Updating Wifi Settings: ${WIFI_SSID}"
  cat <<-EOF | sudo tee -a \
    ${FILESYSTEM_MOUNT}/etc/wpa_supplicant/wpa_supplicant.conf
country=US
network={
  ssid="${WIFI_SSID}"
  scan_ssid=1
  psk="${WIFI_PWD}"
  key_mgmt=WPA-PSK
}
EOF
  sudo sed -i -E \
    's/(update_config=)1/\10/' \
    ${FILESYSTEM_MOUNT}/etc/wpa_supplicant/wpa_supplicant.conf
}

unblock_rfkill() {
  log "Unblocking rfkill"
  for f in ${FILESYSTEM_MOUNT}/var/lib/systemd/rfkill/*:wlan; do
    echo 0 | sudo tee ${f}
  done
}

set_hostname() {
  log "Setting Hostname: ${HOSTNAME}"
  echo "${HOSTNAME}" | sudo tee ${FILESYSTEM_MOUNT}/etc/hostname
  sudo sed -i -E \
    "s/(127\.0\.1\.1\s*)raspberrypi/\1${HOSTNAME}/" \
    ${FILESYSTEM_MOUNT}/etc/hosts
}

add_static_ip() {
  log "Setting Static IP: ${STATIC_IP}"
  local router=$(echo ${STATIC_IP} | sed -E 's/\.\w{1,3}$/\.1/')
  cat <<-EOF | sudo tee -a ${FILESYSTEM_MOUNT}/etc/dhcpcd.conf
interface wlan0
static ip_address=${STATIC_IP}/24
static routers=${router}
static domain_name_servers=${router} 8.8.8.8
EOF
}

get_start_offset() {
  local img=$1
  local start=$(fdisk -l ${IMAGE_LOCATION} | grep ${img} | awk '{print $2}')
  echo $[512*${start}]
}

mount() {
  local img
  local offset
  local mnt=$1

  if [ "${mnt}" = ${BOOT_MOUNT} ]; then
    img=img1
  elif [ "${mnt}" = "${FILESYSTEM_MOUNT}" ]; then
    img=img2
  fi

  offset=$(get_start_offset ${img})
  log "Mounting ${mnt}"
  sudo mount ${IMAGE_LOCATION} -o offset=${offset} ${mnt}
}

unmount() {
  log "Unmounting ${1}"
  sudo umount ${1}
}

reimage() {
  log "Reimaging device: /dev/${BLOCK_DEVICE}"
  sudo dd bs=4M if=${IMAGE_LOCATION} of=/dev/${BLOCK_DEVICE}
}

######
# Main
######
trap "clean_up" EXIT

read -p "$(log 'Enter Wifi SSID: ')" WIFI_SSID
read -p "$(log 'Enter Wifi Password: ')" WIFI_PWD
read -p "$(log 'Enter Static IP: ')" STATIC_IP
read -p "$(log 'Enter Hostname: ')" HOSTNAME
lsblk
read -p "$(log 'Enter Block Device to Reimage: ')" BLOCK_DEVICE

if [ ! -f ${IMAGE_ARCHIVE_LOCATION} ]; then
  download_image
fi

log "Creating mount directories: ${BOOT_MOUNT}, ${FILESYSTEM_MOUNT}"
mkdir -vp ${FILESYSTEM_MOUNT}
mkdir -vp ${BOOT_MOUNT}
extract_image
mount ${BOOT_MOUNT}
enable_ssh
unmount ${BOOT_MOUNT}
mount ${FILESYSTEM_MOUNT}
add_wifi_settings
add_static_ip
set_hostname
unblock_rfkill
unmount ${FILESYSTEM_MOUNT}
reimage
sync
log "Re-image complete!"
