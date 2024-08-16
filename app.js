const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing');
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");




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


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //for parsing the request
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

//INDEX ROUTE
// app.get("/listings",async (req,res) => {
//     const allListings = await Listing.find({});
//     res.render("/listings/index.ejs",{allListings});
// });


//VALIDATION SCHEMA --> isko hamlog create route me v likhe the but isko alag separate kar de rahe as a middleware
const validateListing = (req,res,next) => {
    let result = listingSchema.validate(req.body); //schema.js se sab validate kar rahe hai listing me khuch miss toh nhi kar rahe hai matab listing schema me jo v constraints define kiye hai and request.body sab constraints ko follow kar paa rahui hai nki  nhi 
if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");  //error ke sath aur khuch message aayega toh usko , se separate kar dega
    throw new ExpressError(400,errMsg);
} else {
    next();
}

};

//INDEX ROUTE
 app.get("/listings", wrapAsync(async (req,res) => {   //wrapAsync isliye add kar rahe qki agar koi v error aata hai toh server stop na ho aur error ko handle kar de
  const allListings = await Listing.find({});
        res.render("listings/index",{ allListings});
   
 }));


  //New Route

  app.get("/listings/new",(req,res) => {
    res.render("listings/new");
 });



 //SHOW ROUTE(READ ROUTE) link par click karne ek page open hoga us page par sab details hoga us link ka

 app.get("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show",{listing});
 }));

//create route -yaha se new list add kar rahe hai
app.post("/listings",wrapAsync(async (req,res,next) => {
    //let {title,description,image,price,country,location} = req.body;   //ya toh ye method use karo sare individual ko destructure karo ya phir new.ejs me jaakar saare name ko object bana do as a key value pairs and obj ka naam hoga listing so listing ki pahli key [title] ho jaayegi
    // try{   //wrapasync ke jagah par try and catch block se v error ko handle kar sakte hai same result aayega matlab koin fiel=d me galat i/p dal denge tog error aa jaayega

// let result = listingSchema.validate(req.body); //schema.js se sab validate kar rahe hai listing me khuch miss toh nhi kar rahe hai matab listing schema me jo v constraints define kiye hai and request.body sab constraints ko follow kar paa rahui hai nki  nhi 
// console.log(result);
// if(result.error) {
//     throw new ExpressError(400,result.error);
// }

 
    if(!req.body.listing) {
        throw new ExpressError(400,"send valid data for listing");  //agar client jo listing ke liye wrong data bhej raha hai toh ye error aa jaayega
    }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings"); 
     
    // } catch(err) {
    //     next(err);  //yaha par m9iddleware lagakar error ko handle kar rahe hai
    // }
})
);

//EDIT ROUTE

app.get("/listings/:id/edit",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing}); 
}));
 

//UPDATE ROUTE
app.put("/listings/:id", wrapAsync(async (req,res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"send valid data for listing");  //agar client jo listing ke liye wrong data bhej raha hai toh ye error aa jaayega
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   res.redirect(`/listings/${id}`);
}));

// DELETE Router

app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//  app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the Beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"Goa",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
//  });



// iska matlab yeh hai ki upar wala sab route se match karega agar match nhi hua toh ye wala code run kar jaayega
app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found")); 
});


//MIDDLEWARE FOR HANDLING ERRORS

app.use((err,req,res,next) => {
     let {statusCode=500,message="something went wrong"} = err;

     res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});




app.get("/",(req,res) => {
    res.send("Hi,I am root");
});

app.listen(8080,() => {
    console.log("server is working at port 8080");
});