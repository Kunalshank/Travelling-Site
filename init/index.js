const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require('../models/listing.js ');


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {   //main function ko call kar rahe hai
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);  //ye jo data hai ye data.js se key value pair wala data le rahe hai
    console.log("data was initialized");
};

initDB();