import express from "express";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import wrapAsync from "../utils/wrapAsync.js";
import { reviewPri, validateReview } from "../ReviewSchema.js";
import ExpressError from "../utils/ExpressError.js";
import { authenticat, isReviewOwner } from "../middlewares/authenticate.js";
const router = express.Router({ mergeParams: true });

router.get(
    "/:reviewId/edit",
    authenticat,
    isReviewOwner,
    wrapAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return next(new ExpressError(404, "Review not found"));
        }
        res.render("listings/editReviews.ejs", {
            title: "Edit Your Review",
            review,
            listingId: id,
        });
    }),
);
router.get(
    "/",
    wrapAsync(async (req, res, next) => {
        let id = req.params.id;
        const result = await Review.find({ for: id });
        if (result.length === 0) {
            return next(
                new ExpressError(404, "No reviews found for this listing"),
            );
        }
        res.status(200).json({ result });
    }),
);

// Create Review Route
router.post(
    "/",
    authenticat,
    reviewPri,
    validateReview,
    wrapAsync(async (req, res, next) => {
        const listing = await Listing.findById(req.body.for);

        if (!listing) {
            return next(
                new ExpressError(
                    404,
                    `Listing with id ${req.body.for} doesn't exist`,
                ),
            );
        }
        const newReview = new Review(req.body);
        await newReview.save();

        await Listing.findByIdAndUpdate(req.body.for, {
            $push: { reviews: newReview._id },
        });
        req.flash("success", "Review Added Succesfully!");
        res.status(201).redirect(`/listings/${req.body.for}`);
    }),
);

// Update Review Route
router.put(
    "/:reviewId",
    authenticat,
    isReviewOwner,
    reviewPri,
    validateReview,
    wrapAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        let result = await Review.findByIdAndUpdate(
            reviewId,
            { ...req.body },
            {
                runValidators: true,
            },
        );

        if (!result) {
            return next(
                new ExpressError(404, `Review with id ${id} doesn't exist`),
            );
        }
        req.flash("success", "Review Edited Succesfully!");
        res.status(200).redirect(`/listings/${id}`);
    }),
);

router.delete(
    "/:reviewId",
    authenticat,
    isReviewOwner,
    wrapAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        const result = await Review.findByIdAndDelete(reviewId);

        if (!result) {
            return next(new ExpressError(404, "Review not found"));
        }
        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });
        req.flash("success", "Review Deleted Succesfully!");
        res.status(200).redirect(`/listings/${id}`);
    }),
);

export default router;
