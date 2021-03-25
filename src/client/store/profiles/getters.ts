import { GetterTree } from "vuex";
import { Profile, ProfilesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<ProfilesState, RootState> = {
  profiles(state): Profile[] {
    const { profiles } = state;
    return profiles;
  },

  profilesCount(state): number {
    const { profiles } = state;
    return profiles.length;
  }
};
