const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const mbxGeocodimg = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_KEY;
const   geocodingClient = mbxGeocodimg({ accessToken: mapToken });

const wrapAsync = require("../utils/wrapAsync.js");

const getAllListings = wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    console.log("Collect all listings");
    res.render("listing/index.ejs", { listings });
});

const renderNewListingForm = (req, res) => {
    res.render("listing/new.ejs");
};

const createNewListing = wrapAsync(async (req, res) => {
    console.log('req.body:', req.body);
console.log('req.body.listing:', req.body.listing);
console.log('req.body.listing.category:', req.body.listing.category);
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    console.log("come");

    // Split the category string into an array
    if (req.body.listing.category) {
        newListing.category = req.body.listing.category.map(cat => cat.trim());
    }

    let saved = await newListing.save();
    console.log(saved);
    req.flash("success", "New List Created!");
    res.redirect("/listings");
});


const renderEditListingForm = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error","Your current request doesnt exist");
        return res.redirect("/listings");
        };
        let orignalUrl=list.image.url;
        orignalUrl=orignalUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listing/edit.ejs", { list,orignalUrl });
});

const updateListing = wrapAsync(async (req, res) => {
    let { id } = req.params;

    // Update listing with the data from the form
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // Handle category input - split the comma-separated string into an array
    if (req.body.listing.category) {
        updatedListing.category = req.body.listing.category.split(',').map(cat => cat.trim());
    }

    // Handle image upload
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
    }

    // Save any changes made to the listing
    await updatedListing.save();

    // Flash success message and redirect back to the listing
    req.flash("success", "List Updated!");
    res.redirect(`/listings/${id}`);
});


const deleteListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
});

const showListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author" },
        })
        .populate("owner");
    res.render("listing/show.ejs", { list });
});

const filter= wrapAsync(async (req, res) => {
    // const listings = await Listing.find();
    // console.log(listings);
    let { id } = req.params;
    console.log(id);
	let listings = await Listing.find({ category: { $in: [new RegExp(`^${id}$`, "i")] } });
	console.log(listings);
	if (listings.length != 0) {
		res.locals.success = `Listings Find by ${id}`;
		res.render("listing/index.ejs", { listings });
	} else {
		req.flash("error", "Listings is not here !!!");
		res.redirect("/listings");
	}
    
});
const search = async (req, res, next) => {
    console.log("Search function called");
    console.log("Query params:", req.query);
    try {
        let input = req.query.q;
        console.log("Raw input:", input);
        
        if (!input) {
            console.log("Empty search input");
            return res.status(400).json({ error: "Search value empty" });
        }

        input = input.trim().replace(/\s+/g, " ");
        console.log("Processed input:", input);

        let element = input
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
        console.log("Formatted element:", element);

        const intValue = parseInt(element, 10);
        const isNumber = !isNaN(intValue);
        console.log("Is number:", isNumber, "Int value:", intValue);

        const query = {
            $or: [
                { title: { $regex: element, $options: "i" } },
                { category: { $regex: element, $options: "i" } },
                { country: { $regex: element, $options: "i" } },
                { location: { $regex: element, $options: "i" } },
                ...(isNumber ? [{ price: { $lte: intValue } }] : [])
            ]
        };
        console.log("MongoDB query:", JSON.stringify(query, null, 2));

        const listings = await Listing.find(query).sort({ _id: -1 });
        console.log("Number of results:", listings.length);
        res.render("listing/index.ejs", { listings });

        return res.json(listings);
    } catch (err) {
        console.error("Error in search function:", err);
        next(err); // Pass the error to the error handling middleware
    }
};



const validatelisting = (req, res, next) => {
console.log('req.body:', req.body);
console.log('req.body.listing:', req.body.listing);
console.log('req.body.listing.category:', req.body.listing.category);
    if (typeof req.body.listing.category === 'string') {
        req.body.listing.category = req.body.listing.category.split(',').map(cat => cat.trim());
      }
    console.log(listingSchema);
    const { error } = listingSchema.validate(req.body); // Validate req.body.listing
    if (error) {
        console.log(error);
        req.flash('error', error.details.map(e => e.message).join(', '));
        return res.redirect('/listings/new');
    }
    next();
};

module.exports = {
    getAllListings,
    renderNewListingForm,
    createNewListing,
    renderEditListingForm,
    updateListing,
    deleteListing,
    showListing,
    validatelisting,
    filter,
    search
};
