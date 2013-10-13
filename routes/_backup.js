
// exports.overview = function(req, res){
//   res.render('overview', { title: 'Spotify Party', loggedin: true });
// };

// exports.search = function(req, res){
//   res.render('search', { title: 'Spotify Party', loggedin: true });
// };

// /*
//  * POST login.
//  */
// exports.login = function(req, res){
//   var b = req.body;
  
//   var username = b.username,
//       password = b.password;

//   if(username && password){
//     var mysql  = require('mysql');

//     var connection = mysql.createConnection({
//       host     : 'localhost',
//       user     : 'root',
//       password : 'hoebe',
//       database : 'dev_spotparty'
//     });

//     connection.connect();

//     connection.query('SELECT * FROM users WHERE user_name = ? AND user_pass = ?', [username, password], function(err, result) {
//       if (err) throw err;

//       if(result.length > 0){
//         console.log(result);
//         req.session.user_id = result[0].user_name;
//         res.redirect('/overview');
//       }else{
//         res.render('index', { title: 'Spotify Party', error: 'username and password do not match' });
//       }
//     });

//     connection.end();
//   }else{
//     res.render('index', { title: 'Spotify Party', error: 'No username and password' });
//   }
// };

// /*
//  * POST check unique id.
//  */
// exports.checkuniqueid = function(req, res){
//   var b = req.body;

//   var uniqueid = b.uniqueid;

//   if(uniqueid){

//     var mysql  = require('mysql');

//     var connection = mysql.createConnection({
//       host     : 'localhost',
//       user     : 'root',
//       password : 'hoebe',
//       database : 'dev_spotparty'
//     });

//     connection.connect();

//     connection.query('SELECT * FROM user_app_connections WHERE unique_id = ?', [uniqueid], function(err, result) {
//       if (err) throw err;

//       if(result.length > 0){
//         console.log(result);
//         req.session.unique_id = result[0].unique_id;
//         res.redirect('/search');
//       }else{
//         res.redirect('/overview');
//       }
//     });

//     connection.end();

//     // res.render('search', { title: 'Spotify Party', loggedin: true });
//   }else{
//     res.redirect('/overview');
//   }
// }