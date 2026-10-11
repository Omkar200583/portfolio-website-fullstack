import mongoose from "mongoose";

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["research-paper", "book-chapter"],
      default: "research-paper",
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
      maxlength: 600,
      trim: true,
    },

    abstract: {
      type: String,
      default: "",
    },

    authors: {
      type: [String],
      default: [],
    },

    supervisor: {
      type: String,
      default: "",
      trim: true,
    },

    publication: {
      type: String,
      default: "",
      trim: true,
    },

    publisher: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["Published", "Accepted", "Under Review", "In Press"],
      default: "Published",
    },

    registrationId: {
      type: String,
      default: "",
      trim: true,
    },

    bookTitle: {
      type: String,
      default: "",
      trim: true,
    },

    chapterNumber: {
      type: String,
      default: "",
      trim: true,
    },

    isbn: {
      type: String,
      default: "",
      trim: true,
    },

    researchArea: {
      type: [String],
      default: [],
    },

    keywords: {
      type: [String],
      default: [],
    },

    technologies: {
      type: [String],
      default: [],
    },

    researchProblem: {
      type: String,
      default: "",
    },

    methodology: {
      type: String,
      default: "",
    },

    findings: {
      type: String,
      default: "",
    },

    chapterContent: {
      type: String,
      default: "",
    },

    doi: {
      type: String,
      default: "",
      trim: true,
    },

    paperUrl: {
      type: String,
      default: "",
      trim: true,
    },

    chapterUrl: {
      type: String,
      default: "",
      trim: true,
    },

    publicationUrl: {
      type: String,
      default: "",
      trim: true,
    },

    publisherUrl: {
      type: String,
      default: "",
      trim: true,
    },

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Research =
  mongoose.models.Research ||
  mongoose.model("Research", researchSchema);

export default Research;