class Sensor {
    constructor(name) {
        this.name = name;
        this.powerStatus = 'off'
        this.status = null;
        this.reportingInterval = 10000;
    }

    turn(status) {
        if (status === 'off') {
            this.powerStatus = 'off'
        } else {
            if (this.powerStatus === 'on') throw new Error('이미 켜져있습니다.')
            else {
                this.powerStatus = 'on'
                this.idleSensor('idle');
            }
        }


    }

    idleSensor(status) {
        this.status = status;
        setTimeout(() => { this.distanceSensor('sensingDistance') }, this.reportingInterval);
    }

    distanceSensor(status) {
        let randomTime = Math.floor(Math.random() * 500)
        this.status = status;
        setTimeout(() => { this.reportingSensor('reportingData') }, 500);
    }

    reportingSensor(status) {
        let randomTime = Math.floor(Math.random() * 1000)
        this.status = status;
        setTimeout(() => { this.idleSensor('idle') }, 1000);
    }
}


class IotServer {
    constructor() {
        this.sensorList = [];
    }
    start(sensor) {
        let newSensor = sensor[0]
        this.sensorList.push(newSensor);
    }

    publish({ deviceId, actionId, payload }) {
        if (actionId === 'CHANGE_REPORTING_INTERVAL') {
            let idx = this.sensorList.findIndex(obj => obj.name === deviceId)
            if (this.sensorList[idx].powerStatus !== 'off') {
                this.sensorList[idx].reportingInterval = payload;
            }
        }

    }
}




module.exports = {
    Sensor,
    IotServer,
};
