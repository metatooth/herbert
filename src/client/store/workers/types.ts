export class Worker {
  worker: string;
  nickname: string;
  inet?: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;

  constructor() {
    this.worker = "";
    this.nickname = "";
    this.createdat = new Date();
    this.updatedat = new Date();
    this.deleted = false;
  }
}

export interface WorkersState {
  workers: Worker[];
  error: boolean;
}
