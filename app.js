var VERBOSE = 0;

var IFACE = null;

const fs = require('fs'),
      requireUncached = require('require-uncached');

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

function XMLHttpRequest() {
    this.overrideMimeType = true;
}
global.XMLHttpRequest = XMLHttpRequest;

global.navigator = {};
global.navigator.userAgent = "Node.js";

// fake browser localStorage and store key-value in a file
// possible keys: content, dirent, autosave
global.window.localStorage = {
    getItem: function (key) {

        try {
            if (VERBOSE >= 2) console.log('read file', key);
            var fileData = fs.readFileSync(key, "utf8");
            if (VERBOSE >= 1) console.log('key', key, '=>', fileData);
            return fileData;
        } catch (e) {
            if (VERBOSE >= 1) console.log('file not found:', key);
        }
        return null;
    },
    setItem: function (key, val) {
        if (VERBOSE >= 2) console.log('store file', key, ':', val);
        fs.writeFileSync(key, val, { "encoding": 'utf8' });
    },
    removeItem: function (key) {
        if (VERBOSE >= 2) console.log('delete file', key);
        fs.unlink(key, function (err) {
            if (err) {
                if (VERBOSE >= 2) console.log('file', key, 'NOT deleted');
            } else {
                if (VERBOSE >= 2) console.log('file', key, 'deleted');
            }
        });
    },
    key: function (index) {
        throw "'localStorage key' not implemented";
    },
    clear: function () {
        throw "'localStorage clear' not implemented";
    }
}
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
global.GlkOte.warning = function (err) {
    if (VERBOSE >= 1) console.log('GlkOte warning:', err);
}
global.GlkOte.error = function (err) {
    if (VERBOSE >= 1) console.log('GlkOte error:', err);
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
            if (input_callback !== undefined) {
                input_callback(text);
            } else if (output_callback !== undefined) {
                output_callback(text);
            } else {
                if (VERBOSE >= 2) console.log('input and output callback not defined');
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

        var xmljs = require("xml-js");
        e.jsonData = xmljs.xml2json(d, {compact: true, spaces: 4});
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
    e.on = function (w, c) {
        // FIXME
        if (VERBOSE >= 2) console.log('ON', w, '...'); 
    }

    return e;
};

global.jQuery = {};
global.jQuery.ajax = function (url, opt) {
    if (VERBOSE >= 2) console.log('jQuery.ajax', url, opt);
    try {
        var story = fs.readFileSync(url, 'binary');
    } catch (e) {
        console.error(e);
    }
    opt.success(story);
};
// END_FAKE_JQUERY

// IMPORT
// import required js files (see play-remote.html)
// don't add the once which needs too much "browser"
// make some of them global (gi_load needs them)

requireUncached('./src/quixe/src/quixe/quixe.js');
global.window.Quixe = global.Quixe;

requireUncached('./src/quixe/src/glkote/glkapi.js');
global.window.Glk = global.Glk;

requireUncached('./src/quixe/src/quixe/gi_dispa.js');
global.window.GiDispa = global.GiDispa;

requireUncached('./src/quixe/src/quixe/gi_load.js');

requireUncached('./src/quixe/src/glkote/dialog.js');


// RUN
var output_callback, input_callback;

var Quixe = function (verbose) {

    if (verbose) {
        VERBOSE = verbose;
    }

    this.init = function (storyfile, callback) {
        output_callback = callback;
        global.location = {
            search: '?story=' + storyfile,
            toString: function () {
                return 'http://localhost/play-all.html?story=' + this.search;
            }
        }
        GiLoad.load_run();
    }

    this.input = function (value, callback) {
        input_callback = callback;
        IFACE.accept({ "type": "line", "gen": gen_count, "window": window_id, "value": value });
    };
}

module.exports = Quixe;
