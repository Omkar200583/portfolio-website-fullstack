import Certificate from "../models/Certificate.js";
import cloudinary from "../config/cloudinary.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getCertificates = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    const certificates = await Certificate.find(filter).sort({ order: 1, issueDate: -1 });
    return sendSuccess(res, certificates);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return sendError(res, "Certificate not found", 404);
    return sendSuccess(res, certificate);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, issueDate, credentialUrl } = req.body;
    
    const certificateData = {
      title,
      issuer,
      issueDate,
      credentialUrl,
    };

    // If an image was uploaded
    if (req.file) {
      certificateData.image = {
        url: req.file.path,       // or your cloudinary url
        publicId: req.file.filename, // or your cloudinary public_id
      };
    }

    const certificate = await Certificate.create(certificateData);
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = { url: req.file.path, publicId: req.file.filename };
    if (typeof data.skills === "string") data.skills = JSON.parse(data.skills);
    const cert = await Certificate.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!cert) return sendError(res, "Certificate not found", 404);
    return sendSuccess(res, cert, "Certificate updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return sendError(res, "Certificate not found", 404);
    if (cert.image?.publicId) await cloudinary.uploader.destroy(cert.image.publicId);
    await cert.deleteOne();
    return sendSuccess(res, null, "Certificate deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};