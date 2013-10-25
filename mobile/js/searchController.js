app.controller('SearchController', function($scope, $http) {
    $scope.search_input = '';
    $scope.getData = function (query){
        var url = "http://ws.spotify.com/search/1/track.json?q=" + query
        $http.get(url).then(function(res){
            if(res.data.tracks.length == 0){
                $scope.no_results = true;
            }else{
                $scope.no_results = false;
            }
            $scope.data = res.data.tracks;                
        });
    }
    $scope.sendSong = function(songId){
        var socket = io.connect('http://localhost:8080/');
        socket.emit('clients', {sendSongId: songId});  
    }

});
