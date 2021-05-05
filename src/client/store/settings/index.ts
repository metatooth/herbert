import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Settings, SettingsState } from "./types";
import { RootState } from "../types";

const state: SettingsState = {
  settings: new Settings(),
  error: false
};

const namespaced = true;

export const settings: Module<SettingsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
