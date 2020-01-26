
document.addEventListener("DOMContentLoaded", function() {
    var form = document.forms.namedItem("sendForm");
    form.action = location.pathname;
  });