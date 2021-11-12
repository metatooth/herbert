board = [65, 56, 1.75];

offset = 2.5;

radius = 1.125;

minimum = 1;

module blank() {
    difference() {
        cube(board);
    
        translate([20, board[1] / 2 + 15, board[2] - minimum])
            linear_extrude(minimum)
                text("© Metatooth LLC 2021", 2, "Ubuntu");
    }
}

module board() {
    difference() {
         blank();
         cutaways();
    }
}

module camera() {
    x = 4.21;
    y = 22.87;
    z = 5.5;
    
    translate([45 - x / 2, 11.5 - y / 2, board[2]])
        cube([x, y, z]);
}

module cpu() {
    x = 14;
    y = 14;
    z = minimum;
    
    translate([27.1 - x / 2, 31.2 - y / 2, board[2]])
            cube([x, y, z]);
}

module cutaways() {
    union() {
        fillets();
        thruholes();
    }
}

module display() {
    x = 4.21;
    y = 22.87;
    z = 5.5;
    
    translate([1.2, 28 - y / 2, board[2]])
        cube([x, y, z]);
}

module fillet(quad, x, y) {
    rot = quad * 90 - 90;
         
    translate([x, y, 0])
        rotate([0, 0, rot])
                difference() {
                    cube([offset, offset, board[2]]);
                    translate([offset, offset, 0])
                        cylinder(board[2], offset, offset, $fa = 5, $fs = 0.1);
                }
                
}

module fillets() {
    fillet(1, 0, 0);
    fillet(2, 65, 0);
    fillet(3, 65, 56);
    fillet(4, 0, 56);
}

module fourpole() {
    x = 7.1;
    y = 12.4;
    z = 6;

    
    r = z / 2;
    
    translate([board[0] - 11.5, y, board[2] + z / 2])
    rotate([90, 0, 0])
        cylinder(15.4, r, r, $fa = 5, $fs = 0.1);
    
    translate([board[0] - x / 2 - 11.5, 0, board[2]])
        cube([x, y, z]);
}

module gpio() {
    x = 51.76;
    y = 4.81;
    z = 8.5;

    translate([offset + 29 - x / 2, board[1] - offset - y / 2, board[2]])
        cube([x, y, z]);    
}

module hdmi() {
    x = 14.44;
    y = 12.04;
    z = 6.5;

    translate([32 - x / 2, -1.8, board[2]])
        cube([x, y, z]);
}

module led(offx, offy) {
    x = 1.8;
    y = 1.8;
    z = minimum;
    
    translate([offx, offy, board[2]])
        cube([x, y, z]);
}

module leds() {
        led(0, 7.1);
        led(0, 10.6);
}

module memory() {
    x = 10;
    y = 12;
    z = minimum;
    
    translate([11.5 - x / 2, 41.5 - y / 2, board[2]])
            cube([x, y, z]);
}

module microusb() {
    x = 8.4;
    y = 6.0;
    z = 3.6;
    
    translate([10.5 - x / 2, -1.2, board[2]])
        cube([x, y, z]);
}

module mipis() {
    display();    
    camera();
}

module penrun() {
    x = 5;
    y = 2;
    z = minimum;
    
    translate([board[0] - x - 1.2, board[1] - 10.91 - y /2, board[2]])
        cube([x, y, z]);
}

module sdcard() {
    x = 15;
    y = 12;
    z = minimum;

    
    translate([-2.5, 22, -z])
        cube([x, y, z]);
}

module thruhole(x, y) {
  translate([x, y, 0])
    cylinder(board[2], radius, radius, $fa = 5, $fs = 0.1);
}

module thruholes() {
thruhole(3.5, 3.5);
thruhole(61.5, 3.5);
thruhole(61.5, 52.5);
thruhole(3.5, 52.5);
}

module usb() {
    x = 14.2;
    y = 14.2;
    z = 7.1;
    
    translate([board[0] - x + 3.0, 31.45 - y / 2, board[2]])
        cube([x, y, z]);
}

color("#00ff00") {
    board();
}

color("#7a7a7a") {
    gpio();
    usb();
    hdmi();
    microusb();
}

color("#ffffff") {
    penrun();
    cpu();
    memory();
}

color("#ff5733") {
    mipis();    
}

color("#363636") {
    sdcard();
    fourpole();
    leds();
}
