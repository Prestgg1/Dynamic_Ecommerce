import { createHash, createHmac } from 'crypto';
import { NotFoundException } from '@nestjs/common';

const SERVICE = 's3';
const EMPTY_PAYLOAD_HASH = createHash('sha256').update('').digest('hex');

type MinioConfig = {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
};

type SignedRequest = {
  url: string;
  headers: Record<string, string>;
};

let bucketReady: Promise<void> | null = null;

function getConfig(): MinioConfig {
  return {
    endpoint: (process.env.MINIO_ENDPOINT ?? 'http://minio:9000').replace(
      /\/+$/,
      '',
    ),
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    bucket: process.env.MINIO_BUCKET ?? 'dynamic-ecommerce',
    region: process.env.MINIO_REGION ?? 'us-east-1',
  };
}

function hashHex(input: Buffer | string) {
  return createHash('sha256').update(input).digest('hex');
}

function hmac(key: Buffer | string, data: string) {
  return createHmac('sha256', key).update(data).digest();
}

function formatAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

function encodePathPart(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function objectPath(bucket: string, key?: string) {
  const bucketPath = encodePathPart(bucket);
  if (!key) return `/${bucketPath}`;

  return `/${bucketPath}/${key.split('/').map(encodePathPart).join('/')}`;
}

function signingKey(secretKey: string, dateStamp: string, region: string) {
  const dateKey = hmac(`AWS4${secretKey}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, SERVICE);
  return hmac(serviceKey, 'aws4_request');
}

function signRequest(
  method: string,
  key?: string,
  body: Buffer = Buffer.alloc(0),
  contentType?: string,
): SignedRequest {
  const config = getConfig();
  const now = new Date();
  const amzDate = formatAmzDate(now);
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = body.length ? hashHex(body) : EMPTY_PAYLOAD_HASH;
  const url = new URL(`${config.endpoint}${objectPath(config.bucket, key)}`);

  const headers: Record<string, string> = {
    host: url.host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };

  if (contentType) {
    headers['content-type'] = contentType;
  }

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderNames
    .map((header) => `${header}:${headers[header].trim()}\n`)
    .join('');
  const signedHeaders = signedHeaderNames.join(';');
  const canonicalRequest = [
    method,
    url.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');
  const credentialScope = `${dateStamp}/${config.region}/${SERVICE}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    hashHex(canonicalRequest),
  ].join('\n');
  const signature = createHmac(
    'sha256',
    signingKey(config.secretKey, dateStamp, config.region),
  )
    .update(stringToSign)
    .digest('hex');

  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${config.accessKey}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(', ');

  const requestHeaders: Record<string, string> = { ...headers, authorization };
  delete requestHeaders.host;

  return { url: url.toString(), headers: requestHeaders };
}

async function ensureBucket() {
  if (bucketReady) return bucketReady;

  bucketReady = (async () => {
    const head = signRequest('HEAD');
    const headResponse = await fetch(head.url, {
      method: 'HEAD',
      headers: head.headers,
    });

    if (headResponse.ok) return;

    if (headResponse.status !== 404) {
      throw new Error(`MinIO bucket check failed: ${headResponse.status}`);
    }

    const put = signRequest('PUT');
    const putResponse = await fetch(put.url, {
      method: 'PUT',
      headers: put.headers,
    });

    if (!putResponse.ok) {
      throw new Error(`MinIO bucket create failed: ${putResponse.status}`);
    }
  })().catch((error) => {
    bucketReady = null;
    throw error;
  });

  return bucketReady;
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
) {
  await ensureBucket();

  const signed = signRequest('PUT', key, body, contentType);
  const response = await fetch(signed.url, {
    method: 'PUT',
    headers: signed.headers,
    body: new Uint8Array(body),
  });

  if (!response.ok) {
    throw new Error(`MinIO upload failed: ${response.status}`);
  }
}

export async function getObject(key: string) {
  const signed = signRequest('GET', key);
  const response = await fetch(signed.url, {
    method: 'GET',
    headers: signed.headers,
  });

  if (response.status === 404) {
    throw new NotFoundException('Image not found');
  }

  if (!response.ok) {
    throw new Error(`MinIO image fetch failed: ${response.status}`);
  }

  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType:
      response.headers.get('content-type') ?? 'application/octet-stream',
    etag: response.headers.get('etag') ?? undefined,
  };
}
