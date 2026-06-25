import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["frontend", "backend", "database", "devops", "tools", "languages", "frameworks", "other"],
      required: true,
    },
    proficiency: { type: Number, min: 0, max: 100, required: true },
    icon: { type: String, default: "" },
    color: { type: String, default: "#3B82F6" },
    yearsOfExperience: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    // ADDED: Image field so uploaded images are saved to the database
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);