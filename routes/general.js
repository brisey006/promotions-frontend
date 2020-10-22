const express = require('express');
const { isAuthenticated } = require('../config/auth');
const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        pageTitle: "Home",
    });
});

module.exports = router;