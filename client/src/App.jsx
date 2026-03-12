import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import MyRecipes from "./pages/MyRecipes";
import CreateRecipes from "./pages/CreateRecipes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/recipe" element={<Recipe />}></Route>
        <Route path="/myrecipes" element={<MyRecipes />}></Route>
        <Route path="/createrecipes" element={<CreateRecipes />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
