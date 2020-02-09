
class FrontStatistics {
    constructor(statistics){
        this.initCreatedSection(statistics);
        this.initWorkingSection(statistics);
    }

    get projectsCreated() {
        return this._projectsCreated;
    }

    get tasksCreated() {
        return this._tasksCreated;
    }

    get tasksCreatedAvg() {
        return this._tasksCreatedAvg;
    }

    get tasksToDo() {
        return this._tasksToDo;
    }

    get tasksInProgress() {
        return this._tasksInProgress;
    }

    get tasksDone() {
        return this._tasksDone;
    }

    get tasksExpired() {
        return this._tasksExpired;
    }

    get workingTasks() {
        return this._workingTasks;
    }

    get workingTasksInProgress() {
        return this._workingTasksInProgress;
    }

    get workingTasksDone() {
        return this._workingTasksDone;
    }

    get workingTasksExpired() {
        return this._workingTasksExpired;
    }
    initWorkingSection(statistics){
        this._workingTasksInProgress = 0;
        this._workingTasksDone = 0;
        this._workingTasksExpired = 0;
        
        if (typeof statistics.tasksDoneList !== 'undefined'
         && statistics.tasksDoneList.length > 0) {
            this._workingTasks = statistics.tasksDoneList.length;
            // the array is defined and has at least one element
            statistics.tasksDoneList.forEach((value) => {
    
                if (value.status == 1){
                    this._workingTasksInProgress++;
                } else if (value.status == 2) {
                    this._workingTasksDone++;
                } else if (value.status == 3) {
                    this._workingTasksExpired++;
                }
            })
        } else {
            this._workingTasks = 0
        }
    }

    initCreatedSection(statistics){
        this._tasksToDo = 0;
        this._tasksInProgress = 0;
        this._tasksDone = 0;
        this._tasksExpired = 0;
        // projects Created
        var listProj = new Array();
        if (typeof statistics.taskCreatedList !== 'undefined'
         && statistics.taskCreatedList.length > 0) {
            this._tasksCreated = statistics.taskCreatedList.length;
            // the array is defined and has at least one element
            statistics.taskCreatedList.forEach((value) => {
                if(!listProj.includes(value.projectId)) {
                    listProj.push(value.projectId);
                }
    
                if (value.status == 0){
                    this._tasksToDo++;
                } else if (value.status == 1){
                    this._tasksInProgress++;
                } else if (value.status == 2) {
                    this._tasksDone++;
                } else if (value.status == 3) {
                    this.tasksExpired++;
                }
            })
        } else {
            this._tasksCreated = 0
        }
    
        this._projectsCreated = listProj.length;
        if (this._tasksCreated > 0) {
            this._tasksCreatedAvg = Math.floor(this._tasksCreated/this._projectsCreated);
        } else {
            this._tasksCreatedAvg = 0;
        }
    }

    toJSON() {
        return {
            
    projectsCreated :
    this._projectsCreated
    ,

    tasksCreated :
        this._tasksCreated
    ,

    tasksCreatedAvg :
        this._tasksCreatedAvg
    ,

    tasksToDo :
        this._tasksToDo
    ,

    tasksInProgress :
        this._tasksInProgress
    ,

    tasksDone :
        this._tasksDone
    ,

    tasksExpired :
        this._tasksExpired
    ,

    workingTasks :
        this._workingTasks
    ,

    workingTasksInProgress :
        this._workingTasksInProgress
    ,

    workingTasksDone :
        this._workingTasksDone
    ,

    workingTasksExpired :
        this._workingTasksExpired
    ,
        }
    }
}

module.exports = FrontStatistics;