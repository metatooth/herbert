import { GetterTree } from "vuex";
import { Device, DevicesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<DevicesState, RootState> = {
  devices(state): Device[] {
    const { devices } = state;
    devices.sort((a, b) => a.device.localeCompare(b.device));
    return devices;
  },

  devicesCount(state): number {
    const { devices } = state;
    return devices.length;
  },

  meters(state): Device[] {
    const { devices } = state;
    const meters = devices.filter(d => d.devicetype === "meter");
    meters.sort((a, b): number => a.device.localeCompare(b.device));
    return meters;
  },

  metersCount(state): number {
    const { devices } = state;
    return devices.filter(d => d.devicetype === "meter").length;
  },

  switches(state): Device[] {
    const { devices } = state;
    const switches = devices.filter(d => d.devicetype !== "meter");
    switches.sort((a, b) => a.device.localeCompare(b.device));
    return switches;
  },

  switchesCount(state): number {
    const { devices } = state;
    return devices.filter(d => d.devicetype !== "meter").length;
  }
};
