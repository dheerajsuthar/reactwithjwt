const mongoose = require('mongoose');

module.exports.connect = (uri) => {
  mongoose.connect(uri);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', (err)=>{
    console.log(`Mongoose connection error ${err}`);
  });

  require('./user');
};
