const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{_id : false});

const meetingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    startTime:{
        hours:{
            type:Number,
            required:true,
            min:0,
            max:23
        },
        minutes:{
            type:Number,
            required:true,
            min:0,
            max:59
        }
    },
    endTime:{
        hours:{
            type:Number,
            required:true,
            min:0,
            max:23
        },
        minutes:{
            type:Number,
            required:true,
            min:0,
            max:59
        }
    },
    attendees:{
        type: [attendeeSchema],
        required:true
    }
});

mongoose.model('Meeting',meetingSchema);