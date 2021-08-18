import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Config, ConfigState } from "./types";
import { RootState } from "../types";

const state: ConfigState = {
  configs: [] as Config[],
  error: false
};

const namespaced = true;

export const configs: Module<ConfigState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
