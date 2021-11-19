board = [20, 20, 1];

thru = 2.5;

rounds = 4;

module adds() {
  bump(10, 0);
  bump(10, 20);
}

module blank() {
  difference() {
    difference() {
      union() {
        cube(board);
        adds();
      }
      subs();
    }
    translate([3,15,board[2]/2])
      linear_extrude(board[2])
          text("© Metatooth LLC 2021", 1, "Ubuntu");
  }
}

module bump(x, y) {
  translate([x, y])
    cylinder(board[2], rounds/2, rounds/2, $fa = 5, $fs = 0.1);
}

module connection() {
  translate([1, 5, board[2]])
    cube([5, 10, 10]);
}

module subs() {
  bump(0, 10);
  bump(20, 10);
}

module led() {
  translate([13, 10, board[2] + 5/2])
    rotate([90, 0, 90])
    cylinder(14, 5/2, 5/2, $fa = 5, $fs = 0.1);
}

module thruhole(x, y) {
  translate([x, y])
    cylinder(board[2], thru/2, thru/2, $fa = 5, $fs = 0.1);
}

module thruholes() {
  thruhole(10, 0);
  thruhole(10, 20);
}

color("#00dd77") {
  difference() {
    blank();
    thruholes();
  }
}

color("#fdfdfd") {
  connection();
}

color("#00bbee") {
  led();
}

