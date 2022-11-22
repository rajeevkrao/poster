const MongoClient = require('mongodb').MongoClient;

class Mongo{
  uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.tkwubms.mongodb.net/?retryWrites=true&w=majority`
  client = new MongoClient(this.uri/* , { useNewUrlParser: true, useUnifiedTopology: true } */);
  constructor(){
  }

  connect(){
    return new Promise(async(resolve,reject)=>{
      resolve(this.client.connect())
      /* this.client.connect(err => {
        if(!err){
          //console.log("mongodb database connected");
          resolve(this.client)
        }
        else
          this.error(err,reject)
      }); */
    })
  }

  channelList(){
    return new Promise(async(resolve, reject)=>{
      let client = await this.connect().catch(err=>this.error(err,reject));
      client.db("channels").listCollections().toArray((err,collections)=>{
        resolve(collections.map(collection=>{
          return collection.name
        }))
        client.close()
      })
    })
    
  }

  getClient(){
    return new Promise(async(resolve,reject)=>{
      resolve(await this.connect().catch(err=>this.error(err,reject)))
    })
  }

  error(err,reject){
    reject(err)
    console.log(err)
  }
}

module.exports = Mongo;