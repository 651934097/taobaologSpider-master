
var express = require('express');
var mongoose = require('./lib');

var uri = 'mongodb://localhost/contact';
global.db = mongoose.createConnection(uri);

var routes = require('./routes');

var app = express();
app.get('/', routes.home);
app.get('/insert', routes.insert);
app.get('/name', routes.modelName);

app.listen(3004, function() {
    console.log('listening on http://localhost:3004');
});
