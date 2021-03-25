export class Profile {
  id: number;
  profile: string;
  lampstart: string;
  lampduration: { hours: number };
  lampontemperature: number;
  lamponhumidity: number;
  lampofftemperature: number;
  lampoffhumidity: number;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;

  constructor() {
    this.id = 0;
    this.profile = "";
    this.lampstart = "00:00:00";
    this.lampduration = { hours: 12 };
    this.lampontemperature = 0;
    this.lamponhumidity = 0;
    this.lampofftemperature = 0;
    this.lampoffhumidity = 0;
    this.createdat = new Date();
    this.updatedat = new Date();
    this.deleted = false;
  }
}

export interface ProfilesState {
  profiles: Profile[];
  error: boolean;
}
