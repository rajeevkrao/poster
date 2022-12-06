const express = require("express");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mailjet = require ('node-mailjet')
  .connect(process.env.MAILJET_API, process.env.MAILJET_SECRET)

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
const e = require("express");
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
  console.log(verify)
  if(!verify) return res.sendStatus(403)
  let id = await dbase.getUserIdByEmail(email)
  let su = await dbase.isUserSuperUser(id)
  if(su)
    res.cookie('session', jwt.sign({ id }, process.env.JWT_SECRET,{expiresIn:60*60*24*3})).json({redirect:'/admin'})
  else
    res.cookie('session', jwt.sign({ id }, process.env.JWT_SECRET,{expiresIn:60*60*24*3})).json({redirect:'/'})
  
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
      if(result.acknowledged){
        let token = jwt.sign({email,action:"verification"},process.env.JWT_SECRET)
        const request = mailjet.post("send",{version:'v3.1'})
          .request({
            "Messages":[{
              "From": {
                "Email": "rajeev@loyalytics.in",
                "Name": "Poster"
              },
              "To": [
                {
                  "Email": email,
                  "Name": name
                }
              ],
              "Subject": "Poster Invitation",
              "TextPart": "You have been invited to Poster",
              "HTMLPart": `<div style="text-align:center;"><h3>You have been invited to Poster.<br/> Click on the link to Accept the Invitation<br/> <a href='${process.env.DOMAIN}/verify/?token=${token}'><button>Accept Invitation</button></a></h3></div>`,
              "CustomID": "AppGettingStartedTest"
            }]
          })
        request
          .then(res=>{
            console.log("Email sent")
          })
          .catch(error=>{
          console.log("Unable to send Email");
        })
        res.sendStatus(200)
      }
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
      if(sUser.error)throw new Error("No Such SuperUser")
      var ack = await dbase.addChannel(req.body.name)
      if(ack?.error?.code==409) return res.status(403).json({error:ack.error})
      if(ack?.error?.code==500) throw new Error("Error Creating Channel")
      var doc = await dbase.addChannelMeta(req.body.name,sUser.name,new Date().getTime())
      if(doc.acknowledged) res.json({status:"ok"})
    }
  }
  catch(err){
    console.log(err)
    res.status(403).json({error:err})
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

app.get('/verify',async (req,res)=>{
  try{
    let decoded = jwt.verify(req.query.token,process.env.JWT_SECRET)
    if(decoded.action!='verification') throw new Error("Not a Verifying JWT")
    let id = await dbase.getUserIdByEmail(decoded.email)
    if(!id) throw new Error("User Doesn't Exist")
    res.cookie('invitee', jwt.sign({ id }, process.env.JWT_SECRET/* ,{expiresIn:60*60*24*3} */)).redirect("/password")
  }
  catch(err){
    res.status(403).send("Unauthorized")
  }
})

app.post('/api/password/newuser',async (req,res)=>{
  console.log(req.body)
  try{
    let decoded = jwt.verify(req.cookies.invitee,process.env.JWT_SECRET)
    let check = await dbase.getUserById(decoded.id)
    console.log(check)
    if(!check) return res.status(403).json({error:{code:404,message:"You are not invited"}})
    if(check.invitationStatus) return res.status(409).json({error:{code:409,message:"You are already Verified"}})
    await dbase.verifyNewUser(decoded.id,crypto.sash(req.body.password))
    res.json({status:"ok"})
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.get('*',(req,res)=>{
  res.sendFile(__dirname+"/dist/poster/index.html")
})

app.listen(PORT,()=>{
  console.log(`App Listening to PORT: ${PORT}`)
})
