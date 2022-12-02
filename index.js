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

app.delete('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id)){
      let result = await dbase.deleteUser(req.body.id)
      if(result.acknowledged)
        res.json(result)
      else
       throw new Error("Some Error")
    }
    else throw new Error("Unauthorised")
  }
  catch(err){
    console.log(err)
    res.sendStatus(403)
  }
})

app.put('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id)){
      var { name, email, accesses } = req.body;
      for(channel of Object.keys(accesses))
        if(!accesses[channel].read && !accesses[channel].write && !accesses[channel].delete)
          delete accesses[channel]
      let result = await dbase.createUser(name,email,{accesses})
      if(result.acknowledged)
        res.sendStatus(200)
      else if(result.err.code==11000)
        throw new Error("Email Already Exist")
      else
        throw new Error("Error Occured")
    }
    else 
      throw new Error("Unauthorised")
  }
  catch(err){
    if(err.message=="Email Already Exist")
      res.status(403).json({code:11000,message:err.message})
    else
      res.sendStatus(403)
  }
})

app.patch('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id)){
      var { name, email, accesses } = req.body;
      for(channel of Object.keys(accesses))
        if(!accesses[channel].read && !accesses[channel].write && !accesses[channel].delete)
          delete accesses[channel]
      let result = await dbase.updateUser(name,email,{accesses})
      if(!result.err)
        res.sendStatus(200)
      else if(result?.err?.code==11000)
        throw new Error("Email Already Exist")
      else{
        throw new Error("Error Occured")
      }
    }
    else 
      throw new Error("Unauthorised")
  }
  catch(err){
    console.log(err)
    if(err.message=="Email Already Exist")
      res.status(403).json({code:11000,message:err.message})
    else
      res.status(403).json({code:10000,message:err.message})
  }
})

app.post('/api/channels/name',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    res.json(await dbase.channelList())
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.post('/api/channels/',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id)){
      let channels = await dbase.channelList()
      for(let [index, channel] of channels.entries()){
        let meta = await dbase.getMetaChannel(channel)
        if(meta?.creationTimestamp && meta?.createdBy)
          channels[index] = {name:channel,...meta}
        else
          channels[index] = {name:channel,creationTimestamp:1669075200000,createdBy:"[Auto-Generated]"}
      }
      res.json(channels)
    }
    else 
      throw new Error("Unauthorised")
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.delete('/api/channels',async (req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id))
      var ack = await dbase.deleteChannel(req.body.name)  
    if(ack.acknowledged)
      res.json({status:"ok"})
    else
      throw new Error("Error Deleting Channel")
  }
  catch(err){
    res.status(403).json({status:"error"})
  }
})

app.put('/api/channels',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(await dbase.isUserSuperUser(decoded.id)){
      var sUser = await dbase.getUserById(decoded.id)
      var ack = await dbase.addChannel(req.body.name)  
      var sUser = await dbase.getUserById(decoded.id)
    }
    if(ack.acknowledged)
      res.json({status:"ok"})
    else
      throw new Error("Error Creating Channel")
  }
  catch(err){
    res.status(403).json({status:"error"})
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
