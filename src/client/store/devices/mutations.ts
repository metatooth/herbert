import { MutationTree } from "vuex";
import { DevicesState, DeviceState } from "./types";

export const mutations: MutationTree<DevicesState> = {
  SET_DEVICES(state, payload: DeviceState[]) {
    state.error = false;
    state.devices = payload;
  },
  DEVICES_ERROR(state) {
    state.error = true;
    state.devices = [];
  }
};
