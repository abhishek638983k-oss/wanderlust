import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { reviewPri, validateReview } from "../ReviewSchema.js";
import { authenticate, isReviewOwner } from "../middlewares/authenticate.js";
import {
    editRevieweForm,
    getAllReviews,
    newReviewe,
    editReview,
    deleteReview,
} from "../controllers/review.js";

const router = express.Router({ mergeParams: true });

router.get(
    "/:reviewId/edit",
    authenticate,
    isReviewOwner,
    wrapAsync(editRevieweForm),
);

router
    .route("/:reviewId")
    .put(
        authenticate,
        isReviewOwner,
        reviewPri,
        validateReview,
        wrapAsync(editReview),
    )
    .delete(authenticate, isReviewOwner, wrapAsync(deleteReview));

router
    .route("/")
    .get(wrapAsync(getAllReviews))
    .post(authenticate, reviewPri, validateReview, wrapAsync(newReviewe));

export default router;
