const swaggerAutogen = require('swagger-autogen')();

// Swagger docs
const doc = {
    info: {
      title: 'CDW Connect API',
      description: 'This is an api for CDW Connect application'
    },
    host: 'localhost:4000'
  };
  
const outputFile = './public/swagger.json';
const routes = ['./app.js'];

swaggerAutogen(outputFile, routes, doc);