import { GetterTree } from "vuex";
import { Profile, ProfileState, ProfilesState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<ProfilesState, RootState> = {
  profiles(state): ProfileState[] {
    const { profiles } = state;
    return profiles;
  },

  profilesCount(state): number {
    const { profiles } = state;
    return profiles.length;
  }
};
