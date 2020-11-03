const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();

const { authenticate } = require('../utils/auth')
const { getTeamsForUser, addUserToTeam,deleteUserFromTeam,addTeam,getAllTeams } = require('../controllers/teams')

router.get('/getTeams',authenticate,getTeamsForUser);
router.delete('/:teamId/user',authenticate ,deleteUserFromTeam);
router.post('/:teamId/users',authenticate,addUserToTeam);
router.post('/add',authenticate, addTeam);

//for admin panel
router.get('/getAllTeams',authenticate,getAllTeams);

module.exports = router;