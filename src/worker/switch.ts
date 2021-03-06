export class Switch {
  constructor() {}

  public async off(): Promise<any> {
    return new Promise(resolve => {
      resolve(true);
    });
  }

  public async on(): Promise<any> {
    return new Promise(resolve => {
      resolve(true);
    });
  }
}
