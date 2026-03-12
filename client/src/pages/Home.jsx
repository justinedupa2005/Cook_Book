import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import homePageImg from "../assets/home-page-image.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/recipes")
      .then((res) => {
        setRecipes(res.data.recipes);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HERO IMAGE SECTION */}
      <div className="w-full flex justify-center mt-8">
        <div className="relative w-237.5 h-125 overflow-hidden rounded-4xl shadow-xl">
          <img
            src={homePageImg}
            alt="Delicious food spread"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-white text-6xl font-black tracking-tight uppercase">
              Cook with <span className="text-green-400">Passion</span>
            </h1>

            <div className="h-1.5 w-20 bg-green-500 my-6"></div>

            <p className="text-gray-100 text-xl font-medium max-w-xl leading-relaxed">
              Discover the heart of our home. From the sour notes of{" "}
              <span className="text-yellow-400 font-bold">Sinigang</span> to the
              savory crunch of{" "}
              <span className="text-yellow-400 font-bold">Lechon</span>, explore
              the ultimate collection of Filipino heirloom recipes.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg 
                          transition-all duration-200 
                        hover:bg-green-600 hover:shadow-green-500/40"
              >
                Explore Recipes
              </button>

              <button
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-lg font-bold 
                             transition-all duration-200 
                           hover:bg-white/20 hover:border-white/60 
                             active:scale-95"
              >
                Create Recipes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="container mx-auto px-6 py-10 space-y-20 mt-5">
        <section className="text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">
              Best <span className="text-green-500">Recipes</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Explore our top-rated dishes from the Philippines.
            </p>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* REGION SECTION */}
        <section className="text-center mt-5">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">
              Explore by <span className="text-green-500">Region</span>
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              From the highlands of the North to the flavors of the South.
            </p>
          </div>

          {/* Regional Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                name: "Luzon",
                icon: "⛰️",
                color: "hover:bg-orange-50",
                border: "hover:border-orange-200",
              },
              {
                name: "Visayas",
                icon: "🏝️",
                color: "hover:bg-blue-50",
                border: "hover:border-blue-200",
              },
              {
                name: "Mindanao",
                icon: "🦅",
                color: "hover:bg-yellow-50",
                border: "hover:border-yellow-200",
              },
            ].map((region) => (
              <div
                key={region.name}
                className={`group p-10 rounded-[2.5rem] bg-white border-2 border-gray-200 
                   ${region.color} ${region.border} cursor-pointer 
                   transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {region.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-widest">
                  {region.name}
                </h3>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-bold text-gray-400">
                    View Recipes →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-green-50 p-10 rounded-2xl text-center mt-5">
          <h2 className="text-3xl font-bold text-green-700">
            Have a unique recipe?
          </h2>
          <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600">
            Create Your Own
          </button>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
