import { GetterTree } from "vuex";
import { Device, DeviceState, DevicesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<DevicesState, RootState> = {
  devices(state): DeviceState[] {
    const { devices } = state;
    return devices;
  },

  meters(state): DeviceState[] {
    const { devices } = state;
    return devices.filter(d => d.device.devicetype === "meter");
  },

  switches(state): DeviceState[] {
    const { devices } = state;
    return devices.filter(d => d.device.devicetype !== "meter");
  },

  devicesCount(state): number {
    const { devices } = state;
    return devices.length;
  }
};
