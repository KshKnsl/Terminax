import multer from 'multer';
import path from 'path';

interface MulterDestinationCallback {
    (error: Error | null, destination: string): void;
}

interface MulterFilenameCallback {
    (error: Error | null, filename: string): void;
}

const storage = multer.diskStorage({
        destination: function (
                req: Express.Request, 
                file: any,
                cb: MulterDestinationCallback
        ) {
                cb(null, 'uploads/')
        },
        filename: function (
                req: Express.Request, 
                file: any,
                cb: MulterFilenameCallback
        ) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
});

const upload = multer({ storage: storage });

export default upload;
