import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { DevicesState, Device } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<DevicesState, RootState> = {
  edit({ commit }, payload: Device) {
    const json = JSON.stringify(payload);
    HTTP.put(`/devices/${payload.device}`, json).then(
      response => {
        console.log("EDIT", response.data);
        commit("EDIT", response.data);
      },
      error => {
        console.log(error);
        commit("DEVICE_ERROR");
      }
    );
  },
  fetchData({ commit }) {
    HTTP.get("/devices").then(
      response => {
        const payload: Device[] = response && response.data;
        commit("SET", payload);
      },
      error => {
        console.log(error);
        commit("DEVICES_ERROR");
      }
    );
  },
  off({ commit }, payload: string) {
    HTTP.put(`/devices/${payload}/off`).then(response => {
      commit("OFF", response.data);
    });
  },
  on({ commit }, payload: string) {
    HTTP.put(`/devices/${payload}/on`).then(response => {
      commit("ON", response.data);
    });
  }
};
