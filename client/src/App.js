import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/navigation/NavBar";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
