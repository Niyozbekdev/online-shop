const { Router } = require('express');
const router = Router();
const { getHomePage } = require('../conturolles/homeControlles')

router.get('/', getHomePage)

module.exports = router;