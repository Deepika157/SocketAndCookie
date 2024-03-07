const express= require('express');
const session = require('express-session');
const mongoose= require('mongoose');
const mongosession= require('connect-mongodb-session')(session);
const app= express();


mongoose.connect('mongodb://localhost:27017/sessions')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });


const store= new mongosession({
        uri:'mongodb://localhost:27017/sessions',
        collection:'mySessions'
    })


app.use(session({
        secret: 'key that will sign cookie',
        resave: false,
        saveUninitialized: false,
        store: store
    
    }))

app.get("/", (req,res)=>{
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send("hello sessions");
});

app.listen(5000, console.log( "server running on http://localhost:5000"));