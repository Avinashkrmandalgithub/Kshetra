import { Router } from "express";
import {
    sendOTPByAadhar,
    verifyAadharOTP
} from "../controller/aadhar.controller.js";
import verifyAadhar from "../middlewares/authorization.middleware.js";

const router = Router();

router.route("/send-otp").post(verifyAadhar, sendOTPByAadhar)
router.route("/verify-otp").post(verifyAadhar, verifyAadharOTP)

export default router;