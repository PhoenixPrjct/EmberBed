import mongoose from "mongoose";

const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };


const adminSchema = new Schema({
    pubkey: String,
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection", }]
}, opts)
// const Manager = mongoose.model("Manager", managerSchema);
export default adminSchema;