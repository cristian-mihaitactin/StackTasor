var projectPathname = '';
var testObj = '';
document.addEventListener("DOMContentLoaded", function() {
    var form = document.forms.namedItem("sendForm");
    projectPathname = location.pathname;
    form.action = projectPathname;
    getTasks();

    var dateNow = new Date();
    var dateDay = dateNow.getUTCDate() > 9 ? "" + dateNow.getUTCDate()  : '0' + dateNow.getUTCDate();
    var dateMonth = dateNow.getUTCMonth() > 8 ? "" + dateNow.getUTCMonth() + 1  : '0' + (dateNow.getUTCMonth() + 1);
    var minDate = dateNow.getUTCFullYear() + "-" + dateMonth + '-' + dateDay;
    document.getElementById('expiryDate').min = minDate;
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
      divClone.getElementsByClassName('span-expiryDate')[0].innerText = element.expiryDate;

      var nowDate = new Date();
      var expDate = new Date(element.expiryDate);
      if (expDate > nowDate) {
        var timeDiff = expDate.getTime() - nowDate.getTime(); 
        // To calculate the no. of days between two dates 
        var daysDif = timeDiff / (1000 * 3600 * 24); 

        divClone.getElementsByClassName('span-expiryDays')[0].innerText = Math.floor(daysDif);
      }
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

      //calculate link
      var taskLink = window.location.origin + "/workItem/" + element.projectId + "/tasks/" + element.id._;

      divClone.getElementsByClassName('span-link')[0].href = taskLink;
      divClone.getElementsByClassName('span-link')[0].innerText = taskLink;
      
      var linkId = "taskLink" + index;
      divClone.getElementsByClassName('span-link')[0].id = linkId;
      divClone.getElementsByClassName('btn-copyLink')[0].onclick = () => {
        var copyText = document.getElementById(linkId);
        
        navigator.clipboard.writeText(copyText.innerText).then(function() {
            alert("Copied");
        }, function(err) {
            alert("Failed to copy text!");
          });

      }

      divClone.getElementsByClassName('btn-taskEdit')[0].onclick = () => {
        document.getElementById('name').value = element.name;
        document.getElementById('color').value = element.color;
        var entityExpiryDate = new Date(element.expiryDate);
        var dateDay = entityExpiryDate.getUTCDate() > 9 ? "" + entityExpiryDate.getUTCDate()  : '0' + entityExpiryDate.getUTCDate();
        var dateMonth = entityExpiryDate.getUTCMonth() > 8 ? "" + entityExpiryDate.getUTCMonth() + 1  : '0' + (entityExpiryDate.getUTCMonth() + 1);
        var entityExpiryDateString = entityExpiryDate.getUTCFullYear() + "-" + dateMonth + '-' + dateDay;
        document.getElementById('expiryDate').value = entityExpiryDateString;
        
        document.getElementById('description').value = element.description;
        document.getElementById('estimation').value = element.estimation;
        document.getElementById('taskType').value = element.taskType;
        document.getElementById('geographicZone').value = element.geographicZone;
        document.getElementById('timeZone').value = element.timeZone;
        document.getElementById('workDomain').value = element.workDomain;

        document.getElementById('taskId').value = element.id._;
        var form = document.forms.namedItem("sendForm");
        var projectPathname = location.pathname;
        form.action = projectPathname;
        div_show()
      }
      divClone.getElementsByClassName('btn-taskDelete')[0].onclick = () => {
        var r = confirm("Are you sure you want do delete the task?");
        
        if (r == true) {
            let request = new XMLHttpRequest();
            var taskDeletePathname = location.pathname + "/tasks/" + element.id._;
    
            request.open('DELETE', taskDeletePathname, true);
          
            // get projects
            request.onload = function(event){ 
                console.log("Success, server responded with: " + event.target.response); // raw response
                var responseObj = JSON.parse(event.target.response);
                testObj = responseObj;
                if (responseObj.Error && responseObj.Error == true){
                    console.log('is error');
                    // var errorLabel = document.getElementById('error-label');
                    errorLabel.innerText = responseObj.Message;
                    errorLabel.style.color = "red";
                    errorLabel.style.display = 'block';
                } else {
                    //check if they exist
                    window.location.href = responseObj.RedirectLink;
                }
            }; 
          
            request.onerror = function(event){ 
                    alert("error, server responded with: " + event.target.response); // raw response
                    console.log("error, server responded with: " + event.target.response); // raw response
            }; 
            request.send();        
        }
      }

      divClone.style.display = "";
      taskListEl.insertBefore(divClone, taskListEl.childNodes[0]);
  });
  addCollapsible();
}