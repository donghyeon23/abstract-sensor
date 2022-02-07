class Sensor {
    constructor(name) {
        this.name = name;
        this.powerStatus = 'off'
        this.status = null;
        this.reportingInterval = 10000;
        this.runningTimerId = [];
        this.event = [];
    }

    get receiveEvent() {
        return this.event;
    }

    set receiveEvent(value) {
        console.log(value)
        this.event = value
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
                this.sensorList[idx].receiveEvent = actionId;
            }
        }

    }

    stdin(payload) {
        let data = {
            deviceId: 'id1',
            actionId: 'CHANGE_REPORTING_INTERVAL',
            payload: payload,
        }

        this.publish(data)
    }
}






module.exports = {
    Sensor,
    IotServer,
};
