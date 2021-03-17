import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ProfilesState, Profile } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<ProfilesState, RootState> = {
  fetchData({ commit }) {
    HTTP.get("/profiles").then(
      response => {
        const payload: Profile[] = response && response.data;
        commit("SET_PROFILES", payload);
      },
      error => {
        console.log(error);
        commit("PROFILES_ERROR");
      }
    );
  }
};
