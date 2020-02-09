var projectPathname = '/stats';

document.addEventListener("DOMContentLoaded", function() {

    geStats();
  });

function geStats() {
  let request = new XMLHttpRequest();
  // /project/:projectId/tasks/:taskId

  request.open('GET', projectPathname, true);

  // get projects
  request.onload = function(event){ 
      console.log("Success, server responded with: " + event.target.response); // raw response
      var responseObj = JSON.parse(event.target.response);
      if (responseObj.Error && responseObj.Error == true){
          console.log('is error');
          // var errorLabel = document.getElementById('error-label');
          errorLabel.innerText = responseObj.Message;
          errorLabel.style.color = "red";
          errorLabel.style.display = 'block';
      } else {
          //check if they exist
          tst = responseObj;
          if(responseObj) {
              populateStats(responseObj);
          }
      }
  }; 

  request.onerror = function(event){ 
          alert("error, server responded with: " + event.target.response); // raw response
          console.log("error, server responded with: " + event.target.response); // raw response
  }; 
  request.send();
}

function populateStats(frontstatistics){
    populateCreated(frontstatistics);
    populateWorking(frontstatistics)
}

function populateCreated(frontstatistics) {
    
  var divCreated = document.getElementById('created-div');

  divCreated.getElementsByClassName('create-projects')[0].innerText = frontstatistics.projectsCreated;
  divCreated.getElementsByClassName('create-tasks')[0].innerText = frontstatistics.tasksCreated;
  divCreated.getElementsByClassName('create-avgTasks')[0].innerText = frontstatistics.tasksCreatedAvg;
  divCreated.getElementsByClassName('create-toDoTasks')[0].innerText = frontstatistics.tasksToDo;
  divCreated.getElementsByClassName('create-inProgressTasks')[0].innerText = frontstatistics.tasksInProgress;
  divCreated.getElementsByClassName('create-doneTasks')[0].innerText = frontstatistics.tasksDone;
  divCreated.getElementsByClassName('create-expiredTasks')[0].innerText = frontstatistics.tasksExpired;
}

function populateWorking(frontstatistics) {
    
    var divWorking = document.getElementById('working-div');
  
    divWorking.getElementsByClassName('working-tasks')[0].innerText = frontstatistics.workingTasks;
    divWorking.getElementsByClassName('working-inProgressTasks')[0].innerText = frontstatistics.workingTasksInProgress;
    divWorking.getElementsByClassName('working-doneTasks')[0].innerText = frontstatistics.workingTasksDone;
    divWorking.getElementsByClassName('working-expiredTasks')[0].innerText = frontstatistics.workingTasksExpired;
    
  }