export class Config {
  nickname: string;
  config: object;
  updatedat: Date;

  toString() {
    return JSON.stringify(this.config);
  }
}

export interface ConfigState {
  configs: Config[];
  error: boolean;
}
