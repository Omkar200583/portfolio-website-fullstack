// frontend/src/services/contactService.js
const API_CONFIG = {
  BASE_URL: "/api",
  CONTACT_ENDPOINT: "/contact",
};

// ✅ FIXED: Checks for "accessToken" specifically (matches your login flow)
const getToken = () => {
  // Primary: Check the standard key your auth uses
  const token = localStorage.getItem("accessToken");
  if (token && token.length > 20) {
    console.log('[Auth] Found token in localStorage["accessToken"]');
    return token;
  }

  // Fallback: Scan all keys for any JWT-like string
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw || raw.length < 10) continue;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      if (raw.startsWith("eyJ")) {
        console.log(`[Auth] Found token in localStorage["${key}"] (raw JWT)`);
        return raw;
      }
      continue;
    }

    if (typeof parsed !== "object" || parsed === null) continue;

    const paths = [
      parsed.token,
      parsed.accessToken,
      parsed.authToken,
      parsed.jwt,
      parsed.data?.token,
      parsed.data?.accessToken,
      parsed.user?.token,
      parsed.user?.accessToken,
      parsed.result?.token,
      parsed.result?.accessToken,
    ];

    for (const val of paths) {
      if (typeof val === "string" && val.length > 20) {
        console.log(`[Auth] Found token in localStorage["${key}"]`);
        return val;
      }
    }
  }

  console.log("[Auth] No token found");
  return "";
};

const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const isPublic = options.requiresAuth === false;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(!isPublic && token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
    ...options,
    headers,
  });

  let data;
  const text = await response.text();
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      response.ok
        ? "Invalid response from server"
        : `Server error ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || `Server error: ${response.status}`);
  }

  return data;
};

// ─── VALIDATION ──────────────────────────────────────────────────────────────
const validateForm = (formData) => {
  const errors = {};
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

// ─── RATE LIMITER ────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const checkRateLimit = (email) => {
  const now = Date.now();
  const key = email.toLowerCase().trim();
  const record = rateLimitMap.get(key);
  if (!record) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }
  if (now - record.firstAttempt > 60000) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }
  if (record.count >= 3) {
    const waitTime = Math.ceil((60000 - (now - record.firstAttempt)) / 1000);
    return { allowed: false, message: `Too many requests. Wait ${waitTime}s.` };
  }
  record.count += 1;
  return { allowed: true };
};

// ─── PUBLIC: Send contact form (NO auth) ────────────────────────────────────
const sendContactForm = async (rawFormData) => {
  const { isValid, errors } = validateForm(rawFormData);
  if (!isValid) {
    return { success: false, message: "Please fix the form errors", errors };
  }
  const rateCheck = checkRateLimit(rawFormData.email);
  if (!rateCheck.allowed) {
    return { success: false, message: rateCheck.message };
  }

  try {
    const data = await apiFetch(API_CONFIG.CONTACT_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        name: rawFormData.name.trim(),
        email: rawFormData.email.trim(),
        subject: rawFormData.subject || "Portfolio Contact",
        message: rawFormData.message.trim(),
      }),
      requiresAuth: false,
    });
    console.log("✅ Message saved to MongoDB:", data.data?._id);
    return { success: true, message: data.message || "Message sent successfully!" };
  } catch (error) {
    console.error("❌ Contact form error:", error.message);
    return { success: false, message: error.message || "Failed to send. Try again." };
  }
};

// ─── ADMIN: Get all messages ──────────────────────────────────────────────
const getAll = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  const qs = query.toString();
  const url = `${API_CONFIG.CONTACT_ENDPOINT}${qs ? `?${qs}` : ""}`;

  const data = await apiFetch(url);
  return {
    data: {
      data: data.data || [],
      pagination: data.pagination || { total: 0, page: 1, limit: 20 },
    },
  };
};

// ─── ADMIN: Get single message ───────────────────────────────────────────
const getById = async (id) => {
  const data = await apiFetch(`${API_CONFIG.CONTACT_ENDPOINT}/${id}`);
  return { data: { data: data.data } };
};

// ─── ADMIN: Reply ────────────────────────────────────────────────────────
const reply = async (id, text) => {
  const data = await apiFetch(`${API_CONFIG.CONTACT_ENDPOINT}/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ replyMessage: text }),
  });
  return { data };
};

// ─── ADMIN: Delete ───────────────────────────────────────────────────────
const deleteMessage = async (id) => {
  const data = await apiFetch(`${API_CONFIG.CONTACT_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
  return { data };
};

// ─── ADMIN: Update status ────────────────────────────────────────────────
const updateStatus = async (id, status) => {
  const data = await apiFetch(`${API_CONFIG.CONTACT_ENDPOINT}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return { data };
};

// ─── ADMIN: Get stats ───────────────────────────────────────────────────
const getStats = async () => {
  try {
    const allData = await apiFetch(`${API_CONFIG.CONTACT_ENDPOINT}?limit=100`);
    const messages = allData.data || [];
    return {
      data: {
        totalContacts: allData.pagination?.total || messages.length,
        unreadContacts: messages.filter((m) => m.status === "unread").length,
        recentContacts: messages.filter((m) => {
          return (
            Date.now() - new Date(m.createdAt).getTime() <
            7 * 24 * 60 * 60 * 1000
          );
        }).length,
      },
    };
  } catch (err) {
    console.error("Stats error:", err.message);
    return { data: { totalContacts: 0, unreadContacts: 0, recentContacts: 0 } };
  }
};

// ─── EXPORTS ────────────────────────────────────────────────────────────────
export const contactService = {
  getAll,
  getById,
  reply,
  delete: deleteMessage,
  updateStatus,
  getStats,
  submit: sendContactForm,
};

export { sendContactForm, validateForm, checkRateLimit };
export default sendContactForm;