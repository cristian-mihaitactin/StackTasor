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

    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
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

    get evidence() {
        return this._evidence;
        }
    set evidence(value) {
        this._evidence = value;
    }

    get expiryDate() {
        return this._expiryDate;
        }
    set expiryDate(value) {
        this._expiryDate = value;
    }

    toJSON() {
        var jsonObj = super.toJSON();
        jsonObj.projectId= this.projectId;
        jsonObj.userId= this.userId;
        jsonObj.description= this.description;
        jsonObj.taskType= this.taskType;
        jsonObj.estimation= this.estimation;
        jsonObj.status= this.status;
        jsonObj.geographicZone= this.geographicZone;
        jsonObj.timeZone= this.timeZone;
        jsonObj.workDomain= this.workDomain;
        jsonObj.attachedAccountId= this.attachedAccountId
        jsonObj.evidence= this._evidence
        jsonObj.expiryDate= this._expiryDate

        return jsonObj;
    }
}

module.exports = Task;