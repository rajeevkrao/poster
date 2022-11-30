const express = require("express");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken');

const crypto = require("./modules/crypto")
const mongo = require("./modules/db");
var dbase = new mongo();

/* dbase.getClient().then(client=>{
  client.db('channels').listCollections().toArray((err,collections)=>{
    collections.forEach((collection)=>{
      console.log(collection.name)
    })
    client.close();
  })
}) */


const PORT = 5000

const app = express();

app.use(cors({credentials: true,origin:'http://localhost:4200'}))

let cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('dist/poster'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/test',(req,res)=>{
  res.status(200).send("Test OK");
})

app.post('/api/jwtverify',(req,res)=>{
  try{
    jwt.verify(req.body.token,process.env.JWT_SECRET)
    res.sendStatus(200)
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.post('/api/login',async(req,res)=>{
  let {email, password} = req.body;
  let verify = await dbase.verifyUser(email,crypto.sash(password))
  if(verify){
    let id = await dbase.getUserId(email)
    res.cookie('session', jwt.sign({ id }, process.env.JWT_SECRET,{expiresIn:60*60*24*3})).json(verify)
  }
  else
    res.sendStatus(403)
})

app.post('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id))
      res.json(await dbase.getInvitedUsers())
    else 
      throw new Error("Unauthorised")
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.post("/api/issuperuser",async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id))
      res.json({status:"ok"})
    else 
      throw new Error("Unauthorised")
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.get('/api/test',(req,res)=>{
  dbase.getInvitedUsers().then(list=>{
    res.json(list)
  })
})

app.get('*',(req,res)=>{
  res.sendFile(__dirname+"/dist/poster/index.html")
})

app.listen(PORT,()=>{
  console.log(`App Listening to PORT: ${PORT}`)
})
