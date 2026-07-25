import React, { useState, createContext, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import LandVerify from "./pages/LandVerify.jsx";
import SubmitBlockchain from "./pages/SubmitBlockchain.jsx";
import AadhaarValidation from "./pages/AadhaarValidation.jsx";
import Loader from "./components/Loader.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import CheckLand from "./pages/CheckLand.jsx";
import SliceBuy from "./pages/SliceBuy.jsx";

// Context for Global Navigation
const NavContext = createContext();
export const useNav = () => useContext(NavContext);

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const navigateWithLoader = (path) => {
    if (window.location.pathname === path) return; // Don't reload if already on page

    setIsLoading(true);

    // 1.5 seconds delay for the cool animation
    setTimeout(() => {
      navigate(path);
      // Extra 200ms to ensure the new page components are ready before hiding loader
      setTimeout(() => setIsLoading(false), 200);
    }, 1500);
  };

  return (
    <NavContext.Provider value={{ navigateWithLoader }}>
      {/* Global Loader Overlay */}
      {isLoading && <Loader />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify-land" element={<LandVerify />} />
        <Route path="/verify-aadhaar" element={<AadhaarValidation />} />
        <Route path="/submit-blockchain" element={<SubmitBlockchain />} />
        <Route path="/check-assets" element={<CheckLand />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/slice-buy" element={<SliceBuy />} />
      </Routes>
    </NavContext.Provider>
  );
};

export default App;
