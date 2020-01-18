const Component = require('./component');

class Task extends Component{
    constructor(id){
        super(id);
    }

    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        this._projectId = value;
    }

    get decription() {
        return this._decription;
    }
    set decription(value) {
        this._decription = value;
    }

    get taskType() {
        return this._taskType;
    }
    set taskType(value) {
        this._taskType = value;
    }

    get estimation() {
        return this._estimation;
    }
    set estimation(value) {
        this._estimation = value;
    }

    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }

    get geographicZone() {
        return this._geographicZone;
    }
    set geographicZone(value) {
        this._geographicZone = value;
    }

    get timeZone() {
        return this._timeZone;
    }
    set timeZone(value) {
        this._timeZone = value;
    }

    get workDomain() {
        return this._workDomain;
    }
    set workDomain(value) {
        this._workDomain = value;
    }

    get attachedAccountId() {
        return this._attachedAccountId;
        }
    set attachedAccountId(value) {
        this._attachedAccountId = value;
    }

    toJSON() {
        var jsonObj = super.toJSON();
        jsonObj.projectId= this.projectId;
        jsonObj.decription= this.decription;
        jsonObj.taskType= this.taskType;
        jsonObj.estimation= this.estimation;
        jsonObj.status= this.status;
        jsonObj.geographicZone= this.geographicZone;
        jsonObj.timeZone= this.timeZone;
        jsonObj.workDomain= this.workDomain;
        jsonObj.attachedAccountId= this.attachedAccountId

        return jsonObj;
    }
}

module.exports = Task;