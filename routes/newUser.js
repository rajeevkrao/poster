var express = require('express');

var app = express.Router();

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
  try{
    let decoded = jwt.verify(req.cookies.invitee,process.env.JWT_SECRET)
    let user = await dbase.getUserById(decoded.id)
    if(!user) return res.status(403).json({error:{code:404,message:"You are not invited"}})
    if(user.invitationStatus) return res.status(409).json({error:{code:409,message:"You are already Verified"}})
    await dbase.verifyNewUser(decoded.id,crypto.sash(req.body.password))
    res.json({status:"ok"})
  }
  catch(err){
    res.sendStatus(403)
  }
})

module.exports = app