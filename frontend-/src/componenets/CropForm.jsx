import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { XCircleIcon } from "lucide-react";
import NavBar from "./NavBar";

const CropForm = () => {
  const [cityName, setCityName] = useState("");
  const [phosporous, setPhosporous] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [potassium, setPotassium] = useState("");
  const [ph, setPh] = useState("neutral"); // Set a default value
  const [moisture, setMoisture] = useState("");
  const [soilType, setSoilType] = useState("black"); // Set a default value
  const [waterAvailability, setWaterAvailability] = useState("moderate"); // Set a default value
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/submit", {
        cityname: cityName,
        phosporous,
        nitrogen,
        potassium,
        ph,
        moisture,
        soiltype: soilType,
        wateravailability: waterAvailability,
      });

      console.log(response);

      if (response.data.error) {
        setError("Something went wrong. Please try again.");
      } else {
        navigate("/recommend-crop", { state: { crops: response.data } });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #00C853 0%, #B2FF59 100%)",
      }}
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <NavBar />
      <h1 className="text-4xl font-bold text-white mb-8">KrushiMitra</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="cityname" className="block font-bold mb-2">
            City
          </label>
          <input
            type="text"
            name="cityname"
            placeholder="Enter Your City Name"
            required
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
          />
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2">Soil Data - For More Accuracy</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phosporous" className="block font-bold mb-2">
                Phosporous PPM
              </label>
              <input
                type="text"
                name="phosporous"
                placeholder="Ex 33.6kg/ha"
                value={phosporous}
                onChange={(e) => setPhosporous(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              />
            </div>
            <div>
              <label htmlFor="nitrogen" className="block font-bold mb-2">
                Nitrogen PPM
              </label>
              <input
                type="text"
                name="nitrogen"
                placeholder="ppm"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              />
            </div>
            <div>
              <label htmlFor="potassium" className="block font-bold mb-2">
                Potassium PPM
              </label>
              <input
                type="text"
                name="potassium"
                placeholder="ppm"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              />
            </div>
            <div>
              <label htmlFor="ph" className="block font-bold mb-2">
                pH Level
              </label>
              <select  
  id="ph"  
  name="ph"  
  value={ph}  
  onChange={(e) => setPh(e.target.value)}  
  className="border border-gray-300 rounded-lg py-2 px-4 w-full"  
>  
  <option value="very-acidic">Very Acidic (pH &lt; 5.0)</option>  
  <option value="moderately-acidic">Moderately Acidic (pH 5.0 - 6.0)</option>  
  <option value="slightly-acidic">Slightly Acidic (pH 6.0 - 6.5)</option>  
  <option value="neutral">Neutral (pH 6.5 - 7.5)</option>  
</select>


            </div>
            <div>
              <label htmlFor="moisture" className="block font-bold mb-2">
                Moisture PPM
              </label>
              <input
                type="text"
                name="moisture"
                placeholder="%"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              />
            </div>
            <div>
              <label htmlFor="soiltype" className="block font-bold mb-2">
                Soil Type
              </label>
              <select
                name="soiltype"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              >
                <option value="black">Black Soil (Regur Soil)</option>
                <option value="red">Red Soil</option>
                <option value="desert">Desert Soil</option>
                <option value="mountain">Mountain Soil</option>
                <option value="saline-alkaline">Saline and Alkaline Soil</option>
                <option value="peaty-marshy">Peaty and Marshy Soil</option>
              </select>
            </div>
            <div>
              <label htmlFor="wateravailability" className="block font-bold mb-2">
                Water Availability
              </label>
              <select
                name="wateravailability"
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              >
                <option value="high">High Availability</option>
                <option value="moderate">Moderate Availability</option>
                <option value="low">Low Availability</option>
                <option value="rainfed">Rain-fed Only</option>
                <option value="irrigated">Irrigated</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          Submit
        </button>
      </form>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
          <div className="bg-white text-black font-bold p-4 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-black hover:text-gray-500"
              onClick={handleCloseError}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <p className="text-lg">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropForm;
