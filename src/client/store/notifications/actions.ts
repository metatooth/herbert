import { ActionTree } from "vuex";
import { NotificationsState, Notification } from "./types";
import { RootState } from "../types";

export const actions: ActionTree<NotificationsState, RootState> = {
  add({ commit }, payload: Notification) {
    commit("ADD", payload);
  },
  remove({ commit }, payload: Notification) {
    commit("REMOVE", payload);
  }
};
