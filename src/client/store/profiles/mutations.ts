import { MutationTree } from "vuex";
import { ProfilesState, ProfileState, Profile } from "./types";

export const mutations: MutationTree<ProfilesState> = {
  ADD(state, payload: Profile) {
    const pstate: ProfileState = {
      profile: payload,
      error: false
    };
    state.profiles.push(pstate);
  },
  SET(state, payload: Profile[]) {
    state.error = false;

    state.profiles = [];
    payload.forEach(p => {
      state.profiles.push({ profile: p, error: false });
    });
    state.profiles.sort((a, b) => {
      return a.profile.profile.localeCompare(b.profile.profile);
    });
  },
  EDIT(state, payload: Profile) {
    const found = state.profiles.find((el: ProfileState) => {
      return el.profile.id === payload.id;
    });
    if (found) {
      const index = state.profiles.indexOf(found);
      const pstate: ProfileState = {
        profile: payload,
        error: false
      };
      state.profiles.splice(index, 1, pstate);
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
    const found = state.profiles.find((el: ProfileState) => {
      return el.profile.id === payload.id;
    });
    if (found) {
      const index = state.profiles.indexOf(found);
      state.profiles.splice(index, 1);
    }
  }
};
