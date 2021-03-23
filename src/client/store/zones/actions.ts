import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ZonesState, Zone } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<ZonesState, RootState> = {
  add({ commit }, payload: Zone) {
    const json = JSON.stringify(payload);
    HTTP.post("/zones", json).then(
      response => {
        const zone: Zone = response && response.data;
        commit("ADD", zone);
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  },

  addDevice({ commit }, payload: { zone: Zone; device: string }) {
    const json = JSON.stringify({ device: payload.device });
    HTTP.post(`/zones/${payload.zone.id}/devices`, json).then(
      response => {
        commit("ADD_DEVICE", response.data);
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  },

  edit({ commit }, payload: Zone) {
    const json = JSON.stringify(payload);
    HTTP.put(`/zones/${payload.id}`, json).then(response => {
      commit("EDIT", response.data);
    });
  },

  fetchData({ commit }) {
    HTTP.get("/zones").then(
      response => {
        const payload: Zone[] = response && response.data;
        commit("SET", payload);
      },
      error => {
        console.log(error);
        commit("ERROR");
      }
    );
  },

  remove({ commit }, payload: Zone) {
    HTTP.delete(`/zones/${payload.id}`);
    commit("REMOVE", payload);
  },

  removeDevice({ commit }, payload: { zone: Zone; device: string }) {
    console.log("remove device payload", payload);
    HTTP.delete(`/zones/${payload.zone.id}/devices/${payload.device}`);
    commit("REMOVE_DEVICE", payload.zone);
  }
};
