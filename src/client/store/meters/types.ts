export class Meter {
  device: string;
  devicetype: string;
  manufacturer: string;
  nickname: string;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: Date;
}

export class MetersState {
  meters: Meter[];
  error: boolean;

  constructor() {
    this.meters = [];
    this.error = false;
  }
}
