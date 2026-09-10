import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        required: true,
        immutable: true,
    },
});
userSchema.plugin(passportLocalMongoose.default);
const User = mongoose.model("User", userSchema);

export default User;
