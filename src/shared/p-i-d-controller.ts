export class PIDController {
  setpoint: number;
  a0: number;
  a1: number;
  a2: number;
  error0: number;
  error1: number;
  error2: number;
  out: number;

  constructor(setpoint, kp, ki, kd, dt) {
    this.setpoint = setpoint;

    this.a0 = kp + ki * dt + kd / dt;
    this.a1 = -kp - (2 * kd) / dt;
    this.a2 = kd / dt;

    this.error0 = 0;
    this.error1 = 0;
    this.error2 = 0;

    this.out = 0;
  }

  output(measured) {
    this.error2 = this.error1;
    this.error1 = this.error2;
    this.error0 = this.setpoint - measured;

    this.out =
      this.out +
      this.a0 * this.error0 +
      this.a1 * this.error1 +
      this.a2 * this.error2;

    return this.out;
  }
}
