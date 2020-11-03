const express = require('express');
const router = express.Router();
const {getUsers, getUserIdForEmail,getAllUsers} = require('../controllers/users')
const {authenticate} = require('../utils/auth')

router.get('/',authenticate,getUsers);
router.get('/getUserId',authenticate,getUserIdForEmail);

router.get('/getAllUsers',authenticate,getAllUsers);

module.exports = router;