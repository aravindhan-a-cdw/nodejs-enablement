const express = require("express");
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
require('dotenv').config();
const {logger, loggerMiddleware} = require('./config/logger');
const authRoutes = require('./routes/authentication');
const { jwtStrategy, localStrategy } = require("./config/passport");

if(process.env.ENVIRONMENT === 'dev') {
    require('./config/swagger');
}

const app = express();

// Serve Static files
app.use(express.static('public'))

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(loggerMiddleware);
app.use(passport.initialize());

passport.use(jwtStrategy);
passport.use(localStrategy);

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
