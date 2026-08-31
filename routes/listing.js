import express from "express";
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { validateListing } from "../ListingSchema.js";
let router = express.Router();

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs", { title: "New Listing" });
});

//Edit Route
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {
            listing,
            title: "Edit Your Listing",
        });
    }),
);

//Show Route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        const title = "Detailed Listing";
        res.render("listings/show.ejs", { title, listing });
    }),
);
//Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        const title = "Home";
        res.render("listings/index.ejs", { title, allListings });
    }),
);

//Create Listing Route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        // FIXED: Removed duplicate internal schema validation call since middleware does it
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }),
);

//Update Listing Route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            {
                new: true,
                runValidators: true,
            },
        );
        res.redirect(`/listings/${id}`);
    }),
);

//Delete Listing Route
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    }),
);
export default router;
