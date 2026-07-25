import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/UI/Button.jsx";
import { BrowserProvider, ethers } from 'ethers';
import { keccak256, toUtf8Bytes } from "ethers";
import contract from "../contracts/LandRegistry.sol/AllLandRegistry.json"
import SuccessPage from "./SuccessPage.jsx";
import { useVerifyData } from "../contaxts/verifyDataContext.jsx";

export default function SubmitBlockchain() {
  const { verifyData } = useVerifyData();
  const { ethereum } = window;
  const [formData, setFormData] = useState({
    fullName: verifyData.name || "",
    aadhaarNo: verifyData.aadhaar || "",
    plotNo: verifyData.PlotNumber || "",
    area: verifyData.area || "",
    location: verifyData.Location || "",
  });
  const [blocksubmit,setBlocksubmit]=useState(false)
  const [BlockData,setBlockData]=useState({})
  // 2. Single Unified State for File/Image Data
  const [fileData, setFileData] = useState({
    file: null, // Actual File object
    previewUrl: null, // Blob URL for image preview
    name: "", // File name
    size: "", // File size in KB
    type: "", // MIME type
  });
  const [ipfsimge, setipfsimg] = useState('')
  const [imagefile, setImagefile] = useState()
  const [loder, setLoder] = useState(false)
  // 3. Track IPFS Step: "idle" | "pending" | "uploaded"
  const [ipfsStatus, setIpfsStatus] = useState("idle");

  // --- HANDLERS ---

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const isImage = selectedFile.type.startsWith("image/");
      const preview = isImage ? URL.createObjectURL(selectedFile) : null;
      const fileSizeKB = (selectedFile.size / 1024).toFixed(2);

      const newFileData = {
        file: selectedFile,
        previewUrl: preview,
        name: selectedFile.name,
        size: fileSizeKB,
        type: selectedFile.type,
      };

      setFileData(newFileData);
      setImagefile(selectedFile)
      setIpfsStatus("pending"); // Ready to upload to IPFS

      console.log("==== FILE SELECTED & STATE UPDATED ====");
      console.log(newFileData);
    }
  };

  // Action 1: Upload to IPFS (Instant State Change & Log)
  const handleIPFSUpload = async (e) => {
    e.preventDefault();
    setIpfsStatus('pending');
    setLoder(true)
    if (!fileData.file) return;
    const imgdata = new FormData();
    imgdata.append("file", imagefile);
    const requesturl = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    const uploadrequest = await fetch(requesturl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: imgdata
    })

    const upload = await uploadrequest.json()
    console.log(upload)
    setipfsimg(upload.IpfsHash)

    console.log(imagefile);
    setLoder(false)
    // Instantly update status to allow minting
    setIpfsStatus("uploaded");
  };

  // Action 2: Mint to Blockchain
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoder(true)
    if (fileData.file && ipfsStatus !== "uploaded") {
      alert("Please upload the document to IPFS first!");
      return;
    }
    const hashedId = keccak256(toUtf8Bytes(formData.aadhaarNo));
    const WalletProvider = new BrowserProvider(ethereum);
    const singer = await WalletProvider.getSigner();
    const submitLandDatatnx = new ethers.Contract(
      import.meta.env.VITE_CONTRACT_DEPOLY_ADDRESS,
      contract.abi,
      singer
    )
    const Landdata = await submitLandDatatnx.AddNewLand(
      formData.fullName,
      hashedId,
      formData.plotNo,
      formData.area,
      formData.location,
      ipfsimge
    )
    await Landdata.wait();
    setBlockData(Landdata)
    console.log(Landdata);
    setLoder(false)
    setBlocksubmit(true)
    // Guard: Ensure file is uploaded to IPFS if selected
  };

  // Action: Clear Form
  const clearForm = () => {
    setFormData({
      fullName: "",
      aadhaarNo: "",
      plotNo: "",
      area: "",
      location: "",
    });
    setFileData({
      file: null,
      previewUrl: null,
      name: "",
      size: "",
      type: "",
    });
    setIpfsStatus("idle");
    console.log("==== FORM CLEARED ====");
  };
