const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

class Mongo{
    uri;
    client;
  constructor(){
    this.uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.tkwubms.mongodb.net/?retryWrites=true&w=majority`
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect().then(()=>{
      console.log("Database Connected")
    })
  }

  connect(){
    return new Promise(async(resolve,reject)=>{
      resolve(this.client.connect())
    })
  }

  async channelList(){
    try{
      let collections = await this.client.db("channels").listCollections().toArray();
      return collections.map(collection=>{
        return collection.name;
      })
    }
    catch(err){
      console.log(err)
    }
    /* return new Promise(async(resolve, reject)=>{
      let client = await this.connect().catch(err=>this.error(err,reject));
      if(client === undefined) return;
      client.db("channels").listCollections().toArray((err,collections)=>{
        resolve(collections.map(collection=>{
          return collection.name
        }))
        client.close()
      })
    }) */
  }

  async getMetaChannel(channel){
    try{
      let doc = await this.client.db("channels").collection(channel).findOne({meta:true},{creationTimestamp:1,createdBy:1})
      return doc
    }
    catch(err){
      console.log(doc)
    }
  }

  async createUser(name, email, options){
    try{      
      let doc = {
        name,
        email
      }
      if(options?.passHash) doc.passHash = options.passHash
      if(options?.superUser) doc.superUser = true;
      else doc.invitationStatus = false;
      if(options?.accesses) doc.accesses = options.accesses
      let mDoc = await this.client.db('meta').collection('users').insertOne(doc)
      return mDoc;
    }
    catch(err){
      return {err}
    }
  }

  async updateUser(name, email, options){
    try{      
      let doc = {
        name,
        email
      }
      if(options?.accesses) doc.accesses = options.accesses
      let mDoc = await this.client.db('meta').collection('users').findOneAndUpdate({email:email},{$set:doc})
      return mDoc;
    }
    catch(err){
      return {err}
    }
  }

  async deleteUser(id){
    try{
      let doc = await this.client.db("meta").collection('users').deleteOne({_id:ObjectId(id)})
      return doc
    }
    catch(err){
      console.log(err)
    }
  }

  async addChannel(name){
    try{
      let doc = await this.client.db("channels").createCollection(name)
      console.log(doc)
      return doc
    }
    catch(err){
      if(err.code=="48")//Namespace Exists\Channel with same name exist already
        return {error:{code:409,message:"Channel with that name already Exist"}} //Error 409 - Conflict
      return {error:{code:500,message:"Channel Not Created"}} //Error 500 - Server Error
    }
  }

  async addChannelMeta(channelName,createdBy,creationTimestamp){
    try{
      let doc = await this.client.db("channels").collection(channelName).insertOne({meta:true,createdBy,creationTimestamp})
      return doc
    }
    catch(err){
      return err;
    }
  }

  async getUserById(id){
    try{
      let doc = await this.client.db("meta").collection("users").findOne({_id:ObjectId(id)})
      
      if(doc==[])
        throw new Error("Super User Doesn't Exist")
      return doc
    }
    catch(err){
      if(err.message=="Super User Doesn't Exist")
        {return {error:{cause:err,message:err.message}}}
      console.log(err)
    }
  }

  async deleteChannel(name){
    try{
      await this.client.db("channels").collection(name).drop();
      return {acknowledged:true}
    }
    catch(err){
      console.log(err)
    }
    
    
  }

  async verifySuperUser(email){
    try{
      
      let doc = await this.client.db("meta").collection("users").findOne({email},{superUser:1})
      this.client.close();
      if(doc?.superUser)
        return true
      else  
        return false
    }
    catch(err){
      console.log(err)
    }
  }

  async getUserIdByEmail(email){
    try{
      
      let doc = await this.client.db("meta").collection("users").findOne({email},{_id:1})
      
      if(!doc) throw new Error("No such User Exist")
      return doc._id.toString()
    }
    catch(err){
      console.log(err)
    }
  }

  async getUserIdById(id){
    try{
      
      let doc = await this.client.db("meta").collection("users").findOne({_id:ObjectId(id)},{_id:1})
      
      if(!doc) throw new Error("No such User Exist")
      return doc._id.toString()
    }
    catch(err){
      console.log(err)
    }
  }

  async verifyUser(email, passHash){
    try{
      
      let doc = await this.client.db('meta').collection('users').findOne({email},{passHash:1})
      
      if(!doc)
        return false;
      if(passHash == doc.passHash)
        return true;
      else  
        return false;
    }
    catch(err){
      return {err}
    }
  }

  async isUserSuperUser(id){
    try{
      
      let doc = await this.client.db("meta").collection('users').findOne({_id:ObjectId(id)},{superUser:1})
      
      if(!doc)
        return false;
      if(doc.superUser)
        return true;
      else  
        return false;
    }
    catch(err){
      console.log(err)
    }
  }

  async getInvitedUsers(){
    try{
      
      let doc = await this.client.db('meta').collection('users').aggregate([
        { $match: {superUser:{$ne:true}} },
        {
          $project: {
            _id: {
              $toString: "$_id",
            },
            name: 1,
            email: 1,
            invitationStatus:1,
            accesses:1
          }
        }
      ]).toArray()
      
      return doc;
    }
    catch(err){
      console.log(err)
      return {err}
    }
  }

  async verifyNewUser(id,passHash){
    try{
      let doc = await this.client.db("meta").collection("users").findOneAndUpdate({_id:ObjectId(id)},{$set:{passHash,invitationStatus:true}})
      if(doc) return doc
    }
    catch(err){
      return {error:{code:500,message:"Error Verifying New User"}}
    }
  }

  async getClient(){
    try{
      return await this.client
    }
    catch(err){
      console.log(err)
    }
  }

  

  error(err,reject){
    reject(err)
    console.log(err)
  }
}

module.exports = Mongo;