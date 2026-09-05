import mongoose from "mongoose";
import User from "./users.js";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    stars: {
        type: Number, // <-- CRITICAL: Always declare the type!
        required: true,
        // Option A: Use min/max if you want to allow decimals like 4.5
        min: [1, "Rating cannot be lower than 1"],
        max: [5, "Rating cannot be higher than 5"],

        // Option B: Uncomment enum below if you ONLY want whole numbers (1, 2, 3, 4, 5)
        // enum: { values:, message: '{VALUE} is not a valid rating' }
    },
    avatar: {
        type: String,
        required: true,
    },
    for: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
