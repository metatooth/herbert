import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { MetersState, Meter } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<MetersState, RootState> = {
  edit({ commit }, payload: Meter) {
    const json = JSON.stringify(payload);
    HTTP.put(`/meters/${payload.device}`, json).then(response => {
      commit("EDIT", new Meter(response.data));
    });
  },
  fetchData({ commit }) {
    HTTP.get("/meters").then(response => {
      const payload: Meter[] = [];
      response.data.forEach((json: object) => {
        payload.push(new Meter(JSON.stringify(json)));
      });
      commit("SET", payload);
    });
  },
  remove({ commit }, payload: Meter) {
    HTTP.delete(`/meters/${payload.device}`);
    commit("REMOVE", payload);
  }
};
