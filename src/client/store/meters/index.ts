import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Meter, MetersState } from "./types";
import { RootState } from "../types";

const state: MetersState = {
  meters: [] as Meter[],
  error: false
};

const namespaced = true;

export const meters: Module<MetersState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
