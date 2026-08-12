import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env';

export type UploadTarget = 'image' | 'pdf' | 'video' | 'file';

export type FileUpload = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

export function getStorageKey(target: UploadTarget, filename: string) {
  const safeName = filename.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  return `${target}s/${Date.now()}-${safeName}`;
}

function inferTarget(mimeType: string): UploadTarget {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'file';
}

function requireR2Config() {
  const missing = [
    ['R2_ENDPOINT', env.r2Endpoint],
    ['R2_ACCESS_KEY_ID', env.r2AccessKeyId],
    ['R2_SECRET_ACCESS_KEY', env.r2SecretAccessKey],
    ['R2_BUCKET', env.r2Bucket],
    ['R2_PUBLIC_BASE_URL', env.r2PublicBaseUrl]
  ].filter(([, value]) => !value);

  if (missing.length) {
    throw new Error(`Configuração R2 incompleta: ${missing.map(([key]) => key).join(', ')}`);
  }
}

async function uploadToR2(file: FileUpload, key: string) {
  requireR2Config();
  const client = new S3Client({
    region: 'auto',
    endpoint: env.r2Endpoint,
    credentials: {
      accessKeyId: env.r2AccessKeyId!,
      secretAccessKey: env.r2SecretAccessKey!
    }
  });

  await client.send(
    new PutObjectCommand({
      Bucket: env.r2Bucket!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  return `${env.r2PublicBaseUrl!.replace(/\/$/, '')}/${key}`;
}

async function uploadToLocal(file: FileUpload, key: string) {
  const uploadPath = path.resolve(process.cwd(), env.uploadDir);
  const targetPath = path.join(uploadPath, key);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, file.buffer);
  return `${env.publicBaseUrl}/uploads/${key}`;
}

export async function saveUploadedFile(file: FileUpload) {
  const target = inferTarget(file.mimetype);
  const key = getStorageKey(target, file.originalname);
  const url = env.storageDriver === 'r2' ? await uploadToR2(file, key) : await uploadToLocal(file, key);

  return {
    originalName: file.originalname,
    filename: key,
    mimeType: file.mimetype,
    size: file.size,
    url
  };
}
