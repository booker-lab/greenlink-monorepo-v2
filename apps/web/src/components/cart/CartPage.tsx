'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Truck } from 'lucide-react';

// 샘플 추천 상품 데이터
const recommendedProducts = [
    { id: 1, name: '신선한 로즈마리', price: 12000, originalPrice: 15000, image: '🌿', discount: 20 },
    { id: 2, name: '튤립 꽃다발', price: 25000, originalPrice: 30000, image: '🌷', discount: 17 },
    { id: 3, name: '다육이 세트', price: 18000, originalPrice: 22000, image: '🌵', discount: 18 },
    { id: 4, name: '허브 모음', price: 15000, originalPrice: 18000, image: '🌱', discount: 17 },
];

export default function CartPage() {
    const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');

    // 장바구니 및 찜한 상품 (일단 빈 상태)
    const cartItems: never[] = [];
    const wishlistItems: never[] = [];

    const currentItems = activeTab === 'cart' ? cartItems : wishlistItems;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* 프로모션 배너 */}
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <span className="text-sm font-medium">최대 10,000원 할인 받으세요!</span>
                </div>
                <button className="bg-white text-green-600 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                    쿠폰 받기
                </button>
            </div>

            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200">
                <div className="flex items-center px-4 py-3">
                    <Link href="/" className="mr-4">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800">장바구니</h1>
                </div>

                {/* 탭 */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${activeTab === 'cart'
                            ? 'text-gray-900'
                            : 'text-gray-400'
                            }`}
                    >
                        담은 상품 ({cartItems.length})
                        {activeTab === 'cart' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${activeTab === 'wishlist'
                            ? 'text-gray-900'
                            : 'text-gray-400'
                            }`}
                    >
                        찜한 상품 ({wishlistItems.length})
                        {activeTab === 'wishlist' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                        )}
                    </button>
                </div>
            </div>

            {/* 무료배송 안내 */}
            <div className="bg-green-600 text-white px-4 py-2.5 flex items-center justify-center gap-2">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-medium">그린링크는 모든 상품 무료배송</span>
            </div>

            {/* 상품 목록 또는 빈 상태 */}
            <div className="bg-white">
                {currentItems.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-400 text-sm mb-3">
                            {activeTab === 'cart' ? '담은 상품이 없습니다.' : '찜한 상품이 없습니다.'}
                        </p>
                        <Link
                            href="/"
                            className="text-green-600 text-sm font-medium underline hover:text-green-700"
                        >
                            쇼핑하러 가기
                        </Link>
                    </div>
                ) : (
                    <div>
                        {/* 상품 목록이 있을 경우 여기에 렌더링 */}
                    </div>
                )}
            </div>

            {/* 추천 특가 섹션 */}
            <div className="mt-2 bg-white">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">놓치면 아쉬울 특가!</h2>
                    <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        더 보기
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-px bg-gray-100">
                    {recommendedProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4">
                            <div className="text-5xl mb-3 text-center bg-gray-50 rounded-lg py-6">
                                {product.image}
                            </div>
                            <h3 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-red-500 font-bold text-sm">{product.discount}%</span>
                                <span className="text-gray-800 font-bold">
                                    {product.price.toLocaleString()}원
                                </span>
                            </div>
                            <span className="text-gray-400 text-xs line-through">
                                {product.originalPrice.toLocaleString()}원
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
