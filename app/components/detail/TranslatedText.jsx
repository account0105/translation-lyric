import sanitizeHtml from "sanitize-html";
import React from "react";
import * as deepl from "deepl-node";

const TranslatedText = async ({ text }) => {
    const authKey = "221d12b7-6162-4ab3-85be-4dfd17a90a6f:fx";
    const translator = new deepl.Translator(authKey);

    // <br> でテキストを行ごとに分割
    const lines = text.split(/(<br\s*\/?>)/g);
    const translatedLines = [];

    // 各行を翻訳
    for (const line of lines) {
        if (line.trim() === '<br>') {
            translatedLines.push(line); // <br> タグはそのまま保持
        } else if (line.trim()) {
            const result = await translator.translateText(line, "en", "ja", {
                tagHandling: "html",
            });
            translatedLines.push(result.text);
        } else {
            translatedLines.push(line); // 空行を保持
        }
    }

    // 翻訳結果を結合
    const translatedText = translatedLines.join('');

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(translatedText),
            }}
        ></div>
    );
};

export default TranslatedText;
