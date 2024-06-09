const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = "This is the route to login user"
    res.send("You have found me!");
});

router.post('/signup', (req, res) => {
    // #swagger.tags = ['Auth']
    res.send("You have found me!");
});

router.post('/change-password', () => {
    res.send("Do you really forgot the password?");
});

router.get('/approval', () => {
    res.send('List of users need approval');
})

router.post('/approval', () => {
    res.send("Approved the user");
})

module.exports = router;