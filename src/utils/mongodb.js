const mongoose = require("mongoose");

// Connection URI for MongoDB
const uri = process.env.MONGODB_URL;

const connectDb = async () => {
    try {
        // Use connect method to connect to the server
        mongoose.connect(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        }).then(() => {
            console.log('Successfully connect to MongoDB');
            console.log(process.env.MONGODB_URL)
        }).catch((err) => {
            console.error(err);
        });
    } catch (err) {
        console.error("Unable to connect Mongodb", err)
        process.exit()
    }
}

module.exports = {
    connectDb
}