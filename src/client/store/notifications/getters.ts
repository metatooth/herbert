import { GetterTree } from "vuex";
import { Notification, NotificationsState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<NotificationsState, RootState> = {
  notifications(state): Notification[] {
    const { notifications } = state;
    return notifications;
  },

  notificationsCount(state): number {
    const { notifications } = state;
    return notifications.length;
  }
};
