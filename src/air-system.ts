enum AirSystemStatus {
    Off = 0,
    On = 1
}

export class AirSystem {
    status: AirSystemStatus;
}

export class Blower extends AirSystem {

}

export class Dehumidifier extends AirSystem {

}

export class Heater extends AirSystem {

}

export class Humidifier extends AirSystem {

}


