const express = require('express');
const router = express.Router();
const {getUsers, getUserIdForEmail,getAllUsers, deleteUser,updateUser} = require('../controllers/users')
const {authenticate} = require('../utils/auth')

router.get('/',authenticate,getUsers);
router.get('/getUserId',authenticate,getUserIdForEmail);

router.get('/getAllUsers',authenticate,getAllUsers);
router.delete('/deleteUser',authenticate,deleteUser);
router.patch('/updateUser',authenticate,updateUser);

module.exports = router;