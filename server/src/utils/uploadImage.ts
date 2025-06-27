import { v2 } from "cloudinary";
import "dotenv/config";

export default async function uploadImage(localUrl: string, id: string): Promise<string> {
  v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUNIDARY_API_KEY,
    api_secret: process.env.CLOUNIDARY_API_SECRET,
  });

  let public_id = `${id}_${Date.now()}`;
  await v2.uploader.upload(localUrl, { public_id: public_id }).catch((error: Error) => {
    console.error(error);
  });
  const autoCropUrl = v2.url(public_id, {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  return autoCropUrl;
}
