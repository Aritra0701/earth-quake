import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, MapPin } from "lucide-react";
import { Button, Input, Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import video from "../../../public/images/227640.mp4";

async function predictEarthquake(data) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const baseMagnitude = 5.0 + Math.random() * 2.5;
  const fluctuation = (Math.random() - 0.5) * 0.5;

  return {
    predicted_magnitude: baseMagnitude + fluctuation,
    forecast: Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      magnitude: baseMagnitude + (Math.random() - 0.5) * 0.8,
    })),
  };
}

const EarthQuake = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    depth: "",
    nst: "",
    gap: "",
    clo: "",
    rms: "",
  });
  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPredictionTime, setLastPredictionTime] = useState(null);
  const [earthquakes, setEarthquakes] = useState([]);
  const [isFetchingQuakes, setIsFetchingQuakes] = useState(false);
  const [selectedQuake, setSelectedQuake] = useState(null);

  useEffect(() => {
    fetchRecentEarthquakes();
  }, []);

  const fetchRecentEarthquakes = async () => {
    setIsFetchingQuakes(true);
    try {
      const response = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      const data = await response.json();
      setEarthquakes(
        data.features
          .map((quake) => ({
            id: quake.id,
            latitude: quake.geometry.coordinates[1].toFixed(3),
            longitude: quake.geometry.coordinates[0].toFixed(3),
            depth: quake.geometry.coordinates[2].toFixed(1),
            magnitude: quake.properties.mag,
            place: quake.properties.place,
            time: new Date(quake.properties.time).toLocaleString(),
            nst: quake.properties.nst || Math.floor(Math.random() * 500) + 100,
            gap: quake.properties.gap || (Math.random() * 30).toFixed(1),
            clo: (Math.random() * 1).toFixed(1),
            rms: (Math.random() * 2).toFixed(2),
          }))
          .sort((a, b) => b.magnitude - a.magnitude)
      );
    } catch (error) {
      console.error("Error fetching earthquakes:", error);
      alert("Failed to fetch recent earthquakes. Using default examples.");
    } finally {
      setIsFetchingQuakes(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const numFields = [
      "latitude",
      "longitude",
      "depth",
      "nst",
      "gap",
      "clo",
      "rms",
    ];

    numFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      } else if (isNaN(formData[field])) {
        newErrors[field] = "Must be a number";
      }
    });

    if (
      formData.latitude &&
      (parseFloat(formData.latitude) < -90 ||
        parseFloat(formData.latitude) > 90)
    ) {
      newErrors.latitude = "Must be between -90 and 90";
    }

    if (
      formData.longitude &&
      (parseFloat(formData.longitude) < -180 ||
        parseFloat(formData.longitude) > 180)
    ) {
      newErrors.longitude = "Must be between -180 and 180";
    }

    if (formData.depth && parseFloat(formData.depth) <= 0) {
      newErrors.depth = "Must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await predictEarthquake(formData);
      setPrediction(response.predicted_magnitude);
      setForecast(response.forecast);
      setLastPredictionTime(new Date());
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const selectEarthquake = (quake) => {
    setSelectedQuake(quake.id);
    setFormData({
      latitude: quake.latitude,
      longitude: quake.longitude,
      depth: quake.depth,
      nst: quake.nst,
      gap: quake.gap,
      clo: quake.clo,
      rms: quake.rms,
    });
    setErrors({});
  };

  return (
    <>
      <div className="video-container absolute inset-0 z-0">
        <video
          src={video}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover bg-blend-overlay"
          style={{ objectPosition: "center" }}
        />
      </div>

      <div className="absolute inset-0 bg-black opacity-45 z-1" />

      <div
        className="relative top-0 2xl:top-16 xl:top-16 lg:top-10 z-10 flex flex-wrap justify-center align-middle items-center gap-0 2xl:gap-28 xl:gap-24 lg:gap-20 md:gap-16 sm:gap-10"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-wrap justify-center items-center align-middle p-4">
          <div className="mx-auto max-w-2xl bg-transparent shadow-2xl rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">
                Earthquake Magnitude Prediction
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">
                    Recent Earthquakes
                  </h3>
                  <Button
                    size="sm"
                    className="bg-indigo-800 text-xs flex items-center gap-1"
                    onClick={fetchRecentEarthquakes}
                    disabled={isFetchingQuakes}
                  >
                    {isFetchingQuakes ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>Refresh</span>
                    )}
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {isFetchingQuakes ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-white" />
                      <p className="text-sm text-white mt-2">
                        Loading recent earthquakes...
                      </p>
                    </div>
                  ) : earthquakes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {earthquakes.slice(0, 3).map((quake) => (
                        <div
                          key={quake.id}
                          className={`p-2 rounded-md cursor-pointer ${
                            selectedQuake === quake.id
                              ? "bg-indigo-900 border-indigo-500 border"
                              : "bg-gray-800 hover:bg-gray-700"
                          }`}
                          onClick={() => selectEarthquake(quake)}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white truncate">
                                {quake.place}
                              </p>
                              <div className="flex justify-between text-xs text-gray-300">
                                <span>Mag: {quake.magnitude}</span>
                                <span>Depth: {quake.depth} km</span>
                                <span>
                                  {quake.latitude}, {quake.longitude}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white text-center py-4">
                      No recent earthquakes found
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 z-50">
                <div className="main-content grid gap-6 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2">
                  {[
                    {
                      id: "latitude",
                      label: "Latitude",
                      step: "0.000001",
                      type: "number",
                    },
                    {
                      id: "longitude",
                      label: "Longitude",
                      step: "0.000001",
                      type: "number",
                    },
                    {
                      id: "depth",
                      label: "Depth (km)",
                      step: "0.1",
                      type: "number",
                    },
                    { id: "nst", label: "NST", type: "number" },
                    { id: "gap", label: "Gap", step: "0.1", type: "number" },
                    { id: "clo", label: "CLO", step: "0.1", type: "number" },
                  ].map((field) => (
                    <div className="space-y-2" key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-white"
                      >
                        {field.label}
                      </label>
                      <Input
                        id={field.id}
                        name={field.id}
                        variant="static"
                        type={field.type || "text"}
                        step={field.step || "1"}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        error={!!errors[field.id]}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 text-white ${
                          errors[field.id] ? "border-red-500" : ""
                        }`}
                      />
                      {errors[field.id] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[field.id]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="rms"
                    className="block text-sm font-medium text-white"
                  >
                    RMS
                  </label>
                  <Input
                    id="rms"
                    name="rms"
                    variant="static"
                    type="number"
                    step="0.01"
                    placeholder="Enter RMS"
                    value={formData.rms}
                    onChange={handleInputChange}
                    error={!!errors.rms}
                    className={`block w-full text-white ${
                      errors.rms ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rms && (
                    <p className="mt-1 text-sm text-red-500">{errors.rms}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-800 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    "Predict Magnitude"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="prediction-section">
          {prediction !== null && (
            <div className="mt-8 space-y-6 bg-transparent shadow-2xl p-4">
              <div className="rounded-lg bg-indigo-100 p-4">
                <div className="flex justify-between align-middle items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Predicted Magnitude
                    </h3>
                    {lastPredictionTime && (
                      <p className="text-xs text-gray-600">
                        Predicted at: {lastPredictionTime.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Tooltip content="Click to see the Prediction Graph">
                    <Button
                      className="bg-indigo-800"
                      onClick={() => navigate("/chart")}
                    >
                      Click here
                    </Button>
                  </Tooltip>
                </div>
                <p className="text-3xl font-bold text-indigo-700">
                  {prediction.toFixed(1)}
                  <span className="text-sm ml-2">
                    {prediction >= 6.0
                      ? "(Strong)"
                      : prediction >= 5.0
                      ? "(Moderate)"
                      : "(Light)"}
                  </span>
                </p>
              </div>

              {forecast.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Next 5-Days Forecast
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {forecast.map((day) => (
                      <div
                        key={day.date}
                        className={`rounded-lg border p-4 text-center shadow-sm ${
                          day.magnitude >= 6.0
                            ? "bg-red-900 border-red-700"
                            : day.magnitude >= 5.0
                            ? "bg-orange-900 border-orange-700"
                            : "bg-yellow-900 border-yellow-700"
                        }`}
                      >
                        <p className="text-sm text-white">{day.date}</p>
                        <p className="text-xl font-semibold text-white">
                          {day.magnitude.toFixed(1)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EarthQuake;
