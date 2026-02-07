import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "그린링크",
    description: "하이퍼로컬 화훼/농수산 직거래 플랫폼",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
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
                <div className="max-w-lg mx-auto bg-white min-h-screen shadow-xl relative">
                    {children}
                    <BottomNav />
                </div>
            </body>
        </html>
    );
}
