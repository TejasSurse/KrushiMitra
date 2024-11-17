if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

const cors = require("cors");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
let MAPTOKEN = 'pk.eyJ1IjoidGVqYXMwMTAxIiwiYSI6ImNseXZjaG8ydjFmNjYyaXFsc2IyaWZhcDYifQ.sWbJnDj1kESUEG237t0TFA';
const geocodingClient = mbxGeoCoding({ accessToken: MAPTOKEN });
const API_KEY = "AIzaSyA2I4VwyBBeie0AfmooqKbFfSgi883C5IU";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(API_KEY);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


//==============================================================================================================================================================================
async function run(pastWeather, futureWeather, soilData) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const { phosphorusPPM, nitrogenPPM, potassiumPPM, pH, moisturePPM, soilType, waterAvailability } = soilData;

    // Construct the prompt dynamically based on the input data
    const prompt = `My city name is Mumbai. The latest weather data for my city shows:
    - Future 15 days data: ${JSON.stringify(futureWeather)}
    - Past three months weather data: ${JSON.stringify(pastWeather)}
    - Soil data of my farm:
      - Phosphorous PPM: ${phosphorusPPM}
      - Nitrogen PPM: ${nitrogenPPM}
      - Potassium PPM: ${potassiumPPM}
      - pH: ${pH}
      - Moisture PPM: ${moisturePPM}%
      - Soil Type: ${soilType}
      - Water Availability: ${waterAvailability}.
    Suggest at least 10 unique crops that are not generally farmed by farmers, with their market prices in rupees. Also include crops not traditionally used in Indian farming but are unique and suitable for this environment, along with their benefits. Respond in the following JSON format:
    {
        "unique_crops": [
            {
                "crop": "Crop Name",
                "market_price": "Price in Rupees",
                "benefits": "Short description"
            },
            ...
        ]
    }`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        // Parse JSON response
        const jsonText = response.slice(response.indexOf("{"), response.lastIndexOf("}") + 1).trim();
        const crops = JSON.parse(jsonText).unique_crops;

        console.log("Generated Crops:", crops);
        return crops;
    } catch (error) {
        console.error("Error generating crops:", error.message);
        throw new Error("Failed to process the generative AI model response.");
    }
}


app.post("/search", async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    // Assuming 'input' comes from the request body, not from params
    const { cropName } = req.body;  // Adjust this based on how you're passing data

    if (!cropName) {
        return res.status(400).send({ error: "Crop name is required in the request body" });
    }

    const prompt = `My crop name is ${cropName}. If its not any crop just say Not a Crop...Please try again..- and if its
    a crop  give answer of 6 lines .`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response.text();  // Await the response text
        console.log(response);
        

        // Send the response to the client
        res.send({ data: response });
    } catch (error) {
        console.error("Error generating crops:", error);
        res.status(500).send({ error: "Error generating the crop information" });
    }
});





//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Weather Calculation Function 
// Functions to Return Past Three month weather and forecast future 16 days weather is Ready here it also returns some soil data in that 
let getAveragedata = (arr) => {
    let len = arr.length;
    let sum = 0;
    for (let a of arr) {
        sum += a;
    }
    return sum / len;
}
let futureWeather;
let pastThreeMonths;



async function getWeatherPast(lati, long) {
    let weather = await fetch(`https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&start_date=2024-09-20&end_date=2024-10-03&hourly=temperature_2m,relative_humidity_2m,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,soil_temperature_0cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_27_to_81cm&daily=uv_index_max,uv_index_clear_sky_max`);
    let data = await weather.json();

    // Create objects for each parameter
    pastThreeMonths = {
        temperature2m: getAveragedata(data.hourly.temperature_2m),
        relativeHumidity2m: getAveragedata(data.hourly.relative_humidity_2m),
        surfacePressure: getAveragedata(data.hourly.surface_pressure),
        cloudCover: getAveragedata(data.hourly.cloud_cover),
        cloudCoverLow: getAveragedata(data.hourly.cloud_cover_low),
        cloudCoverMid: getAveragedata(data.hourly.cloud_cover_mid),
        cloudCoverHigh: getAveragedata(data.hourly.cloud_cover_high),
        windSpeed10m: getAveragedata(data.hourly.wind_speed_10m),
        soilTemperature0cm: getAveragedata(data.hourly.soil_temperature_0cm),
        soilTemperature54cm: getAveragedata(data.hourly.soil_temperature_54cm),
        soilMoisture0To1cm: getAveragedata(data.hourly.soil_moisture_0_to_1cm),
        soilMoisture27To81cm: getAveragedata(data.hourly.soil_moisture_27_to_81cm),
        uvIndexMax: getAveragedata(data.daily.uv_index_max),
        uvIndexClearSkyMax: getAveragedata(data.daily.uv_index_clear_sky_max)
    };

    return pastThreeMonths;
}

