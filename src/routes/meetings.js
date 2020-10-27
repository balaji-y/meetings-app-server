const express = require('express');
const router = express.Router();
const { getMeetings, deleteUserFromMeeting,addUsersForMeeting,addMeeting } = require('../controllers/meetings');
const {authenticate} = require('../utils/auth');

router.get('/',authenticate, getMeetings );
router.post('/:meetingId/users', authenticate,addUsersForMeeting);
router.delete('/:meetingId/users/:userId',authenticate ,deleteUserFromMeeting);
router.post('/add',authenticate,addMeeting);

module.exports = router;