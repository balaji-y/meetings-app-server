const mongoose = require('mongoose');
const User = mongoose.model('User');

async function getUsers(req,res,next){
    const users = await User.find({},{email:1}).exec();
    res.json(users);
};

module.exports = {getUsers};