var projectPathname = '/project';
var taskStatus = {
  Accepted: false,
  Abandon: false,
  Finished: false,
  Evidence: ''
}

document.addEventListener("DOMContentLoaded", function() {
    var formEl = document.getElementById('formPop');

    var pathname = window.location.pathname;
    formEl.action = pathname;
    formEl.method = 'POST';

    getTask();
  });

function getTask() {
  let request = new XMLHttpRequest();
  // /project/:projectId/tasks/:taskId
  var pathname = window.location.pathname;
  var splitPathName = pathname.split("/");
  splitPathName[1] = 'project';

  request.open('GET', splitPathName.join('/'), true);

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
              populateTask(responseObj);
              manageButtons(responseObj);
          }
      }
  }; 

  request.onerror = function(event){ 
          alert("error, server responded with: " + event.target.response); // raw response
          console.log("error, server responded with: " + event.target.response); // raw response
  }; 
  request.send();
}

function populateTask(taskitem){
  //original project div template
  var taskListEl = document.getElementById('taskListArticle');
  var divTemplate = document.getElementById('taskTemplate');
    //Clone project div;
    var divClone = divTemplate.cloneNode(true);

    divClone.id = divClone.id + 0;
    divClone.getElementsByClassName('taskName')[0].innerText = taskitem.name;
    divClone.getElementsByClassName('span-createdDate')[0].innerText = taskitem.createdDate;
    divClone.getElementsByClassName('span-updatedDate')[0].innerText = taskitem.updateDate;

    divClone.getElementsByClassName('taskDescription')[0].innerText = taskitem.description;
    if (taskitem.attachedAccountId != null && taskitem.attachedAccountId !== undefined) {
      divClone.getElementsByClassName('span-attachedAccount')[0].innerText = taskitem.attachedAccountId;
    } else {
      divClone.getElementsByClassName('span-attachedAccount')[0].innerText = 'None';
    }
    divClone.getElementsByClassName('span-status')[0].innerText = taskitem.status;

    if (taskitem.evidence != null && taskitem.evidence !== undefined && taskitem.evidence !== "" ){
      divClone.getElementsByClassName('span-evidence')[0].innerText = taskitem.evidence;
    } else {
      divClone.getElementsByClassName('span-evidence')[0].innerText = 'None';
    }

    divClone.getElementsByClassName('span-taskType')[0].innerText = taskitem.taskType;
    divClone.getElementsByClassName('span-estimation')[0].innerText = taskitem.estimation;
    divClone.getElementsByClassName('span-workDomain')[0].innerText = taskitem.workDomain;
    divClone.getElementsByClassName('span-geographicZone')[0].innerText = taskitem.geographicZone;
    divClone.getElementsByClassName('span-timeZone')[0].innerText = taskitem.timeZone;

    divClone.style.display = "";
    taskListEl.insertBefore(divClone, taskListEl.childNodes[0])
    addCollapsible();
}

function manageButtons(taskitem){
  if (taskitem.status == 0) {
    document.getElementById("btn-finish").disabled = true;
    document.getElementById("btn-abandon").disabled = true;
    document.getElementById("btn-accept").disabled = false;
  }

  if (taskitem.status == 1) {
    document.getElementById("btn-finish").disabled = false;
    document.getElementById("btn-abandon").disabled = false;
    document.getElementById("btn-accept").disabled = true;
  }

  if (taskitem.status == 2) {
    document.getElementById("btn-finish").disabled = true;
    document.getElementById("btn-abandon").disabled = true;
    document.getElementById("btn-accept").disabled = true;
  }
}

function acceptTask() {
  taskStatus.Accepted = true;

  taskStatus.Abandon = false,
  taskStatus.Finished = false,
  taskStatus.Evidence = ''
  updateTaskStatus(taskStatus);
}

function abandonTask() {
  taskStatus.Accepted = false;

  taskStatus.Abandon = true,
  taskStatus.Finished = false,
  taskStatus.Evidence = ''
  updateTaskStatus(taskStatus);
}

function updateTaskStatus(data) {
  let request = new XMLHttpRequest();
  // /project/:projectId/tasks/:taskId
  var pathname = window.location.pathname;
  
  request.open('POST', pathname, true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

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
            window.location.href = responseObj.RedirectLink;
          }
      }
  }; 

  request.onerror = function(event){ 
          alert("error, server responded with: " + event.target.response); // raw response
          console.log("error, server responded with: " + event.target.response); // raw response
  };

  request.send(JSON.stringify(data));
}