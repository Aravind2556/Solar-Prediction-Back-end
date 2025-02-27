require('dotenv').config()   //env config
const express = require('express')  //express backage
const mongoose = require('mongoose') //mongoose backge 
const routes = require('./routes/Register')

const cors = require('cors')
const session = require('express-session')
const sessionConnect = require('connect-mongodb-session')(session)


const app = express()

const corsOptions = {  // orgin setup to front end 
    origin: ['http://localhost:2001'], 
    credentials: true, 
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({extended: true}))


const Store = new sessionConnect({
    uri: process.env.DB_CONNECTION_STRING ,
    collection: 'Sessions',
});

app.use(session({
    secret: process.env.SECUREKEY,
    resave: false,
    saveUninitialized: false,
    store: Store,
    // cookie:{
    //     secure: true,
    //     httpOnly: true,
    //     sameSite: 'none'
    // }
    
}));

mongoose.connect(process.env.DB_CONNECTION_STRING)  // mongoose connection and env db password links
.then(()=>console.log('Mongodb Connected successfully!'))
.catch((err)=>console.log('Error found on mongodb connection: ',err))


app.listen(2000,()=>{   //which port
    console.log("Server started on port",2000)
})

app.use('/api', routes)


