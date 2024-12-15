import { GetterTree } from "vuex";
import { Zone, ZonesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<ZonesState, RootState> = {
  zones(state): Zone[] {
    const { zones } = state;
    return zones;
  },

  zonesCount(state): number {
    const { zones } = state;
    return zones.length;
  },
};
