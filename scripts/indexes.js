const DB = require("../modules/db.js");
require('dotenv').config({ path: __dirname+'/../.env'});

const mongo = new DB();

(async()=>{
  let client = await mongo.getClient();
  await mongo.client.db("meta").collection('users').createIndex({"email":1}, {unique:true})
  mongo.client.close();
})()