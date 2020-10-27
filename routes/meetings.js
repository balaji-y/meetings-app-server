const express = require('express');
const router = express.Router();
const { getMeetings, deleteUserFromMeeting,addUsersForMeeting } = require('../controllers/meetings');

router.get('/', getMeetings );

router.post('/:meetingId/users', addUsersForMeeting);
router.delete('/:meetingId/users/:userId',deleteUserFromMeeting);


module.exports = router;