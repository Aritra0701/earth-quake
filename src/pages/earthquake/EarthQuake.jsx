import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Input, Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import video from "../../../public/images/227640.mp4";

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
  const [prediction, setPrediction] = useState(null);
  const [forecast, setForecast] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrediction(6.5);
    setForecast([
      { date: "2024-02-05", magnitude: 5.8 },
      { date: "2024-02-06", magnitude: 6.2 },
      { date: "2024-02-07", magnitude: 5.5 },
      { date: "2024-02-08", magnitude: 6.5 },
      { date: "2024-02-09", magnitude: 6.0 },
    ]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          style={{objectPosition:"center"}}
        />
      </div>


      <div className="absolute inset-0 bg-black opacity-45 z-1"/>


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
              <form onSubmit={handleSubmit} className="space-y-6 z-50">
                <div className="main-content grid gap-6 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2">
                  {[
                    { id: "latitude", label: "Latitude", step: "0.000001" },
                    { id: "longitude", label: "Longitude", step: "0.000001" },
                    { id: "depth", label: "Depth (km)", step: "0.1" },
                    { id: "nst", label: "NST" },
                    { id: "gap", label: "Gap", step: "0.1" },
                    { id: "clo", label: "CLO", step: "0.1" },
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
                        step={field.step || "1"}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 text-white"
                      />
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
                    step="0.01"
                    placeholder="Enter RMS"
                    value={formData?.rms}
                    onChange={handleInputChange}
                    required
                    className="block w-full text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-800 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Predict Magnitude
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
                  <h3 className="text-lg font-semibold">Predicted Magnitude</h3>
                  <Tooltip content="Click to see the Prediction Graph" >
                    <Button className="bg-indigo-800" onClick={() => navigate("/chart")}>
                      Click here
                    </Button>
                  </Tooltip>
                </div>
                <p className="text-3xl font-bold text-indigo-700">
                  {prediction.toFixed(1)}
                </p>
              </div>

              {forecast.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Next 5-Days Prediction
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {forecast?.map((day) => (
                      <div
                        key={day.date}
                        className="rounded-lg border p-4 text-center shadow-sm"
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
