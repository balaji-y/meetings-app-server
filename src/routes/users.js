const express = require('express');
const router = express.Router();
const {getUsers, getUserIdForEmail} = require('../controllers/users')
const {authenticate} = require('../utils/auth')

router.get('/',authenticate,getUsers);
router.get('/getUserId',authenticate,getUserIdForEmail);

module.exports = router;