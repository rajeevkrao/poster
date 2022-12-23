var express = require('express');

var app = express.Router();

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
  if(!verify) return res.sendStatus(403)
  let id = await dbase.getUserIdByEmail(email)
  if(!await dbase.isUserSuperUser(id)) return res.cookie('session', jwt.sign({ id }, process.env.JWT_SECRET,{expiresIn:60*60*24*3})).json({redirect:'/channels'})
  res.cookie('session', jwt.sign({ id, superUser:true }, process.env.JWT_SECRET,{expiresIn:60*60*24*3})).json({redirect:'/admin'})
    
  
})

app.post("/api/issuperuser",async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser) throw new Error("Unauthorised")
    /* if(!await dbase.isUserSuperUser(decoded.id)) throw new Error("Unauthorised") */
    res.json({status:"ok"})
  }
  catch(err){
    res.status(403).json({code:403,message:"You are not a Super User"})
  }
})

module.exports = app

