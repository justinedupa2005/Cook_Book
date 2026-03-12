import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axiosInstance";
import Alert from "../components/Alert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      if (result.status === 200) {
        sessionStorage.setItem("accessToken", result.data.accessToken);
        setAlertMessage("Login Successfully!");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      // Handle different error formats
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setAlertMessage(errorMsg);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="flex w-200 h-125 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side */}
          <div className="hidden md:flex w-1/2 bg-green-500 flex-col justify-center items-center text-white p-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Welcome Back!
            </h1>
            <p className="text-center text-green-50 opacity-90">
              Sign in to continue accessing your dashboard and features.
            </p>

            <Link
              to="/signup"
              className="mt-6 border-2 border-white text-white font-bold py-3 px-10 md:px-12 rounded-full hover:bg-green-600 transition duration-300"
            >
              Sign Up
            </Link>
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
              Login
            </h2>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-500 placeholder-gray-400"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-500 placeholder-gray-400"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                disabled={isLoading}
                className={`mt-4 font-bold p-3 rounded-full transition duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isLoading ? "LOGIN" : "LOGIN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
