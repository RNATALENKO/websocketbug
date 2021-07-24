



const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const TestRoute = require('../Server/Routes/TestRoute');
const PersonModel = require('./Models/Person');



//activate middlewares
app.use(express.json()); 
app.use(cors());
app.use(TestRoute);

const httpServer = require('http').createServer();
const io = require("socket.io")(httpServer,{
    cors:{
        origin:true, //user side app origin, true allows all requests
        methods:["GET", "POST"]
    }
})



httpServer.listen(8080, ()=>{

    //connect to your database
    mongoose.connect(`your connection string`, {useNewUrlParser:true}, { useUnifiedTopology: true }).then(results=>{});

    //log if the connection fails or succesfully connected
    const db = mongoose.connection; 
    db.on('error', console.error.bind(console, 'Connection Error: '));
    db.once('open', ()=>{


        //delete all documents
        db.collection('People').deleteMany({});


    });



    //socket work
    io.on('connection', (socket)=>{


        //socket connected
        console.log('a socket connected...with id...' + socket.id);


        //adds a person and saves it to the database
        socket.on('addPerson', (data)=>{

            //save this person inside of our database
            let document = new PersonModel({
                name:data.name,
                age:data.age,
            })
            document.save();

           socket.broadcast.emit('trigger', {});

        })


        //gets all people from database
        socket.on('getPeople', async ()=>{

           let allPeople = await PersonModel.find();

           //emit it back to that socket
           io.to(socket.id).emit('receiveAllPeople', allPeople);

        })


        


    })






})



