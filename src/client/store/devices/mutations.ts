import { MutationTree } from "vuex";
import { Device, DevicesState } from "./types";

export const mutations: MutationTree<DevicesState> = {
  EDIT(state, payload: Device) {
    const found = state.devices.find((el: Device) => {
      return el.device === payload.device;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      state.devices.splice(index, 1, payload);
    }
  },
  OFF(state, payload: string) {
    const found = state.devices.find((el: Device) => {
      return el.device === payload;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      found.status = "off";
      state.devices.splice(index, 1, found);
    }
  },
  ON(state, payload: string) {
    const found = state.devices.find((el: Device) => {
      return el.device === payload;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      found.status = "on";
      state.devices.splice(index, 1, found);
    }
  },
  REMOVE(state, payload: Device) {
    const found = state.devices.find((el: Device) => {
      return el.device === payload.device;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      state.devices.splice(index, 1);
    }
  },
  SET(state, payload: Device[]) {
    state.error = false;
    state.devices = payload;
  },
  DEVICE_ERROR(state) {
    state.error = true;
  },
  DEVICES_ERROR(state) {
    state.error = true;
    state.devices = [];
  }
};
