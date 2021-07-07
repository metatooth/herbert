import { MutationTree } from "vuex";
import { ZonesState, Zone } from "./types";

export const mutations: MutationTree<ZonesState> = {
  ADD(state, zone: Zone) {
    zone.updatedat = new Date();
    state.zones.push(zone);
  },
  ADD_DEVICE(state, payload: { zone: Zone; device: Device }) {
    state.zones.find((el: Zone) => {
      if (el.id === payload.zone.id) {
        el.devices.push(payload.device);
      }
    });
  },
  EDIT(state, zone: Zone) {
    const found = state.zones.find((el: Zone) => {
      return el.id === zone.id;
    });
    if (found) {
      const index = state.zones.indexOf(found);
      state.zones.splice(index, 1, zone);
    }
  },
  REMOVE(state, zone: Zone) {
    const found = state.zones.find((el: Zone) => {
      return el.id === zone.id;
    });
    if (found) {
      const index = state.zones.indexOf(found);
      state.zones.splice(index, 1);
    }
  },
  REMOVE_DEVICE(state, payload: { zone: Zone; device: Device }) {
    state.zones.find((el: Zone) => {
      if (el.id === payload.zone.id) {
        const index = el.devices.indexOf(payload.device);
        state.zones.splice(index, 1);
      }
    });
  },
  SET(state, payload: Zone[]) {
    state.error = false;
    state.zones = payload;
  },
  ERROR(state) {
    state.error = true;
    state.zones = [];
  }
};
