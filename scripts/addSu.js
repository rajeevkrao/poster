(async()=>{
  const rl = require('readline-sync');
  require('dotenv').config({ path: __dirname+'/../.env'});
  
  const crypto = require("../modules/crypto")
  const DB = require('../modules/db');

  const mongo = new DB();

  let name = rl.question('Name of the new Super User: ');

  let email = rl.question('Email of the new Super User: ');

  let pass = rl.question('Password of the new Super User: ',{hideEchoBack:true})

  let saltHash = crypto.sash(pass)

  let doc = await mongo.createUser(name, email, {passHash:saltHash, superUser:true})
  
  if(doc && doc.err && doc.err.code == 11000)
    console.log("That email already Exist")
  else if(doc.acknowledged)
    console.log("Super User Created")
  else{
    console.log("Error Occured")
    console.log(doc.err)
  }
    

  process.exit();

})()

