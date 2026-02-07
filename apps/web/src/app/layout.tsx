import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "그린링크",
    description: "하이퍼로컬 화훼/농수산 직거래 플랫폼",
    themeColor: "#22c55e",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="antialiased bg-gray-50">
                <div className="max-w-lg mx-auto bg-white min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
