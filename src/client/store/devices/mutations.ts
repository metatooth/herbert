import { MutationTree } from "vuex";
import { DevicesState, Device } from "./types";

export const mutations: MutationTree<DevicesState> = {
  EDIT(state, payload: Device) {
    const found = state.devices.find((el: Device) => { return el.id === payload.id });
    const index = state.devices.indexOf(found);
    state.devices.splice(index, 1, found);
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
