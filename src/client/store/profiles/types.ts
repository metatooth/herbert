export interface Profile {
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
}

export class ProfileState {
  profile: Profile = {
    id: 0,
    profile: "",
    lampstart: "00:00:00",
    lampduration: { hours: 12 },
    lampontemperature: 0,
    lamponhumidity: 0,
    lampofftemperature: 0,
    lampoffhumidity: 0,
    createdat: new Date(),
    updatedat: new Date(),
    deleted: false
  };
  error = false;
}

export interface ProfilesState {
  profiles: ProfileState[];
  error: boolean;
}
