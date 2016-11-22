const VERBOSE = 0;

var IFACE = null;

var Quixe = function(storyfile, output) {

// START_FAKE_BROWSER
// fake a browser with a global window, document, location, ...
global.window = {};

global.window.document = {};
global.window.document.createElement = function (item) {
    var elem = {};
    elem.firstChild = {};
    return elem;
}
global.window.console = console;

global.document = {};
global.document.createElement = global.window.document.createElement;

global.location = {
    search: '?story=' + storyfile,
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
    if (VERBOSE >= 2) console.log('GlkOte update:', arg);

    gen_count = arg.gen;

    // find content
    for (var c of arg.content) {
        var text = c.text;
        if (text) {
            for (var i = 0; i < text.length; i++) {
                var t = text[i];
                if (t && t.content && t.content.length > 0) {
                    if (VERBOSE >= 1) console.log("TYPE", t.content[0]);
                    for (var c = 1; c < t.content.length; c++) {
                        console.log("  ", t.content[c]);
                    }
                }
            }
        }
    }

    // updating window
    if (arg && arg.windows) {
        for (var w of arg.windows) {
            if (w.type === 'buffer') {
                window_id = w.id;
            }
        }
    }
}
// END_GLKOTE

// START_FAKE_JQUERY
// maybe the jquery package would be useful?
global.$ = function (i) {
    var e = {};
    e.length = 1;
    e.append = function (item) { };
    var html = function (d) {
        e.data = d;

        var parser = require('xml2json');
        e.jsonData = JSON.parse(parser.toJson(d));
        return e;
    }
    e.find = function (what) {
        // FIXME
        e.found = e.jsonData['ifindex']['story']['bibliographic']
        return e;
    }
    e.children = function () {
        var r = [];
        for (t in e.found) {
            r.push({ tagName: t, textContent: e.found[t] });
        }
        return r;
    }
    e.html = html;
    return e;
};

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
}

module.exports = Quixe;
