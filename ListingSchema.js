import Joi from "joi";
import ExpressError from "./utils/ExpressError.js";
export const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().min(3).max(50).required(),

        description: Joi.string().min(20).max(200).required(),

        price: Joi.number().min(0).required(),

        image: Joi.string().uri().required(),

        location: Joi.string().required(),

        country: Joi.string().required(),
    }).required(),
});

export const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};
