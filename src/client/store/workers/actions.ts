import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { WorkersState, Worker } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<WorkersState, RootState> = {
  fetchData({ commit }) {
    HTTP.get("/workers").then(
      response => {
        const payload: Worker[] = response && response.data;
        commit("SET_WORKERS", payload);
      },
      error => {
        console.log(error);
        commit("WORKERS_ERROR");
      }
    );
  }
};