async function getWeatherFuture(lati, long) {
    let weatherFuture = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,rain,showers,pressure_msl,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,evapotranspiration,wind_speed_10m,wind_speed_180m,wind_direction_80m,wind_direction_180m,temperature_80m,temperature_180m,soil_temperature_0cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_27_to_81cm&daily=temperature_2m_max,temperature_2m_min,sunrise,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=GMT&past_days=1&forecast_days=16`);
    let dataFuture = await weatherFuture.json();

    // Create objects for each parameter with averages
    futureWeather = {
        temperature2m: getAveragedata(dataFuture.hourly.temperature_2m),
        relativeHumidity2m: getAveragedata(dataFuture.hourly.relative_humidity_2m),
        precipitationProbability: getAveragedata(dataFuture.hourly.precipitation_probability),
        windSpeed10m: getAveragedata(dataFuture.hourly.wind_speed_10m),
        cloudCover: getAveragedata(dataFuture.hourly.cloud_cover),
        uvIndexMax: getAveragedata(dataFuture.daily.uv_index_max),
        temperature2mMax: getAveragedata(dataFuture.daily.temperature_2m_max),
        temperature2mMin: getAveragedata(dataFuture.daily.temperature_2m_min)
    };

    return futureWeather;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.send("Welcome to the Crop Recommendation API");
});

// api for getting crops 
app.post("/submit", async (req, res) => {
    // Reset variables before processing a new request
    futureWeather = null;
    pastThreeMonths = null;
    console.log(req.body)
    // Extract form data from the request body
    const {
        cityname,
        phosporous: phosphorusPPM, // Corrected spelling to match frontend
        nitrogen: nitrogenPPM,
        potassium: potassiumPPM,
        ph: pH, // Case consistent
        moisture: moisturePPM,
        soiltype: soilType, // Case consistent
        wateravailability: waterAvailability, // Fixed typo
    } = req.body;
    

    // Validate required fields
    if (!cityname || !phosphorusPPM || !nitrogenPPM || !potassiumPPM || !pH || !moisturePPM || !soilType || !waterAvailability) {
        return res.status(400).send({ error: "All fields are required." });
    }

    try {
        // Geocoding to get latitude and longitude
        const response = await geocodingClient.forwardGeocode({
            query: cityname,
            limit: 1,
        }).send();

        const latitude = response.body.features[0].geometry.coordinates[1];
        const longitude = response.body.features[0].geometry.coordinates[0];

        // Fetch future and past weather data
        futureWeather = await getWeatherFuture(latitude, longitude);
        pastWeather = await getWeatherPast(latitude, longitude);

        // Call the run function with the weather and soil data
        const data = await run(pastWeather, futureWeather, {
            phosphorusPPM,
            nitrogenPPM,
            potassiumPPM,
            pH,
            moisturePPM,
            soilType,
            waterAvailability,
        });

        if (!data) {
            return res.status(500).send({ error: "Failed to fetch crop recommendations. Please try again." });
        } else {
            console.log(data);
            return res.json(data);
        }
    } catch (error) {
        console.error("Error processing request:", error.message);
        return res.status(500).send({ error: "Something went wrong. Please try again later." });
    }
});


//===============================================================================================================================================================================================

app.listen(8080, () => {
    console.log("Server is Listening ");
});
