window.addEventListener('DOMContentLoaded', function() {
	'use strict';

	var translate = navigator.mozL10n.get;

	navigator.mozL10n.once(function() {
		var title = document.getElementById('title');
		title.textContent = translate('app_title');
	});

	setAudio();

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

    var server;
    var scriptProcessor;
    var context;
    var bufferStream;

	var startButton = document.querySelector("button#start");
	var stopButton = document.querySelector("button#stop");

	startButton.onclick = function() {
		server = new BinaryClient('ws://localhost:10101/echo');
		server.on('open', function() {
			bufferStream = this.createStream();
		});

		if (context) {
			scriptProcessor.connect(context.destination);
			return;
		}

		navigator.getUserMedia({audio:true, video:false}, function(stream){
			var audioContext = window.AudioContext;
			context = new audioContext();
			window.source = context.createMediaStreamSource(stream);
			var bufferSize = 2048;

			scriptProcessor = context.createScriptProcessor(bufferSize, 1, 1);

			scriptProcessor.onaudioprocess = onAudio;

			window.source.connect(scriptProcessor);

			scriptProcessor.connect(context.destination);

		}, function (error) {
			console.log('getUserMedia error: ' + error.code + ' .');
		});
	};

	stopButton.onclick = function() {
		scriptProcessor.disconnect();
		bufferStream.write("closing");
		server.close();
	};

    function onAudio(e) {
        if(!bufferStream || !bufferStream.writable)
            return;

        var left = e.inputBuffer.getChannelData(0);

        //bufferStream.write(convertFloat32ToInt16(left));
		bufferStream.write(left);
    }

    function convertFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l])*0x7FFF;
        }
        return buf.buffer;
    }

    function drawBuffer( width, height, context, data ) {
        context.clearRect ( 0 , 0 , width , height );
        //var data = buffer.getChannelData( 0 );
        var step = Math.ceil( data.length / width );
        var amp = height / 2;
        for(var i=0; i < width; i++){
            var min = 1.0;
            var max = -1.0;
            for (var j=0; j<step; j++) {
                var datum = data[(i*step)+j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
        }
    }
}
