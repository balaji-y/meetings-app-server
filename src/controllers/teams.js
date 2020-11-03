const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const User = mongoose.model('User');

async function getTeamsForUser(req,res,next){
    let email = res.locals.claims.email;
    try{
        let teams = await Team.find({'members.email': email}).exec();
        res.json(teams);
    }
    catch(error){   
       error.status = 500;
       next(error);
    }
};

async function deleteUserFromTeam(req,res,next){
    const teamId = req.params.teamId;
    const userId = res.locals.claims.userId;
    console.log(teamId);

    try{
            const updatedTeam = await Team.findByIdAndUpdate(teamId,{
                                        $pull: { members : { userId :userId}}
                                    },{runValidators:true});

            res.json(updatedTeam);
    }
    catch(error){
        error.status = 500;
        next(error);
    }
};


async function addUserToTeam(req,res,next){
    const teamId = req.params.teamId;
    const users = req.body.users;

    console.log(teamId);
    console.log(users);
    
    if(users === undefined)
    {
        const error = new Error('UserId required');
        error.status =400;
        next(error);
        return;
    }
    else
    {
        try{
            const updatedTeam = await Team.findByIdAndUpdate(teamId,{
                                        $addToSet: { members : users }
                                     },{runValidators:true});
            res.json(updatedTeam);
    
        }
        catch(error){
            error.status = 400;
            next(error);
        }
    }
}

async function addTeam(req,res,next)
{
    const team = req.body.team;
    const userId = res.locals.claims.userId;
    const email = res.locals.claims.email;
    //console.log(team);
    const membersEmail = team.membersEmail;
    const membersFilter = {email: { $in: membersEmail}};

    User.find(membersFilter).exec((errors,users) => {
        if(errors)
        {
            error.status = 500;
            return next(error);
        }
        validMembers = users.map(user => {
            return {
                userId : user._id,
                email: user.email
            }
        });

        //console.log(validMembers);

        if(!validMembers.find(member => member.userId.toString() === userId)){
            validMembers.push({userId,email});
        }

        team.members = validMembers;

        console.log(team);

        Team.create(team,(error,createdTeam)=>{
            if(error)
            {
                error.status = 500;
                next(error);
            }
            else{
                res.status(201).json(createdTeam)
            }
        })
    })

}


async function getAllTeams(req,res,next){
    try{
        const teams = await Team.find({}).exec();
        res.json(teams);
    }
    catch(error){
        error.status = 500;
        next(error);
    }
}

module.exports = {getTeamsForUser, addUserToTeam, deleteUserFromTeam, addTeam, getAllTeams};