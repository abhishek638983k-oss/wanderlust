import mongoose from "mongoose";

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

export default async () => {
    await mongoose
        .connect(MONGO_URL)
        .then(() => {
            console.log("connected to DB");
        })
        .catch((err) => {
            console.log(err);
        });
};
