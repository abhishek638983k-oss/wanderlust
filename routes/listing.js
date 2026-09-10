import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { validateListing } from "../ListingSchema.js";
import { addOwner, addOwnerReviewe } from "../middlewares/addOwner.js";
import { authenticate, isOwner } from "../middlewares/authenticate.js";
import { uploadListingImage } from "../middlewares/upload.js";

import {
    newListingForm,
    editListingForm,
    showListing,
    allListings,
    newListing,
    editListing,
    deleteListing,
} from "../controllers/listing.js";

let router = express.Router();

router.get("/new", authenticate, newListingForm);

router.get("/:id/edit", authenticate, isOwner, wrapAsync(editListingForm));

router
    .route("/:id")
    .get(wrapAsync(showListing))
    .put(
        authenticate,
        isOwner,
        uploadListingImage.single("listing[imageFile]"),
        addOwnerReviewe,
        validateListing,
        wrapAsync(editListing),
    )
    .delete(authenticate, isOwner, wrapAsync(deleteListing));

router
    .route("/")
    .get(wrapAsync(allListings))
    .post(
        authenticate,
        uploadListingImage.single("listing[imageFile]"),
        addOwner,
        (req, res, next) => {
            if (req.file) {
                req.body.listing.image = {
                    filename: req.file.filename,
                    url: req.file.path,
                };
            }
            next();
        },
        validateListing,
        wrapAsync(newListing),
    );

export default router;
