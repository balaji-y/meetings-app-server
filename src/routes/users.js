const express = require('express');
const router = express.Router();
const {getUsers} = require('../controllers/users')
const {authenticate} = require('../utils/auth')

router.get('/',authenticate,getUsers);

module.exports = router;