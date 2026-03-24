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
    console.log(`got file ${file.name}`)

    if (!file){
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    await uploadToCloud(file);
    console.log(`${file.name} uploaded to cloud!`)
    const backendAPIUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendAPIUrl){
      return NextResponse.json({ error: 'Backend url not configured'}, {status: 500})
    };
    

    const response = await fetch(
      `${backendAPIUrl}/verify-report`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_url: `gs://tia-files/tia-uploads/${file.name}`
        })
      }
    )

    const data = await response.json();
    console.log(`returned from backend for file ${file.name}`, data)

    return NextResponse.json(data);
}