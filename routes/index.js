var sha1 = require('sha1');


module.exports = function(app, checkAuth, mongoose, User, Playlist){

  /*
   * GET home page.
   */
  app.get('/', function(req, res){
    res.render('index', { title: 'Spotify Party' });
  });

  /*
   * GET signup page.
   */
  app.get('/signup', function(req, res){
    res.render('./login/signup');
  });

  /*
   * POST signup.
   */
  app.post('/signup', function(req, res){
    var b = req.body;
    
    var message = 'default';

    // check if password en confirmpassword match
    if(b.password == b.confirmpassword){
      
      if(b.password.length >= 5){
        
        new User({
          user_email: b.email,
          user_password: sha1(b.password)
        }).save(function(err, newUser){
          if(err) res.json(err);
        });

        
        res.redirect('/login');
      }else{
        // set message
        message = 'password is to short';
        // log && render view
        console.log(message);
        res.render('./login/signup');
      }
    }else{
      //set message
      message = 'pass didnt match';

      // log && render view
      console.log(message);
      res.render('./login/signup');
    }
  });

  /*
   * GET login page.
   */
  app.get('/login', function(req, res){
    var returnData = {
          data: {},
          message: {}
        };
    res.render('./login/login', returnData);
  });

  /*
   * POST login.
   */
  app.post('/login', function(req, res){
    var b = req.body;
    
    var returnData = {
          data: {},
          message: {}
        };

    var user_email    = b.email,
        user_password = sha1(b.password);
    
    if(user_email && user_password){
      
      User.where('user_email', user_email).where('user_password', user_password).exec('find',function(err, user){
        if(err)
          res.json(err);

        // console.log(user);
        if(user.length > 0){
          // set session
          req.session.user_id = user[0].user_email;
          req.session.userid = user[0]._id;
          
          // go to overview view
          res.redirect('overview');
        }else{
          // reset session
          req.session.user_id = false;
          req.session.userid = null;
          
          returnData = {
            data: { user_email: user_email },
            message: { error: { code: 401 } }
          }
          res.render('./login/login', returnData);
        }
      
      });

    }else{
      // reset session
      req.session.user_id = false;
      req.session.userid = null;
      returnData = {
        data: { user_email: user_email },
        message: { error: { code: 401 } }
      }
      res.render('./login/login', returnData);
    }
  });

  /*
   * GET overview page.
   */
  app.get('/overview', checkAuth, function(req, res){

    var user_email = req.session.user_id;

    Playlist.where('playlist_users.playlist_admin', user_email).exec('find',function(err, playlists){
        if(err)
          res.json(err);
        
        if(playlists)
        {
          // console.log(playlists);
          res.render('./loggedin/overview', { playlists: playlists });
        }
        else
        {
          // console.log(user_email);
          res.render('./loggedin/overview');
        }
    });
    
  });

  /*
   * POST create connectionid.
   */
  app.post('/create-playlist', checkAuth, function(req, res){
    var b = req.body;

    var user_email = req.session.user_id,
        playlist_name = b.playlist_name;

    console.log(user_email, playlist_name);

    if(user_email && playlist_name.length > 5){

      new Playlist({
          playlist_name: playlist_name,
          playlist_users: {
            playlist_admin: user_email,
          }
        }).save(function(err, newPlaylist){
          if(err) res.json(err);

          res.redirect('/searchsong/'+playlist_name);
        });

      
    }else{
      console.log('connection to short');
      res.render('./loggedin/overview');  
    }
  });

}

