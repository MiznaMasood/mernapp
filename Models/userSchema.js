import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: String, // updated from 'user' to 'email'
    password: String
});

const userModel = mongoose.model("User",userSchema)

export default userModel;