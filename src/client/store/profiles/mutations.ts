import { MutationTree } from "vuex";
import { ProfilesState, Profile } from "./types";

export const mutations: MutationTree<ProfilesState> = {
  ADD(state, payload: Profile) {
    state.profiles.push(payload);
  },
  SET(state, payload: Profile[]) {
    state.error = false;
    state.profiles = payload;
    state.profiles.sort((a, b) => {
      return a.profile.localeCompare(b.profile);
    });
  },
  EDIT(state, payload: Profile) {
    const found = state.profiles.find((el: Profile) => {
      return el.id === payload.id;
    });
    if (found) {
      const index = state.profiles.indexOf(found);
      state.profiles.splice(index, 1, payload);
    }
  },
  ERROR(state) {
    state.error = true;
  },
  PROFILES_ERROR(state) {
    state.error = true;
    state.profiles = [];
  },
  REMOVE(state, payload: Profile) {
    const found = state.profiles.find((el: Profile) => {
      return el.id === payload.id;
    });
    if (found) {
      const index = state.profiles.indexOf(found);
      state.profiles.splice(index, 1);
    }
  }
};
