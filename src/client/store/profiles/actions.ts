import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ProfilesState, Profile } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<ProfilesState, RootState> = {
  add({ commit }, payload: Profile) {
    const json = JSON.stringify(payload);
    HTTP.post("/profiles", json).then(
      response => {
        commit("ADD", response.data);
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  },
  edit({ commit }, payload: Profile) {
    const json = JSON.stringify(payload);
    HTTP.put(`/profiles/${payload.id}`, json).then(
      response => {
        commit("EDIT", response.data);
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  },
  fetchData({ commit }) {
    HTTP.get("/profiles").then(
      response => {
        const payload: Profile[] = response && response.data;
        commit("SET", payload);
      },
      error => {
        console.log(error);
        commit("PROFILES_ERROR");
      }
    );
  },
  remove({ commit }, payload: Profile) {
    HTTP.delete(`/profiles/${profile.id}`);
    commit("REMOVE", payload);
  }
};
