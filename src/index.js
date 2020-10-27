const express = require('express');
const app = express();

require('../db/init');

app.use(express.json());

const meetingsRouter = require('../routes/meetings');
const usersRouter = require('../routes/users');

app.use('/api/meetings',meetingsRouter);
app.use('/api/users',usersRouter);
const port = process.env.PORT || 3000;

app.use((err,req,res,next) =>{
    res.status(err.status).json({
        message:err.message
    })
});

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
});