const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const RecipeModel = require("./models/recipe");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//GENERATE ACCESS TOKEN
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

//GENERATE REFRESH TOKEN
const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

//REFRESH COOKIE
const setRefreshCookie = (res, token) =>
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

//VERIFY TOKEN
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

//SIGNUP POST
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({ message: "User created successfully", accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//LOGIN POST
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.status(200).json({ message: "Login Successfully", accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//REFRESH TOKEN
app.post("/api/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

//LOGGING OUT TOKEN
app.post("/api/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

//REDIRECT TO HOMEPAGE
app.get("/api/home", (req, res) => {
  res.json({ message: "This is HOMEPAGE" });
});

//REQUEST RECIPE
app.get("/api/recipes", async (req, res) => {
  try {
    const { region, category, difficulty, search, page = 1 } = req.query;

    const limit = 9;
    const skip = (page - 1) * limit;

    let filter = {};

    if (region) filter.region = region;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    if (search) {
      filter.dishName = { $regex: search, $options: "i" };
    }

    const recipes = await RecipeModel.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RecipeModel.countDocuments(filter);

    res.json({
      recipes,
      totalPage: Math.ceil(total / limit),
      currentPages: Number(page),
    });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

//REQUESTING USER OWN RECIPES
app.get("/api/my-recipes", verifyToken, async (req, res) => {
  const recipes = await RecipeModel.find({ createdBy: req.user.id }).populate(
    "createdBy",
    "username",
  );
  res.json(recipes);
});

//REQUIESTING SPECIFIC RECIPE
app.get("/api/recipes/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id).populate(
      "createdBy",
      "username",
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ADDING RECIPE
app.post(
  "/api/recipes",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      let imageUrl = "";
      let publicId = "";

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        publicId = result.public_id;

        fs.unlinkSync(req.file.path);
      }

      const {
        dishName,
        region,
        category,
        prepTime,
        cookTime,
        description,
        ingredients,
        instructions,
        difficulty,
      } = req.body;

      const newRecipe = await RecipeModel.create({
        dishName,
        region,
        image: imageUrl,
        imagePublicId: publicId,
        category,
        prepTime,
        cookTime,
        description,
        ingredients,
        instructions,
        difficulty,
        createdBy: req.user.id,
      });

      res.status(201).json({
        message: "Recipe Added",
        data: newRecipe,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
);

//DELETING RECIPE
app.delete("/api/recipes/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (recipe.imagePublicId) {
      await cloudinary.uploader.destroy(recipe.imagePublicId);
    }

    await RecipeModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
