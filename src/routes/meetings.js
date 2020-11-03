const express = require('express');
const router = express.Router();
const { getMeetings, deleteUserFromMeeting,addUsersForMeeting,addMeeting,getAllMeetings} = require('../controllers/meetings');
const {authenticate} = require('../utils/auth');

router.get('/',authenticate, getMeetings );
router.post('/:meetingId/users', authenticate,addUsersForMeeting);
router.delete('/:meetingId/user',authenticate ,deleteUserFromMeeting);
router.post('/add',authenticate,addMeeting);

//for admin panel
router.get('/getAllMeetings',authenticate,getAllMeetings);

module.exports = router;