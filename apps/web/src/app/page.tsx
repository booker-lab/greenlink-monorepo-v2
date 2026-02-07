import Link from "next/link";
import { Search, ShoppingCart, Bell, Home, Grid, User } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen pb-20">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-xl font-bold text-green-600">그린링크</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/search" className="text-gray-600 hover:text-green-600">
                            <Search className="w-6 h-6" />
                        </Link>
                        <Link href="/cart" className="text-gray-600 hover:text-green-600 relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                0
                            </span>
                        </Link>
                        <Link href="/notifications" className="text-gray-600 hover:text-green-600">
                            <Bell className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* 배너 */}
            <section className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <h2 className="text-lg font-bold mb-2">🌱 신선한 로컬 농산물</h2>
                <p className="text-sm text-green-100">우리 동네 농가에서 직접 만나보세요</p>
            </section>

            {/* 퀵 카테고리 */}
            <section className="p-4">
                <div className="grid grid-cols-4 gap-4">
                    {["🌷 화훼", "🥬 채소", "🍎 과일", "🌾 곡물"].map((cat, idx) => (
                        <button
                            key={idx}
                            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                            <span className="text-2xl mb-1">{cat.split(" ")[0]}</span>
                            <span className="text-xs text-gray-600">{cat.split(" ")[1]}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* 추천 상품 */}
            <section className="p-4">
                <h3 className="font-bold text-gray-800 mb-3">🔥 오늘의 추천</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { name: "싱싱한 장미 한 다발", price: 15000, emoji: "🌹" },
                        { name: "유기농 상추 세트", price: 8000, emoji: "🥬" },
                        { name: "제철 딸기 1kg", price: 12000, emoji: "🍓" },
                        { name: "튤립 꽃다발", price: 20000, emoji: "🌷" },
                    ].map((product, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-lg p-3">
                            <div className="text-4xl text-center mb-2 py-4 bg-gray-50 rounded">
                                {product.emoji}
                            </div>
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                                {product.name}
                            </h4>
                            <p className="text-green-600 font-bold">
                                {product.price.toLocaleString()}원
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                    <Link href="/" className="flex flex-col items-center text-green-600">
                        <Home className="w-6 h-6" />
                        <span className="text-xs mt-1">홈</span>
                    </Link>
                    <Link href="/category" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                        <Grid className="w-6 h-6" />
                        <span className="text-xs mt-1">카테고리</span>
                    </Link>
                    <Link href="/search" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                        <Search className="w-6 h-6" />
                        <span className="text-xs mt-1">검색</span>
                    </Link>
                    <Link href="/mypage" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                        <User className="w-6 h-6" />
                        <span className="text-xs mt-1">마이</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
