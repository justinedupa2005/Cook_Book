import api from "../api/axiosInstance";
import { useEffect, useState } from "react";

function RecipeModal({ recipeId, onClose }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/api/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();

    // Lock body scroll when modal opens
    document.body.style.overflow = "hidden";

    // Unlock body scroll when modal closes
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [recipeId]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-orange-100 text-orange-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-scroll">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !recipe ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 font-medium">Recipe not found.</p>
          </div>
        ) : (
          <>
            {/* IMAGE */}
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.dishName}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col gap-5">
              {/* Title + badges */}
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  {recipe.dishName}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${difficultyColors[recipe.difficulty]}`}
                  >
                    {recipe.difficulty}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-700">
                    {recipe.region}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-purple-100 text-purple-700">
                    {recipe.category}
                  </span>
                </div>
              </div>

              {/* Time info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Prep Time
                  </p>
                  <p className="text-lg font-black text-gray-700 mt-1">
                    {recipe.prepTime} min
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Cook Time
                  </p>
                  <p className="text-lg font-black text-gray-700 mt-1">
                    {recipe.cookTime} min
                  </p>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
                  Ingredients
                </h3>
                <ul className="flex flex-col gap-2">
                  {recipe.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                      <span className="font-bold text-gray-800">
                        {ing.quantity} {ing.unit}
                      </span>
                      <span>{ing.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
                  Instructions
                </h3>
                <ol className="flex flex-col gap-3">
                  {recipe.instructions.map((ins, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-start text-sm text-gray-600"
                    >
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{ins.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Created by */}
              <p className="text-xs text-gray-400 text-right">
                By{" "}
                <span className="font-bold text-gray-500">
                  {recipe.createdBy?.username}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeModal;
