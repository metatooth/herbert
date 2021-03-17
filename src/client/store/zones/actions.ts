import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ZonesState, Zone } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<ZonesState, RootState> = {
  getZones({ commit }) {
    HTTP.get("/zones").then(
      response => {
        const payload: Zone[] = response && response.data;
        commit("SET_ZONES", payload);
      },
      error => {
        console.log(error);
        commit("ZONES_ERROR");
      }
    );
  }
};
