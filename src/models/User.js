const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

userSchema.path('email').validate( email =>emailRegex.test(email.toLowerCase()),'Invalid email id format')

const SALT_FACTOR = 10;

userSchema.pre('save',function(done){
    const user = this;

    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>{
        if(err){
            return done(err);
        }
        bcrypt.hash(user.password,salt,(err,hashedPassword)=>{
            if(err){
                return done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = (password,done)=>{
    bcrypt.compare(password,this.password,(err,match)=>{
        done(err,match);
    })
}
mongoose.model('User',userSchema);