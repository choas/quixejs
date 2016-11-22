const STORY = 'src/quixe/stories/glulxercise.ulx';

// START_FAKE_BROWSER
// fake a browser with a global window, document, location, ...
global.window = {};

global.window.document = {};
global.window.console = console;

global.document = {};

global.location = { 
  search: '?story=' + STORY, 
  toString: function () { 
    return 'http://localhost/play-all.html?story=' + this.search;
  } 
}

function XMLHttpRequest() {
  this.overrideMimeType = true;
}
global.XMLHttpRequest = XMLHttpRequest;

global.navigator = {};
global.navigator.userAgent = "Node.js";

// more ...

// END_FAKE_BROWSER

// START_GLKOTE
// adding GlkOte stuff (note: glkote.js is too much 'browser')
global.GlkOte = {};
global.GlkOte.log = function (l) { console.log(l); }

// END_GLKOTE

// START_FAKE_JQUERY
// maybe the jquery package would be useful?
global.jQuery = {};
global.jQuery.ajax = function (url, opt) {
};
// END_FAKE_JQUERY


// IMPORT
// import required js files (see play-remote.html)
// don't add the once which needs too much 'browser'

require('./src/quixe/src/quixe/quixe.js');
require('./src/quixe/src/glkote/glkapi.js');
require('./src/quixe/src/quixe/gi_dispa.js');
require('./src/quixe/src/quixe/gi_load.js');


// RUN

GiLoad.load_run();
