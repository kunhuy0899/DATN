'use strict';
const md5 = require('md5');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const Pack = require('./package');
// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8010,
});

const validate = async function (decoded, request) {
};


const start = async function () {
  const config = {
    statusCodes: {
      401: { message: 'Please Login to view that page' },
      400: { message: 'Sorry, we do not have that page.' },
      404: { message: 'Sorry, that page is not available.' },
    }
  };
  try {
    const swaggerOptions = {
      info: {
        title: 'Test API Documentation',
        version: Pack.version,
      },
      host: 'localhost:8010',
      securityDefinitions: {
        'jwt': {
          'type': 'apiKey',
          'name': 'Authorization',
          'in': 'header',
          'x-keyPrefix': 'Bearer '
        }
      },
      security: [{ jwt: [] }]
    };
    await server.register([
      require('hapi-auth-jwt2'),
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      },
      {
        plugin: require('hapi-error'),
        options: config
      }

    ]);

    server.auth.strategy('jwt', 'jwt',
      {
        key: '10026',
        validate: validate,
        verifyOptions: { algorithms: ['HS256'] },
        cookieKey: 'yourkeyhere',
        headerKey: 'authorization',
        tokenType: 'Bearer'
      });


    server.auth.default('jwt');
    await server.register([
      Inert,
      require('./plugin/demo.js')
    ]);

    await server.start(err => {
      if (err) {
        throw err
      }

      console.log(`Server running at ${server.info.uri}`)
    })
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

start();

