import multer from "multer";
import path from "path";

type MulterCallback = (error: Error | null, value: string) => void;

const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: MulterCallback) =>
    cb(null, "uploads/"),
  filename: (_req: Express.Request, file: Express.Multer.File, cb: MulterCallback) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export default multer({ storage });
