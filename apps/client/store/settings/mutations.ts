import { MutationTree } from "vuex";
import { Settings, SettingsState } from "./types";

export const mutations: MutationTree<SettingsState> = {
  SET(state, payload: Settings) {
    state.settings = payload;
  },
  ERROR(state) {
    state.error = true;
  },
};
