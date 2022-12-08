var express = require('express');

var app = express.Router();

app.post('/api/channels/name',async(req,res)=>{
  try{
    jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    res.json(await dbase.channelList())
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.post('/api/channels/',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!await dbase.isUserSuperUser(decoded.id)) throw new Error("Unauthorised")
    let channels = await dbase.channelList(); 
    for(let [index, channel] of channels.entries()){
      let meta = await dbase.getMetaChannel(channel)
      if(!(meta?.creationTimestamp && meta?.createdBy)){
        channels[index] = {name:channel,creationTimestamp:1669075200000,createdBy:"[Auto-Generated]"}
        continue;
      }
      channels[index] = {name:channel,...meta}
    }
    res.json(channels)
  }
  catch(err){
    console.log(err)
    res.sendStatus(403)
  }
})

app.delete('/api/channels',async (req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!await dbase.isUserSuperUser(decoded.id)) throw new Error("Unauthorized")
    let ack = await dbase.deleteChannel(req.body.name)  
    if(!ack.acknowledged) throw new Error("Error Deleting Channel")
    res.json({status:"ok"})  
  }
  catch(err){
    res.status(403).json({status:"error"})
  }
})

app.put('/api/channels',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!await dbase.isUserSuperUser(decoded.id)) throw new Error("Unauthorized")
    var sUser = await dbase.getUserById(decoded.id)
    if(sUser.error)throw new Error("No Such SuperUser")
    var ack = await dbase.addChannel(req.body.name)
    if(ack?.error?.code==409) return res.status(403).json({error:ack.error})
    if(ack?.error?.code==500) throw new Error("Error Creating Channel")
    var doc = await dbase.addChannelMeta(req.body.name,sUser.name,new Date().getTime())
    if(doc.acknowledged) res.json({status:"ok"})
  }
  catch(err){
    console.log(err)
    res.status(403).json({error:err})
  }
})

module.exports = app