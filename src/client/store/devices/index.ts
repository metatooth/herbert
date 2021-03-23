import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { DeviceState, DevicesState } from "./types";
import { RootState } from "../types";

const state: DevicesState = {
  devices: [] as DeviceState[],
  error: false
};

const namespaced = true;

export const devices: Module<DevicesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
