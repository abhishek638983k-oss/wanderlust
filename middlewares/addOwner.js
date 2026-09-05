export const addOwner = (req, res, next) => {
    req.body.listing.owner = res.locals.currentUser._id;
    next();
};

export const addOwnerReviewe = (req, res, next) => {
    req.body.listing.owner = res.locals.currentUser._id;
    next();
};
