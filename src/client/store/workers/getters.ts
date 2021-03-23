import { GetterTree } from "vuex";
import { WorkerState, WorkersState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<WorkersState, RootState> = {
  allWorkers(state): WorkerState[] {
    const { workers } = state;
    return workers;
  },

  workersCount(state): number {
    const { workers } = state;
    return workers.length;
  }
};
