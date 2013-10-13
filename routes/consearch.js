module.exports = function(app, checkAuth, jq){

// setup socket io
var io = require('socket.io').listen(8080);
console.log("socket io running on port 8080");

io.sockets.on('connection', function (socket) {
  socket.on('clients', function(data){
    console.log(data);
    
    socket.broadcast.emit('tospotify/'+data.user_id+'/'+data.connection_idstr+'', {user_id: data.user_id, connection_idstr: data.connection_idstr, songId: data.sendSongId});
  });
});

  /*
   * GET search page.
   */
  app.get('/searchsong/:connection_idstr', checkAuth, function(req, res){

    var connection_idstr  = req.params.connection_idstr,
        user_id           = req.session.userid;
    
    res.render('./loggedin/search', {connection_idstr: connection_idstr, user_id: user_id});
      
  });

  /*
   * POST overview page.
   */
  app.post('/searchsong/:connection_idstr', checkAuth, function(req, res){
    var b                 = req.body,
        connection_idstr  = req.params.connection_idstr,
        user_id           = req.session.userid;
    
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

      res.render('./loggedin/search', { connection_idstr: connection_idstr, user_id: user_id, tracks: tracks });
    });
      
  });
}