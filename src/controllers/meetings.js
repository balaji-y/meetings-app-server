const mongoose = require('mongoose');
const Meeting = mongoose.model('Meeting');
const User = mongoose.model('User');
const Team = mongoose.model('Team');
const nodemailer = require('nodemailer');

async function getMeetings(req,res,next){
    let date = req.query.date;
    if(date)
        date = date.toLowerCase();
    const userId = res.locals.claims.userId;
    const searchTerm = req.query.searchTerm;

    /*if(date === undefined){
        let todayDate = new Date();
        date = todayDate.getFullYear()+'-'+(todayDate.getMonth()+1)+'-'+todayDate.getDate();
        //console.log(date);
    }*/
        

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
            const today = new Date().toISOString().substr(0,10); 
            let tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate()+1) 
            tomorrow = tomorrow.toISOString().substr(0,10);

            switch(date){
                case "past" : filter.date= {$lt: today}
                            //console.log(filter);
                            break;
                case "upcoming" : filter.date={$gt: today}
                            break;
                case "all" : delete filter.date;
                            break;
                case "today" : filter.date = { $gte:today, $lt: tomorrow }
                            break;
                default :     filter.date = date;
                        
            }
            if(searchTerm)
            {
                filter.name = { $regex : new RegExp(searchTerm,"i")}
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
    const userId = res.locals.claims.userId;
    console.log(meetingId);

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
    
    console.log(meetingId);
    console.log(userIds);
    
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

            const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'balaji.y.1228@gmail.com',
                      pass: 'Balaji_1228' 
                    }
                  });
                  
                  const mailOptions = {
                    from: 'balaji.y.1228@gmail.com',
                    to: userIds.email,
                    subject: 'You have been added to a meeting',
                    text: `you are added to meeting ${updatedMeeting.name}`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            res.json(updatedMeeting);
    
        }
        catch(error){
            error.status = 400;
            next(error);
        }
    }
}

async function addMeeting(req, res, next){
    const meeting = req.body.meeting;
    //console.log(data);
    const email = res.locals.claims.email;
    const userId =  res.locals.claims.userId;
    let attendeesEmailSepByComma = meeting.attendeesEmail;
    let attendeesEmail = [];
    let attendeesEmailWithoutFilter = meeting.attendeesEmail.split(',');
    for(let i=0;i<attendeesEmailWithoutFilter.length;i++)
    {
        const attendeeWithoutFilter = attendeesEmailWithoutFilter[i].trim();
        if(attendeeWithoutFilter[0]==='@')
        {
            try{
                teamMembers = await Team.find({shortName:attendeeWithoutFilter.substr(1)},{members:1,_id:0});
                if(teamMembers.length>0)
                {
                    //console.log("teamMembers",teamMembers[0].members);
                    const emails = teamMembers[0].members.map(team => team.email);  
                    attendeesEmail.push(...emails);
                    //console.log('check',attendeesEmail);
                    // console.log("onlyemails",emails);
                }
            }
            catch(error)
            {
                error.status = 403;
                next(error);
            }
           
        }
        else
        {
            attendeesEmail.push(attendeeWithoutFilter);
        }
    }
    console.log('attendees Email',attendeesEmail);
    const attendeesFilter = {email: {$in: attendeesEmail}};

    User.find(attendeesFilter).exec((error,users)=>{
        if(error)
        {
            error.status = 500;
            return next(error);
        }

        validAttendees = users.map(user => {
            return {
                userId: user._id,
                email: user.email
            }
        });

        if( !validAttendees.find(attendee => attendee.userId.toString() === userId)){
            if(validAttendees.length>0)
            {
                attendeesEmailSepByComma = attendeesEmailSepByComma.concat(`,${email}`);
            }
            else{
                attendeesEmailSepByComma = email;
            }
            validAttendees.push({userId,email});
        }

        meeting.attendees = validAttendees;
        console.log(meeting);

        Meeting.create(meeting,(error,createdMeeting)=>{
            if(error){
                error.status = 500;
                next(error);
            }
            else{

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'balaji.y.1228@gmail.com',
                      pass: 'Balaji_1228' 
                    }
                  });
                  
                  const mailOptions = {
                    from: 'balaji.y.1228@gmail.com',
                    to: attendeesEmailSepByComma,
                    subject: 'You have been added to a meeting',
                    text: `you are added to meeting ${createdMeeting.name}`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });

                res.status(201).json(createdMeeting);
            }
        })
    })
}


module.exports = { getMeetings,deleteUserFromMeeting,addUsersForMeeting,addMeeting };