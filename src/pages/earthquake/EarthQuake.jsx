import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button, Input, Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import video from "../../../public/images/227640.mp4";

// Mock function to simulate DeepSeek API call
async function predictEarthquake(data) {
  // In a real app, you would call your backend API here
  // which would then call DeepSeek's API

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // This is mock data - replace with actual API response
  const baseMagnitude = 5.0 + Math.random() * 2.5; // Random between 5.0-7.5
  const fluctuation = (Math.random() - 0.5) * 0.5; // Random fluctuation ±0.25

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

  const fillExample = (exampleNum) => {
    const examples = [
      {
        latitude: "38.297",
        longitude: "142.372",
        depth: "29",
        nst: "541",
        gap: "20",
        clo: "0.8",
        rms: "1.46",
      },
      {
        latitude: "3.316",
        longitude: "95.854",
        depth: "30",
        nst: "412",
        gap: "25",
        clo: "0.7",
        rms: "1.23",
      },
      {
        latitude: "28.147",
        longitude: "84.708",
        depth: "15",
        nst: "321",
        gap: "18",
        clo: "0.9",
        rms: "1.05",
      },
    ];

    setFormData(examples[exampleNum - 1]);
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
              <div className="mb-4 flex gap-2">
                <Button
                  size="sm"
                  className="bg-indigo-800 text-xs"
                  onClick={() => fillExample(1)}
                >
                  Tōhoku
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-800 text-xs"
                  onClick={() => fillExample(2)}
                >
                  Indian Ocean
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-800 text-xs"
                  onClick={() => fillExample(3)}
                >
                  Nepal
                </Button>
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
