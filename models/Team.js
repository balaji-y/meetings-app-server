const mongoose = require('mongoose');

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
    attendees: [
        {
           userId:{
               type:mongoose.Schema.ObjectId,
               required:true
           },
           email:{
               type:String,
               required:true
           }
        }
    ]
});

mongoose.model('Team',teamSchema);