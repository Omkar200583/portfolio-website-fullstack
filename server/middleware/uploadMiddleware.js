import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const createStorage = (
  folder,
  allowedFormats = ["jpg", "jpeg", "png", "webp", "gif"]
) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `portfolio/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    },
  });

const imageFileFilter = (req, file, callback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return callback(null, true);
  }

  return callback(
    new Error("Only JPG, PNG, WEBP and GIF images are allowed"),
    false
  );
};

const researchFileFilter = (req, file, callback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return callback(null, true);
  }

  return callback(
    new Error("Only supported images and PDF files are allowed"),
    false
  );
};

export const uploadProject = multer({
  storage: createStorage("projects"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadCertificate = multer({
  storage: createStorage("certificates"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadAvatar = multer({
  storage: createStorage("avatars"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadResume = multer({
  storage: createStorage("resumes", [
    "pdf",
    "doc",
    "docx",
  ]),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadBlog = multer({
  storage: createStorage("blog"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const researchUploader = multer({
  storage: createStorage("research", [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "pdf",
  ]),
  fileFilter: researchFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export const uploadResearchFile = (req, res, next) => {
  researchUploader.single("file")(req, res, (error) => {
    if (error) {
      const status = error instanceof multer.MulterError ? 400 : 400;

      return res.status(status).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "File too large. Maximum size is 20 MB."
            : error.message || "File upload failed",
      });
    }

    next();
  });
};