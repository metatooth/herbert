import { GetterTree } from "vuex";
import { Settings, SettingsState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<SettingsState, RootState> = {
  settings(state): Settings {
    const { settings } = state;
    return settings;
  },
};
