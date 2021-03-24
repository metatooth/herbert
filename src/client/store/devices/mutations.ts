import { MutationTree } from "vuex";
import { DevicesState, DeviceState, Device } from "./types";

export const mutations: MutationTree<DevicesState> = {
  EDIT(state, payload: Device) {
    const found = state.devices.find((el: DeviceState) => {
      return el.device.device === payload.device;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      const dstate = {
        device: payload,
        error: false
      };

      state.devices.splice(index, 1, dstate);
    }
  },
  OFF(state, payload: string) {
    const found = state.devices.find((el: DeviceState) => {
      return el.device.device === payload;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      found.status = "off";
      state.devices.splice(index, 1, found);
    }
  },
  ON(state, payload: string) {
    const found = state.devices.find((el: DeviceState) => {
      return el.device.device === payload;
    });
    if (found) {
      const index = state.devices.indexOf(found);
      found.status = "on";
      state.devices.splice(index, 1, found);
    }
  },
  SET(state, payload: Device[]) {
    state.error = false;

    state.devices = [];
    payload.forEach(d => {
      state.devices.push({ device: d, error: false });
    });
  },
  DEVICE_ERROR(state) {
    state.error = true;
  },
  DEVICES_ERROR(state) {
    state.error = true;
    state.devices = [];
  }
};
