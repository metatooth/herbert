import { GetterTree } from "vuex";
import { Worker, WorkersState } from "./types";
import { RootState } from "../types";

export const getters: GetterTree<WorkersState, RootState> = {
  allWorkers(state): Worker[] {
    const { workers } = state;
    return workers;
  },

  workersCount(state): number {
    const { workers } = state;
    return workers.length;
  }
};
