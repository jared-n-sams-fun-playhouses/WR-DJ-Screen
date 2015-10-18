window.addEventListener('DOMContentLoaded', function() {
	'use strict';

	var translate = navigator.mozL10n.get;

	navigator.mozL10n.once(start);

	function start() {
		var title = document.getElementById('title');
		title.textContent = translate('app_title');

		setup();
	}

	function setup() {
		setAudio();
	}

});

function setAudio() {
	window.AudioContext = (window.AudioContext || window.webkitAudioContext);

	navigator.getUserMedia =   (navigator.getUserMedia || 
								navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia);

	window.URL =   (window.URL ||
					window.webkitURL ||
					window.mozURL ||
					window.msURL);

	var audio = document.querySelector('audio');

	var context = new AudioContext();

	navigator.getUserMedia({audio:true}, function(stream) {

		var microphone = context.createMediaStreamSource(stream);
		var filter = context.createBiquadFilter();

		microphone.connect(filter);
		filter.connect(context.destination);

		audio.src = window.URL.createObjectURL(stream);
		
	}, 	function (error) {
		console.log('getUserMedia error: ' + error.code + ' .');
	});
}

function setConnection() {
	
}