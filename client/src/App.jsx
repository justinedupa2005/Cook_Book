import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Signup from "./components/Signup";
import Login from "./components/Login";

const fetchAPI = async () => {
  const response = await axios.get("http://localhost:8080/");
  console.log(response);
};

function App() {
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
