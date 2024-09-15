const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/users.js"); // Import User model
const initdata = require("./data.js");

const DB_URL = "mongodb+srv://bansalsushant2024:WakXzTH63HheqW8L@cluster0.odyn0ux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Use AtlasDB URL or fallback to local DB
console.log(DB_URL);

async function main() {
    await mongoose.connect(DB_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
        initDB();
    })
    .catch((err) => {
        console.log(err);
    });

let categoryAll = [
    "Trending",
    "Mountains",
    "Rooms",
    "Pace",
    "Beach",
    "Treehouse",
    "Farms",
    "Iconic Cities",
    "Arctic",
    "Ocean"
];

// Function to ensure the owner exists and get their ID
const ensureOwnerExists = async () => {
    const ownerEmail = "owner@example.com"; // Unique email for the static owner
    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
        // Create the user if it does not exist
        owner = await User.create({
            email: ownerEmail,
            // Add any other required fields for the User model
        });
        console.log("Owner created with email:", ownerEmail);
    } else {
        console.log("Owner already exists with email:", ownerEmail);
    }
    return owner._id; // Return the owner's _id
};

const initDB = async () => {
    const ownerId = await ensureOwnerExists(); // Ensure the owner exists and get their ID

    await Listing.deleteMany({}); // Clear the collection first
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: ownerId, // Use the owner's ID for reference
        price: obj.price * 25, // Adjusting the price (multiplying by 25)
        category: [
            `${categoryAll[Math.floor(Math.random() * categoryAll.length)]}`, // Pick a random category
            `${categoryAll[Math.floor(Math.random() * categoryAll.length)]}`  // Pick a second random category
        ],
    }));
    await Listing.insertMany(initdata.data); // Insert modified data
    console.log("Database initialized with updated listings.");
};
