const searchService = require('../services/search.service')

const searchController = {
    search: async (req, res) => {
        const query = req.query.query;
        const result = await searchService.search(query);
        res.json({
            result,
            status: 200
        })
    }
}


module.exports = searchController;