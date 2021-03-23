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
  deletedat: Date;
}

export interface ProfilesState {
  profiles: Profile[];
  error: boolean;
}
