const mongoose=require("mongoose");
const Listing=require("../models/listing.js")
const initdata=require("./data.js");

const mong_url="mongodb://127.0.0.1:27017/wanderworld";
main().then(()=>{
    console.log("Connect to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mong_url);
};

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"669278901801b46a90cc1c90"}))
    await Listing.insertMany(initdata.data);
};
initDB();