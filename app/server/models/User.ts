import mongoose from "mongoose";

const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };


const userSchema = new Schema({
    pubkey: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    staked_nfts: [String],
    phoenix_relation: {
        type: String,
        enum: ['Hobby',
            'Loyal',
            'DieHard',
            'Whale',
            'None',],
        required: true,
        trim: true,
        default: 'None',
    }

}, opts)



// const User = mongoose.model("User", userSchema);
export default userSchema;
