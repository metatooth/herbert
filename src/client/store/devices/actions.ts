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
        commit("EDIT", Object.assign(new Device(), response.data));
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
        const payload: Device[] = [];
        response.data.forEach((json: object) => {
          payload.push(Object.assign(new Device(), json));
        });
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
      commit("OFF", Object.assign(new Device(), response.data));
    });
  },
  on({ commit }, payload: string) {
    HTTP.put(`/devices/${payload}/on`).then(response => {
      commit("ON", Object.assign(new Device(), response.data));
    });
  },
  remove({ commit }, payload: Device) {
    HTTP.delete(`/devices/${payload.device}`);
    commit("REMOVE", payload);
  }
};
