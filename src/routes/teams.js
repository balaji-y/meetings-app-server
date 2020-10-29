const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();

const { authenticate } = require('../utils/auth')
const { getTeamsForUser, addUserToTeam,deleteUserFromTeam,addTeam } = require('../controllers/teams')

router.get('/getTeams',authenticate,getTeamsForUser);
router.delete('/:teamId/user',authenticate ,deleteUserFromTeam);
router.post('/:teamId/users',authenticate,addUserToTeam);

router.post('/add',authenticate, addTeam);

module.exports = router;