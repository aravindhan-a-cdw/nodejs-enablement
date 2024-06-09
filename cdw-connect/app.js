const express = require("express");
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const {logger, loggerMiddleware} = require('./utils/logger');
const authRoutes = require('./routes/authentication');

if(process.env.ENVIRONMENT === 'dev') {
    require('./utils/swagger');
}

const app = express();

// Serve Static files
app.use(express.static('public'))

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(loggerMiddleware);

// Add Swagger UI Middleware
const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        url: "/swagger.json"
    }
  };
app.use('/api-docs', swaggerUi.serveFiles(null, options), swaggerUi.setup(null, options));

// Add routes
app.use('/api/v1', authRoutes);

// Error Handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  logger.error(err.message);
  res.status(500).send("Something broke!");
});

module.exports = app;
