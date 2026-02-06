import Link from "next/link";
import { Plus, Store, Package, MessageSquare, Star, Settings } from "lucide-react";

export default function AdminHomePage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 비즈프로필 헤더 */}
            <div className="bg-white">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <Store className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">초록농장</h1>
                            <p className="text-sm text-green-100">화훼 · 채소 전문</p>
                        </div>
                        <Link href="/settings" className="text-white/80 hover:text-white">
                            <Settings className="w-6 h-6" />
                        </Link>
                    </div>

                    {/* 그린 온도 */}
                    <div className="mt-4 bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">그린 온도</span>
                            <span className="text-lg font-bold">42.5°C 🌱</span>
                        </div>
                        <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all"
                                style={{ width: "70%" }}
                            />
                        </div>
                    </div>
                </div>

                {/* 단골 수 / 소식 */}
                <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-800">128</p>
                        <p className="text-sm text-gray-500">단골</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-800">24</p>
                        <p className="text-sm text-gray-500">소식</p>
                    </div>
                </div>
            </div>

            {/* 빠른 액션 버튼 */}
            <div className="p-4">
                <Link
                    href="/products/new"
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    상품 등록하기
                </Link>
            </div>

            {/* 메뉴 탭 */}
            <div className="bg-white mt-2">
                <nav className="flex border-b border-gray-100">
                    <button className="flex-1 py-4 text-center font-medium text-green-600 border-b-2 border-green-600">
                        상품
                    </button>
                    <button className="flex-1 py-4 text-center font-medium text-gray-400 hover:text-gray-600">
                        소식
                    </button>
                    <button className="flex-1 py-4 text-center font-medium text-gray-400 hover:text-gray-600">
                        리뷰
                    </button>
                </nav>

                {/* 상품 목록 (빈 상태) */}
                <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">등록된 상품이 없습니다</p>
                    <Link
                        href="/products/new"
                        className="text-green-600 font-medium hover:underline"
                    >
                        첫 상품 등록하기
                    </Link>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="flex justify-around items-center h-16">
                    <Link href="/" className="flex flex-col items-center text-green-600">
                        <Store className="w-6 h-6" />
                        <span className="text-xs mt-1">홈</span>
                    </Link>
                    <Link href="/products" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                        <Package className="w-6 h-6" />
                        <span className="text-xs mt-1">상품</span>
                    </Link>
                    <Link href="/news" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-xs mt-1">소식</span>
                    </Link>
                    <Link href="/reviews" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                        <Star className="w-6 h-6" />
                        <span className="text-xs mt-1">리뷰</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
