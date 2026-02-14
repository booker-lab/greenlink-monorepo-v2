'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Home, ShoppingCart, Share2, Star, Heart,
    Search, ChevronRight, Flag
} from 'lucide-react';
import {
    DEAR_ORCHID_FARM, DEAR_ORCHID_PRODUCTS, MOCK_REVIEWS
} from '@greenlink/lib';
import type { Product, Review } from '@greenlink/lib';

export default function FarmProfilePage() {
    const params = useParams();
    const router = useRouter();
    const farmId = params.id as string;

    // 현재는 디어 오키드만 존재
    const farm = DEAR_ORCHID_FARM;
    const products = DEAR_ORCHID_PRODUCTS.filter(p => p.status === 'active');
    const reviews = MOCK_REVIEWS;

    // 평균 별점
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');

    // 카테고리 목록
    const categories = ['전체', ...Array.from(new Set(products.map(p => p.category)))];

    // 필터링
    const filteredProducts = products.filter(p => {
        const matchCategory = selectedCategory === '전체' || p.category === selectedCategory;
        const matchSearch = searchQuery === '' || p.name.includes(searchQuery);
        return matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* ───────── 헤더 ───────── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.back()} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">그린링크</h1>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-gray-600">
                            <Home className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="text-gray-600">
                            <ShoppingCart className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ───────── 판매자 프로필 (팔도감 스타일) ───────── */}
            <div className="px-4 py-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-2xl shadow-md">
                            {farm.profileEmoji}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {farm.location.city}{farm.location.district} {farm.name}
                            </h2>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-700">{avgRating}</span>
                                <span className="text-sm text-gray-400">({reviews.length.toLocaleString()})</span>
                            </div>
                        </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        공유
                    </button>
                </div>
                <p className="text-sm text-green-600 mt-3 leading-relaxed">
                    {farm.description}
                </p>
            </div>

            {/* ───────── 탭: 상품 / 후기 ───────── */}
            <div className="sticky top-[53px] z-40 bg-white border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'products'
                            ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}`}
                    >
                        상품
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews'
                            ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}`}
                    >
                        후기
                    </button>
                </div>
            </div>

            {/* ───────── 상품 탭 ───────── */}
            {activeTab === 'products' && (
                <div>
                    {/* 검색 */}
                    <div className="px-4 pt-4 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`${farm.name}님의 상품 검색`}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    {/* 카테고리 필터 (팔도감: 전체, 간편식, 가공·양념육...) */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* 상품 그리드 (2열, 팔도감 스타일) */}
                    <div className="grid grid-cols-2 gap-3 px-4 py-3">
                        {filteredProducts.map(product => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group">
                                {/* 상품 이미지 */}
                                <div className="relative rounded-xl overflow-hidden">
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center text-5xl group-hover:bg-gray-100 transition-colors">
                                        {product.images[0]}
                                    </div>
                                    {/* 추천 뱃지 */}
                                    {product.originalPrice && (
                                        <div className="absolute bottom-2 left-2">
                                            <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">추천</span>
                                        </div>
                                    )}
                                    {/* 하트 */}
                                    <button
                                        onClick={e => { e.preventDefault(); }}
                                        className="absolute bottom-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                                    >
                                        <Heart className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                {/* 상품 정보 */}
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">{farm.location.city}{farm.location.district} {farm.name}</p>
                                    <p className="text-sm font-medium text-gray-800 mt-0.5 line-clamp-2 leading-snug">{product.name}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {product.originalPrice && (
                                            <span className="text-sm font-bold text-red-500">
                                                {Math.round((1 - product.price / product.originalPrice) * 100)}%
                                            </span>
                                        )}
                                        <span className="text-sm font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                                    </div>
                                    {product.originalPrice && (
                                        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-0.5">
                                            🔥 내일 {(product.originalPrice - product.price).toLocaleString()}원 비싸져요
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-gray-500">
                                            {avgRating} ({reviews.filter(r => r.productId === product.id).length || Math.floor(Math.random() * 50 + 10)})
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">무료배송</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
                        </div>
                    )}
                </div>
            )}

            {/* ───────── 후기 탭 (팔도감 스타일) ───────── */}
            {activeTab === 'reviews' && (
                <div>
                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-3">💬</p>
                            <p className="text-gray-500 text-sm">아직 작성된 후기가 없어요</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {reviews.map(review => {
                                const reviewProduct = DEAR_ORCHID_PRODUCTS.find(p => p.id === review.productId);
                                return (
                                    <div key={review.id} className="px-4 py-5">
                                        {/* 리뷰 헤더: 작성자 + 구매횟수 + 신고 */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 text-sm">{review.author}</span>
                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                                                    {Math.floor(Math.random() * 20 + 1)}번 구매
                                                </span>
                                            </div>
                                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                                                <Flag className="w-3 h-3" />
                                                신고하기
                                            </button>
                                        </div>

                                        {/* 별점 + 날짜 */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">{review.createdAt}</span>
                                        </div>

                                        {/* 옵션 */}
                                        {review.option && (
                                            <p className="text-xs text-gray-500 mb-2">옵션: {review.option}</p>
                                        )}

                                        {/* 리뷰 이미지 */}
                                        {review.images.length > 0 && (
                                            <div className="flex gap-2 mb-3">
                                                {review.images.map((img, idx) => (
                                                    <div key={idx} className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-4xl border border-gray-100">
                                                        {img}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 리뷰 텍스트 */}
                                        <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">
                                            {review.content}
                                        </p>

                                        {/* 상품 카드 (팔도감 스타일: 리뷰 아래 구매 상품 표시) */}
                                        {reviewProduct && (
                                            <Link
                                                href={`/product/${reviewProduct.id}`}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100">
                                                    {reviewProduct.images[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500">{farm.location.city}{farm.location.district} {farm.name}</p>
                                                    <p className="text-sm font-medium text-gray-800 truncate">{reviewProduct.name}</p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        {reviewProduct.originalPrice && (
                                                            <span className="text-sm font-bold text-red-500">
                                                                {Math.round((1 - reviewProduct.price / reviewProduct.originalPrice) * 100)}%
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-bold text-gray-900">{reviewProduct.price.toLocaleString()}원</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
