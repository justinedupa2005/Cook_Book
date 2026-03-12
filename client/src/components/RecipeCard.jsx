function RecipeCard({ recipe }) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-orange-100 text-orange-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={recipe.image}
        alt={recipe.dishName}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 text-left">
        <h3 className="text-lg font-bold text-gray-800">{recipe.dishName}</h3>

        <p className="text-gray-500 text-sm mt-1">{recipe.description}</p>

        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <span>Prep: {recipe.prepTime} min</span>
          <span>Cook: {recipe.cookTime} min</span>
        </div>

        <div className="mt-3">
          <span
            className={`text-xs px-2 py-1 rounded ${difficultyColors[recipe.difficulty]}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
