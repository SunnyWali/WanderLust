    const mongoose=require("mongoose");
    const Review=require("./review");
    const listingSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true,
        },
        description:String,
        // image:{
        //     type:Object,
        //     hello:"https://images.unsplash.com/photo-1454388683759-ee76c15fee26?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //     set:v=>(v===""?hello:v),
        // },
        image: {
            type: Object,
            // default: {
            //   url: "https://images.unsplash.com/photo-1454388683759-ee76c15fee26?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            // },
            set: (v) => (v === "" ? { url: "https://images.unsplash.com/photo-1454388683759-ee76c15fee26?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" } : v),
          },
        price:Number,
        location:String,
        country:String,
        review:[{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Review",
        }]
    });

    const Listing=mongoose.model("Listing",listingSchema);

    module.exports=Listing;