import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// MongoDB (optional)
let dbConnected = false;
let Fertilizer;

try {
  await mongoose.connect("mongodb://127.0.0.1:27017/crop_yield");
  console.log("✅ MongoDB connected (Fertilizer)");
  dbConnected = true;
} catch (err) {
  console.warn("⚠️ MongoDB not available, running without DB persistence");
}

if (dbConnected) {
  Fertilizer = mongoose.model("Fertilizer", new mongoose.Schema({
    Crop_Type: String,
    Soil_Type: String,
    Crop_Yield: Number,
    N: Number,
    P: Number,
    K: Number
  }));
}

// 🌱 Fertilizer API
app.post("/fertilizer", async (req, res) => {
  console.log("🔥 /fertilizer HIT");

  let { Crop_Type, Soil_Type, Crop_Yield } = req.body;
  Crop_Yield = Number(Crop_Yield);

  const N = Math.round(Crop_Yield * 0.8);
  const P = Math.round(Crop_Yield * 0.5);
  const K = Math.round(Crop_Yield * 0.6);

  if (dbConnected && Fertilizer) {
    try {
      await Fertilizer.create({ Crop_Type, Soil_Type, Crop_Yield, N, P, K });
    } catch (e) {
      console.warn("DB save failed, skipping persistence");
    }
  }

  res.json({ success: true, recommended_NPK: { N, P, K } });
});

app.listen(5001, () => {
  console.log("🚀 Fertilizer Server running on http://localhost:5001");
});