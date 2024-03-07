const express = require('express');
const mongoose= require('mongoose');
const Bodyparser= require('body-parser');
const path= require('path');
const session = require('express-session');

const mongosession= require('connect-mongodb-session')(session);
const app = express();


const http= require('http').Server(app);
const io= require('socket.io')(http); 
app.use(express.json());

var cors = require('cors');
app.use(cors())
app.use(Bodyparser.json());

let users = []


/*mongoose.connect('mongodb://localhost:27017/mydbase3')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    }); */


const MsgSchema= new mongoose.Schema({
    id: String,
    msg: String
});

const Data= mongoose.model('Data',MsgSchema);


mongoose.connect('mongodb://localhost:27017/sessions')
    .then(() => {
        console.log('Connected to session MongoDB');
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

app.get('/', (req,res)=>{
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    console.log("hello")
    return res.send("hello sessions");
});


 app.get('/', (req,res)=>{
     res.sendFile(path.join(__dirname, 'public\demo.html' ))
})


app.post('/chat', async(req,res)=>{
try{
    const id= req.body.id;
    const msg= req.body.msg;
 
     console.log(id);
     console.log(msg);

     const newModel= new Data({
        id, msg
    });
    
    await Data.insertMany(newModel);
    
    users.forEach(user=> {
        if(user.id != id)
        user.socket.emit("message", msg)
    })

    res.status(201).send(JSON.stringify({message: "'message sent  successfully'"}));

   }
     catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('An error occurred while saving user');
    }

});



io.on('connection', socket=>{
    console.log('A user connected');

    socket.on('initialize', (id)=>{
        users.push({
            id: id,
            socket: socket
        })
        console.log('User:', users);
    })
     
    socket.on('id', (id)=>{
        console.log('User:'+ id);
    })
    socket.on("message", msg=>{
        console.log("Client message:" + msg);
    })

    socket.on('disconnect', ()=>{
        console.log("A user disconnected");
    })

});



const PORT = process.env.PORT || 7070;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
