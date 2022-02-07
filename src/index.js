class Sensor {
    constructor(name) {
        this.name = name;
        this.powerStatus = 'off'
        this.status = null;
        this.reportingInterval = 10000;

        this.runningTimerId = [];
    }

    turn(status) {
        if (status === 'off') {
            this.powerStatus = 'off'
            clearTimeout(this.runningTimerId);
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
        this.runningTimerId = setTimeout(() => { this.distanceSensor('sensingDistance') }, this.reportingInterval);
    }

    distanceSensor(status) {
        this.status = status;
        this.runningTimerId = setTimeout(() => { this.reportingSensor('reportingData') }, 500);
    }


    reportingSensor(status) {
        this.status = status;
        this.runningTimerId = setTimeout(() => { this.idleSensor('idle') }, 1000);
    }
}


class IotServer {
    constructor() {
        this.sensorList = [];
    }
    start(sensor) {
        this.sensorList.push(...sensor);
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
