import { GetterTree } from "vuex";
import { Config, ConfigState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<ConfigState, RootState> = {
  configs(state): Config[] {
    const { configs } = state;
    return configs;
  },

  configsCount(state): number {
    const { configs } = state;
    return configs.length;
  },
};
