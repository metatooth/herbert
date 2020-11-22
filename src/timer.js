/**
 * @constructor
 * @param {Integer} start when to start the light cycle
 * @param {Integer} duration total hours lights to be on
 */
function Timer(start, duration) {
  this.type = 'Timer';

  this.start = start;
  this.duration = duration;
}

Object.assign( Timer.prototype, {
  constructor: Timer,

  isTimer: true,

  isOn: function(hour) {
    let result = false;
    const limit = this.start + this.duration;

    if (limit < 24) {
      if (hour >= this.start && hour < limit) {
        result = true;
      }
    } else {
      if (hour >= this.start && hour < 24) {
        result = true;
      }

      if (hour >= 0 && hour < (limit - 24)) {
        result = true;
      }
    }

    return result;
  },
});

module.exports = Timer;
