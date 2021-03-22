import { GetterTree } from "vuex";
import { DeviceState, DevicesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<DevicesState, RootState> = {
  allDevices(state): DeviceState[] {
    const { devices } = state;
    return devices;
  },

  allMeters(state): DeviceState[] {
    const { devices } = state;
    const filter = (dev: DeviceState) => {
      return dev.device.devicetype === "meter";
    };
    return devices.filter(filter);
  },

  allSwitches(state): DeviceState[] {
    const { devices } = state;
    const filter = (dev: DeviceState) => {
      return dev.device.devicetype !== "meter";
    };
    return devices.filter(filter);
  },

  devicesCount(state): number {
    const { devices } = state;
    return devices.length;
  }
};
