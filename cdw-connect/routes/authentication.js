const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const { default: mongoose } = require('mongoose');

router.get('/login', (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = "This is the route to login user"
    res.send("You have found me!");
});

router.post('/signup', (req, res, next) => {
    // #swagger.tags = ['Auth']
    const user = new UserModel({
        name: "Aravindhan",
        employeeId: "20411",
        "email": "abcd@cdw.com",
        gender: "male",
        // password: "1232434"
    });
    user.save().then(userDoc => {
        res.json(userDoc);
    }).catch(err => {
        if(err instanceof mongoose.Error.ValidationError) {
            res.status(422).json({
                message: err.message
            })
        } else {
            next(err);
        }
    });
});

router.get('/pending', () => {
    res.send('List of users need approval');
})

router.post('/pending', () => {
    res.send("Approved the user");
})

module.exports = router;