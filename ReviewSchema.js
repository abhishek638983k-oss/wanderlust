import Joi from "joi";
import ExpressError from "./utils/ExpressError.js";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
// 1. Define the Joi Schema
export const reviewSchema = Joi.object({
    content: Joi.string().min(10).max(200).required(),

    owner: Joi.any()
        .custom((value, helpers) => {
            // If it's a native Mongoose/MongoDB ObjectId object instance
            if (
                value &&
                typeof value === "object" &&
                mongoose.Types.ObjectId.isValid(value)
            ) {
                return value.toString();
            }
            // If it's already a 24-character hexadecimal string
            if (typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value)) {
                return value;
            }
            return helpers.message(
                '"listing.owner" must be a valid MongoDB ObjectId',
            );
        })
        .required(),

    stars: Joi.number().min(1).max(5).required(),

    // Validates that this is a 24-character hex MongoDB ID
    for: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": '"for" must be a valid Listing ID',
        }),
});

// 2. Define the Middleware Function
export const validateReview = (req, res, next) => {
    // FIXED: Changed listingSchema to reviewSchema to match above
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        // Extracts the clean error message and throws it to your Express error handler
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    }

    next();
};

export const reviewPri = async (req, res, next) => {
    const currListing = await Listing.findById(req.params.id);
    if (
        currListing &&
        currListing.owner._id.equals(res.locals.currentUser._id)
    ) {
        req.flash("error", "Cant add Reviewes to Your Own Lisgings");
        return res.redirect(`/listings/${req.params.id}`);
    }
    req.body.for = req.params.id;
    req.body.owner = res.locals.currentUser._id;
    next();
};
