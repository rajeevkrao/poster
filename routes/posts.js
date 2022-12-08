var express = require('express');

var app = express.Router();

app.post("api/posts",async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!await dbase.isUserSuperUser(decoded.id))
      if(!dbase.userPermissionOfChannel(decoded.id, req.body.channel, {read:true}))
        return res.status(403).json({code:403,message:"No Read Permission for the Channel"})
    //Work Pending
    
  }
  catch(err){
    res.status(403).json({
      code:403,
      message:"Unauthorized"
    })
  }
})

module.exports = app