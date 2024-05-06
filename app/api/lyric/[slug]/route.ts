// app/api/song/[slug]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";
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
    { params }: { params: { slug: string} }
) {

     
    const targetUrl = params.slug; // スクレイピングしたいURL
    const { data } = await axios.get(targetUrl);
    const $ = cheerio.load(data);
    const result: Result[] = [];
    $(".Lyrics__Container-sc-1ynbvzw-1").each((index, element) => {
        result.push({
            html: $(element).html(), // `html()`メソッドを使用してHTML文字列を取得
        });
    });

    const toText = result[0].html;

    // 全てのHTMLタグを <br> に置き換えた後、余分な <br> を削除
    const outputString = toText.replace(/<[^>]*>/g, "<br>");

    // 余分な <br> を削除して1つにまとめる
    let compressedString = outputString
        .replace(/(<br>\s*)+/g, "<br>") // この部分で全ての <br> の連続を1つにまとめる
        .replace(/\[.*?\]/g, ""); // [] 内の内容を削除

    // 再度 <br> の連続を削除して一つにまとめる
    compressedString = compressedString.replace(/(<br>\s*)+/g, "<br>");





    return Response.json({ song: compressedString});
}
