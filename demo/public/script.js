window.onload = function () {
	var numSource = new EventSource('/randnum');
  var uuidSource = new EventSource('/randuuid');

  numSource.addEventListener('message', function (e) {
    document.getElementById('randNum').innerHTML = e.data;
  });

  uuidSource.addEventListener('message', function (e) {
    document.getElementById('randUUID').innerHTML = e.data;
  });

  var multiplesTracking = document.getElementById('multiplesTracking');
  var attachMultiplesEventSourceListener = function (num) {
    console.log('Attaching', num);
    var source = new EventSource('/randmultiples/' + num);
    source.addEventListener('message', function (e) {
      document.getElementById('multiplesOf' + num).innerHTML = e.data;
    });
  };
  var attachMultiplesEventSourceListeners = function () {
    for (var i = 2; i <= 9; i++) {
      var num = i;
      attachMultiplesEventSourceListener(num);
    }
  };
  attachMultiplesEventSourceListeners();
};
