'use client';

import Link from "next/link";
import { Search, ShoppingCart, Bell } from "lucide-react";
import HomeBanner from "@/components/home/HomeBanner";

export default function HomePage() {
    // Sample product data
    const products = [
        { id: 1, name: '신선한 로즈마리', price: 12000, image: '🌿', seller: '초록농장' },
        { id: 2, name: '튤립 꽃다발', price: 25000, image: '🌷', seller: '꽃밭농원' },
        { id: 3, name: '다육이 세트', price: 18000, image: '🌵', seller: '선인장마을' },
        { id: 4, name: '허브 모음', price: 15000, image: '🌱', seller: '향기정원' },
        { id: 5, name: '장미 한 송이', price: 8000, image: '🌹', seller: '로즈가든' },
        { id: 6, name: '해바라기', price: 10000, image: '🌻', seller: '해바라기농장' },
    ];

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

            {/* 배너 (v1에서 마이그레이션) */}
            <HomeBanner />

            {/* Quick Category Icons */}
            <div className="bg-white p-4 border-b border-gray-100">
                <div className="grid grid-cols-4 gap-4 text-center">
                    {['🌿 채소', '🍎 과일', '🌸 화훼', '🌾 곡물'].map((category, idx) => (
                        <Link key={idx} href="/category" className="flex flex-col items-center gap-2 hover:opacity-80">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-2xl">
                                {category.split(' ')[0]}
                            </div>
                            <span className="text-xs text-gray-600">{category.split(' ')[1]}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Today's Special */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 mb-2">오늘의 특가</h2>
                <div className="grid grid-cols-2 gap-3">
                    {products.slice(0, 2).map((product) => (
                        <div key={product.id} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-4xl mb-2 text-center">{product.image}</div>
                            <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                            <p className="text-green-600 font-bold">{product.price.toLocaleString()}원</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Feed */}
            <div className="bg-white">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">이번 주 인기 상품</h2>
                </div>
                <div className="grid grid-cols-2 gap-px bg-gray-100">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white p-4">
                            <div className="text-5xl mb-3 text-center bg-gray-50 rounded-lg py-6">
                                {product.image}
                            </div>
                            <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                            <p className="text-green-600 font-bold text-base">{product.price.toLocaleString()}원</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 그린링크 비즈 홍보 배너 */}
            <div className="m-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-2">
                        <span className="text-2xl">🏪</span>
                    </div>
                    <h3 className="font-bold text-gray-800">내가 찾던 손님</h3>
                    <p className="text-sm text-gray-600">모두 그린링크에 있어요</p>
                    <p className="text-xs text-green-600 mt-1">내 동네 근처 이웃 152,847명</p>
                </div>
                <a
                    href="http://localhost:3001"
                    className="block w-full py-3 bg-gray-900 text-white font-semibold rounded-lg text-center hover:bg-gray-800 transition-colors"
                >
                    그린링크 비즈 시작하기 →
                </a>
                <p className="text-center text-xs text-gray-500 mt-2">
                    비즈프로필은 등록부터 사용까지 <span className="text-green-600 font-medium">무료예요!</span>
                </p>
            </div>
        </div>
    );
}
