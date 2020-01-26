var projectPathname = '/project';
document.addEventListener("DOMContentLoaded", function() {
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
    divClone.getElementsByClassName('span-attachedAccount')[0].innerText = taskitem.attachedAccountId;
    divClone.getElementsByClassName('span-status')[0].innerText = taskitem.status;
    divClone.getElementsByClassName('span-evidence')[0].innerText = taskitem.evidence;
    divClone.getElementsByClassName('span-taskType')[0].innerText = taskitem.taskType;
    divClone.getElementsByClassName('span-estimation')[0].innerText = taskitem.estimation;
    divClone.getElementsByClassName('span-workDomain')[0].innerText = taskitem.workDomain;
    divClone.getElementsByClassName('span-geographicZone')[0].innerText = taskitem.geographicZone;
    divClone.getElementsByClassName('span-timeZone')[0].innerText = taskitem.timeZone;
    
    divClone.style.display = "";
    taskListEl.insertBefore(divClone, taskListEl.childNodes[0])
    addCollapsible();
}