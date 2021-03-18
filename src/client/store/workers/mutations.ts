import { MutationTree } from "vuex";
import { WorkersState, Worker } from "./types";

export const mutations: MutationTree<WorkersState> = {
  EDIT(state, payload: Worker) {
    const found = state.workers.find((el: Worker) => { el.id === payload.id });
    const index = state.workers.indexOf(found);
    state.workers.splice(index, 1, payload);
  },
  SET(state, payload: Worker[]) {
    state.error = false;
    state.workers = payload;
  },
  WORKERS_ERROR(state) {
    state.error = true;
    state.workers = [];
  }
};
