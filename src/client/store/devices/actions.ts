import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { DevicesState, Device } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<DevicesState, RootState> = {
  edit({ commit }, payload: Device) {
    const json = JSON.stringify(payload);
    HTTP.put(`/devices/${payload.device}`, json).then(response => {
      commit("EDIT", Object.assign(new Device(response.data)));
    });
  },
  fetchData({ commit }) {
    HTTP.get("/devices").then(response => {
      const payload: Device[] = [];
      response.data.forEach((json: object) => {
        payload.push(new Device(JSON.stringify(json)));
      });
      commit("SET", payload);
    });
  },
  off(context, payload: string) {
    HTTP.put(`/devices/${payload}/off`);
  },
  on(context, payload: string) {
    HTTP.put(`/devices/${payload}/on`);
  },
  remove({ commit }, payload: Device) {
    HTTP.delete(`/devices/${payload.device}`);
    commit("REMOVE", payload);
  }
};
