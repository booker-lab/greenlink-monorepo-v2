import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "그린링크 비즈",
    description: "농가/판매자 전용 비즈프로필 관리 대시보드",
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
                {children}
            </body>
        </html>
    );
}
