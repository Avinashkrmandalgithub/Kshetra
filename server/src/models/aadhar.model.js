import { Schema, model } from "mongoose";

const addressSchema = new Schema({
    country: {
        type: String,
    },
    district: {
        type: String,
    },
    house: {
        type: String,
    },
    landmark: {
        type: String,
    },
    pincode: {
        type: String,
    },
    post_office: {
        type: String,
    },
    state: {
        type: String,
    },
    street: {
        type: String,
    },
    subdistrict: {
        type: String,
    },
    vtc: {
        type: String,
    }
}, { _id: false })

const aadharSchema = new Schema({
    name: {
        type: String,
    },
    full_address: {
        type: String,
    },
    date_of_birth: {
        type: String,
    },
    email_hash: {
        type: String,
    },
    gender: {
        type: String,
    },
    address: addressSchema,
    year_of_birth: {
        type: String,
    },
    mobile_hash: {
        type: String,
    },
    photo: {
        type: String,
    }
}, { timestamps: true })

const Aadhar = model("Aadhar", aadharSchema)

export default Aadhar;