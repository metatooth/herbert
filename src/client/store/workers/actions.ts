import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { WorkersState, Worker } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<WorkersState, RootState> = {
  edit({ commit }, payload: Worker) {
    const json = JSON.stringify(payload);
    HTTP.put(`/workers/${payload.worker}/config`, json).then(response => {
      commit("EDIT", Object.assign(new Worker(), response.data));
    });
  },
  fetchData({ commit }) {
    HTTP.get("/workers").then(response => {
      const payload: Worker[] = [];
      response.data.forEach((json: object) => {
        if (json.camera) {
          let camera = "data:image/jpeg;base64,";
          camera += btoa(String.fromCharCode(...json.camera.data));
          json.camera = camera;
        }
        payload.push(Object.assign(new Worker(), json));
      });
      commit("SET", payload);
    });
  },
  remove({ commit }, payload: Worker) {
    HTTP.delete(`/workers/${payload.worker}`);
    commit("REMOVE", payload);
  }
};
