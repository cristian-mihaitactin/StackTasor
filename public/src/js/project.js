var projectPathname = '';
document.addEventListener("DOMContentLoaded", function() {
    var form = document.forms.namedItem("sendForm");
    projectPathname = location.pathname;
    form.action = projectPathname;
    getTasks();
  });

function getTasks() {
  let request = new XMLHttpRequest();
  request.open('GET', projectPathname + "/tasks", true);

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
          if(responseObj.length && responseObj.length > 0) {
              populateTasks(responseObj);
          }
      }
  }; 

  request.onerror = function(event){ 
          alert("error, server responded with: " + event.target.response); // raw response
          console.log("error, server responded with: " + event.target.response); // raw response
  }; 
  request.send();
}

function populateTasks(taskList){
  //original project div template
  var taskListEl = document.getElementById('taskListArticle');
  var divTemplate = document.getElementById('taskTemplate');

  taskList.forEach((element,index) => {
      //Clone project div;
      var divClone = divTemplate.cloneNode(true);
      // list.insertBefore(newItem, list.childNodes[0]);  // Insert <li> before the first child of <ul>
      var backcolor = element.color;
      if (!backcolor.startsWith('#')) {
          backcolor = "#" + backcolor;
      }
      divClone.id = divClone.id + index;
      divClone.style.backgroundColor  = backcolor;
      divClone.getElementsByClassName('taskName')[0].innerText = element.name;
      divClone.getElementsByClassName('span-createdDate')[0].innerText = element.createdDate;
      divClone.getElementsByClassName('span-updatedDate')[0].innerText = element.updateDate;

      divClone.getElementsByClassName('taskDescription')[0].innerText = element.description;
      divClone.getElementsByClassName('span-attachedAccount')[0].innerText = element.attachedAccountId;
      divClone.getElementsByClassName('span-status')[0].innerText = element.status;
      divClone.getElementsByClassName('span-evidence')[0].innerText = element.evidence;
      divClone.getElementsByClassName('span-taskType')[0].innerText = element.taskType;
      divClone.getElementsByClassName('span-estimation')[0].innerText = element.estimation;
      divClone.getElementsByClassName('span-workDomain')[0].innerText = element.workDomain;
      divClone.getElementsByClassName('span-geographicZone')[0].innerText = element.geographicZone;
      divClone.getElementsByClassName('span-timeZone')[0].innerText = element.timeZone;

      divClone.style.display = "";
      // divClone.href = "/project/" + element.id._;
      taskListEl.insertBefore(divClone, taskListEl.childNodes[0]);
  });
  addCollapsible();
}