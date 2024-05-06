import sanitizeHtml from "sanitize-html";
import React from "react";

const Original = ({ text }) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(text),
            }}
        ></div>
    );
};

export default Original;
