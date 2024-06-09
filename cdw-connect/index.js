const app = require('./app');
const {logger} = require('./utils/logger');

const PORT = 4000;

app.listen(PORT, () => {
    logger.info(`Server Listening on http://localhost:${PORT}`);
});