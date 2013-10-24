module.exports = function(app, checkAuth, jq){

// setup socket io
var io = require('socket.io').listen(8080);
console.log("socket io running on port 8080");

io.sockets.on('connection', function (socket) {
  socket.on('clients', function(data){
    console.log(data);
    
    socket.broadcast.emit('tospotify/'+data.user_id+'/'+data.playlist_name+'', {user_id: data.user_id, playlist_name: data.playlist_name, songId: data.sendSongId});
  });
});

  /*
   * GET search page.
   */
  app.get('/searchsong/:playlist_name', checkAuth, function(req, res){

    var playlist_name  = req.params.playlist_name,
        user_id           = req.session.userid;
    
    res.render('./loggedin/search', {playlist_name: playlist_name, user_id: user_id});
      
  });

  /*
   * POST overview page.
   */
  app.post('/searchsong/:playlist_name', checkAuth, function(req, res){
    var b                 = req.body,
        playlist_name  = req.params.playlist_name,
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

      res.render('./loggedin/search', { playlist_name: playlist_name, user_id: user_id, tracks: tracks });
    });
      
  });
}