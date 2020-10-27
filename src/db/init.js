const mongoose = require('mongoose');
const {seed} = require('./seed');

require('../models/Meeting');
require('../models/Team');
require('../models/User');

const uri = 'mongodb://localhost:27017/calendar-app';

mongoose.set('useFindAndModify',false);
mongoose.set('returnOriginal',false);

mongoose.connect(uri,{useUnifiedTopology:true,useNewUrlParser:true});

mongoose.connection.on('open' , ()=> {
    console.log('DB Connected');
    //call this when you want to import data
   //seed();
});

mongoose.connection.on('error', (err)=>{
    console.log(err.message);
    process.exit();
});