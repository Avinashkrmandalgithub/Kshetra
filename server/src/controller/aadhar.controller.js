import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import tmpData from "../tmp/data.js"
import Aadhar from "../models/aadhar.model.js"

const xApiKey = process.env.API_KEY;

const sendOTPByAadhar = asyncHandler(async (req, res) => {
    const { aadharNumber } = req.body
    if (!aadharNumber) {
        throw new ApiError(400, "aadhar number is required")
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            aadhaar_number: aadharNumber,
            authkey : xApiKey
        })
    };

    const response = await fetch('https://apitxt.com/api/aadhaarSendOTP', options);
    const data = await response.json();
    console.log({data})
    if (data.status > 200) {
        throw new ApiError(response.status, data.message || "Failed to send OTP")
    }

    return res.status(200).json(new ApiResponse(200, data, "OTP sent successfully"))
})

const verifyAadharOTP = asyncHandler(async (req, res) => {
    const { reference_id, otp } = req.body
    if (!reference_id || !otp) {
        throw new ApiError(400, "reference_id and otp are required")
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            authkey : xApiKey,
            reference_id: reference_id,
            otp: otp
        })
    };

    const response = await fetch('https://apitxt.com/api/aadhaarVerifyOTP', options);
    const data = await response.json();
    console.log({data})

    if (data.status > 200) {
        throw new ApiError(data.status, data.message || "Failed to verify OTP")
    }

    const aadharInfo = data.data;

    const aadharRecord = await Aadhar.create({
        verified : aadharInfo.verified,
        name: aadharInfo.name,
        full_address: aadharInfo.full_address,
        date_of_birth: aadharInfo.date_of_birth,
        gender: aadharInfo.gender,
        address: aadharInfo.address,
        photo: aadharInfo.photo,
        has_photo : aadharInfo.has_photo,
        care_of : aadharInfo.care_of,
    });

    return res.status(200).json(new ApiResponse(200, aadharRecord, "OTP verified successfully"))
})

export {
    sendOTPByAadhar,
    verifyAadharOTP
}