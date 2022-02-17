import { MutationTree } from "vuex";
import { ZonesState, Zone } from "./types";

export const mutations: MutationTree<ZonesState> = {
  ADD(state, zone: Zone) {
    zone.updatedat = new Date();
    state.zones.push(zone);
  },
  ADD_DEVICE(state, payload: { zone: Zone; device: Device }) {
    state.zones.find((zone: Zone) => {
      if (zone.id === payload.zone.id) {
        const found = zone.devices.find((d: Device) => {
          return d.id === device;
        });
        if (!found) {
          zone.devices.push(payload.device);
        }
      }
    });
  },
  ADD_METER(state, payload: { zone: Zone; meter: Meter }) {
    state.zones.find((zone: Zone) => {
      if (zone.id === payload.zone.id) {
        const found = zone.meters.find((m: Meter) => {
          return m.device === meter;
        });
        if (!found) {
          zone.meters.push(payload.meter);
        }
      }
    });
  },
  ADD_CHILD(state, payload: { zone: Zone; child: number }) {
    state.zones.find((zone: Zone) => {
      if (zone.id === payload.zone.id) {
        const found = zone.children.find((z: Zone) => {
          return z.id === payload.child;
        });
        if (!found) {
          zone.children.push(payload.child);
        }
      }
    });
  },
  EDIT(state, zone: Zone) {
    const found = state.zones.find((el: Zone) => {
      return el.id === zone.id;
    });
    console.log("found", found);
    console.log("zone", zone);
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
  REMOVE_DEVICE(state, payload: { zone: Zone; device: string }) {
    state.zones.find((el: Zone) => {
      if (el.id === payload.zone.id) {
        const index = el.devices.indexOf(payload.device);
        el.devices.splice(index, 1);
      }
    });
  },
  REMOVE_METER(state, payload: { zone: Zone; meter: string }) {
    state.zones.find((el: Zone) => {
      if (el.id === payload.zone.id) {
        const index = el.meters.indexOf(payload.meter);
        el.meters.splice(index, 1);
      }
    });
  },
  REMOVE_CHILD(state, payload: { zone: Zone; child: number }) {
    state.zones.find((el: Zone) => {
      if (el.id === payload.zone.id) {
        const index = el.children.indexOf(payload.child);
        el.children.splice(index, 1);
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
