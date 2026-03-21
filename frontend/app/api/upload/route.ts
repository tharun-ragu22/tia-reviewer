import { Storage } from '@google-cloud/storage'
import { NextRequest, NextResponse } from 'next/server'

const storage = new Storage()
const bucketName = 'tia-files'

async function uploadToCloud(file: File) {
  const destPath = `tia-uploads/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await storage.bucket(bucketName).file(destPath).save(buffer, {
    contentType: file.type,
  });
}

export async function POST(request: NextRequest) {
    console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS)
    console.log("GCS_BUCKET_NAME:", process.env.GCS_BUCKET_NAME)
    console.log("GCP_PROJECT_ID:", process.env.GCP_PROJECT_ID)
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file){
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    await uploadToCloud(file);
    return NextResponse.json({ message: 'File uploaded successfully' });
}