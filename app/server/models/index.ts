import adminSchema from "./Admin";
import userSchema from "./User";
import collectionSchema from "./Collection";
import mongoose from "mongoose";

const Admin = mongoose.model("Manager", adminSchema)
const Collection = mongoose.model("Collection", collectionSchema);
const User = mongoose.model("User", userSchema);
export { Collection, Admin, User } 