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
    await Listing.insertMany(initdata.data);
};
initDB();