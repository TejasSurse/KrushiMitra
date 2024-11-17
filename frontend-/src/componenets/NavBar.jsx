import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (search.trim()) {
      try {
        // Make the API call to fetch crop details
        const response = await axios.post("http://localhost:8080/search", {
          cropName: search.trim(),
        });

        // Navigate to CropInfo page and pass response via state
        navigate(`/crop-info?crop=${encodeURIComponent(search.trim())}`, {
          state: { cropDetails: response.data.data },  // Pass the response here
        });
      } catch (error) {
        console.error("Error fetching crop details:", error);
      }
    }
  };

  return (
    <nav className="w-full bg-green-600 text-white py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold">KrushiMitra</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search Crop Info"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-2 px-4 rounded-lg text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-white text-green-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-200"
        >
          Search
        </button>
        <a
          href="https://plant-species-identification-zwez.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
         Plant identy
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
