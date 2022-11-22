const express = require("express");
const cors = require("cors");
require('dotenv').config();

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

dbase.channelList().then(list=>{
  console.log(list)
})


const PORT = 5000

const app = express();

app.use(cors())

app.use(express.static('dist/poster'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/test',(req,res)=>{
	res.sendFile(__dirname+"/test.html")
})

app.get('/test/*',(req,res)=>{
	res.sendFile(__dirname+"/test.html")
})

app.post('/api/test',(req,res)=>{
  res.status(200).send("Test OK");
})

app.get('*',(req,res)=>{
  res.sendFile(__dirname+"/dist/poster/index.html")
})

app.listen(PORT,()=>{
  console.log(`App Listening to PORT: ${PORT}`)
})
