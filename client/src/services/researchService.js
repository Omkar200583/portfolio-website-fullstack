import axios from "axios";

// API CONFIGURATION

const configuredBaseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const normalizedBaseURL = configuredBaseURL.replace(/\/+$/, "");

const API_BASE = /\/api$/i.test(normalizedBaseURL)
  ? normalizedBaseURL
  : `${normalizedBaseURL}/api`;

// AUTHENTICATION

const getAdminToken = () =>
  localStorage.getItem("adminToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("authToken") ||
  sessionStorage.getItem("adminToken") ||
  sessionStorage.getItem("token") ||
  "";

const authHeaders = () => {
  const token = getAdminToken();

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// AXIOS INSTANCE

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// RESPONSE HANDLING

const unwrap = (response) =>
  response.data?.data ?? response.data;

const request = async (callback, fallback) => {
  try {
    return unwrap(await callback());
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      fallback;

    console.error("Research API error:", {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      response: error.response?.data,
    });

    throw new Error(message, { cause: error });
  }
};

// PUBLIC RESEARCH

export const getResearch = (params = {}) =>
  request(
    () => api.get("/research", { params }),
    "Failed to load publications"
  );

export const getResearchById = (id) =>
  request(
    () =>
      api.get(
        `/research/${encodeURIComponent(id)}`
      ),
    "Failed to load publication"
  );

export const getFeaturedResearch = () =>
  request(
    () => api.get("/research/featured"),
    "Failed to load featured publications"
  );

// ADMIN RESEARCH

export const getAllResearchAdmin = () =>
  request(
    () =>
      api.get("/research/admin/all", {
        headers: authHeaders(),
      }),
    "Failed to load admin publications"
  );

export const getResearchByIdAdmin = (id) =>
  request(
    () =>
      api.get(
        `/research/admin/${encodeURIComponent(id)}`,
        {
          headers: authHeaders(),
        }
      ),
    "Failed to load publication"
  );

export const createResearch = (data) =>
  request(
    () =>
      api.post("/research", data, {
        headers: authHeaders(),
      }),
    "Failed to create publication"
  );

export const updateResearch = (id, data) =>
  request(
    () =>
      api.put(
        `/research/${encodeURIComponent(id)}`,
        data,
        {
          headers: authHeaders(),
        }
      ),
    "Failed to update publication"
  );

export const deleteResearch = (id) =>
  request(
    () =>
      api.delete(
        `/research/${encodeURIComponent(id)}`,
        {
          headers: authHeaders(),
        }
      ),
    "Failed to delete publication"
  );

export const toggleResearchVisibility = (id) =>
  request(
    () =>
      api.patch(
        `/research/${encodeURIComponent(id)}/visibility`,
        {},
        {
          headers: authHeaders(),
        }
      ),
    "Failed to update publication visibility"
  );

export const toggleResearchFeatured = (id) =>
  request(
    () =>
      api.patch(
        `/research/${encodeURIComponent(id)}/featured`,
        {},
        {
          headers: authHeaders(),
        }
      ),
    "Failed to update featured status"
  );

// FILE UPLOAD

export const uploadResearchFile = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Please select a valid file");
  }

  const formData = new FormData();

  formData.append("file", file);

  const result = await request(
    () =>
      api.post("/research/upload", formData, {
        headers: authHeaders(),
      }),
    "Failed to upload research file"
  );

  if (!result?.url) {
    throw new Error(
      "The server did not return a file URL"
    );
  }

  return result.url;
};

// OPTIONS

export const RESEARCH_STATUS_OPTIONS = [
  "Published",
  "Accepted",
  "Under Review",
  "In Press",
];

export const RESEARCH_TYPE_OPTIONS = [
  {
    value: "research-paper",
    label: "Research Paper",
  },
  {
    value: "book-chapter",
    label: "Book Chapter",
  },
];

// DEFAULT EXPORT

const researchService = {
  getPublic: getResearch,
  getPublicById: getResearchById,
  getFeatured: getFeaturedResearch,

  getAdminAll: getAllResearchAdmin,
  getAdminById: getResearchByIdAdmin,

  create: createResearch,
  update: updateResearch,
  delete: deleteResearch,

  togglePublish: toggleResearchVisibility,
  toggleFeatured: toggleResearchFeatured,

  uploadFile: uploadResearchFile,
};

export default researchService;