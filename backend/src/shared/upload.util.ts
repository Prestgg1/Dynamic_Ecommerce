import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { getObject, uploadObject } from './minio.util';

const IMAGE_SIGNATURES = {
  'image/jpeg': {
    extension: '.jpg',
    matches: (buffer: Buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  'image/png': {
    extension: '.png',
    matches: (buffer: Buffer) =>
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a,
  },
  'image/webp': {
    extension: '.webp',
    matches: (buffer: Buffer) =>
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  },
} as const;

type AllowedImageMimeType = keyof typeof IMAGE_SIGNATURES;

function assertSafeImage(file: Express.Multer.File) {
  const config = IMAGE_SIGNATURES[file.mimetype as AllowedImageMimeType];

  if (!config || !file.buffer || !config.matches(file.buffer)) {
    throw new BadRequestException('Uploaded file is not a valid image');
  }

  return config.extension;
}

export async function persistUploadedImage(
  file: Express.Multer.File,
  options: { prefix: string },
) {
  const extension = assertSafeImage(file);
  const fileName = `${options.prefix}-${Date.now()}-${randomUUID()}${extension}`;

  await uploadObject(fileName, file.buffer, file.mimetype);

  return `/uploads/${fileName}`;
}

export async function getUploadedImage(fileName: string) {
  const safeName = fileName.trim();

  if (
    !safeName ||
    safeName.includes('/') ||
    safeName.includes('\\') ||
    safeName.includes('..')
  ) {
    throw new BadRequestException('Invalid image path');
  }

  return getObject(safeName);
}
