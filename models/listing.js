const mongoose = require("mongoose");
const Schema = mongoose.Schema;  //baar baar ongose.schema na likhana pare so usko store kar de rahe hai

const listingSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    description: String,
    image: {
        type: String,
        default:"https://unsplash.com/photos/a-couple-of-people-standing-on-top-of-a-sandy-beach-xvxhy7C3Kjs",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-couple-of-people-standing-on-top-of-a-sandy-beach-xvxhy7C3Kjs" : v, //default link set kar rahe hai agar koi image nhi hua toh uske jagah ye image aa jaayega 
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing",listingSchema); 
module.exports = Listing; 