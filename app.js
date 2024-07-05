const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const ejsmate=require("ejs-mate");
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
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsmate);


app.get("/",(req,res)=>{
    res.send("Hello World");
});

// app.get("/test",async(req,res)=>{
//     const sample=new Listing({
//         title:"Taj Mahal",
//         description:"The Taj Mahal is a mausoleum located in Agra, India",
//         price:12000,
//         image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1200px-Taj_Mahal_%28Edited%29.jpeg",
//         location:"agra",
//         country:"India",
//     });
//     await sample.save();
//     res.send("Save table");
// });
app.get("/listings",async(req,res)=>{
    const listings=await Listing.find();
    console.log("Collect all listings");
    res.render("listing/index.ejs",{listings});
});
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
});
app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let list=await Listing.findById(id);
    res.render("listing/edit.ejs",{list});
});
app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

});
app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
app.get("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    let list=await Listing.findById(id);
    res.render("listing/show.ejs",{list});
});
app.post("/listings",async(req,res)=>{
    let newlisting=new Listing(req.body.listing);
    newlisting.save();
    res.redirect("/listings");

});


app.listen(8080,()=>{
    console.log("server is running on port 8080");
});