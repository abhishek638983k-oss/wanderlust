import Listing from "../models/listing.js";
import Review from "../models/review.js";

export const authenticat = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "signup or login required");
        return res.redirect("/auth/login");
    }
    next();
};

export const saveRedirectURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};

export const isOwner = async (req, res, next) => {
    const currListing = await Listing.findById(req.params.id);
    if (!currListing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "This action is not allowed!");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};

export const isReviewOwner = async (req, res, next) => {
    const currRevirwe = await Review.findById(req.params.reviewId);
    if (!currRevirwe.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "This action is not allowed!");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};
