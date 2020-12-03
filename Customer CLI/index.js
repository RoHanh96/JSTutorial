const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Declare env
dotenv.config();

//Connect to db
const db = mongoose.connect(process.env.MONGODB_URL, {
    useMongoClient: true
});

let dbConnect = mongoose.connection;
dbConnect.on('error', (err) => {
    if (err) console.log(err);
});
dbConnect.on('open', () => {
    console.log('Connect success!');
});
