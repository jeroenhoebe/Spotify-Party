
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , consearch = require('./routes/consearch')
  , http = require('http')
  , path = require('path')
  , mongoose  = require('mongoose')
  , jq = require('jquery');

var app = express();



// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.locals.pretty = true;
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('hoebestaathet'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// check login
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('login');
  } else {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

//connect MongoDB
mongoose.connect('mongodb://localhost/spotparty');

// SCHEMAS
var userSchema = mongoose.Schema({
    user_email: {type: String, required: true},
    user_password: String,
    user_metadata: {
      user_createdate: {type: Date, default: Date.now()},
      user_modifydate: {type: Date, default: Date.now()},
      user_deletedate: {type: Date, default: null}
    }
  });

var playlistSchema = mongoose.Schema({
  playlist_name: {type: String, required: true},
  playlist_public: {type: Boolean, default: true},
  playlist_users: {
    playlist_admin: {type: String},
    playlist_followers: [String]
  }
});

// MODELS
var User = mongoose.model('User', userSchema);
var Playlist = mongoose.model('Playlist', playlistSchema);

// require routes
require('./routes/index')(app, checkAuth, mongoose, User, Playlist);
require('./routes/consearch')(app, checkAuth, jq);
require('./routes/api')(app, checkAuth, mongoose, User, Playlist);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
