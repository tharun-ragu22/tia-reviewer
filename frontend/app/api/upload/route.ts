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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file){
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    await uploadToCloud(file);
    return NextResponse.json({ message: 'File uploaded successfully' });
}