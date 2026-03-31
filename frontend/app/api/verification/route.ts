import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const fileUri = formData.get("file_uri") as string;

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
      file_url: fileUri,
    }),
  });

  const data = await response.json();
  console.log(`returned from backend for file ${fileUri}`, data);

  return NextResponse.json(data);
}
