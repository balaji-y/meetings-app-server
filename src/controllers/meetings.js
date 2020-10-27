const mongoose = require('mongoose');
const Meeting = mongoose.model('Meeting');
const User = mongoose.model('User');

async function getMeetings(req,res,next){
    const date = req.query.date.toLowerCase();
    const userId = req.query.userId;
    const searchTerm = req.query.searchTerm;


    if(date === undefined || userId===undefined)
    {
        const error = new Error('Date and userId should be sent')
        error.status = 400;
        next(error);
        return;
    }

    else{
        try{
            const filter = {'attendees.userId':userId};
            const today = new Date();
            switch(date){
                case "past" : filter.date= {$lt: today}
                            console.log(filter);
                            break;
                case "upcoming" : filter.date={$gt: today}
                            break;
                case "all" : delete filter.date;
                            break;
                case "today" : filter.date = {$eq:today}
                            break;
                default :     filter.date = date;
                        
            }
            if(searchTerm)
            {
                filter.description = { $regex : new RegExp(searchTerm,"i")}
            }
            const meetings = await Meeting.find(filter);
            res.status(200).json(meetings);
        }
        catch(error){
            error.status = 400;
            next(error);
        }
    }
};

async function deleteUserFromMeeting(req,res,next){
    const meetingId = req.params.meetingId;
    const userId = req.params.userId;

    try{
            const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId,{
                                        $pull: { attendees : { userId :userId}}
                                    });

            res.json(updatedMeeting);
    }
    catch(error){
        error.status = 500;
        next(error);
    }
};

async function addUsersForMeeting(req,res,next){
    const meetingId = req.params.meetingId;
    const userIds = req.body.userIds;
    
    if(userIds === undefined)
    {
        const error = new Error('UserId required');
        error.status(400)
        next(error);
        return;
    }
    else
    {
        try{
            const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId,{
                                        $addToSet: { attendees : userIds }
                                     },{runValidators:true});
            res.json(updatedMeeting);
    
        }
        catch(error){
            error.status = 400;
            next(error);
        }
    }
}

async function addMeeting(req, res, next){
    const data = req.body;
    const user = {
        email:res.locals.claims.email,
        userId : res.locals.claims.userId
    };

    let meetings;
    try {
        if(data instanceof Array)
        {
            meetings = data;
        }
        else{
            meetings = [data];
        }

        meetings.forEach(meeting => {
            if(meeting.attendees.indexOf(user) === -1){
                 meeting.attendees.push(user);
            }
        });

        const addedMeetings = await Meeting.insertMany(meetings);
        res.status(201).json(addedMeetings);
    }
    catch(error)
    {
        error.status = 500;
        next(error);
        return;
    }
}


module.exports = { getMeetings,deleteUserFromMeeting,addUsersForMeeting,addMeeting };