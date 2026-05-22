import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';

// Ensure the key is exactly 32 bytes by slicing or padding
const getEncryptionKey = (): Buffer => {
  const rawKey = env.ENCRYPTION_KEY;
  if (rawKey.length >= 32) {
    return Buffer.from(rawKey.substring(0, 32), 'utf8');
  }
  return Buffer.from(rawKey.padEnd(32, '0'), 'utf8');
};

const KEY = getEncryptionKey();

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: iv:ciphertext:authTag
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypts an encrypted string (iv:ciphertext:authTag) using AES-256-GCM.
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format. Expected iv:ciphertext:authTag');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const ciphertext = parts[1];
  const authTag = Buffer.from(parts[2], 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
