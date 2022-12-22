import mongoose from "mongoose";
import { randomUUID } from "crypto";
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };


const collectionSchema = new Schema({
    idx: String,
    name: String,
    pda: String,
    reward_mint: String,
    reward_wallet: String,
    phoenix_relation: {
        type: String,
        enum: ['Affiliate',
            'Founder',
            'Member',
            'Saved',
            'None',],
        required: true,
        trim: true,
        default: 'None',
    },
    paid_sig: {
        type: String,
        trim: true,
        // required: true,
    },
    hashlist: [String],


}, opts)
// const Collection = mongoose.model("Collection", collectionSchema);
collectionSchema.pre('save', function (next) {
    if (!this.idx) {
        this.idx = randomUUID();
    }
    next();
});

export default collectionSchema;