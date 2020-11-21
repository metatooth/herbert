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
    if (hour >= this.start) {
      result = true;
    }

    if (hour >= (this.start + this.duration)) {
      result = false;
    }

    return result;
  },

});

module.exports = Timer;
