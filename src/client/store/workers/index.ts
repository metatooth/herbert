import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Worker, WorkersState } from "./types";
import { RootState } from "../types";

const state: WorkersState = {
  workers: [] as Worker[],
  error: false
};

const namespaced = true;

export const workers: Module<WorkersState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export default workers;
