import { MutationTree } from "vuex";
import { WorkersState, Worker } from "./types";

export const mutations: MutationTree<WorkersState> = {
  SET_WORKERS(state, payload: Worker[]) {
    state.error = false;
    state.workers = payload;
  },
  WORKERS_ERROR(state) {
    state.error = true;
    state.workers = [];
  }
};
