const express = require('express')
const router = express.Router();
const {sendToken} = require('../controllers/auth');

router.post('/login',sendToken);


module.exports = router;