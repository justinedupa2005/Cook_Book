import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createAccount = (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      alert("Password do not match");
      return;
    }

    axios
      .post("http://localhost:8080", { username, email, password })
      .then((result) => console.log("Success: ", result.data))
      .catch((err) => console.log("Error: ", err));
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="flex w-[800px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 bg-green-500 flex-col justify-center items-center text-white p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Welcome
          </h1>
          <p className="text-center opacity-90">
            Join our community and start your journey with us today.
          </p>

          <Link
            to="/Login"
            className="mt-6 border-2 border-white text-white font-bold py-3 px-10 md:px-12 rounded-full hover:bg-green-600 transition duration-300"
          >
            Login
          </Link>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Signup
          </h2>

          <form onSubmit={createAccount} className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 placeholder-gray-500 bg-gray-100 border-none rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 placeholder-gray-500 bg-gray-100 border-none rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 placeholder-gray-500 bg-gray-100 border-none rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 placeholder-gray-500 bg-gray-100 border-none rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="mt-4 bg-green-500 text-white font-bold p-3 rounded-lg hover:bg-green-600 transition duration-300 shadow-lg">
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
