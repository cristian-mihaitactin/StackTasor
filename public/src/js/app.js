const projectsUrl = '/project';
var tst = '';
document.addEventListener("DOMContentLoaded", function() {
    getProjects();
  });
function getProjects() {
    let request = new XMLHttpRequest();
    request.open('GET', projectsUrl, true);

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
                populateProjects(responseObj);
            }
        }
    }; 

    request.onerror = function(event){ 
            alert("error, server responded with: " + event.target.response); // raw response
            console.log("error, server responded with: " + event.target.response); // raw response
    }; 
    request.send();
}

function populateProjects(projectList){
    //original project btn template
    var projectListEl = document.getElementById('projectList');
    var btnTemplate = document.getElementById('btn-projectTemplate');

    projectList.forEach((element,index) => {
        //Clone project btn;
        var btnClone = btnTemplate.cloneNode(true);
        // list.insertBefore(newItem, list.childNodes[0]);  // Insert <li> before the first child of <ul>
        var backcolor = element.color;
        if (!backcolor.startsWith('#')) {
            backcolor = "#" + backcolor;
        }
        btnClone.style.backgroundColor  = backcolor;
        btnClone.getElementsByTagName('strong')[0].innerText = element.name;
        btnClone.style.display = "inline-block";
        btnClone.id = btnClone.id + index;
        projectListEl.insertBefore(btnClone, projectListEl.childNodes[0]);
    });

    //clone project btn
    //append project btn
}