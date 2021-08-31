#!/bin/bash

set -eo pipefail

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
  if [ ! -f ${IMAGE_ARCHIVE_LOCATION} ]; then
    log "Downloading ${IMAGE_ARCHIVE}"
    curl -L -o ${IMAGE_ARCHIVE_LOCATION} ${IMAGE_URL}
  fi
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
  if [ "${PI_HOSTNAME}" != "raspberrypi" ]; then
    log "Setting Hostname: ${PI_HOSTNAME}"
    echo "${PI_HOSTNAME}" | sudo tee ${FILESYSTEM_MOUNT}/etc/hostname
    sudo sed -i -E \
      "s/(127\.0\.1\.1\s*)raspberrypi/\1${PI_HOSTNAME}/" \
      ${FILESYSTEM_MOUNT}/etc/hosts
  fi
}

add_static_ip() {
  log "Setting Static IP: ${STATIC_IP}"
  cat <<-EOF | sudo tee -a ${FILESYSTEM_MOUNT}/etc/dhcpcd.conf
interface ${INTERFACE}
static ip_address=${STATIC_IP}/24
static routers=${ROUTER}
static domain_name_servers=${DNS}
EOF
}

add_user() {
  if [ "${NEW_USER}" != "pi" ]; then
    log "Deleting \"pi\" user"
    sudo chroot ${FILESYSTEM_MOUNT} userdel -r pi
    sudo rm -v ${FILESYSTEM_MOUNT}/etc/sudoers.d/010_pi-nopasswd
    log "Adding User: ${NEW_USER}"
    sudo chroot ${FILESYSTEM_MOUNT} useradd -ms /bin/bash ${NEW_USER}
    sudo chroot ${FILESYSTEM_MOUNT} bash -c \
      "echo -e \"${NEW_USER_PWD}\n${NEW_USER_PWD}\" | passwd ${NEW_USER}"
    echo "${NEW_USER} ALL=(ALL) NOPASSWD: ALL" | sudo tee \
      ${FILESYSTEM_MOUNT}/etc/sudoers.d/010_${NEW_USER}-nopasswd
  fi
}

make_mount_dirs() {
  log "Creating mount directories: ${BOOT_MOUNT}, ${FILESYSTEM_MOUNT}"
  mkdir -vp ${FILESYSTEM_MOUNT}
  mkdir -vp ${BOOT_MOUNT}
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
  sync
}

get_user_input() {
  if [ -z "${WIFI_SSID}" ]; then
    read -p "$(log 'Enter Wifi SSID: ')" WIFI_SSID
  fi
  if [ -z "${WIFI_PWD}" ]; then
    read -p "$(log 'Enter Wifi Password: ')" WIFI_PWD
  fi
  if [ -z "${STATIC_IP}" ]; then
    read -p "$(log 'Enter Static IP: ')" STATIC_IP
  fi
  if [ -z "${INTERFACE}" ]; then
    read -p "$(log 'Enter Static IP Interface [wlan0]: ')" INTERFACE
    INTERFACE="${INTERFACE:-wlan0}"
  fi
  if [ -z "${ROUTER}" ]; then
    read -p "$(log 'Enter Router: ')" ROUTER
  fi
  if [ -z "${DNS}" ]; then
    read -p "$(log 'Enter DNS: ')" DNS
  fi
  if [ -z "${PI_HOSTNAME}" ]; then
    read -p "$(log 'Enter Hostname [raspberrypi]: ')" PI_HOSTNAME
    PI_HOSTNAME="${PI_HOSTNAME:-raspberrypi}"
  fi
  if [ -z "${NEW_USER}" ]; then
    read -p "$(log 'Enter Username [pi]: ')" NEW_USER
    NEW_USER="${NEW_USER:-pi}"
  fi
  if [ -z "${NEW_USER_PWD}" ]; then
    read -p "$(log 'Enter User Password [raspberry]: ')" NEW_USER_PWD
    NEW_USER_PWD="${NEW_USER_PWD:-raspberry}"
  fi
  if [ -z "${BLOCK_DEVICE}" ]; then
    lsblk
    read -p "$(log 'Enter Block Device to Reimage: ')" BLOCK_DEVICE
    BLOCK_DEVICE="${BLOCK_DEVICE#/dev/}"
  fi
}

