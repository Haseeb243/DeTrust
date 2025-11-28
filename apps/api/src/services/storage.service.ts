import crypto from 'crypto';
import lighthouse from '@lighthouse-web3/sdk';
import { fetch } from 'undici';
import { Prisma, SecureFileVisibility, type SecureFile, type SecureFileCategory, type SecureFileResourceType } from '@detrust/database';

import { config } from '../config';
import { prisma } from '../config/database';
import { AppError, ForbiddenError, NotFoundError } from '../middleware';

const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 210_000;

const MASTER_KEY = (() => {
  const secret = config.storage.encryption.masterKey;
  const isHex = /^[0-9a-fA-F]+$/.test(secret) && secret.length % 2 === 0;
  const buffer = Buffer.from(secret, isHex ? 'hex' : 'utf8');
  if (buffer.length < KEY_LENGTH) {
    throw new Error('FILE_ENCRYPTION_SECRET must resolve to at least 32 bytes');
  }
  return buffer;
})();

const toHex = (data: Buffer) => data.toString('hex');
const fromHex = (value: string) => Buffer.from(value, 'hex');

interface UploadSecureFileOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
  userId: string;
  category: SecureFileCategory;
  visibility?: SecureFileVisibility;
  resourceType?: SecureFileResourceType;
  resourceId?: string;
  metadata?: Prisma.JsonValue;
}

class StorageService {
  private deriveKey(salt: Buffer) {
    return crypto.pbkdf2Sync(MASTER_KEY, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha512');
  }

  private encrypt(buffer: Buffer) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = this.deriveKey(salt);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return { encrypted, salt, iv, authTag };
  }

  private decrypt(buffer: Buffer, saltHex: string, ivHex: string, authTagHex: string) {
    const salt = fromHex(saltHex);
    const iv = fromHex(ivHex);
    const authTag = fromHex(authTagHex);
    const key = this.deriveKey(salt);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
  }

  private async uploadToLighthouse(buffer: Buffer) {
    const response = await lighthouse.uploadBuffer(buffer, config.storage.lighthouse.apiKey);
    const cid = response?.data?.Hash;
    if (!cid) {
      throw new AppError('Failed to upload encrypted blob to Lighthouse');
    }
    return cid;
  }

  private async downloadFromLighthouse(cid: string) {
    const url = `${config.storage.lighthouse.gatewayUrl}/ipfs/${cid}`;
    const result = await fetch(url);
    if (!result.ok) {
      throw new AppError('Unable to fetch encrypted blob from Lighthouse', result.status);
    }
    const arrayBuffer = await result.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private checksum(buffer: Buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async uploadSecureFile(options: UploadSecureFileOptions): Promise<SecureFile> {
    const { buffer, filename, mimeType, size, userId, category, visibility, resourceType, resourceId, metadata } = options;
    const { encrypted, salt, iv, authTag } = this.encrypt(buffer);
    const cid = await this.uploadToLighthouse(encrypted);

    const secureFile = await prisma.secureFile.create({
      data: {
        userId,
        category,
        visibility: visibility ?? SecureFileVisibility.PRIVATE,
        storageProvider: 'LIGHTHOUSE',
        cid,
        filename,
        mimeType,
        size,
        checksum: this.checksum(buffer),
        encryptionSalt: toHex(salt),
        encryptionIv: toHex(iv),
        encryptionAuthTag: toHex(authTag),
        resourceType,
        resourceId,
        metadata,
      },
    });

    return secureFile;
  }

  async replaceCategoryFile(options: UploadSecureFileOptions): Promise<SecureFile> {
    await prisma.secureFile.updateMany({
      where: {
        userId: options.userId,
        category: options.category,
      },
      data: {
        visibility: SecureFileVisibility.PRIVATE,
      },
    });

    return this.uploadSecureFile(options);
  }

  async getAccessibleFile(fileId: string, viewerId?: string | null): Promise<SecureFile> {
    const secureFile = await prisma.secureFile.findUnique({ where: { id: fileId } });
    if (!secureFile) {
      throw new NotFoundError('File not found');
    }

    if (secureFile.visibility === SecureFileVisibility.PUBLIC) {
      return secureFile;
    }

    if (secureFile.visibility === SecureFileVisibility.AUTHENTICATED) {
      if (!viewerId) {
        throw new ForbiddenError('Authentication required to view this file');
      }
      return secureFile;
    }

    if (secureFile.userId !== viewerId) {
      throw new ForbiddenError('You do not have access to this file');
    }

    return secureFile;
  }

  async downloadDecryptedFile(file: SecureFile) {
    const ciphertext = await this.downloadFromLighthouse(file.cid);
    return this.decrypt(ciphertext, file.encryptionSalt, file.encryptionIv, file.encryptionAuthTag);
  }
}

export const storageService = new StorageService();
export default storageService;
