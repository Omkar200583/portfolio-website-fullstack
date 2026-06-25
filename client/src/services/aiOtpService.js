import api from "./api";

const aiOtpService = {
  sendOtp: (data) => api.post("/ai-otp/send", data),
  verifyOtp: (data) => api.post("/ai-otp/verify", data),
};

export default aiOtpService;