// import dotenv from "dotenv";
// const environment = process.env.NODE_ENV || "development";

// if (environment !== "production") {
//     dotenv.config();
// }

import express from "express";
import path from "path";
import methodOverride from "method-override";
import ejsmate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import { fileURLToPath } from "url";

import ExpressError from "./utils/ExpressError.js";
import User from "./models/users.js";
import listingRoute from "./routes/listing.js";
import reviewRoute from "./routes/review.js";
import authRoute from "./routes/auth.js";
import connectDB from "./config/db.js";

const app = express();
await connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionOptions = {
    secret: "abhishek",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    },
};
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.isLogin = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/auth", authRoute);
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
