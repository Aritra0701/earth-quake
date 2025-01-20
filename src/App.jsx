import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import "./App.css";
import EarthQuake from "./pages/earthquake/EarthQuake";
import LineChart from "./components/charts/LineChart";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<EarthQuake/>}/>
          <Route path="/chart" element={<LineChart/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
