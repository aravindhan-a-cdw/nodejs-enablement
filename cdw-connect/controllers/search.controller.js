const searchService = require('../services/search.service')

const searchController = {
    search: async (req, res, next) => {
        try {
            const query = req.query.query;
            const result = await searchService.search(query);
            res.locals.responseData = {
                data: result
            }
        } catch (error) {
            next(error);
        }
        next();
    }
}


module.exports = searchController;