import { MutationTree } from "vuex";
import { Meter, MetersState } from "./types";

export const mutations: MutationTree<MetersState> = {
  EDIT(state, payload: Meter) {
    const found = state.meters.find((el: Meter) => {
      return el.device === payload.device;
    });
    if (found) {
      const index = state.meters.indexOf(found);
      state.meters.splice(index, 1, payload);
    }
  },
  REMOVE(state, payload: Meter) {
    const found = state.meters.find((el: Meter) => {
      return el.device === payload.device;
    });
    if (found) {
      const index = state.meters.indexOf(found);
      state.meters.splice(index, 1);
    }
  },
  SET(state, payload: Meter[]) {
    state.error = false;
    state.meters = payload;
  },
  METER_ERROR(state) {
    state.error = true;
  },
  METERS_ERROR(state) {
    state.error = true;
    state.meters = [];
  }
};
