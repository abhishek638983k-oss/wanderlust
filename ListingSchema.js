import Joi from "joi";
import mongoose from "mongoose";
import ExpressError from "./utils/ExpressError.js";
export const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().min(3).max(50).required(),

        description: Joi.string().min(20).max(200).required(),

        price: Joi.number().min(0).required(),

        image: Joi.string().uri().required(),

        location: Joi.string().required(),

        country: Joi.string().required(),
        // Custom check: accepts string or transforms native ObjectId into a valid string
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
                if (
                    typeof value === "string" &&
                    /^[0-9a-fA-F]{24}$/.test(value)
                ) {
                    return value;
                }
                return helpers.message(
                    '"listing.owner" must be a valid MongoDB ObjectId',
                );
            })
            .required(),
    }).required(),
});

export const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};
