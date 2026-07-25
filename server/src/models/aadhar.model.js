import { Schema, model } from "mongoose";

const addressSchema = new Schema({
    house : {
        type : String,
    },
    street : {
        type : String,
    },
    landmark : {
        type : String,
    },
    vtc : {
        type : String,
    },
    subdistrict : {
        type : String,
    },
    district : {
        type : String,
    },
    post_office : {
        type : String,
    },
    state : {
        type : String,
    },
    country : {
        type : String,
    },
    pincode : {
        type : Number,
    }
}, { _id: false })

const aadharSchema = new Schema({
    verified : {
        type : Boolean,
        default : false
    },
    name: {
        type: String,
    },
    full_address: {
        type: String,
    },
    date_of_birth: {
        type: String,
    },
    gender: {
        type: String,
    },
    care_of : {
        type: String,
    },
    address: addressSchema,
    photo: {
        type: String,
    },
    has_photo: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Aadhar = model("Aadhar", aadharSchema)

export default Aadhar;