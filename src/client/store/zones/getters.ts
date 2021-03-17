import { GetterTree } from "vuex";
import { ZoneState, ZonesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<ZonesState, RootState> = {
  allZones(state): ZoneState[] {
    const { zones } = state;
    return zones;
  },

  zonesCount(state): number {
    const { zones } = state;
    return zones.length;
  }
};
