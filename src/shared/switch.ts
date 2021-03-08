export class Switch {
  public async off(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public async on(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
