import express from "express";
import upload from "../middleware/multer";

const router = express.Router();

import uploadImage from "../utils/uploadImage";

router.post("/upload", upload.single("logo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const url = await uploadImage(req.file.path, "anonymous");
  res.json({ url });
});

export default router;
