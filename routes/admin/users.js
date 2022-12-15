var express = require('express');

var app = express.Router();

app.post('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser) throw new Error("Unauthorised")
    res.json(await dbase.getInvitedUsers())
  }
  catch(err){
    res.sendStatus(403)
  }
})

app.delete('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser) throw new Error("Unauthorised")
    let result = await dbase.deleteUser(req.body.id)
    if(!result.acknowledged) throw new Error("Some Error")
    res.json(result)
  }
  catch(err){
    console.log(err)
    res.sendStatus(403)
  }
})

app.put('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser) throw new Error("Unauthorised")
    var { name, email, accesses } = req.body;
    for(channel of Object.keys(accesses))
      if(!accesses[channel].read && !accesses[channel].write && !accesses[channel].delete)
        delete accesses[channel]
    let result = await dbase.createUser(name,email,{accesses})
    if(!result.acknowledged && result.err.code==11000) throw new Error("Email Already Exist")
    if(!result.acknowledged) throw new Error("Error Occured")
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
  catch(err){
    if(err.message=="Email Already Exist") return res.status(403).json({code:11000,message:err.message})
    res.sendStatus(403)
  }
})

app.patch('/api/users/invited',async(req,res)=>{
  try{
    let decoded = jwt.verify(req.cookies.session,process.env.JWT_SECRET)
    if(!decoded?.superUser) throw new Error("Unauthorised")
    var { name, email, accesses } = req.body;
    for(channel of Object.keys(accesses))
      if(!accesses[channel].read && !accesses[channel].write && !accesses[channel].delete)
        delete accesses[channel]
    let result = await dbase.updateUser(name,email,{accesses})
    if(result?.err?.code==11000) throw new Error("Email Already Exist")
    if(result?.err) throw new Error("Error Occured")
    res.sendStatus(200)
  }
  catch(err){
    console.log(err)
    if(err.message!="Email Already Exist") return res.status(403).json({code:10000,message:err.message})
    res.status(403).json({code:11000,message:err.message})
  }
})

module.exports = app;