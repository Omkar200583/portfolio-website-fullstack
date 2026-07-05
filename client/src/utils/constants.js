export const APP_NAME = "Omkar Jadhav | AI Portfolio";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://portfolio-backend-vh57.onrender.com/api";

export const SOCIAL_LINKS = {
  github: "https://github.com/omkarjadhav",
  linkedin: "https://linkedin.com/in/omkarjadhav",
  twitter: "https://twitter.com/omkarjadhav",
  email: "mailto:contact@omkarjadhav.dev",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// API Keys
export const API_KEYS = {
  OPENAI: import.meta.env.VITE_OPENAI_KEY,
  CLOUDINARY: import.meta.env.VITE_CLOUDINARY_KEY,
};