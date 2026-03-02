import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="flex w-[800px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">
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

          <form className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-500 placeholder-gray-400"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-500 placeholder-gray-400"
            />

            <button className="mt-4 bg-green-500 text-white font-bold p-3 rounded-full hover:bg-green-600 transition duration-300">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
