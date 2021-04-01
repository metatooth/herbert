import { MutationTree } from "vuex";
import { Notification, NotificationsState } from "./types";

export const mutations: MutationTree<NotificationsState> = {
  ADD(state, payload: Notification) {
    const found = state.notifications.find((el: Notification) => {
      return el.id === payload.id;
    });
    if (found) {
      const index = state.notifications.indexOf(found);
      state.notifications.splice(index, 1, payload);
    } else {
      state.notifications.push(payload);
    }
  },
  REMOVE(state, payload: Notification) {
    const found = state.notifications.find((el: Notification) => {
      return el.id === payload.id;
    });
    if (found) {
      const index = state.notifications.indexOf(found);
      state.notifications.splice(index, 1);
    }
  }
};
