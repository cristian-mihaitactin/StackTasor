var overlayEl = document.getElementById('overlay');

function div_show() {
    // var popupContact = document.getElementById('popupContact').style.display = "block";
    document.getElementById('popupContact').style.display = "block";

    $('#overlay').fadeIn(200, function() {
    $('#popupContact').animate({
        'top': '20px'
    }, 200);
    });
    return false;

}
function div_hide(){
    $('#popupContact').animate({
    'top': '-200px'
    }, 500, function() {
    $('#overlay').fadeOut('fast', function() {
        document.getElementById('popupContact').style.display = "none";
    });
    });
}