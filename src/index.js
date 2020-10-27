require('./db/init');
const express = require('express');
const app = express();


const meetingsRouter = require('./routes/meetings');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const {genericErrorHandler} = require('./middlewares/error');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());


app.use('/api/meetings',meetingsRouter);
app.use('/api/users',usersRouter);
app.use('/api/auth',authRouter);

app.use(genericErrorHandler);

app.listen(port,(err)=>{
    if(err)
    {
        console.log(err.message);
        return;
    }
    console.log(`server started at http://localhost:${port}`);
});