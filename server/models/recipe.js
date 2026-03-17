const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  quantity: {
    type: String,
    default: "",
    min: 0,
  },
  unit: {
    type: String,
    default: "",
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const RecipeSchema = new mongoose.Schema({
  dishName: { type: String, required: true },
  region: {
    type: String,
    required: true,
    trim: true,
    enum: ["Luzon", "Visayas", "Mindanao", "General"],
    default: "General",
  },
  image: {
    type: String,
    default: "",
  },
  imagePublicId: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Ulam",
      "Breakfast",
      "Merienda",
      "Dessert",
      "Soup",
      "Seafood",
      "Street Food",
    ],
  },
  cloudId: {
    type: String,
  },
  prepTime: {
    type: Number,
    required: true,
  },
  cookTime: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [IngredientSchema],
    validate: [(v) => v.length > 0, "Must have at least one ingredient"],
  },
  instructions: {
    type: [
      {
        step: Number,
        text: String,
      },
    ],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const RecipeModel = mongoose.model("recipe", RecipeSchema);
module.exports = RecipeModel;
