window.onload = function () {
	var numSource = new EventSource('/randnum');
  var uuidSource = new EventSource('/randuuid');

  numSource.addEventListener('message', function (e) {
    document.getElementById('randNum').innerHTML = e.data;
  });

  uuidSource.addEventListener('message', function (e) {
    document.getElementById('randUUID').innerHTML = e.data;
  });

  var toggleForm = document.getElementById('toggleForm');
  toggleForm.onchange = function () {
    var checkboxes = toggleForm.getElementsByTagName('input');
    var activeCheckboxes = [];
    for (var i = 0; i < checkboxes.length; i++) {
      var checkbox = checkboxes[i];
      if (checkbox.checked) {
        activeCheckboxes.push(checkbox.value);
      }
    }
    updateTracking(activeCheckboxes);
  };

  var multiplesTracking = document.getElementById('multiplesTracking');
  var updateTracking = function (tracking) {
    removeTrackingElements();
    for (var i = 0; i < tracking.length; i++) {
      createTrackingElement(tracking[i]);
    }
  };
  var createTrackingElement = function (value) {
    var element = '<h4>' + value + ': <span id="e' + value + '"></span></h4>';
    multiplesTracking.innerHTML += element;
    var source = new EventSource('/randmultiples/' + value);
    source.addEventListener('message', function (e) {
      multiplesTracking.querySelector('#e' + value).innerHTML = e.data;
    });
  };
  var removeTrackingElements = function () {
    multiplesTracking.innerHTML = '';
  };
};
