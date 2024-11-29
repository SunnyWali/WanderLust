    const mongoose=require("mongoose");

    const listingSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true,
        },
        description:String,
        image:{
            type:Object,
            default:"https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:v=>(v===""?"default":v),
        },
        price:Number,
        location:String,
        country:String
    });

    const Listing=mongoose.model("Listing",listingSchema);

    module.exports=Listing;