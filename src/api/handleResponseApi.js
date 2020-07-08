const constants = require('./constants');
const _ = require('lodash');

module.exports = (result) => {
  let response  = {};
  if(result.output && result.output.statusCode) {
    result = result.output;
  }

  if(result['statusCode']) {
    //error
    response = {
      code: result.statusCode,
      message: constants.statusCodes[result.statusCode] ? 
                constants.statusCodes[result.statusCode].message : 
                result.payload.message,
      data: result.data ? result.data : {}
    }
  }
  else {
    if(result.code<0) {
      response = result;
    }else {
      response = {
        code: 200,
        message: 'Success',
        data: result.data ? result.data : result
      }
    }
  }
  return response;
}