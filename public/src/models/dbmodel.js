const uuidv1 = require('uuid/v1');

class DbModel{
    constructor(id){
        if(id == null){
            this._id = uuidv1();
            this._createdDate = new Date(new Date().toUTCString());
            this._updateDate = new Date(new Date().toUTCString());
        }
    }
    get id(){
        return this._id;
    }
    set id(value){
        this._id = value;
    }

    get createdDate() {
        return this._createdDate;
    }
    set createdDate(value) {
        this._createdDate = value;
    }

    update(){
        this._updateDate = new Date(new Date().toUTCString());
    }
}

module.exports = DbModel;