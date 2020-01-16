const Component = require('./component');

class Project extends Component{
    constructor(id){
        super(id);
    }

    get accountId() {
        return this._accountId;
        }
    set accountId(value) {
        this._accountId = value;
    }
}

module.exports = Project;