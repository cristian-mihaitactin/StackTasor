var overlayEl = document.getElementById('overlay');

function div_show() {
    // var popupContact = document.getElementById('popupContact').style.display = "block";
    document.getElementById('popupContact').style.display = "block";

    return false;

}
function div_hide(){
    document.getElementById('name').value = '';
        document.getElementById('color').value = '';
        document.getElementById('description').value = '';
        document.getElementById('estimation').value = '';
        document.getElementById('taskType').value = '';
        document.getElementById('geographicZone').value = '';
        document.getElementById('timeZone').value = '';
        document.getElementById('workDomain').value = '';

        document.getElementById('popupContact').style.display = "none";

}