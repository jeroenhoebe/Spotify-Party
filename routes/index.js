var sha1 = require('sha1');


module.exports = function(app, checkAuth, mysql, connection){

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
        
        var postdata = {
          user_email: b.email,
          user_password: sha1(b.password)
        }

        var query = connection.query('INSERT INTO users SET ?', postdata, function(err, result) {
          if(err)
            res.json(err);
          console.log(err, result);
        });

        
        res.redirect('/login');
        // res.render('./login/login');
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
      
      var sql  = "SELECT * FROM `users` WHERE `user_email` = ? AND `user_password` = ?";
      
      connection.query(sql, [user_email, user_password], function(err, result) {
        if(err)
          res.json(err);

        if(result.length > 0){
          // set session
          req.session.user_id = user_email;
          req.session.userid = result[0].user_id;
          var now = new Date();
          var query = connection.query('UPDATE users SET user_lastlogin=? WHERE user_email=?', [now, user_email], function(err, result) {
          if(err)
            res.json(err);
          });

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

    var sql  = "SELECT connection_id, connection_idstr FROM `users` JOIN `connections` ON connection_userid = user_id WHERE `user_email` = ?";
      
    connection.query(sql, [user_email], function(err, results) {
      if(err)
        res.json(err);

      if(results){
        console.log(results);
        res.render('./loggedin/overview', { connectionids: results });
      }else{
        res.render('./loggedin/overview');
      }
    });
  });

  /*
   * POST create connectionid.
   */
  app.post('/createconnectionid', checkAuth, function(req, res){
    var b = req.body;

    var user_email = req.session.user_id,
        connectionid = b.connectionid;

    console.log(user_email, connectionid);

    if(user_email && connectionid.length > 5){

      var sql  = "SELECT * FROM `users` WHERE `user_email` = ? LIMIT 1";
      
      connection.query(sql, [user_email], function(err, result) {
        if(err)
          res.json(err);
        
        if(result){
          
          var postdata = { connection_idstr: connectionid, connection_userid: result[0].user_id };

          connection.query('INSERT INTO connections SET ?', postdata, function(err, result) {
            if(err) throw err;

            res.redirect('/searchsong/'+connectionid);
          });

          // console.log(result, postdata);

        }else{
          console.log('no user');
        }
      });

      
    }else{
      console.log('connection to short');
      res.render('./loggedin/overview');  
    }
  });

}

