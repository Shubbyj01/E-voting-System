import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/AdminDashboard";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import SplashPage from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/results" element={<Results />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/vote" element={<Vote />} />
       <Route path="/" element={<SplashPage />} />
    </Routes>
  );
}

export default App;
