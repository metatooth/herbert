import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { SettingsState, Settings } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<SettingsState, RootState> = {
  edit({ commit }, payload: Settings) {
    const json = JSON.stringify(payload);
    HTTP.put("/settings", json).then(
      response => {
        commit("SET", Object.assign(new Settings(), response.data));
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  },
  fetchData({ commit }) {
    HTTP.get("/settings").then(
      response => {
        if (response.data.log) {
          let logo = "data:image/png;base64,";
          logo += btoa(String.fromCharCode(...response.data.logo.data));
          response.data.logo = logo;
        }
        commit("SET", Object.assign(new Settings(), response.data));
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  }
};
