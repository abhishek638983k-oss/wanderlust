import express from "express";
import User from "../models/users.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectURL } from "../middlewares/authenticate.js";
let router = express.Router();

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
});

router.get("/signup", (req, res) => {
    res.render("listings/signup.ejs", { title: "Signup" });
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            if (existingUser.username === username) {
                req.flash("error", "Username already registered");
                return res.status(400).redirect("/auth/signup");
            }

            if (existingUser.email === email) {
                req.flash("error", "Email already registered");
                return res.status(400).redirect("/auth/signup");
            }
        }

        const newuser = new User({ email, username });

        const registeruser = await User.register(newuser, password);

        req.login(registeruser, (err) => {
            if (err) {
                req.flash(
                    "error",
                    "Something went wrong while logging you in.",
                );
                return res.status(500).redirect("/auth/signup");
            }

            req.flash("success", `Welcome to Wanderlust @${username}`);
            return res.redirect("/listings");
        });
    }),
);
router.get("/login", (req, res) => {
    res.render("listings/login.ejs", { title: "login" });
});
router.post(
    "/login",
    saveRedirectURL,
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: true,
    }),
    wrapAsync(async (req, res) => {
        const username = req.body.username;
        req.flash("success", `Welcome to Wanderlust @${username}`);
        delete req.session.redirectURL;
        res.redirect(res.locals.redirectURL || "/listings");
    }),
);

export default router;
