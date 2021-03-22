import { MutationTree } from "vuex";
import { ZonesState, Zone } from "./types";

export const mutations: MutationTree<ZonesState> = {
  ADD(state, zone: Zone) {
    zone.updatedat = new Date();
    state.zones.push(zone);
  },
  ADD_DEVICE(state, payload: { zone: Zone, device: string }) {
    console.log("any needed? add zone device mutation", payload);
  },
  EDIT(state, zone: Zone) {
    const found = state.zones.find((el: Zone) => {
      return el.id === zone.id;
    });
    const index = state.zones.indexOf(found);
    state.zones.splice(index, 1, zone);
  },
  REMOVE(state, zone: Zone) {
    const found = state.zones.find((el: Zone) => {
      return el.id === zone.id;
    });
    const index = state.zones.indexOf(found);
    state.zones.splice(index, 1);
  },
  REMOVE_DEVICE(state, payload: { zone: Zone, device: string }) {
    console.log("any needed? remove zone device mutation", payload);
  },
  SET(state, zones: Zone[]) {
    state.error = false;
    state.zones = zones;
  },
  ERROR(state) {
    state.error = true;
    state.zones = [];
  }
};
