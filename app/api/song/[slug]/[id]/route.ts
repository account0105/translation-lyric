// app/api/song/[slug]/route.ts

import * as deepl from "deepl-node";

interface Result {
    html: string | null;
}

interface Song {
    title: string;
    artist_names: string;
    release_date: string;
    language: deepl.SourceLanguageCode;
    media: MediaProperty[];
    song_art_image_url: string;
}

interface MediaProperty {
    url: string;
    provider: string;
}

interface PageProps {
    searchParams: {
        from: string;
        song_info: string;
        TranslatedLanguage: deepl.TargetLanguageCode;
    };
}

export async function GET(
    req: Request,
    { params }: { params: { slug: string; id: string } }
) {
    const url = new URL(req.url);
    const song_info1 = params.slug;
    const song_info2 = params.id;

    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const res = await fetch(
        `https://api.genius.com/${song_info1}/${song_info2}?access_token=${token}`
    );
    const songInfo: { response: { song: Song } } = await res.json();

    const song = songInfo.response.song;



    return Response.json({ song: song });
}
