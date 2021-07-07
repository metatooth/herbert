import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { MetersState, Meter } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<MetersState, RootState> = {
  edit({ commit }, payload: Meter) {
    const json = JSON.stringify(payload);
    HTTP.put(`/devices/${payload.device}`, json).then(response => {
      commit("EDIT", new Meter(response.data));
    });
  },
  fetchData({ commit }) {
    HTTP.get("/devices").then(response => {
      const payload: Meter[] = [];
      response.data.forEach((json: object) => {
        const obj = new Meter(JSON.stringify(json));
        if (obj.devicetype === "meter") {
          payload.push(obj);
        }
      });
      commit("SET", payload);
    });
  },
  remove({ commit }, payload: Meter) {
    HTTP.delete(`/devices/${payload.device}`);
    commit("REMOVE", payload);
  }
};
