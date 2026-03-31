import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

import { randomUUID } from "crypto";

const storage = new Storage({
  credentials: JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS!, 'utf-8')),
  projectId: process.env.GCP_PROJECT_ID,
});

async function getPresignedUrl(fileName: string) {
  const objectPath = `tia-uploads/${randomUUID()}-${fileName}`;
  const bucketName = process.env.GCS_BUCKET_NAME!;

  const [signedUrl] = await storage
    .bucket(bucketName)
    .file(objectPath)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType: "application/pdf",
    });

  const gcsUri = `gs://${process.env.GCS_BUCKET_NAME}/${objectPath}`;

  return [signedUrl, gcsUri];
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const fileName = formData.get("file_name") as string;
  console.log(`got file ${fileName}`);

  if (!fileName) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const [presignedUrl, file_uri] = await getPresignedUrl(fileName);

  return NextResponse.json(
    { presigned_url: presignedUrl, file_uri: file_uri },
    { status: 200 },
  );
  
}
