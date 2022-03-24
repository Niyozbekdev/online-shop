const mongoose = require('mongoose');

const connectDB = async () => {
    const connecting = await mongoose.connect(process.env.MONGO_URL, {
       useNewUrlParser: true,
       useUnifiedTopology: true
   })
   console.log(`MongoDbga ulnish bajarildi ${connecting.connection.host}`)
}
module.exports = connectDB;
