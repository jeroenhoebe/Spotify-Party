module.exports = function(app, checkAuth, mongoose, User, Playlist){

  /*
   * POST login.
   */
  app.post('/api/login', function(req, res){
    var b = req.body;
    
    var returnData = {
          data: {},
          message: {}
        };

    var user_email    = b.email,
        user_password = b.password;

    if(user_email && user_password){

      User.where('user_email', user_email).where('user_password', user_password).exec('find',function(err, user){
        if(err){
          res.json(err);
        }

        // console.log(user);
        if(user.length > 0){
          returnData = {
            data: {
              user_email: user_email,
              user_id: user[0]._id
            },
            message: { code: 200 }
          };
          res.json(returnData);
        }else{
          returnData = {
            data: { user_email: user_email },
            message: { code: 401 }
          }
          res.json(returnData);
        }
      });
      

    }else{
      
      returnData = {
        data: { user_email: user_email },
        message: { code: 401 }
      }
      res.json(returnData);
    }
  });

  /*
   * POST connections.
   */
  app.post('/api/connections', function(req, res){
    var b = req.body;
    
    var user_email = b.user_email,
        user_id     = b.user_id;

    var returnData = {
      data: {},
      message: {code: 400}
    };

    console.log(user_email, user_id);

    if(user_email && user_id){

      User.where('_id', user_id).where('user_email', user_email).exec('find',function(err, user){
        if(err)
          res.json(err);

        if(user.length > 0){
          console.log(user);

          Playlist.where('playlist_users.playlist_admin', user[0].user_email).exec('find', function(err, playlists){
            if(err){
              res.json(err);
            }
            console.log(playlists);
            returnData.data = playlists;
            returnData.message.code = 200;
            res.json(returnData);
          });
        }else{
          returnData.data = "You're trying something sneaky aren't you?";
          returnData.message.code = 401;

          res.json(returnData);
        }
      });
    }
  });
}