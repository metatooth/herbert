import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Zone, ZonesState } from "./types";
import { RootState } from "../types";

const state: ZonesState = {
  zones: [] as Zone[],
  error: false
};

const namespaced = true;

export const zones: Module<ZonesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
