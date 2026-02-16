import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "그린링크 드라이버",
    description: "배송기사 전용 배송 관리 앱",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#0ea5e9",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${inter.className} antialiased bg-gray-900`}>
                <div className="max-w-lg mx-auto bg-gray-900 min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
