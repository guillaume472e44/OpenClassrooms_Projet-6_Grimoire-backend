import multer from "multer";

function fileFilter(req, file, callback) {
  if (file.mimetype.split("/")[0] !== "image") {
    return callback(new Error("Seules les images sont autorisées"), false);
  }
  callback(null, true);
}

export default multer({ storage: multer.memoryStorage(), fileFilter }).single(
  "image",
);
