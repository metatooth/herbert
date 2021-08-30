export class Profile {
  id: number;
  profile: string;
  lampstart: string;
  lampduration: { hours: number };
  lampontemperature: number;
  lamponhumidity: number;
  lampofftemperature: number;
  lampoffhumidity: number;
  bloweractive: number;
  blowercycle: number;
  irrigationperday: number;
  irrigationduration: number;
  maxirrigators: number;
  createdat: Date;
  updatedat: Date;
  deleted: boolean;
  deletedat?: Date;
}

export interface ProfilesState {
  profiles: Profile[];
  error: boolean;
}
