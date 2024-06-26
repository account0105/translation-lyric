import "./globals.css";
import Header from "./components/header/Header";
import { Providers } from "./providers";
import { Inter } from "@next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

// Interフォントを定義、weightオプションで使用したいフォントウェイトを指定
const inter = Inter({
    subsets: ["latin"],
    weight: "200", // フォントウェイトを100に設定
});

export const metadata = {
    title: "Lyric Translation",
    description: "Lyric Translation app",
};



export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja" suppressHydrationWarning className={inter.className}>
            <body className="dark:bg-slate-900 bg-slate-50 text-black dark:text-white">
                <ThemeProvider theme={theme}>
                    <Providers>
                        <Header />
                        {children}
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