if(blocksubmit){
  return(
    <>
     <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit'] flex flex-col">

    <SuccessPage hash={BlockData.hash} aadher={formData.aadhaarNo} />
    </div>
    </>
  )
}
  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit'] flex flex-col">
      <Navbar />

      <main className="grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl bg-white border-4 border-[#121212] shadow-[12px_12px_0px_0px_#121212] relative">
          {/* Header Strip */}
          <div className="bg-[#1040C0] p-6 border-b-4 border-[#121212] flex flex-col md:flex-row justify-between items-center text-white">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                Mint Land NFT
              </h1>
              <p className="font-bold tracking-widest text-[#F0C020] uppercase text-sm mt-1">
                Secure Registry Protocol
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#121212] border-2 border-[#F0C020] px-4 py-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-bold font-mono text-sm tracking-wider">
                0x71C...9A23
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {/* 2-Column Grid for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col">
                <label className="text-xl font-black uppercase tracking-tight mb-2 flex justify-between">
                  <span>Legal Full Name</span>
                  <span className="text-[#D02020] text-sm pt-1">
                    Sandbox API Ready
                  </span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter as per Govt ID"
                  value={formData.fullName}
                  onChange={handleChange}
                  readOnly
                  required
                  className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#D02020] transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-black uppercase tracking-tight mb-2 flex justify-between">
                  <span>Aadhaar Number</span>
                  <span className="text-[#D02020] text-sm pt-1">
                    Sandbox API Ready
                  </span>
                </label>
                <input
                  type="text"
                  name="aadhaarNo"
                  placeholder="12-Digit Identity Number"
                  value={formData.aadhaarNo}
                  onChange={handleChange}
                  readOnly
                  maxLength={12}
                  required
                  className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#D02020] transition-all tracking-widest"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-black uppercase tracking-tight mb-2">
                  Plot / Survey No.
                </label>
                <input
                  type="text"
                  name="plotNo"
                  placeholder="e.g. S-124/B"
                  value={formData.plotNo}
                  onChange={handleChange}
                  readOnly
                  required
                  className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#1040C0] transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-black uppercase tracking-tight mb-2">
                  Total Area (Sq. Ft.)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="area"
                    placeholder="2400"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full p-4 border-4 border-r-0 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#1040C0] transition-all"
                  />
                  <div className="bg-[#121212] text-white flex items-center justify-center px-4 border-4 border-[#121212] font-bold uppercase">
                    Sq Ft
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-8">
              <label className="text-xl font-black uppercase tracking-tight mb-2">
                Physical Location / Address
              </label>
              <textarea
                name="location"
                placeholder="Complete property address with pincode..."
                value={formData.location}
                onChange={handleChange}
                required
                readOnly
                rows="3"
                className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#F0C020] transition-all resize-none"
              ></textarea>
            </div>

            {/* Image / Document Upload */}
            <div className="flex flex-col mb-10">
              <label className="text-xl font-black uppercase tracking-tight mb-2 flex justify-between">
                <span>Property Image / Deed Document</span>
                {ipfsStatus === "uploaded" && (
                  <span className="text-[#1040C0] text-sm pt-1">
                    IPFS Verified
                  </span>
                )}
              </label>

              <div
                className={`relative border-4 border-dashed border-[#121212] p-8 text-center transition-colors group cursor-pointer ${ipfsStatus === "uploaded" ? "bg-[#1040C0]/10 border-solid border-[#1040C0]" : "bg-[#F0C020]/10 hover:bg-[#F0C020]/20"}`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required={ipfsStatus === "idle"}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                  {fileData.previewUrl ? (
                    <div className="z-20 flex flex-col items-center">
                      <img
                        src={fileData.previewUrl}
                        alt="Preview"
                        className="h-40 w-auto object-cover border-4 border-[#121212] mb-4 shadow-[4px_4px_0px_0px_#121212]"
                      />
                      <p
                        className={`font-bold text-xl bg-white border-2 border-[#121212] px-4 py-1 mb-2 ${ipfsStatus === "uploaded" ? "text-[#1040C0]" : "text-[#121212]"}`}
                      >
                        {fileData.name} ({fileData.size} KB)
                      </p>
                    </div>
                  ) : fileData.file ? (
                    <div className="z-20 flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 bg-[#121212] flex justify-center items-center">
                        <div className="text-white font-bold text-xl">PDF</div>
                      </div>
                      <p
                        className={`font-bold text-xl bg-white border-2 border-[#121212] px-4 py-1 mb-2 ${ipfsStatus === "uploaded" ? "text-[#1040C0]" : "text-[#121212]"}`}
                      >
                        {fileData.name} ({fileData.size} KB)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 flex justify-center items-center transition-transform duration-300 bg-[#121212] group-hover:-translate-y-2">
                        <div className="w-0 h-0 border-l-12 border-r-12 border-b-20 border-l-transparent border-r-transparent border-b-[#F0F0F0]"></div>
                      </div>
                      <p className="font-black uppercase text-xl text-[#121212]">
                        Click or Drag to Upload
                      </p>
                      <p className="font-medium text-[#121212]/70 mt-1">
                        JPG, PNG or PDF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 border-t-4 border-[#121212] pt-8">
              {/* Single Button that changes type and onClick based on state */}
              <Button
                variant="primary"
                className="w-full md:w-2/3 text-xl py-4 flex justify-center items-center gap-3 transition-all"
                type={ipfsStatus === "pending" ? "button" : "submit"}
                onClick={
                  ipfsStatus === "pending" ? handleIPFSUpload : undefined
                }
              >
                {ipfsStatus === "pending"
                  ? loder ? <> <div
                    className="w-6 h-6 mr-3 border-4 rounded-full border-white border-t-black border-r-black animate-spin"
                    role="status"
                    aria-label="loading"
                  ></div>
                    UPLOADING...</> : "Upload to IPFS"
                  :loder ? <> <div
                    className="w-6 h-6 mr-3 border-4 rounded-full border-white border-t-black border-r-black animate-spin"
                    role="status"
                    aria-label="loading"
                  ></div>
                    SUBMITTING...</> :  "Mint to Blockchain"}
              </Button>

              <button
                type="button"
                className="w-full md:w-1/3 bg-white text-[#121212] border-4 border-[#121212] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors py-4 active:translate-y-1"
                onClick={clearForm}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
