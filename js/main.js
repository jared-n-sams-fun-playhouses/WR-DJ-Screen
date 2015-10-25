window.addEventListener('DOMContentLoaded', function() {
	'use strict';

	var translate = navigator.mozL10n.get;

	navigator.mozL10n.once(function() {
		var title = document.getElementById('title');
		title.textContent = translate('app_title');
	});

	var server = new WebSocket("ws://localhost:10101/echo");

	server.onopen = function() {
		server.send("Connection init from DJ Screen.");
	}

	setAudio(server);

});

function setAudio(server) {
	window.AudioContext = (window.AudioContext || window.webkitAudioContext);

	navigator.getUserMedia =   (navigator.getUserMedia ||
								navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia);

	window.URL =   (window.URL ||
					window.webkitURL ||
					window.mozURL ||
					window.msURL);

	var context = new AudioContext();

	navigator.getUserMedia({audio:true}, function(stream) {

		window.source = context.createMediaStreamSource(stream);

		source.connect(context.destination);

	}, 	function (error) {
		console.log('getUserMedia error: ' + error.code + ' .');
	});
}
