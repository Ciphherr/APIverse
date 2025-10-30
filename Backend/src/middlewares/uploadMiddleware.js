import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const apiId = uuidv4();
    req.apiId = apiId; // attach apiId to request so controller can use it
    cb(null, `${apiId}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /json|yaml|yml/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extName) cb(null, true);
  else cb(new Error("Only JSON and YAML files are allowed"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
