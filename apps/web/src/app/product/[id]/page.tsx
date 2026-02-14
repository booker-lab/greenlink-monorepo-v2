'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Home, ShoppingCart, Share2, Heart, ChevronRight,
    ChevronDown, Star, Shield, MapPin, Truck, MessageCircle,
    ThumbsUp, Clock, Gift
} from 'lucide-react';
import {
    DEAR_ORCHID_FARM, DEAR_ORCHID_PRODUCTS, MOCK_REVIEWS
} from '@greenlink/lib';
import type { Product, Review } from '@greenlink/lib';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    // 상품 찾기
    const product = DEAR_ORCHID_PRODUCTS.find(p => p.id === productId);
    const farm = DEAR_ORCHID_FARM;
    const allProducts = DEAR_ORCHID_PRODUCTS.filter(p => p.status === 'active');
    const reviews = MOCK_REVIEWS.filter(r => r.productId === productId);
    const allReviews = MOCK_REVIEWS;

    // 전체 리뷰 평점 계산
    const avgRating = allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : '0.0';

    const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
    const [isWished, setIsWished] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // 타이머 (팔도감 스타일 - 오늘 자정까지)
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            const diff = end.getTime() - now.getTime();
            if (diff <= 0) { setTimeLeft('00:00:00'); return; }
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            setTimeLeft(`${h}:${m}:${s}`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">🔍</p>
                    <p className="text-gray-500">상품을 찾을 수 없습니다</p>
                    <button onClick={() => router.push('/')} className="mt-4 text-green-600 font-medium">
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const discountPercent = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const toggleAccordion = (key: string) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* ───────── 헤더 (팔도감 스타일) ───────── */}
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
                        <Link href="/cart" className="text-gray-600 relative">
                            <ShoppingCart className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ───────── 1. 할인 배너 (팔도감: 추천 할인 -15,132원) ───────── */}
            {product.originalPrice && (
                <div className="bg-green-50 py-2.5 px-4 flex items-center justify-center gap-2">
                    <span className="text-green-700 text-sm font-medium">
                        🎉 추천 할인 <span className="font-bold">-{(product.originalPrice - product.price).toLocaleString()}원</span> 이 적용됐어요
                    </span>
                </div>
            )}

            {/* ───────── 2. 상품 이미지 + 뱃지 + 타이머 ───────── */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="aspect-square flex items-center justify-center">
                    <span className="text-[120px]">{product.images[0] || '📦'}</span>
                </div>

                {/* 추천 뱃지 */}
                <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-green-600 text-white text-xs font-bold rounded-md shadow-sm">
                        추천
                    </span>
                </div>

                {/* 할인율 뱃지 */}
                {discountPercent > 0 && (
                    <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow-sm">
                            오늘특가
                        </span>
                    </div>
                )}

                {/* 타이머 오버레이 (팔도감 스타일) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-2 px-4 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                        그린특가 <span className="font-mono font-bold">{timeLeft}</span> 남음
                    </span>
                </div>
            </div>

            {/* ───────── 3. 판매자 프로필 (팔도감: 강원춘천 이용우) ───────── */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <Link href={`/farm/${farm.id}`} className="flex items-center gap-2 hover:opacity-80">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-sm">
                        {farm.profileEmoji}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">
                            {farm.location.city}{farm.location.district}
                        </span>
                        <span className="text-sm text-gray-800 font-bold">{farm.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                </Link>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Share2 className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* ───────── 4. 상품명 + 별점 + 후기 수 ───────── */}
            <div className="px-4 pb-3">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={`w-4 h-4 ${i <= Math.round(Number(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">{allReviews.length}개 후기 보기</span>
                </div>
            </div>

            {/* ───────── 5. 할인율 + 가격 + 긴급성 문구 ───────── */}
            <div className="px-4 pb-4 border-b border-gray-100">
                {discountPercent > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice?.toLocaleString()}원</span>
                    </div>
                )}
                <div className="flex items-baseline gap-2">
                    {discountPercent > 0 && (
                        <span className="text-2xl font-black text-red-500">{discountPercent}%</span>
                    )}
                    <span className="text-2xl font-black text-gray-900">{product.price.toLocaleString()}원</span>
                    {discountPercent > 0 && (
                        <span className="text-xs text-green-700 font-medium bg-green-50 px-1.5 py-0.5 rounded">그린특가</span>
                    )}
                </div>
                {product.originalPrice && (
                    <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-red-500">🔥</span>
                        <span className="text-xs text-red-600 font-medium">
                            내일 {(product.originalPrice - product.price).toLocaleString()}원 비싸져요
                        </span>
                    </div>
                )}
            </div>

            {/* ───────── 6. 배송 안내 배너 (팔도감 스타일) ───────── */}
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="bg-blue-50 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">산지 직송 · 무료배송</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {farm.location.city} {farm.location.district}에서 직접 배송해드려요
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-1">
                            주문 후 2~3일 내 수령 가능
                        </p>
                    </div>
                </div>
            </div>

            {/* ───────── 7. 후기 미리보기 (팔도감: 후기 3,956개) ───────── */}
            <div className="px-4 py-4 border-b-8 border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900 text-lg">후기 <span className="text-green-600">{allReviews.length}개</span></h2>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
                    >
                        전체보기 <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-1 mb-3 px-3 py-2 bg-yellow-50 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                        평점 {avgRating}로 고객 만족도가 높은 상품입니다
                    </span>
                </div>

                {/* 후기 카드 슬라이드 (팔도감 스타일) */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                    {allReviews.slice(0, 4).map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>

            {/* ───────── 8. 추천 상품 캐러셀 (팔도감: 팔도감 베스트 상품) ───────── */}
            <div className="px-4 py-4 border-b-8 border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg mb-3">🌸 디어 오키드 베스트 상품</h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                    {allProducts.map((p, idx) => (
                        <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            className="flex-shrink-0 w-36"
                        >
                            <div className="relative">
                                <div className="w-36 h-36 bg-gray-50 rounded-xl flex items-center justify-center text-4xl border border-gray-100">
                                    {p.images[0]}
                                </div>
                                {/* 순위 뱃지 */}
                                <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-gray-900/80 text-white text-xs font-bold rounded flex items-center justify-center">
                                    {idx + 1}
                                </div>
                                {p.originalPrice && (
                                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">
                                        추천
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                <p className="text-xs text-gray-500">{farm.location.city}{farm.location.district} {farm.name}</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5 line-clamp-2">{p.name}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {p.originalPrice && (
                                        <span className="text-sm font-bold text-red-500">
                                            {Math.round((1 - p.price / p.originalPrice) * 100)}%
                                        </span>
                                    )}
                                    <span className="text-sm font-bold text-gray-900">{p.price.toLocaleString()}원</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">무료배송</p>
                            </div>
                            <button
                                onClick={(e) => { e.preventDefault(); }}
                                className="w-full mt-2 py-1.5 text-xs font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                            >
                                장바구니 담기
                            </button>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ───────── 9. 탭: 상품 정보 / 후기 (팔도감 스타일 sticky) ───────── */}
            <div className="sticky top-[53px] z-40 bg-white border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-400'
                            }`}
                    >
                        상품 정보
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-400'
                            }`}
                    >
                        후기 {allReviews.length}개
                    </button>
                </div>
            </div>

            {/* ───────── 상품 정보 탭 ───────── */}
            {activeTab === 'info' && (
                <div>
                    {/* 상품 설명 */}
                    <div className="px-4 py-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">상품 설명</h3>

                        {/* 상세 이미지 영역 */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center mb-4">
                            <span className="text-[80px]">{product.images[0]}</span>
                        </div>

                        <div className={`text-sm text-gray-700 leading-relaxed ${!showFullDesc ? 'line-clamp-4' : ''}`}>
                            <p className="mb-3">{product.description}</p>
                            <p className="mb-3">
                                {farm.name}에서 직접 재배한 {product.category} 상품입니다.
                                {farm.location.city} {farm.location.district}에서 정성껏 키운 {product.name}을(를) 산지 직송으로 보내드립니다.
                            </p>
                            <p className="mb-3">
                                🌱 재배 환경: 적정 온도와 습도를 유지하며 자연 채광으로 건강하게 키웠습니다.<br />
                                📦 포장: 특수 포장재를 사용하여 배송 중 손상을 최소화합니다.<br />
                                🚚 배송: 주문 후 2~3일 내 수령 가능합니다.
                            </p>
                            <p>
                                ※ 식물 특성상 사진과 실제 상품의 형태가 다소 다를 수 있습니다.<br />
                                ※ 수령 후 즉시 개봉하여 통풍이 잘 되는 곳에 놓아주세요.
                            </p>
                        </div>

                        {/* 더보기 버튼 (팔도감 스타일) */}
                        <button
                            onClick={() => setShowFullDesc(!showFullDesc)}
                            className="w-full mt-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
                        >
                            상품정보 {showFullDesc ? '접기' : '더보기'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFullDesc ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* ───────── 10. 아코디언 (팔도감 스타일) ───────── */}
                    <div className="border-t border-gray-100">
                        {/* 배송 / 교환 / 반품 안내 */}
                        <AccordionItem
                            title="배송 / 교환 / 반품 안내"
                            isOpen={openAccordion === 'delivery'}
                            onToggle={() => toggleAccordion('delivery')}
                        >
                            <div className="space-y-3 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-800 mb-1">배송 안내</p>
                                    <p>· 배송비: 무료배송</p>
                                    <p>· 배송 기간: 주문일로부터 2~3일 (주말/공휴일 제외)</p>
                                    <p>· 산지 직송으로 신선한 상태로 배송됩니다</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 mb-1">교환 / 반품 안내</p>
                                    <p>· 수령일로부터 24시간 이내 접수</p>
                                    <p>· 식물 상태 이상 시 사진 첨부하여 문의</p>
                                    <p>· 단순 변심의 경우 반품 배송비 고객 부담</p>
                                </div>
                            </div>
                        </AccordionItem>

                        {/* 상품정보 제공고시 */}
                        <AccordionItem
                            title="상품정보 제공고시 (원재료 및 원산지 등)"
                            isOpen={openAccordion === 'notice'}
                            onToggle={() => toggleAccordion('notice')}
                        >
                            <div className="text-sm text-gray-600">
                                <table className="w-full">
                                    <tbody className="divide-y divide-gray-100">
                                        <tr><td className="py-2 text-gray-500 w-28">품명</td><td className="py-2 font-medium">{product.name}</td></tr>
                                        <tr><td className="py-2 text-gray-500">원산지</td><td className="py-2">{farm.location.city} {farm.location.district}</td></tr>
                                        <tr><td className="py-2 text-gray-500">판매자</td><td className="py-2">{farm.name} ({farm.owner})</td></tr>
                                        <tr><td className="py-2 text-gray-500">카테고리</td><td className="py-2">{farm.category} / {product.category}</td></tr>
                                        <tr><td className="py-2 text-gray-500">단위</td><td className="py-2">1{product.unit}</td></tr>
                                        <tr><td className="py-2 text-gray-500">연락처</td><td className="py-2">{farm.phone}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </AccordionItem>

                        {/* 채팅 문의하기 */}
                        <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-900">채팅 문의하기</p>
                                <p className="text-xs text-gray-500 mt-0.5">상품/배송/기타 궁금하신 내용을 문의하세요</p>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                문의하기
                            </button>
                        </div>
                    </div>

                    {/* 당신을 위한 추천 */}
                    <div className="px-4 py-6 border-t-8 border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">당신을 위한 추천</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {allProducts.filter(p => p.id !== productId).slice(0, 4).map(p => (
                                <Link key={p.id} href={`/product/${p.id}`} className="group">
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center text-4xl group-hover:bg-gray-100 transition-colors aspect-square">
                                        {p.images[0]}
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 mt-2 line-clamp-1">{p.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        {p.originalPrice && (
                                            <span className="text-sm font-bold text-red-500">
                                                {Math.round((1 - p.price / p.originalPrice) * 100)}%
                                            </span>
                                        )}
                                        <span className="text-sm font-bold text-gray-900">{p.price.toLocaleString()}원</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ───────── 후기 탭 ───────── */}
            {activeTab === 'reviews' && (
                <div className="px-4 py-6">
                    <div className="flex items-center gap-1 mb-4 px-3 py-2.5 bg-yellow-50 rounded-lg">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                            평점 {avgRating}로 고객 만족도가 높은 상품입니다
                        </span>
                    </div>

                    {allReviews.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-3">💬</p>
                            <p className="text-gray-500 text-sm">아직 작성된 후기가 없어요</p>
                            <p className="text-gray-400 text-xs mt-1">첫 번째 후기를 남겨보세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {allReviews.map(review => (
                                <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                                {review.author[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{review.author}</p>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{review.createdAt}</span>
                                    </div>
                                    {review.option && (
                                        <p className="text-xs text-gray-400 mb-2 bg-gray-50 px-2 py-1 rounded inline-block">
                                            옵션: {review.option}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
                                    {review.images.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {review.images.map((img, idx) => (
                                                <div key={idx} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                                    {img}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button className="flex items-center gap-1 mt-3 text-xs text-gray-400 hover:text-green-600">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        도움이 됐어요 {review.helpful}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ───────── 하단 고정 CTA (팔도감 스타일) ───────── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="max-w-lg mx-auto flex items-center gap-2 px-4 py-3">
                    {/* 찜 */}
                    <button
                        onClick={() => setIsWished(!isWished)}
                        className="flex flex-col items-center gap-0.5 px-2"
                    >
                        <Heart className={`w-6 h-6 transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        <span className="text-[10px] text-gray-500">찜</span>
                    </button>

                    {/* 선물하기 */}
                    <button className="flex flex-col items-center gap-0.5 px-2">
                        <Gift className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] text-gray-500">선물하기</span>
                    </button>

                    {/* 구매 버튼 (타이머 표시) */}
                    <button className="flex-1 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 text-center">
                        {timeLeft && (
                            <span className="font-mono">{timeLeft} 남음</span>
                        )}
                        {!timeLeft && '구매하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ───────── 후기 카드 컴포넌트 (팔도감 스타일 수평 스크롤) ─────────
function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            {review.option && (
                <p className="text-xs text-gray-400 mb-1.5">옵션: {review.option}</p>
            )}
            <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{review.content}</p>
            {review.images.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                    {review.images.map((img, idx) => (
                        <div key={idx} className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-100">
                            {img}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ───────── 아코디언 컴포넌트 ─────────
function AccordionItem({ title, isOpen, onToggle, children }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border-t border-gray-100">
            <button
                onClick={onToggle}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <span className="font-bold text-gray-900 text-sm">{title}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4">
                    {children}
                </div>
            )}
        </div>
    );
}
