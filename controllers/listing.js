import Listing from "../models/listing.js";

export const newListingForm = (req, res) => {
    res.render("listings/new.ejs", { title: "New Listing" });
};

export const editListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {
        listing,
        title: "Edit Your Listing",
    });
};

export const showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "owner",
            },
        });
    const title = "Detailed Listing";
    res.render("listings/show.ejs", { title, listing });
};

export const allListings = async (req, res) => {
    const allListings = await Listing.find({});
    const title = "Home";
    res.render("listings/index.ejs", { title, allListings });
};

export const newListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "listing created succesfully");
    res.redirect("/listings");
};

export const editListing = async (req, res) => {
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
};

export const deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Succesfully!");
    res.redirect("/listings");
};
