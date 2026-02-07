import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "그린링크 비즈",
    description: "농가/판매자 전용 비즈프로필 관리 대시보드",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#22c55e",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${inter.className} antialiased bg-gray-100`}>
                <div className="max-w-lg mx-auto bg-white min-h-screen shadow-xl">
                    {children}
                </div>
            </body>
        </html>
    );
}
