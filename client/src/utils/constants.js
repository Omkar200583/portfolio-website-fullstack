export const APP_NAME = "Omkar Jadhav | AI Portfolio";

export const APP_VERSION = "1.0.0";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const SOCIAL_LINKS = {
  github: "https://github.com/omkarjadhav",
  linkedin: "https://linkedin.com/in/omkarjadhav",
  twitter: "https://twitter.com/omkarjadhav",
  email: "contact@omkarjadhav.dev"
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user"
};

export const THEMES = {
  LIGHT: "light",
  DARK: "dark"
};

// API Keys (Mocked for structure)
export const API_KEYS = {
  OPENAI: process.env.REACT_APP_OPENAI_KEY,
  CLOUDINARY: process.env.REACT_APP_CLOUDINARY_KEY
};