const mongoose=require("mongoose");
const alldata=require("../init/data.js");
const Listing=require("../models/listing.js");
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
 
main().then(()=>
{
    console.log("Connected successfully");
})
.catch(()=> 
{
    console.log("failed to connect with the database");
});

const initData=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(alldata.data);
    console.log("Data has been saved successfully");
}

console.log("Data was failed to saved and inserted successfully");
initData();

