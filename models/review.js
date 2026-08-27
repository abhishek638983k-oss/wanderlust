import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
