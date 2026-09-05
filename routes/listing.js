import express from "express";
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { validateListing } from "../ListingSchema.js";
import { authenticat, isOwner } from "../middlewares/authenticate.js";
let router = express.Router();

//New Route
router.get("/new", authenticat, (req, res) => {
    res.render("listings/new.ejs", { title: "New Listing" });
});

//Edit Route
router.get(
    "/:id/edit",
    authenticat,
    isOwner,
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
        const listing = await Listing.findById(id)
            .populate("owner")
            .populate({
                path: "reviews",
                populate: {
                    path: "owner",
                },
            });
        console.log(listing.reviews);
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
    authenticat,
    (req, res, next) => {
        req.body.listing.owner = res.locals.currentUser._id;
        console.log(req.body.listing);
        next();
    },
    validateListing,
    wrapAsync(async (req, res, next) => {
        // FIXED: Removed duplicate internal schema validation call since middleware does it
        const newListing = new Listing(req.body.listing);

        await newListing.save();
        req.flash("success", "listing created succesfully");
        res.redirect("/listings");
    }),
);

//Update Listing Route
router.put(
    "/:id",
    authenticat,
    isOwner,
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
        req.flash("success", "Listing Updated Succesfully!");
        res.redirect(`/listings/${id}`);
    }),
);

//Delete Listing Route
router.delete(
    "/:id",
    authenticat,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted Succesfully!");
        res.redirect("/listings");
    }),
);
export default router;
