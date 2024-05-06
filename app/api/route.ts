
import { NextResponse } from 'next/server';

interface Song {
  language: string;
  // 他に必要なフィールドを追加
}

export async function GET(request: Request) {
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  
  const url = new URL(request.url);
  const songInfoParam = url.searchParams.get('song_info');

  if (!songInfoParam) {
    return NextResponse.json({ error: 'song_info parameter is missing' }, { status: 400 });
  }

  const res = await fetch(`https://api.genius.com${songInfoParam}?access_token=${token}`);

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch song info' }, { status: res.status });
  }

  const songInfo: { response: { song: Song } } = await res.json();
  const song = songInfo.response.song;

  return NextResponse.json({ song });
}
