import { GetterTree } from "vuex";
import { Meter, MetersState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<MetersState, RootState> = {
  meters(state): Meter[] {
    const { meters } = state;
    return meters;
  },

  metersCount(state): number {
    const { meters } = state;
    return meters.length;
  }
};
