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
    const { type, tags } = req.query;
    let filter = {};
    let tagArray = [];

    if (type) {
        filter.type = type;
    }

    if (tags) {
        if (Array.isArray(tags)) {
            // Handles form submission with multiple checkboxes (?tags=Beachfront&tags=Cabins)
            tagArray = tags.flatMap((tag) =>
                String(tag)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            );
        } else if (typeof tags === "string") {
            // Handles single checkbox or comma-separated string (?tags=Beachfront,Cabins)
            tagArray = tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
        }

        filter.tags = { $in: tagArray };
    }
    const allListings = await Listing.find(filter);
    const title = req.query.type || "Home";
    res.render("listings/index.ejs", { title, allListings, tagArray });
};
export const newListing = async (req, res) => {
    const newListing = new Listing({
        ...req.body.listing,
        image: {
            filename: req.file.filename,
            url: req.file.path,
        },
    });
    await newListing.save();
    req.flash("success", "listing created succesfully");
    res.redirect("/listings");
};

export const editListing = async (req, res) => {
    let { id } = req.params;
    const listingData = { ...req.body.listing };

    if (req.file) {
        listingData.image = {
            filename: req.file.filename,
            url: req.file.path,
        };
    }

    await Listing.findByIdAndUpdate(id, listingData, {
        new: true,
        runValidators: true,
    });
    req.flash("success", "Listing Updated Succesfully!");
    res.redirect(`/listings/${id}`);
};

export const deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Succesfully!");
    res.redirect("/listings");
};
