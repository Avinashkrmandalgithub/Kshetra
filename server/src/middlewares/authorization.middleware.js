import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import tmpData from '../tmp/data.js'

const xApi = process.env.API_KEY;
const xSecret = process.env.API_SECRET;

const verifyAadhar = asyncHandler(async (req, res, next) => {
    console.log({token: tmpData.get('access_token')})
    if (tmpData.has('access_token')) {
        return next();
    }

    const options = {
        method: 'POST',
        headers: {
            'x-api-key': xApi,
            'x-api-secret': xSecret
        }
    };

    const response = await fetch(`https://api.sandbox.co.in/authenticate`, options);
    const data = await response.json();

    if (response.ok) {
        console.log('Aadhar verification successful:', {data});
        if(data?.access_token) {
            tmpData.set('access_token', data.access_token);
        }
        console.log({tokenEnd: tmpData.get('access_token')})
        next();
    } else {
        throw new ApiError('Failed to verify Aadhar', 401);
    }
})

export default verifyAadhar