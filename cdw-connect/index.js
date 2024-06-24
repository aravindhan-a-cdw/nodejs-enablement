const app = require('./app');
const db = require('./database');
const {logger} = require('./config/logger');

const PORT = 4000;

// start the server
const server = app.listen(PORT, () => {
    logger.info(`Server Listening on http://localhost:${PORT}`);
});

// Connect to db
db.connect().then(() => {
    logger.info("Database connection successful!");
}).catch(err => {
    logger.error(err.message);
    server.close();
    logger.info(`Server stopped listening`);
})