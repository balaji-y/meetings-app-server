const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{_id:false});

const teamSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    shortName:{
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    members: [ membersSchema ]
},{versionKey:false});

mongoose.model('Team',teamSchema);