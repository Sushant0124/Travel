const Listing=require("./models/listing");
const Review=require("./models/reviews");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listings");
        return res.redirect("/login");
    }else{
        next();
    }
};

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}   ;

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        console.log(req);
        const {id, reviewsId } = req.params;
        const review = await Review.findById(reviewsId);
        
        // Check if the review exists
        if (!review) {


            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        // Check if the current user is the author of the review
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not authorized to perform this action");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (e) {
        console.error(e);
        req.flash("error", "Something went wrong");
        res.redirect(`/listings/${id}`);
    }
};