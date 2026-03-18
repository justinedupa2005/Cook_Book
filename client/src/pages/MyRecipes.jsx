import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";

const REGIONS = ["All", "Luzon", "Visayas", "Mindanao"];
const CATEGORIES = [
  "All",
  "Ulam",
  "Breakfast",
  "Merienda",
  "Dessert",
  "Soup",
  "Seafood",
  "Street Food",
];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-10
                     text-gray-700 font-medium text-sm cursor-pointer
                     focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                     transition-all duration-200 hover:border-gray-300"
        >
          {options.map((opt) => (
            <option key={opt} value={opt === "All" ? "" : opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, region, category, difficulty]);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (region) params.append("region", region);
      if (category) params.append("category", category);
      if (difficulty) params.append("difficulty", difficulty);
      if (debouncedSearch) params.append("search", debouncedSearch);
      params.append("page", page);

      const token = localStorage.getItem("accessToken");

      const res = await api.get(
        `http://localhost:8080/api/my-recipes?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      setRecipes(res.data.recipes);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log("Error fetching recipes: ", err);
    } finally {
      setLoading(false);
    }
  }, [region, category, difficulty, debouncedSearch, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const hasActiveFilters = region || category || difficulty || search;

  const clearFilters = () => {
    setSearch("");
    setRegion("");
    setCategory("");
    setDifficulty("");
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}

      <Navbar />

      {/* COMBINED HEADER + FILTER BANNER */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-5">
        <div className="container mx-auto max-w-6xl flex flex-col gap-4">
          {/* Title + Search bar on same row */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight whitespace-nowrap">
              My <span className="text-green-500">Recipes</span>
            </h1>

            {/* Search bar — full width, prominent */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for a dish name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 pl-12 text-base
                         text-gray-700 font-medium placeholder-gray-400
                         focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100
                         transition-all duration-200 hover:border-gray-300"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </div>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Dropdowns row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <FilterSelect
              label="Region"
              value={region}
              onChange={setRegion}
              options={REGIONS}
            />
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
            />
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={DIFFICULTIES}
            />

            {hasActiveFilters && (
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-xs font-bold text-transparent uppercase tracking-widest pl-1 select-none">
                  Clear
                </label>
                <button
                  onClick={clearFilters}
                  className="whitespace-nowrap bg-red-50 text-red-500 border-2 border-red-100
                             font-bold text-sm px-4 py-2.5 rounded-xl
                             hover:bg-red-100 hover:border-red-200
                             transition-all duration-200 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-8 flex-1">
        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 font-medium">
            {loading ? (
              <span className="animate-pulse">Loading recipes...</span>
            ) : (
              <>
                <span className="text-gray-800 font-bold">
                  {recipes.length}
                </span>{" "}
                recipe{recipes.length !== 1 ? "s" : ""} found
              </>
            )}
          </p>
          <p className="text-sm text-gray-400 font-medium">
            Page {page} of {totalPages}
          </p>
        </div>

        {/* RECIPE GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-black text-gray-700 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Try adjusting your filters or search for something different.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-5 bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm
                           hover:bg-green-600 transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onClick={() => setSelectedRecipeId(recipe._id)}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200
                         font-bold text-sm text-gray-600 bg-white
                         hover:border-green-400 hover:text-green-600 hover:bg-green-50
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200
                         disabled:hover:bg-white disabled:hover:text-gray-600
                         transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-3 py-2.5 text-gray-400 text-sm font-medium"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`w-10 h-10 rounded-xl border-2 text-sm font-bold transition-all duration-200
                        ${
                          page === item
                            ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-200"
                            : "bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                        }`}
                    >
                      {item}
                    </button>
                  ),
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200
                         font-bold text-sm text-gray-600 bg-white
                         hover:border-green-400 hover:text-green-600 hover:bg-green-50
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200
                         disabled:hover:bg-white disabled:hover:text-gray-600
                         transition-all duration-200"
            >
              Next
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyRecipes;
