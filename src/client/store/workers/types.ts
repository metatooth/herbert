export interface Worker {
  worker: string;
  nickname: string;
  inet?: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat: Date;
}

export interface WorkersState {
  workers: Worker[];
  error: boolean;
}
