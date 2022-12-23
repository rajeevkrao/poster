var express = require('express');

var app = express.Router();

app.post("/api/posts",async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser)
      if(!await dbase.userPermissionOfChannel(decoded.id, req.body.channel, {read:true}))
        return res.status(403).json({code:403,message:"No Read Permission for the Channel"})
    res.json(await dbase.fetchPostsOfChannel(req.body.channel,req.body.page))
  }
  catch(err){
    res.status(403).json({
      code:403,
      message:"Unauthorized"
    })
  }
})

app.put("/api/posts",async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser)
      if(!await dbase.userPermissionOfChannel(decoded.id, req.body.channel, {write:true}))
        return res.status(403).json({code:403,message:"You don't have write permission for this channel"})
    let doc = await dbase.addPostToChannel(decoded.id,req.body.channel,req.body.content)
    if(!doc.acknowledged) throw new Error("Error Creating Post")
    res.json({status:"ok"})
  }
  catch(err){
    console.log(err)
    res.status(403).json(err)
  }
})

app.patch("/api/posts",async(req,res)=>{
  try{
    let { channel, id, content} = req.body
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser){
      console.log(id)
      if(!await dbase.isUserCreatedPost(id,channel,decoded.id))
        return res.status(403).json({code:403,message:"This post is not created by You!"}) 
      if(!await dbase.userPermissionOfChannel(decoded.id, req.body.channel, {write:true}))
        return res.status(403).json({code:403,message:"You don't have write permission for this channel"})
    }
    let doc = await dbase.editPostOfChannel(channel, id, content)
    if(doc?.err) throw new Error("Error Editing Post")
    res.json({status:"ok"})
  }
  catch(err){
    console.log(err)
    res.status(403).json(err)
  }
})



app.delete('/api/posts',async (req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser){
      if(!await dbase.isUserCreatedPost(req.body.postId,req.body.channel,decoded.id)){
        console.log("Reach")
        return res.status(403).json({code:403,message:"This post is not created by You!"}) 
      }
      if(!await dbase.userPermissionOfChannel(decoded.id, req.body.channel, {delete:true}))
        return res.status(403).json({code:403,message:"You don't have delete permission for this channel"}) 
    }
    let ack = await dbase.deletePostOfChannel(req.body.channel, req.body.postId)  
    if(!ack.acknowledged) throw new Error("Error Deleting Channel")
    res.json({status:"ok"})  
  }
  catch(err){
    console.log(err)
    res.status(403).json(err)
  }
})

module.exports = app