const MongoDB = require('../MongoDB');

const ObjectId = require('mongodb').ObjectId;

class DemoDAO extends MongoDB {
  constructor() {
    super()
    this.collectionName = 'demo';
  }
  async getList() {
    const List = await this.getAll();
    return List;
  }

  
}
module.exports = DemoDAO;