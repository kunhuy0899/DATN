const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('./config/database');
const Boom = require('./boom');
const url = dbConfig.mongo.url;

class MongoDB {
  constructor() {
    this.conDb = null;
    this.dbClose = null;
  }

  async updateOrInsertOne(key,data, collectionName, callback) {
    let result = false;
    try {
      await this.connectDB();
      if(!collectionName || !collectionName.length) {
        collectionName = this.collectionName;
      }
      result = await this.conDb.collection(collectionName).updateOne(key,{$set: data}, { upsert: true});
      await this.closeDB();
    } catch (error) {
      if(callback) callback('',error)
      console.log(error);
      await this.closeDB();
    }
    return result;
  }

  async connectDB(dbName) {
    dbName = dbName || process.env.DB_NAME;
    try {
      if(!this.dbClose) {
        const connectRs = await MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true });
        this.conDb = connectRs.db(dbName);
        this.dbClose = connectRs;
        return this.conDb;
      }
    } catch(ex) {
      console.log('connect error db', ex)
      throw ex
    } 
 
  }

  async closeDB() {
    if(this.dbClose) {
      await this.dbClose.close();
      this.dbClose = null;
    }
  }

  async getAll() {
    let result=false;
    try {
      await this.connectDB();
      result = await this.conDb.collection(this.collectionName).find({}).toArray();
      await this.closeDB();
    } catch (error) {
      console.log('errrr.......', error.message);
      await this.closeDB();
      return Boom.badRequest(error.message)
    }
    return result;

  }
  async find(options) {
    let result = null;
    try {
      await this.connectDB();
      result = await this.conDb.collection(this.collectionName).find(options).toArray();
    } catch (error) {
      console.log('errrr.......', error.message);
      return Boom.badRequest(error.message)
    }
    return result;
  }
}

module.exports = MongoDB;