export class Worker {
  worker: string;
  nickname: string;
  configname: string;
  config: object;
  inet?: string;
  camera?: Uint8Array;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;

  constructor() {
    this.worker = "";
    this.nickname = "";
    this.configname = "";
    this.config = {};
    this.createdat = new Date();
    this.updatedat = new Date();
    this.deleted = false;
  }

  get name() {
    return this.nickname || this.inet;
  }
}

export interface WorkersState {
  workers: Worker[];
  error: boolean;
}
