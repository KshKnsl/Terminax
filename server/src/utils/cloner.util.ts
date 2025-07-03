import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import simpleGit from "simple-git";
import { ProjectInterface } from "../models/project";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  endpoint: process.env.FILEBASE_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.FILEBASE_BUCKET_NAME!;

async function uploadFolderToFileBase(project: ProjectInterface, localPath: string): Promise<string> {
  async function walkAndUpload(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const s3Key = `${project.ownerId}/${project.name}/${prefix}${entry.name}`;
      if (entry.isDirectory()) {
        await walkAndUpload(fullPath, `${prefix}${entry.name}/`);
      } else {
        const fileContent = fs.readFileSync(fullPath);
        const params = {
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileContent,
        };
        await s3Client.send(new PutObjectCommand(params));
        console.log(`Uploaded ${s3Key}`);
      }
    }
  }
  await walkAndUpload(localPath, "");
  fs.rmSync(localPath, { recursive: true, force: true });
  return `https://${BUCKET_NAME}.s3.filebase.com/${project.ownerId}/${project.name}/`;
}

export async function cloneRepository(
  project: ProjectInterface,
  accessToken?: string
): Promise<string> {
  const git = simpleGit();
  const repoName = project.repo_name || project.name;
  const localPath = path.join(__dirname, `../../cloned_repos/${repoName}`);
  if (fs.existsSync(localPath)) fs.rmSync(localPath, { recursive: true, force: true });
  fs.mkdirSync(localPath, { recursive: true });

  if (project.repo_url) {
    let repoUrl = project.repo_url;
    if (accessToken) {
      repoUrl = repoUrl.replace(
        /^https:\/\/(github\.com)/,
        `https://${accessToken}:x-oauth-basic@$1`
      );
    }
    await git.clone(repoUrl, localPath);
  } else if (project.template) {
    const templatePath = path.join(__dirname, `../../templates/${project.template}`);
    fs.cpSync(templatePath, localPath, { recursive: true });
  }
  return uploadFolderToFileBase(project, localPath);
}
