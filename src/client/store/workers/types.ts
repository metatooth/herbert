export interface Worker {
  worker: string;
  nickname: string;
  inet?: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
}

export class WorkerState {
  worker: Worker = {
    worker: "",
    nickname: "",
    createdat: new Date(),
    updatedat: new Date(),
    deleted: false
  };
  error = false;
}

export interface WorkersState {
  workers: WorkerState[];
  error: boolean;
}
