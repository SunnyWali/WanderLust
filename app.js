const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("../WanderLust/models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review=require("./models/review.js");
const {reviewSchema}=require("./schema.js");
const review = require("./models/review.js");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const mongoUrl = "mongodb://127.0.0.1:27017/WanderLust";


async function main() {
    mongoose.connect(mongoUrl);
}

main().then(() => {
    console.log("Connected Successfully");
}).catch((err) => {
    console.log(err);
});

// app.get("/listing",async(req,res)=>
// {
//     let listing=new Listing({
//         title:'Hello',
//         description:'This is the villa',
//         price:400,
//         location:'Goa',
//         country:'India'
//     });
//     await listing.save().then(()=>console.log("saved"));
//     res.send("success");
// })

//defining function for ListingSchema Validation
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next(); 
    }
}

//defining function for reviewSchema validation
const validateReviews=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg); 
    }
    else{
        next();
    }
}
//Home Route
app.get("/", (req, res) => {
    res.send("Hi i am root");
});

//Index Route 
app.get("/listing", wrapAsync(async (req, res) => {
    let alllisting = await Listing.find({});
    res.render("listing/index", { alllisting });
}));

//New Route
app.get("/listing/new", (req, res) => {
    res.render("listing/new");
});

//Show Route
app.get("/listing/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate("review");
    //  console.log(list);
    res.render("listing/show", { list });
}));

//Create Route
app.post("/listing",validateListing,wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

//Edit Route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let list = await Listing.findById(id);
    res.render("listing/edit", { list });
}));

//Update Route
app.put("/listing/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}));

//Delete Route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let deletedItem = await Listing.findByIdAndDelete(id);
    // console.log(deletedItem);
    res.redirect("/listing");
}));

//Post Review Route
app.post("/listing/:id/reviews",validateReviews,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let list=await Listing.findById(id);
    let newReview=await new Review(req.body.review);
    list.review.push(newReview);
    await list.save();
    await newReview.save();
    res.redirect(`/listing/${list._id}`);
    // console.log("Sucess");
}));

//Delete Review Route
app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
    // await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    // await Listing.findByIdAndDelete(id);
    // res.redirect(`/listing/${id}`);
}));
//Error handling middleware for all the pages which do not exists
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error  handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Error Occured" } = err;
    res.status(status).render("error", {message});
});

app.listen(8080, (req, res) => {
    console.log("Server is working on the port no 8080");
}); 