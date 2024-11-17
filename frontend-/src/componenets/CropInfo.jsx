import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const CropInfo = () => {
  const [searchParams] = useSearchParams();
  const crop = searchParams.get("crop"); // Get crop name from URL query parameters
  const [chatResponse, setChatResponse] = useState("");
  const location = useLocation();

  // If crop details were passed from NavBar, use them
  const cropDetails = location.state?.cropDetails;

  useEffect(() => {
    if (!cropDetails && crop) {
      setChatResponse("Fetching details...");
      // If no cropDetails were passed, you could initiate a fetch here if necessary
    } else if (cropDetails) {
      setChatResponse(cropDetails); // Set the details from NavBar API call
    }
  }, [cropDetails, crop]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #00C853 0%, #B2FF59 100%)",
      }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <h1 className="text-3xl font-bold mb-4">Crop Information</h1>
      {crop ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <p className="text-lg font-semibold mb-2">Crop Details:</p>
          <p className="text-gray-700">{chatResponse}</p>
        </div>
      ) : (
        <p className="text-red-500">No crop specified. Please search for a crop.</p>
      )}
    </div>
  );
};

export default CropInfo;
