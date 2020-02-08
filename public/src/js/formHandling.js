 window.onload = () => {
    var errorLabel = document.getElementById('error-label');
    errorLabel.style.display = 'none';

    var form = document.forms.namedItem("sendForm");
    form.addEventListener('submit', function(ev) {
    //disable button
    document.querySelectorAll('input[type=submit]').forEach( x => {x.setAttribute('disabled', true);})
    document.querySelectorAll('input[type=submit]').forEach( x => {x.value = "Sending ...";})
    var oData = new FormData(form);
    ev.preventDefault();
    }, false);

    form.addEventListener('formdata', (e) => {
        // Get the form data from the event object
        let data = e.formData;
        // submit the data via XHR
        let request = new XMLHttpRequest();
        request.open(form.method, form.action, true);

        request.onload = function(event){ 
            console.log("Success, server responded with: " + event.target.response); // raw response
            var responseObj = JSON.parse(event.target.response);
            if (responseObj.Error && responseObj.Error == true){
                console.log('is error');
                // var errorLabel = document.getElementById('error-label');
                errorLabel.innerText = responseObj.Message;
                errorLabel.style.color = "red";
                errorLabel.style.display = 'block';
                document.querySelectorAll('input[type=submit]').forEach( x => {x.setAttribute('disabled', false);})
                document.querySelectorAll('input[type=submit]').forEach( x => {x.value = "Submit";})


            } else {
                document.querySelectorAll('input[type=submit]').forEach( x => {x.setAttribute('disabled', true);})
                document.querySelectorAll('input[type=submit]').forEach( x => {x.value = "Done";})

                errorLabel.style.display = 'none';
                window.location.href = responseObj.RedirectLink;
            }
        }; 

        request.onerror = function(event){ 
            document.querySelectorAll('input[type=submit]').forEach( x => {x.setAttribute('disabled', false);})
            document.querySelectorAll('input[type=submit]').forEach( x => {x.value = "Submit";})
                alert("error, server responded with: " + event.target.response); // raw response
                console.log("error, server responded with: " + event.target.response); // raw response
        }; 
        request.send(data);
      });
 }

