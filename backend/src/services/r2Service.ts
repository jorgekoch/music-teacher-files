import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID!;
const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;

const publicBucket = process.env.R2_PUBLIC_BUCKET!;
const privateBucket = process.env.R2_PRIVATE_BUCKET!;
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL!;

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();
}

export async function uploadPublicFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  folder = "uploads"
) {
  const safeName = sanitizeFileName(originalName);
  const key = `${folder}/${Date.now()}-${safeName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: publicBucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );

  return {
    key,
    url: `${publicBaseUrl}/${key}`,
  };
}

export async function uploadPrivateFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  userId: number,
  folderId: number
) {
  const safeName = sanitizeFileName(originalName);
  const key = `users/${userId}/folders/${folderId}/${Date.now()}-${safeName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: privateBucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );

  return { key };
}

export async function deletePublicFile(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: publicBucket,
      Key: key,
    })
  );
}

export async function deletePrivateFile(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: privateBucket,
      Key: key,
    })
  );
}

export async function generatePrivateFileUrl(key: string, expiresIn = 300) {
  const command = new GetObjectCommand({
    Bucket: privateBucket,
    Key: key,
  });

  return getSignedUrl(r2, command, { expiresIn });
}