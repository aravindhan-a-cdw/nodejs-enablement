const app = require('./app');
const db = require('./database');
const {logger} = require('./utils/logger');

const PORT = 4000;

const server = app.listen(PORT, () => {
    logger.info(`Server Listening on http://localhost:${PORT}`);
});

db.connect().catch(err => {
    logger.error(err.message);
    server.close();
    logger.info(`Server stopped listening`);
}).then(() => {
    logger.info("Database connection successful!");
})