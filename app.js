const STORY = 'src/quixe/stories/glulxercise.ulx';
const VERBOSE = 1;

// START_FAKE_BROWSER
// fake a browser with a global window, document, location, ...
global.window = {};

global.window.document = {};
global.window.document.createElement = function (i) { var e = {}; e.firstChild = {}; return e; }
global.window.console = console;

global.document = {};
global.document.createElement = function (i) { var e = {}; e.firstChild = {}; return e; }

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
global.GlkOte.log = function (args) { 
    if (VERBOSE >= 1) console.log(args); 
}
global.GlkOte.init = function (iface) {}
// END_GLKOTE

// START_FAKE_JQUERY
// maybe the jquery package would be useful?
global.jQuery = {};
global.jQuery.ajax = function (url, opt) {
  if (VERBOSE >= 2) console.log('jQuery.ajax', url, opt);
  var fs = require('fs');
  var story = fs.readFileSync(url, 'binary');
  opt.success(story);
};
// END_FAKE_JQUERY

// IMPORT
// import required js files (see play-remote.html)
// don't add the once which needs too much 'browser'
// make some of them global (gi_load needs them)

require('./src/quixe/src/quixe/quixe.js');
global.window.Quixe = global.Quixe;

require('./src/quixe/src/glkote/glkapi.js');
global.window.Glk = global.Glk;

require('./src/quixe/src/quixe/gi_dispa.js');
global.window.GiDispa = global.GiDispa;

require('./src/quixe/src/quixe/gi_load.js');


// RUN

GiLoad.load_run();