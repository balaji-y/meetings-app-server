const mongoose = require('mongoose');
const User = mongoose.model('User');

async function getUsers(req,res,next){
    const users = await User.find({},{email:1}).exec();
    res.json(users);
};

async function getUserIdForEmail(req,res,next){
    try{
        const email = req.query.email;
        const userId = await User.find({email:email},{_id:1}).exec();
        res.json(userId[0]);
    }
    catch(error)
    {
        error.status = 500;
        next(error);
    }
    
};

async function getAllUsers(req,res,next){
    try{
        const users = await User.find({}).exec();
        res.json(users);
    }
    catch(error){
        error.status = 500;
        next(error);
    }
}

module.exports = {getUsers , getUserIdForEmail, getAllUsers};