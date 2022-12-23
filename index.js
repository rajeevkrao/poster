const express = require("express");
const cors = require("cors");
require('dotenv').config();

global.jwt = require('jsonwebtoken');
global.mailjet = require ('node-mailjet')
  .connect(process.env.MAILJET_API, process.env.MAILJET_SECRET)

global.crypto = require("./modules/crypto")

const mongo = require("./modules/db");
global.dbase = new mongo();

const PORT = 5000

const app = express();

app.use(cors({credentials: true,origin:'http://localhost:4200'}))

let cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('dist/poster'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = {admin:{}}

routes.auth = require("./routes/auth")
routes.admin.users = require("./routes/admin/users")
routes.channels = require("./routes/channels")
routes.posts = require("./routes/posts")

app.use(routes.auth)
app.use(routes.channels)
app.use(routes.posts)
app.use(routes.admin.users)

//----SonarLint Tests-----------------

var a = 1

if(a=1)
  console.log("hell")

//------------------------------------


/* for(route of Object.keys(routes)){
  if(typeof(route) != "object"){
    console.log(typeof(route))
    app.use(route)
    continue
  }
  for(subRoute of Object.keys(route))
    app.use(subRoute) 
} */

//TEST API
app.post('/api/test',(req,res)=>{
  res.status(200).send("Test OK");
})



app.get('*',(req,res)=>{
  res.sendFile(__dirname+"/dist/poster/index.html")
})

app.listen(PORT,()=>{
  console.log(`App Listening to PORT: ${PORT}`)
})
