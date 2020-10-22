const express = require('express');
const router = express.Router();

router.use('/', require('./promotions'));

module.exports = router;