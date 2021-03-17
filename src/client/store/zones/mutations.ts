import { MutationTree } from "vuex";
import { ZonesState, ZoneState } from "./types";

export const mutations: MutationTree<ZonesState> = {
  SET_ZONES(state, payload: ZoneState[]) {
    state.error = false;
    state.zones = payload;
  },
  ZONES_ERROR(state) {
    state.error = true;
    state.zones = [];
  }
};
