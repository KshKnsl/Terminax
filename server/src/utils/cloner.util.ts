import simpleGit from "simple-git";
import { ProjectInterface } from "../models/project";
export async function cloneRepository(project: ProjectInterface, accessToken?: string): Promise<string>
{
    const git = simpleGit();
    return "";
}