import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ["website", "ecommerce", "software", "social"], required: true },
    summary: String,
    image: String,
    liveUrl: String,
    isDemo: { type: Boolean, default: true }, // keeps fictional work clearly labelled
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);