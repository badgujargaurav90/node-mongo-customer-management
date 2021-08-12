'use strict';
const jwt = require('jsonwebtoken')  
const tokenSecret = "restaurant-tokens"

module.exports = {
  /*commonmsg function start from here */
  commonMsg: function (status, msg, resData, err) {
    if (!msg) msg = 'Something went wrong';
    var code;
    if (status === 'failure') code = 500;
    else if(status === "success") code = 200;
    else if(status === "no-record") code = 204;
    else if(status === "wrong-data") code = 535;
    var methodResponse = {};
    methodResponse['info'] = {};
    methodResponse['data'] = {};
    methodResponse['error'] = {};
    if (resData) {
      resData = JSON.stringify(resData);
      resData = JSON.parse(resData);
      methodResponse.data =   resData;
    }
    if (err) {
      methodResponse.error = err;
    }
    methodResponse.data.responseMsg = msg;
    methodResponse.info = {
      'status': status,
      'code': code
    };
    return methodResponse;

  },
  /*commonmsg function ends here */
  generateToken: function(response){
    return jwt.sign({data:response},tokenSecret,{expiresIn:'24h'})
}
}
