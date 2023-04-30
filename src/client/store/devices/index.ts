import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Device, DevicesState } from "./types";
import { RootState } from "../types";

const state: DevicesState = {
  devices: [] as Device[],
  error: false,
};

const namespaced = true;

export const devices: Module<DevicesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
