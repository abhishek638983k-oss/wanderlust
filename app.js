import express from "express";
import path from "path";
import methodOverride from "method-override";
import ejsmate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import { fileURLToPath } from "url";
import listingRoute from "./routes/listing.js";
import reviewRoute from "./routes/review.js";
import connectDB from "./config/db.js";

const app = express();
await connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//root route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

let chek = (req, res, next) => {
    console.log("review req recived");
    next();
};

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);

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
    console.log("server is running at http://localhost:8080/");
});
