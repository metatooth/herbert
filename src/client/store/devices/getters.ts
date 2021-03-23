import { GetterTree } from "vuex";
import { Device, DevicesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<DevicesState, RootState> = {
  devices(state): Device[] {
    const { devices } = state;
    return devices;
  },

  meters(state): Device[] {
    const { devices } = state;
    return devices.filter(device => device.devicetype === "meter");
  },

  switches(state): Device[] {
    const { devices } = state;
    return devices.filter(device => device.devicetype !== "meter");
  },

  devicesCount(state): number {
    const { devices } = state;
    return devices.length;
  }
};
