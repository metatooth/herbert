import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ZonesState, Zone } from "./types";
import { Device } from "../devices/types";
import { RootState } from "../types";

export const actions: ActionTree<ZonesState, RootState> = {
  add({ commit }, payload: Zone) {
    const json = JSON.stringify(payload);
    HTTP.post("/zones", json).then(
      response => {
        commit("ADD", Object.assign(new Zone(), response.data));
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
        commit("ADD_DEVICE", Object.assign(new Zone(), response.data));
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
      commit("EDIT", Object.assign(new Zone(), response.data));
    });
  },

  fetchData({ commit }) {
    HTTP.get("/zones").then(
      response => {
        const payload: Zone[] = [];
        response.data.forEach((json: object) => {
          const zone = Object.assign(new Zone(), json);
          const clone = JSON.parse(JSON.stringify(json));
          if (zone.profile) {
            zone.profile.lampontemperature = parseFloat(
              clone.profile.lampontemperature
            );

            zone.profile.lamponhumidity = parseFloat(
              clone.profile.lamponhumidity
            );
            zone.profile.lampofftemperature = parseFloat(
              clone.profile.lampofftemperature
            );

            zone.profile.lampoffhumidity = parseFloat(
              clone.profile.lampoffhumidity
            );
          }
          const devices: Device[] = [];
          clone.devices.forEach((d: object) => {
            devices.push(Object.assign(new Device(), d));
          });

          zone.devices = devices;
          payload.push(zone);
        });
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
