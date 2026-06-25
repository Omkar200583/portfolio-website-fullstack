// models/Experience.js
import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    current: {
      type: Boolean,
      default: false,
    },
    
    location: { type: String, default: "" },
    type: { 
      type: String, 
      enum: ["full-time", "part-time", "internship", "freelance", "contract"],
      default: "full-time" 
    },
    description: { type: String, required: true },
    companyLogo: {
      url: String,
      publicId: String,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Sort by order field before saving if needed
experienceSchema.pre("save", function (next) {
  if (this.isNew && !this.order) {
    this.order = 0;
  }
  next();
});

export default mongoose.model("Experience", experienceSchema);