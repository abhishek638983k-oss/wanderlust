import Joi from "joi";
import ExpressError from "./utils/ExpressError.js";
import { faker } from "@faker-js/faker";

// 1. Define the Joi Schema
export const reviewSchema = Joi.object({
    content: Joi.string().min(10).max(200).required(),

    username: Joi.string().trim().required(),

    stars: Joi.number().min(1).max(5).required(),

    // Use .uri() to ensure faker's avatar URL is valid
    avatar: Joi.string().uri().required(),

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

export const reviewPri = (req, res, next) => {
    req.body.username = faker.internet.username();
    req.body.avatar = faker.image.avatar();
    req.body.for = req.params.id;

    next();
};
