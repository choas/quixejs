const STORY = 'src/quixe/stories/glulxercise.ulx';
const VERBOSE = 1;

var IFACE = null;

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

// more ... ???

// END_FAKE_BROWSER

// START_GLKOTE
// adding GlkOte stuff (note: glkote.js is too much 'browser')
global.GlkOte = {};
global.GlkOte.log = function (args) {
    if (VERBOSE >= 1) console.log(args);
}
global.GlkOte.init = function (iface) {
    IFACE = iface;
    iface.accept({ "type": "init", "gen": 0, "metrics": { "width": 450, "height": 723, "gridcharheight": 16, "gridcharwidth": 8.375, "gridmarginx": 20, "gridmarginy": 12, "buffercharheight": 16, "buffercharwidth": 7, "buffermarginx": 20, "buffermarginy": 12, "graphicsmarginx": 0, "graphicsmarginy": 0, "outspacingx": 4, "outspacingy": 4, "inspacingx": 4, "inspacingy": 4 } });
}
global.GlkOte.error = function (err) {
    console.log('GlkOte error:', err);
}
global.GlkOte.update = function (arg) {
    console.log('GlkOte update:', arg);
}
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