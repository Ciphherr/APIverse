import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import LandingPage from "./pages/landingPage";

function App() {
  const [apiId, setApiId] = useState(null); // define state here

  return (

      <div className="w-full h-full mx-auto">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home setApiId={setApiId} />} />
          <Route path="/docs" element={<Docs apiId={apiId} />} />
        </Routes>
      </div>

  );
}

export default App;
