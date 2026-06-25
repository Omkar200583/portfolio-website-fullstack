export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};
export const isValidMongoId = (id) => /^[a-fA-F0-9]{24}$/.test(id);