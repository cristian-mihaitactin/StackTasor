class Statistic {
    constructor(userid) {
        this._userid = userid;
        this._taskCreatedList = new Array();
        this._tasksDoneList = new Array();
    }

    get userid() {
        return this._userid;
    }
    set userid(value) {
        this._userid = value;
    }

    get tasksDoneList() {
        return this._tasksDoneList;
    }
    set tasksDoneList(value) {
        this._tasksDoneList = value;
    }

    get taskCreatedList() {
        return this._taskCreatedList;
    }
    set taskCreatedList(value) {
        this._taskCreatedList = value;
    }

    toJSON() {
        return {
            userid: {
                _: this.userid
            },
            tasksDoneList : this.tasksDoneList,
            taskCreatedList : this.taskCreatedList,
        }
      }
}

module.exports = Statistic;