'use client';

import Link from "next/link";
import { Search, ShoppingCart, Bell, Shield, MapPin, Users, ChevronRight } from "lucide-react";
import HomeBanner from "@/components/home/HomeBanner";
import { DEAR_ORCHID_FARM, DEAR_ORCHID_PRODUCTS } from "@greenlink/lib";

export default function HomePage() {
    const farm = DEAR_ORCHID_FARM;
    const products = DEAR_ORCHID_PRODUCTS.filter(p => p.status === 'active');

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

            {/* 🏡 우리 동네 추천 농장 - 당근마켓 비즈프로필 스타일 */}
            <div className="bg-white border-b-8 border-gray-100">
                <div className="p-4 pb-2">
                    <h2 className="font-bold text-gray-800 text-lg">🏡 우리 동네 추천 농장</h2>
                    <p className="text-xs text-gray-500 mt-0.5">내 동네 이천에서 인증된 농가예요</p>
                </div>
                <div className="px-4 pb-4">
                    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl border border-green-200 overflow-hidden shadow-sm">
                        {/* 농장 프로필 헤더 */}
                        <div className="p-4 pb-3">
                            <div className="flex items-start gap-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                                    {farm.profileEmoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-base">{farm.name}</h3>
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            <Shield className="w-3 h-3" /> 인증
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        <span>{farm.location.city} {farm.location.district}</span>
                                        <span>·</span>
                                        <span>{farm.category}/{farm.subcategory}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{farm.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* 신뢰 지표 */}
                        <div className="px-4 py-3 bg-white/60 border-t border-green-100">
                            <div className="flex justify-around items-center">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <span className="text-lg">{farm.greenTemperature.emoji}</span>
                                        <span className="text-xl font-black text-green-600">{farm.greenTemperature.value}°C</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">그린 온도</p>
                                </div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <Users className="w-4 h-4 text-gray-600" />
                                        <span className="text-xl font-bold text-gray-800">{farm.followers}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">단골</p>
                                </div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-bold text-green-700">농업경영체</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">인증 완료</p>
                                </div>
                            </div>
                        </div>

                        {/* 온도 게이지 바 */}
                        <div className="px-4 pb-2">
                            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                    style={{ width: `${farm.greenTemperature.value}%` }}
                                />
                            </div>
                        </div>

                        {/* 태그 */}
                        <div className="px-4 py-3 border-t border-green-100 bg-white/40">
                            <div className="flex gap-1.5 flex-wrap">
                                {farm.tags.slice(0, 5).map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-4 py-3 bg-white border-t border-green-100">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 text-green-700 font-semibold text-sm hover:bg-green-50 rounded-lg transition-colors">
                                농장 프로필 보기
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Special - 디어 오키드 상품 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 mb-2">오늘의 특가 🔥</h2>
                <div className="grid grid-cols-2 gap-3">
                    {products.filter(p => p.originalPrice).map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-2 text-center">{product.images[0]}</div>
                            <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-1">{farm.name}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-green-600 font-bold">{product.price.toLocaleString()}원</p>
                                {product.originalPrice && (
                                    <p className="text-gray-400 text-xs line-through">{product.originalPrice.toLocaleString()}원</p>
                                )}
                            </div>
                            {product.originalPrice && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded">
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Product Feed - 디어 오키드 전체 상품 */}
            <div className="bg-white">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">🌸 {farm.name}의 상품</h2>
                </div>
                <div className="grid grid-cols-2 gap-px bg-gray-100">
                    {products.map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`} className="bg-white p-4 hover:bg-gray-50 transition-colors">
                            <div className="text-5xl mb-3 text-center bg-gray-50 rounded-lg py-6">
                                {product.images[0]}
                            </div>
                            <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-1">{farm.name} · {farm.location.city}</p>
                            <p className="text-green-600 font-bold text-base">{product.price.toLocaleString()}원</p>
                            <p className="text-xs text-gray-400 mt-0.5">재고 {product.quantity}{product.unit}</p>
                        </Link>
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
