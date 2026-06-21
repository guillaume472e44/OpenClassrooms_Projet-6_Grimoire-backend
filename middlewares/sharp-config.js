import sharp from "sharp";

export default async (req, res, next) => {
  try {
    if (req.file) {
      const destination = "images";
      const filename = `${JSON.parse(req.body.book).title.replaceAll(" ", "_")}${Date.now()}.webp`;

      await sharp(req.file.buffer)
        .resize(404, 456, { fit: "contain", background: "#fff" })
        .webp({ quality: 92 })
        .toFile(`${destination}/${filename}`);

      req.file.filename = filename;
      req.file.mimetype = "image/webp";
      req.file.destination = destination;
      req.file.path = `${destination}\\${filename}`;

      next();
    } else next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};
