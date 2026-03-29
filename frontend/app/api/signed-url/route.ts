// app/api/signed-url/route.ts
import { Storage } from '@google-cloud/storage'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
const storage = new Storage()

export async function POST(req: NextRequest) {
  const { fileName } = await req.json()

  const objectPath = `tia-uploads/${randomUUID()}-${fileName}`

  const [signedUrl] = await storage
    .bucket(process.env.GCS_BUCKET_NAME!)
    .file(objectPath)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType: 'application/pdf',
    })

  return NextResponse.json({ signedUrl, objectPath })
}