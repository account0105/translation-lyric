import axios from "axios";
import cheerio from "cheerio";
import TranslatedText from "../../components/detail/Mobile";
import { Link } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
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

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: PageProps) {
    // const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    // const res = await fetch(
    //     `https://api.genius.com${searchParams.song_info}?access_token=${token}`
    // );
    // const songInfo: { response: { song: Song } } = await res.json();
    // const song = songInfo.response.song;
    // const OriginalLanguage = song.language;

    const targetUrl = searchParams.from; // スクレイピングしたいURL
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

    // 歌情報
    const url = process.env.NEXT_PUBLIC_PRRODUCT_URL;
    const { song_info, from, TranslatedLanguage } = searchParams;
    const songRes = await fetch(`${url}/api/song${song_info}`);
    const songData = await songRes.json();
    const song = songData.song;
    const OriginalLanguage = song.language;



    // const lyricRes = await fetch(
    //     `http://localhost:3000/api/lyric/${from}`
    // );
    // const lyric = await lyricRes.json();



    // song.mediaが三つ以上で縦並び
    const isThreeOrMoreMedia = song.media.length > 2;

    return (
        <div className="w-full">
            <div className="text-center text-3xl my-10">{song.title}</div>
            <div className="mb-10">
                <Card
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        maxWidth: "500px",
                        margin: "0 auto",
                    }}
                    className="dark:bg-slate-800 bg-gray-100 dark:text-white"
                >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography component="h5" variant="h5">
                                {song.artist_names}
                            </Typography>
                            <Typography component="p" variant="subtitle1">
                                release:{song.release_date}
                            </Typography>
                        </CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 1,
                                pb: 1,
                            }}
                        >
                            <div
                                className={
                                    isThreeOrMoreMedia ? "flex flex-col" : ""
                                }
                            >
                                {song.media.map((media, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            href={media.url}
                                            sx={{ margin: "0 0 0 10px" }}
                                        >
                                            {media.provider}
                                        </Link>
                                    );
                                })}
                            </div>
                        </Box>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ width: 151 }}
                        image={song.song_art_image_url}
                        alt={song.title}
                    />
                </Card>
            </div>
            
                <div className="flex justify-center">
                
                    <TranslatedText
                        text={compressedString}
                        originalLanguage={OriginalLanguage}
                        translatedLanguage={searchParams.TranslatedLanguage}
                    />
                </div>
        </div>
    );
}
