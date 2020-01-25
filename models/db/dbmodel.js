const uuidv1 = require('uuid/v1');

class DbModel {
    constructor(id) {
        if (typeof id == 'undefined' || id == null) {
            this._id = uuidv1();
            this._createdDate = new Date(new Date().toUTCString());
            this._updateDate = new Date(new Date().toUTCString());
        } else {
            this._id = id;
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }

    get createdDate() {
        return this._createdDate;
    }
    set createdDate(value) {
        this._createdDate = value;
    }

    get updateDate() {
        return this._updateDate;
    }
    set updateDate(value) {
        this._updateDate = value;
    }

    update() {
        if (typeof this._createdDate !== 'undefined' || this._createdDate == null) {
            this._createdDate = new Date(new Date().toUTCString());
        }
        this._updateDate = new Date(new Date().toUTCString());
    }

    toJSON() {
        return {
            id: {
                _: this.id
            },
            createdDate: this.createdDate,
            updateDate: this.updateDate
        }
      }
}

module.exports = DbModel;