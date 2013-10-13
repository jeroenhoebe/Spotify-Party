module.exports = function(app, checkAuth, mysql, connection){

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
      
      var sql  = "SELECT * FROM `users` WHERE `user_email` = ? AND `user_password` = ?";
      
      connection.query(sql, [user_email, user_password], function(err, result) {
        if(err)
          res.json(err);

        if(result.length > 0){
          returnData = {
            data: {
              user_email: user_email,
              user_id: result[0].user_id
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

    var sql  = "SELECT connection_id, connection_idstr FROM `connections` JOIN `users` ON `connection_userid` = `user_id` WHERE user_email = ? AND connection_userid = ?";
    connection.query(sql, [user_email, user_id], function(err, results) {
      if(err){
        console.log(err);
        returnData.data = err;
        res.json(returnData);
      }
        
      // if we have results
      if(results.length > 0){
        returnData.data = results;
        returnData.message.code = 200;

        res.json(returnData);
      }else{
        returnData.data = "You're trying something sneaky aren't you?";
        returnData.message.code = 401;

        res.json(returnData);
      }
    });
  });
}