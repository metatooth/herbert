import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { ProfileState, ProfilesState } from "./types";
import { RootState } from "../types";

const state: ProfilesState = {
  profiles: [] as ProfileState[],
  error: false
};

const namespaced = true;

export const profiles: Module<ProfilesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
