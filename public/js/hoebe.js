// function that makes a request and returns a promise:
function coverAjax(trackhref) {
  // return $.ajax({
  //   url: 'https://embed.spotify.com/oembed/?url='+trackhref,
  //   type: 'GET'
  // });

  return $.ajax({
    type: "GET",
    url: 'https://embed.spotify.com/oembed/?url='+trackhref,
    dataType: "jsonp"
  })
}


// function that expects a promise as an argument:
function displayData(x, that) {
  x.done(function(realData) {
    var threehundred_thumb = realData.thumbnail_url.replace("cover","300");

    $(that).find('img').attr('src', threehundred_thumb);
  });
}


// On load
(function($) {
  console.log('init hoebe.js');
  // find all tracks
  // var tracks = $('#tracks').find('.trackwrapper');
  var tracks = 0;
  
  if(tracks > 0){
    // loop through each track
    tracks.each(function(index){
      var that = this;
      
      // get data attr
      var trackhref = $(this).attr('data-trackhref');
      
      // get a promise from testAjax:
      var ajaxcall = coverAjax(trackhref);

      // give a promise to other function:
      displayData(ajaxcall, that);
    });
  }
  
  $( "#tracks" ).on( "click", "span.add-track", function(e) {
    e.preventDefault();
    
    var that              = this,
        trackhref         = $(that).closest(".trackwrapper").attr('data-trackhref'),
        user_id           = $('#user_id').val(),
        connection_idstr  = $('#connection_idstr').val();
    
    console.log(trackhref, user_id, connection_idstr);


    var socket = io.connect('http://localhost:8080/');
        socket.emit('clients', {user_id: user_id, connection_idstr: connection_idstr, sendSongId: trackhref});  


  });

})(jQuery);


//- https://embed.spotify.com/oembed/?url=spotify:track:6bc5scNUVa3h76T9nvpGIH 
//- https://embed.spotify.com/oembed/?url=spotify:album:5NCz8TTIiax2h1XTnImAQ2 
//- https://embed.spotify.com/oembed/?url=spotify:artist:7ae4vgLLhir2MCjyhgbGOQ

//- /cover/ represents the size of the thumbnail.
//- Available sizes: 60, 85, 120, 300, and 640.

//- eg: https://d3rt1990lpmkn.cloudfront.net/640/f15552e72e1fcf02484d94553a7e7cd98049361a

//- { 
//-   "album": { 
//-     "released": "2009", "href": "spotify:album:1zCNrbPpz5OLSr6mSpPdKm", 
//-     "name": "Greatest Hits", 
//-     "availability": { 
//-       "territories": "AD AT AU BE CA CH DE DK EE ES FI FR GB HK IE IS IT LI LT LU LV MC MX MY NL NO NZ PL PT SE SG US" 
//-     }
//-   }, 
//-   "name": "Everlong", 
//-   "popularity": "0.74", 
//-   "external-ids": [{ 
//-     "type": "isrc",
//-     "id": "USRW29600011"
//-   }], 
//-   "length": 250.259, 
//-   "href": "spotify:track:07q6QTQXyPRCf7GbLakRPr", 
//-   "artists": [{
//-     "href": "spotify:artist:7jy3rLJdDQY21OgRLCZ9sD", 
//-     "name": "Foo Fighters"
//-   }], 
//-   "track-number": "3"
//- }