window.onload = function () {
	var numSource = new EventSource('/randnum');
  var uuidSource = new EventSource('/randuuid');

  numSource.addEventListener('message', function (e) {
    document.getElementById('randNum').innerHTML = e.data;
  });

  uuidSource.addEventListener('message', function (e) {
    document.getElementById('randUUID').innerHTML = e.data;
  });
};
