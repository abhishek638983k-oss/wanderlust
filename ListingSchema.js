import Joi from "joi";
import mongoose from "mongoose";
import ExpressError from "./utils/ExpressError.js";

const type = Object.freeze({
    PENDING: "experiences",
    APPROVED: "stay",
});

// 1. Define your allowed tags array explicitly
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

export const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().min(3).max(50).required(),

        description: Joi.string().min(20).max(200).required(),

        price: Joi.number().min(0).required(),

        image: Joi.object({
            filename: Joi.string().trim().required(),
            url: Joi.string().trim().uri({ allowRelative: true }).required(),
        }).required(),

        location: Joi.string().required(),

        country: Joi.string().required(),

        owner: Joi.any()
            .custom((value, helpers) => {
                if (
                    value &&
                    typeof value === "object" &&
                    mongoose.Types.ObjectId.isValid(value)
                ) {
                    return value.toString();
                }
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

        type: Joi.string()
            .valid("stay", "experience")
            .alter({
                create: (schema) => schema.required(),
                update: (schema) => schema.forbidden(),
            }),

        // 2. Added the tags multi-enum array rule inside the listing block
        tags: Joi.array()
            .items(Joi.string().valid(...ALLOWED_TAGS))
            .messages({
                "any.only": "{#value} is not a valid listing tag layout.",
            }),
    }).required(),
});

export const validateListing = (req, res, next) => {
    // 3. Transform string inputs if sent from standard HTML forms/FormData
    if (req.body.listing && typeof req.body.listing.tags === "string") {
        req.body.listing.tags = req.body.listing.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
    }

    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};
