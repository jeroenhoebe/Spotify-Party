module.exports = function(app, checkAuth, jq, mongoose, User, Playlist){

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


  app.get('/jacuzzi', function(req, res){
    var playlist_name  = "jacuzzi party",
        user_id        = "525db90f7d3b646099000001";
    
    res.render('./loggedin/public_search', {playlist_name: playlist_name, user_id: user_id});
  });

  /*
   * POST overview page.
   */
  app.post('/jacuzzi/:playlist_name', function(req, res){
    var b                 = req.body,
        playlist_name  = req.params.playlist_name,
        user_id           = "525db90f7d3b646099000001";
    
    // log search param
    console.log(b.searchsong);

    // set uri search req
    var urireq = 'http://ws.spotify.com/search/1/track.json?q='+b.searchsong;

    // retrieve json
    jq.getJSON(urireq, function(data) {
      // console.log(data);
      
      // set tracks array
      var tracks = [];

      // check if there are more than 10 tracks
      if(data.tracks.length > 10){

        // loop through 10 tracks
        for (var i = 0; i < 10; i++) {
          
          // set song data
          var trackinfo = data.tracks[i];

          trackinfo.img = { 
            cover: "/images/default-track.jpg"
          };


          tracks.push(trackinfo);
        };
      }else{
        for (var i = 0; i < data.tracks.length; i++) {
          var trackinfo = data.tracks[i];
          trackinfo.img = { 
            cover: "/images/default-track.jpg"
          };

          tracks.push(trackinfo);
        };

      }

      // console.log(tracks);
      // $.each( data.tracks, function( key, value ) {
      //   alert( key + ": " + value );
      // });

      function checkCoverData(item){
        console.log(item);
      }

      res.render('./loggedin/search', { playlist_name: playlist_name, user_id: user_id, tracks: tracks });
    });
      
  });
}