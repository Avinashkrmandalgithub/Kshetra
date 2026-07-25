import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Fingerprint,
  Lock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useVerifyData } from "../contaxts/verifyDataContext";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AadhaarValidation = () => {
  const [step, setStep] = useState("aadhaar"); // 'aadhaar' | 'otp' | 'success' | 'error'
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const { setVerifyData } = useVerifyData();

  // --- Logic unchanged as requested ---
  const handleAadhaarSubmit = async (e) => {
    e.preventDefault();
    if (aadhaar.length === 12) {
      try {
        setIsLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/aadhar/send-otp`,
          {
            aadharNumber: aadhaar,
          },
        );
        const refId = res.data?.data?.data?.reference_id;
        setReferenceId(refId);
        setStep("otp");
      } catch (error) {
        console.error(error);
        setStep("error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/aadhar/verify-otp`,
        {
          reference_id: referenceId,
          otp: otp,
        },
      );
      const status = res.data?.data?.data?.status;
      if (status === "VALID") {
        setVerifyData({
          aadhaar: aadhaar,
          name: res.data?.data?.data?.name,
          address: res.data?.data?.data?.full_address,
        });
        setStep("success");
      } else {
        setStep("error");
      }
    } catch (error) {
      console.error(error);
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("aadhaar");
    setAadhaar("");
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit',sans-serif] selection:bg-[#F0C020] overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto grid lg:grid-cols-2 border-b-4 border-black min-h-[calc(100vh-80px)]">
        {/* LEFT PANEL: CONTENT & FORM */}
        <section className="p-8 md:p-12 lg:p-20 flex flex-col justify-center border-r-0 lg:border-r-4 border-black bg-white">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0C020] border-2 border-black font-black text-[10px] uppercase mb-6 shadow-[3px_3px_0px_0px_black] tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Secure UIDAI Gateway
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
              Verify <br />
              <span className="text-[#D02020]">Identity.</span>
            </h1>

            <p className="text-xl font-medium text-gray-800 max-w-sm border-l-8 border-[#1040C0] pl-6 py-2 leading-tight">
              Link your Aadhaar to LandChain to establish legal ownership on the
              ledger.
            </p>
          </div>

          <div className="relative max-w-md w-full">
            {/* Bauhaus Decorative Circle */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#F0C020] rounded-full border-4 border-black z-0" />

            <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_black] p-8 md:p-10 relative z-10 overflow-hidden">
              {/* STEP 1: Aadhaar Input */}
              {step === "aadhaar" && (
                <form onSubmit={handleAadhaarSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="block font-black uppercase tracking-[0.2em] text-xs text-gray-500">
                      Aadhaar Number (12 Digits)
                    </label>
                    <div className="relative group">
                      <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-black group-focus-within:text-[#1040C0] transition-colors" />
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="0000 0000 0000"
                        value={aadhaar}
                        onChange={(e) =>
                          setAadhaar(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full pl-16 pr-4 py-5 border-4 border-black text-2xl font-black focus:outline-none focus:bg-[#F0C020]/10 focus:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all tracking-widest"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="w-2 h-2 rounded-full bg-[#D02020]" />
                      <p className="text-[10px] font-bold uppercase tracking-tighter italic">
                        AES-256 Bit Government Grade Encryption
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={aadhaar.length !== 12 || isLoading}
                    className={`w-full py-5 border-4 border-black font-black uppercase tracking-[0.15em] flex items-center justify-center gap-4 transition-all text-lg
                      ${
                        aadhaar.length === 12
                          ? "bg-[#F0C020] text-black shadow-[6px_6px_0px_0px_black] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_black] active:translate-y-1 active:shadow-none"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                      }`}
                  >
                    {isLoading ? "Verifying..." : "Initialize"}
                    {!isLoading && <ArrowRight className="w-6 h-6 stroke-3" />}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP Input */}
              {step === "otp" && (
                <form
                  onSubmit={handleOtpSubmit}
                  className="space-y-8 animate-in fade-in slide-in-from-right duration-500"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="font-black uppercase tracking-[0.2em] text-xs text-gray-500">
                        Secure OTP
                      </label>
                      <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                        SENT
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-600 leading-snug">
                      Verification code sent to the mobile linked with your
                      UIDAI record.
                    </p>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-black" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full pl-16 pr-4 py-5 border-4 border-black text-4xl tracking-[0.8em] font-black focus:outline-none focus:bg-[#D02020]/5 transition-colors placeholder:tracking-normal placeholder:opacity-20"
                        required
                      />
                    </div>
                  </div>

                  <button
                    disabled={otp.length !== 6 || isLoading}
                    className={`w-full py-5 border-4 border-black font-black uppercase tracking-[0.15em] flex items-center justify-center gap-4 transition-all text-lg
                      ${
                        otp.length === 6
                          ? "bg-[#D02020] text-white shadow-[6px_6px_0px_0px_black] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
                          : "bg-gray-200 cursor-not-allowed opacity-60 text-gray-400"
                      }`}
                  >
                    {isLoading ? "Validating..." : "Confirm Access"}
                    {!isLoading && <ShieldCheck className="w-6 h-6 stroke-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("aadhaar")}
                    className="w-full text-center font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    ← Edit Aadhaar Number
                  </button>
                </form>
              )}

              {/* SUCCESS & ERROR STATES (Refined) */}
              {step === "success" && (
                <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-[#1040C0] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_black]">
                    <CheckCircle2 className="w-12 h-12 text-white stroke-3" />
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
                    Identity <br /> Confirmed
                  </h3>
                  <p className="text-sm font-bold text-gray-600 mb-10 tracking-tight">
                    Your credentials have been matched successfully with the
                    UIDAI registry.
                  </p>
                  <Link to="/verify-land">
                    <button
                        className="w-full py-4 bg-black text-white border-4 border-black font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#1040C0] hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                        Proceed
                    </button>
                  </Link>
                </div>
              )}

              {step === "error" && (
                <div className="text-center py-10 animate-in shake">
                  <div className="w-24 h-24 bg-[#D02020] border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_black] rotate-3">
                    <XCircle className="w-12 h-12 text-white stroke-3" />
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
                    Verification <br /> Failed
                  </h3>
                  <p className="text-sm font-bold text-gray-600 mb-10">
                    The information provided does not match our security
                    parameters.
                  </p>
                  <button
                    onClick={reset}
                    className="w-full py-4 bg-[#F0C020] border-4 border-black font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_black] active:translate-y-1 transition-all"
                  >
                    Restart
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: GEOMETRIC ART (Architectural Vibe) */}
        <section className="bg-[#1040C0] relative overflow-hidden flex items-center justify-center p-12 lg:p-20">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#fff 2.5px, transparent 2.5px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative w-full max-w-md aspect-4/5 flex items-center justify-center">
            {/* Background Composition */}
            <div className="absolute top-0 right-0 w-64 h-64 border-8 border-black rounded-full opacity-20 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-12 bg-[#D02020] border-4 border-black -rotate-12 translate-y-10" />

            {/* Central Focal Card */}
            <div className="relative z-20 w-72 bg-white border-8 border-black shadow-[20px_20px_0px_0px_black] flex flex-col">
              <div className="h-48 bg-[#121212] p-6 flex flex-col justify-between border-b-8 border-black relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#F0C020] rotate-45" />
                <span className="text-[#F0F0F0] font-black tracking-widest text-xs uppercase z-10">
                  System_Auth_v2
                </span>
                <div className="w-12 h-12 border-4 border-white flex items-center justify-center z-10">
                  <div className="w-4 h-4 bg-[#D02020] animate-ping" />
                </div>
              </div>
              <div className="p-6 space-y-4 grow bg-white">
                <div className="h-4 w-full bg-black/5 border-2 border-black/10" />
                <div className="h-4 w-3/4 bg-black/5 border-2 border-black/10" />
                <div className="pt-4">
                  <div className="h-12 w-full border-4 border-black bg-[#F0C020] flex items-center justify-center shadow-[4px_4px_0px_0px_black]">
                    <span className="text-[12px] font-black uppercase tracking-tighter">
                      Identity_Secured
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Accents */}
            <div className="absolute top-[15%] left-0 w-12 h-12 bg-[#D02020] border-4 border-black rounded-none rotate-45 z-10 shadow-[4px_4px_0px_0px_black]" />
            <div className="absolute bottom-[20%] right-[-5%] w-20 h-20 bg-white border-4 border-black rounded-full z-10 flex items-center justify-center shadow-[8px_8px_0px_0px_black]">
              <div className="w-8 h-8 bg-black rounded-full" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AadhaarValidation;
