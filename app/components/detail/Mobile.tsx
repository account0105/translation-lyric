import sanitizeHtml from "sanitize-html";
import React from "react";
import * as deepl from "deepl-node";
import PageProps from "../../song/[title]/page"

interface TranslatedTextProps {
    text: string;
    originalLanguage: deepl.SourceLanguageCode;
    translatedLanguage: deepl.TargetLanguageCode;
}

interface TranslatedPair {
    original: string;
    translated: string;
}

const TranslatedText = async ({ ...props }: TranslatedTextProps) => {
    const { text, originalLanguage, translatedLanguage } = props;
    const authKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY;
    const translator = new deepl.Translator(authKey);
    // <br> でテキストを行ごとに分割
    const lines = text.split(/<br\s*\/?>/g);
    const translatedPairs: TranslatedPair[] = [];

    // 各行を翻訳して、原文と翻訳文のペアを作成
    for (const line of lines) {
        if (line.trim()) {
            const result = await translator.translateText(
                line,
                originalLanguage,
                translatedLanguage
            );
            translatedPairs.push({ original: line, translated: result.text });
            // translatedPairs.push({ original: line, translated: "[test translated text]" });
        }
    }

    // 翻訳結果を交互に表示
    return (
        <div>
            {translatedPairs.map((pair, index) => (
                <div key={index} className="px-8">
                    <p>{sanitizeHtml(pair.original)}</p>
                    <p>{sanitizeHtml(pair.translated)}</p>
                    <br /> {/* 行の区切り */}
                </div>
            ))}
        </div>
    );
};

export default TranslatedText;
