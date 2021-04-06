import { GetterTree } from "vuex";
import { Device, DevicesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<DevicesState, RootState> = {
  devices(state): Device[] {
    const { devices } = state;
    return devices;
  },

  devicesCount(state): number {
    const { devices } = state;
    return devices.length;
  },

  meters(state): Device[] {
    const { devices } = state;
    return devices.filter(d => d.devicetype === "meter").sort((a, b) => {
      a.device > b.device;
    });
  },

  metersCount(state): Device[] {
    const { devices } = state;
    return devices.filter(d => d.devicetype === "meter").length;
  },

  switches(state): Device[] {
    const { devices } = state;
    return devices.filter(d => d.devicetype !== "meter").sort((a, b) => {
      a.device > b.device;
    });
  },

  switchesCount(state): Device[] {
    const { devices } = state;
    return devices.filter(d => d.devicetype !== "meter").length;
  }

};
