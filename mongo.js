const mongoose = require('mongoose');

const connectionDB = process.env.MONGO_DB_URI; 

mongoose.connect(connectionDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => console.log('Connection to database successfully'))
  .catch(err => console.log(err));