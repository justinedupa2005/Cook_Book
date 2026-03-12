import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex items-center bg-green-500 px-6 py-4 shadow-md">
      {/* Logo */}
      <div className="flex-1">
        <h1 className="text-white text-3xl font-bold">Cook Book</h1>
      </div>

      {/* Navbar Links */}
      <div className="flex items-center gap-1">
        {[
          { label: "Home", to: "/home" },
          { label: "Recipes", to: "/recipe" },
          { label: "My Recipes", to: "/myrecipes" },
          { label: "Create Recipes", to: "/createrecipes" },
          { label: "Favorites", to: "/" },
          { label: "About", to: "/" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="text-white text-md font-medium px-3 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            {item.label}
          </Link>
        ))}

        {/* Signup Button */}
        <Link
          to={"/signup"}
          className="ml-3 bg-white text-green-500 text-md font-bold px-5 py-2 rounded-full hover:bg-gray-100 transition duration-200"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
