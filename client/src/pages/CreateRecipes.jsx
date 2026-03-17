import { useState } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Alert from "../components/Alert";

const regions = ["Luzon", "Visayas", "Mindanao"];
const difficulties = ["Easy", "Medium", "Hard"];
const categories = [
  "Ulam",
  "Breakfast",
  "Merienda",
  "Dessert",
  "Soup",
  "Seafood",
  "Street Food",
];

// Reusable styled label
function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block"
    >
      {children}
    </label>
  );
}

// Reusable input class
const inputClass =
  "w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300 bg-white";

const selectClass =
  "w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium cursor-pointer focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300 bg-white";

function SelectField({ id, name, value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClass}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
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
  );
}

const initialFormState = {
  dishName: "",
  description: "",
  region: "",
  category: "",
  difficulty: "",
  prepTime: "",
  cookTime: "",
  ingredients: [{ quantity: "", unit: "", name: "" }],
  instructions: [{ step: 1, text: "" }],
};

function CreateRecipes() {
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dishName: "",
    description: "",
    region: "",
    category: "",
    difficulty: "",
    prepTime: "",
    cookTime: "",
    ingredients: [{ quantity: "", unit: "", name: "" }],
    instructions: [{ step: 1, text: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addIngredient = () =>
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { quantity: "", unit: "", name: "" },
      ],
    });

  const handleIngredientChange = (index, field, value) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    setFormData({ ...formData, ingredients: updated });
  };

  const removeIngredient = (index) =>
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });

  const addInstruction = () =>
    setFormData({
      ...formData,
      instructions: [
        ...formData.instructions,
        { step: formData.instructions.length + 1, text: "" },
      ],
    });

  const handleInstructionChange = (index, value) => {
    const updated = [...formData.instructions];
    updated[index] = { step: index + 1, text: value };
    setFormData({ ...formData, instructions: updated });
  };

  const removeInstruction = (index) =>
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    });

  const resetForm = () => {
    setFormData(initialFormState);
    setImage(null);

    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("dishName", formData.dishName);
    data.append("description", formData.description);
    data.append("region", formData.region);
    data.append("category", formData.category);
    data.append("difficulty", formData.difficulty);
    data.append("prepTime", formData.prepTime);
    data.append("cookTime", formData.cookTime);
    data.append("ingredients", JSON.stringify(formData.ingredients));
    data.append("instructions", JSON.stringify(formData.instructions));
    if (image) data.append("image", image);

    try {
      const res = await api.post("/api/recipes", data);

      setAlert("Recipe successfully created!");
      resetForm();
    } catch (err) {
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setAlert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {alert && <Alert message={alert} onClose={() => setAlert(null)} />}

      <Navbar />

      {/* PAGE HEADER */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-5">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            Create <span className="text-green-500">Recipe</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Share your favorite Filipino dish with the community.
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 container mx-auto max-w-2xl px-6 py-8"
      >
        <div className="flex flex-col gap-5">
          {/* IMAGE UPLOAD */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
            <FieldLabel>Recipe Image</FieldLabel>

            {/* Drop zone */}
            <label
              htmlFor="image-upload"
              className="mt-1 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 overflow-hidden relative"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Click to upload image
                  </span>
                  <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            {image && (
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  document.getElementById("image-upload").value = "";
                }}
                className="mt-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
              >
                Remove image
              </button>
            )}
          </div>

          {/* BASIC INFO */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest border-b border-gray-100 pb-2">
              Basic Info
            </h2>

            {/* Dish Name */}
            <div>
              <FieldLabel htmlFor="dishName">Dish Name</FieldLabel>
              <input
                type="text"
                id="dishName"
                name="dishName"
                placeholder="e.g. Sinigang na Baboy"
                value={formData.dishName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                name="description"
                placeholder="Briefly describe the dish..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300 bg-white resize-none"
              />
            </div>

            {/* Region / Category / Difficulty — 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel htmlFor="region">Region</FieldLabel>
                <SelectField
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  options={regions}
                  placeholder="Select region"
                />
              </div>
              <div>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <SelectField
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories}
                  placeholder="Select category"
                />
              </div>
              <div>
                <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
                <SelectField
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  options={difficulties}
                  placeholder="Select difficulty"
                />
              </div>
            </div>

            {/* Prep / Cook Time — 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="prepTime">Prep Time (mins)</FieldLabel>
                <input
                  type="number"
                  id="prepTime"
                  name="prepTime"
                  min={0}
                  placeholder="e.g. 15"
                  value={formData.prepTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="cookTime">Cook Time (mins)</FieldLabel>
                <input
                  type="number"
                  id="cookTime"
                  name="cookTime"
                  min={0}
                  placeholder="e.g. 30"
                  value={formData.cookTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* INGREDIENTS */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest border-b border-gray-100 pb-2">
              Ingredients
            </h2>

            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Qty"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 font-medium w-20 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white text-center"
                />

                <div className="relative w-28 shrink-0">
                  <select
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                    className="w-full appearance-none border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 font-medium cursor-pointer focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white pr-7"
                  >
                    <option value="">Unit</option>
                    <option value="cup">Cup</option>
                    <option value="tbsp">Tbsp</option>
                    <option value="tsp">Tsp</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
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

                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white"
                />

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
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
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-1 flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors w-fit"
            >
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-base leading-none">
                +
              </span>
              Add Ingredient
            </button>
          </div>

          {/* INSTRUCTIONS */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest border-b border-gray-100 pb-2">
              Instructions
            </h2>

            {formData.instructions.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No steps yet. Add your first instruction below.
              </p>
            )}

            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3 items-start">
                <span className="mt-2.5 w-6 h-6 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <textarea
                  placeholder="Describe this step..."
                  value={instruction.text}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  rows={2}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="mt-2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0"
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
              </div>
            ))}

            <button
              type="button"
              onClick={addInstruction}
              className="mt-1 flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors w-fit"
            >
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-base leading-none">
                +
              </span>
              Add Step
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3.5 bg-green-500 hover:bg-green-600 active:scale-[0.99] text-white font-black text-base rounded-xl shadow-md shadow-green-200 transition-all duration-200"
          >
            Create Recipe
          </button>
        </div>
      </form>

      <Footer />
    </div>
  );
}

export default CreateRecipes;
