import { MutationTree } from "vuex";
import { ProfilesState, Profile } from "./types";

export const mutations: MutationTree<ProfilesState> = {
  SET_PROFILES(state, payload: Profile[]) {
    state.error = false;
    state.profiles = payload;
  },
  PROFILES_ERROR(state) {
    state.error = true;
    state.profiles = [];
  }
};
