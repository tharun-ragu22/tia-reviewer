import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

import { randomUUID } from "crypto";

const storage = new Storage();

async function uploadToCloud(file: File) {
  const fileName = file.name;

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

  await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/pdf" },
    body: file,
  });
  const gcsUri = `gs://${process.env.GCS_BUCKET_NAME}/${objectPath}`;

  return gcsUri;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  console.log(`got file ${file.name}`);

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const presignedUrl = await uploadToCloud(file);
  console.log(`${file.name} uploaded to cloud!`);
  const backendAPIUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendAPIUrl) {
    return NextResponse.json(
      { error: "Backend url not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(`${backendAPIUrl}/verify-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_url: presignedUrl,
    }),
  });

  const data = await response.json();
  console.log(`returned from backend for file ${file.name}`, data);

  return NextResponse.json(data);
}
