import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Hit } from "../page";

interface ResultProps {
    data: Hit[];
    language: string;
}

const Result = ({ data, language }: ResultProps) => {
    return (
        <div>
            <div className="w-3/4 mx-auto max-w-3xl mt-8">
                {data &&
                    data.map((data, index) => {
                        return (
                            <div
                                key={index}
                                className="mb-3 shadow dark:bg-gray-700 bg-blue-100 rounded"
                            >
                                <Link
                                    href={{
                                        pathname: `/song/${data.result.title}`,
                                        query: {
                                            from: data.result.url,
                                            song_info: data.result.api_path,
                                            TranslatedLanguage:language,
                                        },
                                    }}
                                >
                                    <div className="flex">
                                        <Image
                                            src={data.result.song_art_image_url}
                                            width={200}
                                            height={200}
                                            alt={data.result.title}
                                            className="w-24 rounded max-h-24"
                                        />
                                        <div className="ml-8 mt-4">
                                            <p className="text-xl">
                                                {data.result.title}
                                            </p>
                                            <p className="text-md">
                                                {data.result.artist_names}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Result;
