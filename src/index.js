
class Sensor {
    static eventOut(data) {
        console.log('[Sensor] IotServer[Action Id] :', data[0], ', payload :', data[1])
    }
    constructor(name) {
        this.name = name;
        this.powerStatus = 'off'
        this.status = null;
        this.reportingInterval = 10000;
        this.runningTimerId = [];
    }

    get reportingInterval() {
        return this._reportingInterval;
    }

    set reportingInterval(value) {
        if (value < 0 || value > 10000) throw new Error();
        this._reportingInterval = value
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
        IotServer.stdout([status, this.name]);
        this.runningTimerId = setTimeout(() => { this.idleSensor('idle') }, 1000);
    }
}


class IotServer {
    static stdout(data) {
        console.log('[Server] Sensor', data[1], '로부터 받은 data :', data[0])
    }
    constructor() {
        this.sensorList = [];
        // this.stdin();
    }
    start(sensor) {
        this.sensorList.push(...sensor);
        this.stdin();
    }

    publish({ deviceId, actionId, payload }) {
        if (actionId === 'CHANGE_REPORTING_INTERVAL') {
            let idx = this.sensorList.findIndex(obj => obj.name === deviceId)
            if (this.sensorList[idx].powerStatus !== 'off') {
                this.sensorList[idx].reportingInterval = payload;
            }
        }
    }

    stdin() {
        // const readlineSync = require('readline-sync');
        // let id = readlineSync.questionInt('id:');
        // let payload = readlineSync.questionInt('payload:');
        const readline = require('readline');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('id와 payload를 공백으로 구분하여 입력해주세요. \n bye를 입력하시면 입력이 중지 됩니다.', (input) => {
            if (input === 'bye') {
                rl.close();
            } else {
                let [id, payload] = input.split(' ')

                if (!isNaN(id) && !isNaN(payload)) {
                    let data = {
                        deviceId: `id${id}`,
                        actionId: 'CHANGE_REPORTING_INTERVAL',
                        payload: payload,
                    }
                    this.publish(data);
                    Sensor.eventOut([data['actionId'], payload]);
                    rl.close();
                    this.stdin()
                } else {
                    console.log('숫자만 입력해주세요')
                    rl.close();
                    this.stdin()
                }

            }
        })


    }
};


const sensor = new Sensor('id1');
sensor.turn('on')
const server = new IotServer();
server.start([sensor]);
// server.stdin()



// new IotServer()
// IotServer.stdin(2000)


module.exports = {
    Sensor,
    IotServer,
};
