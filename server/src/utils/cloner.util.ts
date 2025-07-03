import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import simpleGit from "simple-git";
import { ProjectInterface } from "../models/project";
import fs from "fs";
import path from "path";

const s3 = new S3Client({
  endpoint: process.env.FILEBASE_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.FILEBASE_BUCKET_NAME;

async function uploadFolderToFileBase(
  project: ProjectInterface,
  localPath: string
): Promise<string> {
  async function walkAndUpload(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || prefix.includes("/.git/") || entry.name === ".git")
        continue;
      const fullPath = path.join(dir, entry.name);
      const key = `${project.ownerId}/${project.name}/${prefix}${entry.name}`;
      if (entry.isDirectory()) await walkAndUpload(fullPath, `${prefix}${entry.name}/`);
      else {
        try {
          const content = fs.readFileSync(fullPath);
          const params = {
            Bucket: bucket,
            Key: key,
            Body: content,
          };
          await s3.send(new PutObjectCommand(params));
          console.log(`Uploaded ${key}`);
        } catch (err: any) {
          console.error(`403 Forbidden uploading ${key}:`, err.message || err);
        }
      }
    }
  }
  await walkAndUpload(localPath, "");
  fs.rmSync(localPath, { recursive: true, force: true });
  return `https://${bucket}.s3.filebase.com/${project.ownerId}/${project.name}/`;
}

export async function cloneRepository(
  project: ProjectInterface,
  accessToken?: string
): Promise<string> {
  const git = simpleGit();
  const name = project.repo_name || project.name;
  const local = path.join(__dirname, `../../cloned_repos/${name}`);
  if (fs.existsSync(local)) fs.rmSync(local, { recursive: true, force: true });
  fs.mkdirSync(local, { recursive: true });

  if (project.repo_url) {
    let url = project.repo_url;
    if (accessToken) {
      url = url.replace(
        /^https:\/\/(github\.com)/,
        `https://${accessToken}:x-oauth-basic@$1`
      );
    }
    await git.clone(url, local);
  } else if (project.template) {
    const template = path.join(__dirname, `../../../templates/${project.template}`);
    fs.cpSync(template, local, { recursive: true });
  }
  return uploadFolderToFileBase(project, local);
}