log_settings() {
  echo ""
  echo -e "\033[1;95mWIFI_SSID\033[0;0m:    ${WIFI_SSID}"
  echo -e "\033[1;95mWIFI_PWD\033[0;0m:     ${WIFI_PWD}"
  echo -e "\033[1;95mSTATIC_IP\033[0;0m:    ${STATIC_IP}"
  echo -e "\033[1;95mINTERFACE\033[0;0m:    ${INTERFACE}"
  echo -e "\033[1;95mPI_HOSTNAME\033[0;0m:  ${PI_HOSTNAME}"
  echo -e "\033[1;95mNEW_USER\033[0;0m:     ${NEW_USER}"
  echo -e "\033[1;95mNEW_USER_PWD\033[0;0m: ${NEW_USER_PWD}"
  echo -e "\033[1;95mBLOCK_DEVICE\033[0;0m: ${BLOCK_DEVICE}"
  echo -e "\033[1;95mROUTER\033[0;0m:       ${ROUTER}"
  echo -e "\033[1;95mROUTER\033[0;0m:       ${DNS}"
  echo ""
}

usage() {
  echo ""
  log "$(basename "${BASH_SOURCE[0]}") [options]"
  cat <<-EOF

options:
  --wifi-ssid=<ssid>       Sets wifi SSID

  --wifi-pwd=<pwd>         Sets wifi password

  --ip=<ip>                Sets a static IP

  --ip-interface=<iface>   The interface to use for static ip [default=wlan0]

  --hostname=<hostname>    Sets hostname [default=raspberry]

  --username=<username>    Adds new user (auto-deletes default "pi" user)
                            - Leave blank to use default pi user -

  --user-pwd=<pwd>         Sets password for non "pi" user only
                            - Leave blank to use default pi user -

  --block-device=<device>  The block device to reimage

  --router=<router>        The router ip to use when configuring network
                           interface settings

  --dns=<dns>              The DNS to use when configuring network interface
                           settings

  -h|--help                Print help menu

EOF
  exit 0
}

######
# Main
######
for i in "$@"; do
  case $i in
    --wifi-ssid=*)
      WIFI_SSID="${i#*=}"
      shift
      ;;
    --wifi-pwd=*)
      WIFI_PWD="${i#*=}"
      shift
      ;;
    --ip=*)
      STATIC_IP="${i#*=}"
      shift
      ;;
    --ip-interface=*)
      INTERFACE="${i#*=}"
      shift
      ;;
    --hostname=*)
      PI_HOSTNAME="${i#*=}"
      shift
      ;;
    --username=*)
      NEW_USER="${i#*=}"
      shift
      ;;
    --user-pwd=*)
      NEW_USER_PWD="${i#*=}"
      shift
      ;;
    --block-device=*)
      BLOCK_DEVICE="${i#*=}"
      BLOCK_DEVICE="${BLOCK_DEVICE#/dev/}"
      shift
      ;;
    --router=*)
      ROUTER="${i#*=}"
      shift
      ;;
    --dns=*)
      DNS="${i#*=}"
      shift
      ;;
    *)
      usage
      ;;
  esac
done

trap "clean_up" EXIT

get_user_input
log_settings
download_image
extract_image
make_mount_dirs
mount ${BOOT_MOUNT}
enable_ssh
unmount ${BOOT_MOUNT}
mount ${FILESYSTEM_MOUNT}
add_wifi_settings
add_static_ip
add_user
set_hostname
unblock_rfkill
unmount ${FILESYSTEM_MOUNT}
reimage
log "Re-image complete!"
