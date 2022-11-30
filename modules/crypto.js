var crypto = require('crypto');

class Crypto{
  static sash(password){
    if(!process.env.SALT_HASH_SECRET)
      throw new Error("Unable to Access HASH SECRET")
    return crypto.createHmac('sha512',process.env.SALT_HASH_SECRET).update(password).digest('hex');
  }

  
}

module.exports = Crypto;