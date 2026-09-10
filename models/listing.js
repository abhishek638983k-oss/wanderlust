import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const ALLOWED_TAGS = [
    "Beachfront",
    "Cabins",
    "Trending",
    "Iconic Cities",
    "Castles",
    "Camping",
    "Amazing Pools",
    "Farms",
    "Arctic",
    "Luxury",
    "Adventure",
    "Food & Drink",
    "Art & Culture",
    "Nature & Wildlife",
];

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    price: Number,
    location: String,
    country: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    type: {
        type: String,
        enum: ["experience", "stay"],
        required: true,
        immutable: true,
    },
    // Allows an array containing multiple valid tags
    tags: [
        {
            type: String,
            enum: {
                values: ALLOWED_TAGS,
                message: "{VALUE} is not a supported tag layout.",
            },
        },
    ],
});

listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
