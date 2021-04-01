import { Module } from "vuex";
import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { Notification, NotificationsState } from "./types";
import { RootState } from "../types";

const state: NotificationsState = {
  notifications: [] as Notification[],
  error: false
};

const namespaced = true;

export const notifications: Module<NotificationsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
