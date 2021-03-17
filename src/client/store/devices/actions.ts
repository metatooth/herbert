import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { DevicesState, Device } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<DevicesState, RootState> = {
  fetchData({ commit }): any {
    HTTP.get("/devices").then(
      response => {
        const payload: Device[] = response && response.data;
        commit("SET_DEVICES", payload);
      },
      error => {
        console.log(error);
        commit("DEVICES_ERROR");
      }
    );
  }
};
