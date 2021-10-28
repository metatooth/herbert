import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ProfilesState, Profile } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<ProfilesState, RootState> = {
  add({ commit }, payload: Profile) {
    const json = JSON.stringify(payload);
    HTTP.post("/profiles", json).then(response => {
      const profile = Object.assign(new Profile(), response.data);
      profile.lampontemperature = parseFloat(response.data.lampontemperature);
      profile.lamponhumidity = parseFloat(response.data.lamponhumidity);
      profile.lampofftemperature = parseFloat(response.data.lampofftemperature);
      profile.lampoffhumidity = parseFloat(response.data.lampoffhumidity);
      profile.bloweractive = parseInt(response.data.bloweractive);
      profile.blowercycle = parseInt(response.data.blowercycle);
      profile.irrigationperday = parseInt(response.data.irrigationperday);
      profile.irrigationduration = parseInt(response.data.irrigationduration);
      commit("ADD", profile);
    });
  },
  edit({ commit }, payload: Profile) {
    const json = JSON.stringify(payload);
    HTTP.put(`/profiles/${payload.id}`, json).then(response => {
      const profile = Object.assign(new Profile(), response.data);
      profile.lampontemperature = parseFloat(response.data.lampontemperature);
      profile.lamponhumidity = parseFloat(response.data.lamponhumidity);
      profile.lampofftemperature = parseFloat(response.data.lampofftemperature);
      profile.lampoffhumidity = parseFloat(response.data.lampoffhumidity);
      profile.bloweractive = parseInt(response.data.bloweractive);
      profile.blowercycle = parseInt(response.data.blowercycle);
      profile.irrigationperday = parseInt(response.data.irrigationperday);
      profile.irrigationduration = parseInt(response.data.irrigationduration);
      commit("EDIT", profile);
    });
  },
  fetchData({ commit }) {
    HTTP.get("/profiles").then(response => {
      const payload: Profile[] = [];
      response.data.forEach((data: object) => {
        const profile = Object.assign(new Profile(), data);
        const clone = JSON.parse(JSON.stringify(data));

        profile.lampontemperature = parseFloat(clone.lampontemperature);
        profile.lamponhumidity = parseFloat(clone.lamponhumidity);
        profile.lampofftemperature = parseFloat(clone.lampofftemperature);
        profile.lampoffhumidity = parseFloat(clone.lampoffhumidity);
        profile.bloweractive = parseInt(clone.bloweractive);
        profile.blowercycle = parseInt(clone.blowercycle);
        profile.irrigationperday = parseInt(clone.irrigationperday);
        profile.irrigationduration = parseInt(clone.irrigationduration);

        payload.push(profile);
      });
      commit("SET", payload);
    });
  },
  remove({ commit }, payload: Profile) {
    HTTP.delete(`/profiles/${payload.id}`);
    commit("REMOVE", payload);
  }
};
