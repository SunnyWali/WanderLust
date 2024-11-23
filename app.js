const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("../WanderLust/models/listing");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const mongoUrl = "mongodb://127.0.0.1:27017/WanderLust";
app.listen(8080, (req, res) => {
    console.log("Server is working on the port no 8080");
});

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

//Index Route 
app.get("/listing", async (req, res) => {
    let alllisting = await Listing.find({});
    res.render("listing/index", { alllisting });
});

//New Route
app.get("/listing/new",(req,res)=>
{
    res.render("listing/new");
});

//Show Route
app.get("/listing/:id", async (req, res) => {
 let{id}=req.params;
 let list=await Listing.findById(id);
 res.render("listing/show",{list});
});

//Create Route
app.post("/listing",async(req,res)=>
{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
});

//Edit Route
app.get("/listing/:id/edit",async(req,res)=>
{
    let{id}=req.params;
    let list=await Listing.findById(id);
    res.render("listing/edit",{list});
});

//Update Route
app.put("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
});

//Delete Route
app.delete("/listing/:id",async(req,res)=>
{
    let{id}=req.params;
    console.log(id);
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listing");
});;

