import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

/**
 * Ensures that the upload directory and any subdirectories exist.
 */
export async function ensureUploadDir(subDir?: string) {
  const fullPath = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR;
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }
  return fullPath;
}

/**
 * Saves a File object to the local storage.
 * @param file The file to save.
 * @param subDir The subdirectory within uploads (e.g., 'resumes', 'lab-images').
 * @returns An object containing the file key, url, and original name.
 */
export async function saveFile(file: File, subDir: string) {
  const dir = await ensureUploadDir(subDir);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Create a unique file name
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${safeName}`;
  const filePath = path.join(dir, fileName);
  
  await writeFile(filePath, buffer);
  
  return {
    key: fileName,
    url: `/api/files/${subDir}/${fileName}`,
    name: file.name
  };
}

/**
 * Deletes a file from local storage.
 * @param fileName The name of the file to delete.
 * @param subDir The subdirectory within uploads.
 */
export async function deleteFile(fileName: string, subDir: string) {
  const filePath = path.join(UPLOAD_DIR, subDir, fileName);
  if (existsSync(filePath)) {
    try {
      await unlink(filePath);
      return true;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }
  return false;
}
