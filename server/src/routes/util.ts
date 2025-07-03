import express from "express";
import upload from "../middleware/multer";
import uploadImage from "../utils/uploadImage";

const router = express.Router();

router.post("/upload", upload.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = await uploadImage(req.file.path, "anonymous");
  res.json({ url });
});

export default router;
