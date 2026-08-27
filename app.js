import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import ejsmate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { validateListing } from "./ListingSchema.js";

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//Index Route
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        const title = "Home";
        res.render("listings/index.ejs", { title, allListings });
    }),
);

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs", { title: "New Listing" });
});

//Show Route
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        const title = "Detailed Listing";
        res.render("listings/show.ejs", { title, listing });
    }),
);

//Create Route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {
        listingSchema.validate(req.body);
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }),
);

//Edit Route
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {
            listing,
            title: "Edit Your Listing",
        });
    }),
);

//Update Route
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    }),
);

//Delete Route
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    }),
);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    const status = err.status ?? err.statusCode ?? 500;
    res.status(status).render("listings/error.ejs", {
        title: "ERROR",
        err,
        status,
    });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
