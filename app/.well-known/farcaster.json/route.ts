import { NextResponse } from 'next/server';

export async function GET() {
  // Basit placeholder - Farcaster manifest dosyası
  return NextResponse.json({
    name: 'Crowd Oracle',
    description: 'Geleceği Tahmin Et',
  });
}
