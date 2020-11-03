const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function sendToken(req,res,next){
    const {email,password} = req.body;
    
    try
    {
        const user = await User.findOne({email:email});
        console.log(user);
        if(user)
        {
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    const error = new Error('Error occured');
                    error.status = 500;
                    return next(error);
                }
                if(result === true)
                {
                    const claims = { email: user.email, userId: user._id };
        
                    jwt.sign(claims, 'secret', {expiresIn: '24h'}, function( error, token ) {
                    console.log( 'jwt token generated' );

                    if( error ) {
                        return res.status(401).json({ message: error.message });
                    }

                    res.status(200).json({
                        message: 'Signed in sucessfully',
                        token: token,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    });
                });
                }
                else{
                    const error = new Error('Passwords does not match');
                    error.status = 400;
                    next(error);
                }
            })
        }
        else
        {
            const error = new Error('User does not exists');
            error.status = 400;
            next(error);
            return;
        }
        
       
    }
    catch(error)
    {
        error.status = 500;
        next(error);
    }
}

async function checkUser(req,res,next){
    const user = User.findOne({email:req.query.email}).exec();
    if(user.email)
    {
        res.status(400).json("user already exists");
    }
    else{
        res.status(200).send("ok");
    }
}


async function registerUser(req,res,next){
    const data = req.body;

    User.create(data,(err,newUser)=>{
        if(err){
            err.status = 500;
            next(err);
        }
        else{
            res.status(204).json(newUser);
        }
    })   
}

module.exports = {sendToken,registerUser,checkUser};