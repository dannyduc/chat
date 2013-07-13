
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , connect = require('connect');

var app = module.exports = express();

var sessionStore = new connect.session.MemoryStore();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser('somesuperspecialsecrethere'));
  app.use(express.session({key: 'express.sid', store: sessionStore}))
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.set('view options', { layout: false });

// Routes

app.get('/', routes.index);
app.get('/chatroom', routes.chatroom);
app.get('/rooms', routes.rooms);

var port = 3000;
var server = app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

require('./routes/sockets.js').initialize(server);


