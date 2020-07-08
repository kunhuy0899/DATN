const serverConfig = require('./config/server');
const handleResponseApi =  require('./handleResponseApi');
const fs = require('fs');
const http = require('http');
const https = require('https');
const MomentRange = require('moment-range');
const Joi = require('@hapi/joi');
const Moment = require('moment');
const moment = MomentRange.extendMoment(Moment);
class Common {
  constructor(options = null) {
    this.options = options;
  }
  getUnix(date) {
    //YYYY-MM-DD
    return Moment(date).unix();
  }
  getNow() {
    return Moment().unix();
  }
  getTodayTime() {
    return Moment({h:0, m:0, s:0, ms:0}).unix();
  }
  getToday() {
    return Moment().format('YYYY-MM-DD');
  }
  getYesterday() {
    return Moment().subtract(1, 'days').format('YYYY-MM-DD');
  }
  getDayBefore(n, date){
    return Moment(date).subtract(n, 'days').format('YYYY-MM-DD');
  }
  getDayAfter(day, date){
    var myDate = new Date(date);
    myDate.setDate(myDate.getDate() + day);
    return Moment.utc(myDate).format('YYYY-MM-DD');
  }
  requestHeader() {
    // return 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36';
    return 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  }

  routePost(options) {
    let { server, path, callback, auth, validate } = options;
    if(auth !=false) {
      auth = 'jwt'
    }
    const methob = 'POST';
    const refactValidate = {
      payload: Joi.object({
        ...validate
      })
    }
    this.route(server, path, callback,methob, auth, refactValidate);
  }

  routeGet(options) {
    // server, path, callback, auth = 'jwt'
    let { server, path, callback, auth, validate } = options;
    if(auth !=false) {
      auth = 'jwt'
    }
    const methob = 'GET';
    const refactValidate = {
      query: Joi.object({
        ...validate
      })
    }
    this.route(server, path, callback,methob, auth, refactValidate);
  }
  route(server, path, callback, method, auth, validate, timeout = {server: 10000}) {
    server.route({
      method,
      path,
      config: {
        auth,
        cors: serverConfig.corsHeaders,
        tags: ['api'],
        validate,
        timeout
      },
      handler: async (request, h) => {
        let callBackResult;
          try {
            callBackResult = handleResponseApi(await callback(request, h, false));
          } catch (error) {
            callBackResult = handleResponseApi(error);
          }
          return h.response(callBackResult);
      }
    });
  }

  response(statusCode, message, data = null) {
    return {
      statusCode,
      message,
      data
    }
   }

  createSlug(name){
    return this.changeAlias(name).split(' ').join('-').toLowerCase();
  }

  changeAlias(str) {
    if(str && str.length) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      str = str.replace(/[^a-zA-Z0-9 ]/g, "")
      return str.replace(/:|-|%|!|/g, '');
    } else {
      return str;
    }
  }
}

module.exports = Common;