import { MutationTree } from "vuex";
import { ZonesState, ZoneState, Zone } from "./types";

export const mutations: MutationTree<ZonesState> = {
  ADD(state, zone: Zone) {
    zone.updatedat = new Date();
    const zstate: ZoneState = {
      zone: zone,
      error: false
    };
    state.zones.push(zstate);
  },
  ADD_DEVICE(state, payload: { zone: Zone; device: string }) {
    console.log("any needed? add zone device mutation", payload);
  },
  EDIT(state, zone: Zone) {
    const found = state.zones.find((el: ZoneState) => {
      return el.zone.id === zone.id;
    });
    if (found) {
      const index = state.zones.indexOf(found);
      const zstate: ZoneState = {
        zone: zone,
        error: false
      };
      state.zones.splice(index, 1, zstate);
    }
  },
  REMOVE(state, zone: Zone) {
    const found = state.zones.find((el: ZoneState) => {
      return el.zone.id === zone.id;
    });
    if (found) {
      const index = state.zones.indexOf(found);
      state.zones.splice(index, 1);
    }
  },
  REMOVE_DEVICE(state, payload: { zone: Zone; device: string }) {
    console.log("any needed? remove zone device mutation", payload);
  },
  SET(state, zones: Zone[]) {
    state.error = false;
    const zstates: ZoneState[] = [];
    zones.forEach(z => {
      zstates.push({ zone: z, error: false });
    });
    state.zones = zstates;
  },
  ERROR(state) {
    state.error = true;
    state.zones = [];
  }
};
