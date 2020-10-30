const express = require('express')
const router = express.Router();
const {sendToken,registerUser,checkUser} = require('../controllers/auth');

router.post('/login',sendToken);
router.post('/signup',registerUser);
router.get('/check',checkUser);


module.exports = router;