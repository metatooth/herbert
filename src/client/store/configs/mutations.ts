import { MutationTree } from "vuex";
import { Config, ConfigState } from "./types";

export const mutations: MutationTree<ConfigState> = {
  ADD(state, payload: Config) {
    state.configs.push(payload);
  },
  EDIT(state, payload: Config) {
    const found = state.configs.find((el: Config) => {
      return el.nickname === payload.nickname;
    });
    if (found) {
      const index = state.configs.indexOf(found);
      state.configs.splice(index, 1, payload);
    }
  },
  SET(state, payload: Config[]) {
    state.error = false;
    state.configs = payload;
  },
  CONFIGS_ERROR(state) {
    state.error = true;
    state.configs = [];
  },
};
