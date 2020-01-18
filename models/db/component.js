const DbModel = require('./dbmodel');

class Component extends DbModel {
    constructor(id) {
        super(id);
        if (id == null) {
            this._name = "Empty"
            this._color = "#808080"
        }
    }

    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }

    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
    }

    toJSON() {
        var jsonObj = super.toJSON();
        jsonObj.name = this.name;
        jsonObj.color = this.color;

        return jsonObj;
      }
}

module.exports = Component;