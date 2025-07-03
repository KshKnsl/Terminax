import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import stream from "stream";
import { promisify } from "util";
import { ProjectInterface } from "../models/project";
import { S3Client } from "@aws-sdk/client-s3";
import fs from "fs";

const s3 = new S3Client({
  endpoint: process.env.FILEBASE_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.FILEBASE_BUCKET_NAME;

export async function fetchProjectFilesFromFilebase(
  project: ProjectInterface,
  destFolder: string = "fetched_active_projects"
): Promise<string> {
  const key = `${project.ownerId}/${project.name}/`;
  const local = path.join(__dirname, `../../${destFolder}/${project.name}`);
  if (!fs.existsSync(local)) fs.mkdirSync(local, { recursive: true });

  const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: key }));
  console.log(`Listing objects in bucket ${bucket} with prefix ${key}`);
  console.log(`Found ${list}`);
  if (!list.Contents) return local;

  for (const obj of list.Contents) {
    if (!obj.Key || obj.Key.endsWith("/")) continue;
    const rel = obj.Key.substring(key.length);
    const path1 = path.join(local, rel);
    const dir = path.dirname(path1);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const get = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: obj.Key }));
    const pipe = promisify(stream.pipeline);
    await pipe(get.Body as NodeJS.ReadableStream, fs.createWriteStream(path1));
  }
  return local;
}
