import { MutationTree } from "vuex";
import { WorkersState, WorkerState, Worker } from "./types";

export const mutations: MutationTree<WorkersState> = {
  EDIT(state, payload: Worker) {
    const found = state.workers.find((el: WorkerState) => {
      return el.worker.worker === payload.worker;
    });
    if (found) {
      const index = state.workers.indexOf(found);
      const wstate: WorkerState = {
        worker: payload,
        error: false
      };
      state.workers.splice(index, 1, wstate);
    }
  },
  SET(state, payload: Worker[]) {
    state.error = false;

    state.workers = [];
    payload.forEach(w => {
      state.workers.push({ worker: w, error: false });
    });
  },
  WORKERS_ERROR(state) {
    state.error = true;
    state.workers = [];
  }
};
