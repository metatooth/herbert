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
};
