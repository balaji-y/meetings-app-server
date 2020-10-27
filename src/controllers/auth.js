const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

async function sendToken(req,res,next){
    const {email,password} = req.body;
    
    try
    {
        if(email && password)
        {
            const user = await User.findOne({email:email},{email:1,password:1});
            if(user)
            {
                if(password === user.password)
                {
                    const claims = {
                        userId : user._id,
                        email : user.email
                    }

                    jwt.sign(claims,'secret',{expiresIn:'24h'},(err,token)=>{
                        if(err)
                        {
                            const error = new Error('Error in Authentication');
                            error.status = 500;
                            next(error);
                            return;
                        }
                        return res.status(200).json({
                            token,
                            email
                        });
                    });
                }
                else
                {
                    const error = new Error('Email and Password does not match');
                    error.status = 400;
                    next(error);
                    return;
                }
            }
            else
            {
                const error = new Error('User does not exists');
                error.status = 400;
                next(error);
                return;
            }
        }
        else 
        {
            const error = new Error('Login Credentials cannot be empty');
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

module.exports = {sendToken};