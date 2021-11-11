board = [65, 1.75, 56];

offset = 2.5;

radius = 1.125;

minimum = 1;

module blank() {
    cube([65, board[1], 56]);
}

module board() {
        difference() {
            blank();
            translate([0, board[1], 0])
                rotate([90, 0 ,0])
                    cutaways();
        }
}

module camera() {
    x = 4.21;
    y = 5.5;
    z = 22.87;
    
    translate([45 - x / 2, board[1], board[2] - z - 0.6])
        cube([x, y + board[1], z]);
}

module cpu() {
    x = 14;
    y = minimum;
    z = 14;
    
    translate([26 - x / 2, board[1], 24 - z / 2])
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
    y = 5.5;
    z = 22.87;
    
    translate([1.2, board[1], 28 - z / 2])
        cube([x, y + board[1], z]);
}

module fillet(quad, x, y) {
    rot = quad * 90 - 90;
    
    offx = x;
    offy = y;
    
    if (quad == 2) {
    } else if (quad == 3) {
    } else if (quad == 4) {
    }
     
    translate([offx, offy, board[1]])
        rotate([0, 0, rot])
            rotate([-90, 0, 0])
                difference() {

                    cube([offset, board[1], offset]);

                    translate([offset, board[1], offset])
                        rotate([90, 0, 0])
                            cylinder(board[1], offset, offset, $fa = 5, $fs = 0.1);
                }
                
}

module fillets() {
    fillet(1, 0, 0);
    fillet(2, 65, 0);
    fillet(3, 65, 56);
    fillet(4, 0, 56);
}

module fourpole() {
    x = 7.22;
    y = 6;
    z = 13.24;
    
    r = y / 2;
    
    translate([board[0] - 11.5, board[1] + y / 2, board[2] - z])
        cylinder(14.44, r, r, $fa = 5, $fs = 0.1);
    
    translate([board[0] - x / 2 - 11.5, board[1], board[2] - z])
        cube([x, y, z]);
}

module gpio() {
    x = 51.76;
    y = 8.5;
    z = 4.81;

    translate([offset + 29 - x / 2, board[1], offset - z / 2])
        cube([x, y, z]);    
}

module hdmi() {
    x = 14.44;
    y = 6.5;
    z = 12.04;

    translate([32 - x / 2, board[1], board[2] - z + 1.2])
        cube([x, y, z]);
}

module memory() {
    x = 10;
    y = minimum;
    z = 12;
    
    translate([11 - x / 2, board[1], 12.5 - z / 2])
            cube([x, y, z]);
}

module microusb() {
    x = 8.43;
    y = 3.61;
    z = 6.02;
    
    translate([10.6 - x / 2, board[1], board[2] - z + 1.2])
        cube([x, y, z]);
}

module mipis() {
    display();    
    camera();
}

module penrun() {
    x = 5;
    y = minimum;
    z = 2;
    
    translate([board[0] - x - 1, board[1], 10.91 - z /2])
        cube([x, y, z]);
}

module sdcard() {
    x = 15;
    y = 1;
    z = 11;
    
    translate([-2.41, -y,  27.5 - z / 2])
        cube([x, y, z]);
}

module thruhole(x, y) {
  translate([x, y, 0])
    cylinder(board[1], radius, radius, $fa = 5, $fs = 0.1);
}

module thruholes() {
thruhole(3.5, 3.5);
thruhole(61.5, 3.5);
thruhole(61.5, 52.5);
thruhole(3.5, 52.5);
}

module usb() {
    x = 14.44;
    y = 7.1;
    z = 13.24;
    
    translate([board[0] - x + 2.41, board[1], board[2] - 31.45 - z / 2])
        cube([x, y + board[1], z]);
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
}