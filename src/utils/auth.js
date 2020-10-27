const jwt = require('jsonwebtoken');

function authenticate(req,res,next)
{
    const token = req.header('Authorization');

    if(!token)
    {
        const error = new Error( 'Token is not sent' );
        error.status = 401;
        next( error );
        return;
    }
    jwt.verify( token, 'secret',(err,claims)=>{
        if(err)
        {
            const error = new Error( 'No access allowed' );
            error.status = 401;
            next( error );
            return;
        }
        res.locals.claims = claims;
        next();
    });

}

module.exports = { authenticate };