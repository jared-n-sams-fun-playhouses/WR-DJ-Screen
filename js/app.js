// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

    // We'll ask the browser to use strict code to help us catch errors earlier.
    // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
    'use strict';

    var translate = navigator.mozL10n.get;

    // We want to wait until the localisations library has loaded all the strings.
    // So we'll tell it to let us know once it's ready.
    navigator.mozL10n.once(start);

    // ---

    function errorCallback(error) {
        console.log('getUserMedia error: ' + error.code + ' .');
    }

    function setup() {
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
            
        }, errorCallback);
    }

    function start() {
        // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
        // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations

        var title = document.getElementById('title');
        title.textContent = translate('app_title');

        setup();
    }

});
