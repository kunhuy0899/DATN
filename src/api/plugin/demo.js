
const Common = require('../common');
const DemoDAO = require('../DAO/DemoDAO');
const Joi = require('@hapi/joi');
const Boom = require("boom");
exports.plugin = {
  name: 'demo',
  version: '1.0.0',
  register: async function (server, options) {
    const common = new Common;
    common.routePost({
      server,
      path: '/api/demo',
      auth: false,
      validate: {
        keyword: Joi.string()
      }, callback: async (request, h) => {
        try {
          return "Test API";
        } catch (ex) {
          console.log(ex)
        }
      },
    });
  }
};

