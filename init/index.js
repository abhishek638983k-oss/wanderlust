import mongoose from "mongoose";
import Listing from "../models/listing.js";
import { sampleListings } from "./data.js";

const MONGO_URL =
    "mongodb://admin:Abhi6389%40@127.0.0.1:27017/wanderlust?authSource=wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");
}

async function initDB() {
    await Listing.deleteMany({});

    const formattedData = sampleListings.map((obj) => {
        return {
            ...obj,
            image: obj.image?.url || obj.image,
        };
    });

    await Listing.insertMany(formattedData);

    console.log("Data initialized");
}

main()
    .then(async () => {
        await initDB();
        await mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
