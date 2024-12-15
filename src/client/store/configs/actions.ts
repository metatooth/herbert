import { ActionTree } from "vuex";
import HTTP from "@/api/http";
import { ConfigState, Config } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<ConfigState, RootState> = {
  add({ commit }, payload: Config) {
    HTTP.post("/configs", payload).then((res) => {
      commit("ADD", Object.assign(new Config(), res.data));
    });
  },
  edit({ commit }, payload: Config & { currentName: string }) {
    HTTP.put(`/configs/${payload.currentName}`, payload).then((response) => {
      commit("EDIT", Object.assign(new Config(), response.data));
    });
  },
  fetchData({ commit }) {
    HTTP.get("/configs").then((response) => {
      const payload: Config[] = [];
      response.data.forEach((json: object) => {
        payload.push(Object.assign(new Config(), json));
      });
      commit("SET", payload);
    });
  },
};
