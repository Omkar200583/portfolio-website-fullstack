import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


const createStorage = (folder, allowedFormats = ["jpg", "jpeg", "png", "webp", "gif"]) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `portfolio/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"), false);
};

export const uploadProject = multer({ storage: createStorage("projects"), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadCertificate = multer({ storage: createStorage("certificates"), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadAvatar = multer({ storage: createStorage("avatars"), fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
export const uploadResume = multer({
  storage: createStorage("resumes", ["pdf", "doc", "docx"]),
  limits: { fileSize: 10 * 1024 * 1024 },
});
export const uploadBlog = multer({ storage: createStorage("blog"), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });