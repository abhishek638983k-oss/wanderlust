import multer from "multer";
import { storage } from "../cloudConfig.js";

const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        return callback(null, true);
    }

    const error = new Error("Only JPEG, JPG, and PNG images are allowed.");
    error.status = 400;
    callback(error, false);
};

export const uploadListingImage = multer({
    storage: storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
