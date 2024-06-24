const searchService = require('../services/search.service')

const searchController = {
    search: async (req, res, next) => {
        try {
            const query = req.query.query;
            const result = await searchService.search(query);
            res.json({
                result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    }
}


module.exports = searchController;