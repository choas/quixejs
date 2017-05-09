var Q = require('./app.js');
var q = new Q(2);
q.init('src/quixe/stories/glulxercise.ulx',
  function (text) {
    console.log('content text', text);
  });
q.input('random');
