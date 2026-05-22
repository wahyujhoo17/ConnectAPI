import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';

// Base directory for local fallback storage
const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), 'storage');

export class StorageService {
  private static instance: StorageService;
  private isS3Configured = false;
  private s3Client: any = null; // Can be instantiated if AWS SDK / MinIO is available

  private constructor() {
    this.initStorage();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private async initStorage() {
    // Check if MinIO/S3 is configured
    if (env.MINIO_ACCESS_KEY && env.MINIO_SECRET_KEY) {
      try {
        // We could import S3 Client dynamically if needed
        // For development robustness, we default to local filesystem first
        // and log S3 configuration presence
        this.isS3Configured = false; 
      } catch (err) {
        console.error('Failed to initialize S3 Storage, falling back to local storage', err);
      }
    }

    // Ensure local storage directory exists
    try {
      await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true });
      await fs.mkdir(path.join(LOCAL_STORAGE_DIR, 'sessions'), { recursive: true });
      await fs.mkdir(path.join(LOCAL_STORAGE_DIR, 'media'), { recursive: true });
    } catch (err) {
      console.error('Failed to create local storage directories', err);
    }
  }

  private getLocalPath(key: string): string {
    return path.join(LOCAL_STORAGE_DIR, key);
  }

  /**
   * Saves a file (string or buffer) to storage.
   * If S3 is configured, uploads to S3, otherwise saves to local filesystem.
   */
  public async saveFile(key: string, data: string | Buffer): Promise<void> {
    if (this.isS3Configured) {
      // S3 Implementation placeholder
      return;
    }

    const localPath = this.getLocalPath(key);
    // Ensure parent directory exists
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, data);
  }

  /**
   * Loads a file from storage as Buffer.
   */
  public async loadFile(key: string): Promise<Buffer> {
    if (this.isS3Configured) {
      // S3 Implementation placeholder
      return Buffer.from('');
    }

    const localPath = this.getLocalPath(key);
    return await fs.readFile(localPath);
  }

  /**
   * Loads a file from storage as String.
   */
  public async loadFileAsString(key: string): Promise<string> {
    const buffer = await this.loadFile(key);
    return buffer.toString('utf8');
  }

  /**
   * Deletes a file from storage.
   */
  public async deleteFile(key: string): Promise<void> {
    if (this.isS3Configured) {
      // S3 Implementation placeholder
      return;
    }

    const localPath = this.getLocalPath(key);
    try {
      await fs.unlink(localPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  /**
   * Checks if a file exists in storage.
   */
  public async fileExists(key: string): Promise<boolean> {
    if (this.isS3Configured) {
      // S3 Implementation placeholder
      return false;
    }

    const localPath = this.getLocalPath(key);
    try {
      await fs.access(localPath);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = StorageService.getInstance();
