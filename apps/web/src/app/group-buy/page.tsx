'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, ChevronRight, TrendingUp, Flame, Sparkles } from 'lucide-react';
import { useGroupBuyStore, FLOWER_CATEGORIES } from '@greenlink/lib';
import type { GroupBuyDeal } from '@greenlink/lib';

/* ── 상태 뱃지 설정 ── */
const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
    RECRUITING: { label: '모집 중', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
    GOAL_MET: { label: '모집 완료!', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
    PURCHASING: { label: '사입 중', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' },
    DELIVERING: { label: '배송 중', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200' },
    COMPLETED: { label: '완료', color: 'text-gray-500', bgColor: 'bg-gray-50 border-gray-200' },
    CANCELLED: { label: '취소', color: 'text-red-500', bgColor: 'bg-red-50 border-red-200' },
};

function DealCard({ deal }: { deal: GroupBuyDeal }) {
    const progress = Math.round((deal.currentCount / deal.targetCount) * 100);
    const remaining = deal.targetCount - deal.currentCount;
    const statusConf = STATUS_CONFIG[deal.status];
    const deadlineDate = new Date(deal.deadline);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return (
        <Link href={`/group-buy/${deal.id}`} className="block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden active:scale-[0.98]">
                {/* 상품 이미지 영역 */}
                <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                    <span className="text-6xl">{deal.image}</span>

                    {/* 상태 뱃지 */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-xs font-bold ${statusConf.bgColor} ${statusConf.color}`}>
                        {statusConf.label}
                    </div>

                    {/* D-day */}
                    {deal.status === 'RECRUITING' && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-gray-200">
                            D-{daysLeft}
                        </div>
                    )}

                    {/* HOT 뱃지 */}
                    {progress >= 70 && deal.status === 'RECRUITING' && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3" /> HOT
                        </div>
                    )}
                </div>

                {/* 상품 정보 */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{deal.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">{deal.description}</p>

                    {/* 가격 */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-black text-green-600">
                            {deal.sellingPrice.toLocaleString()}원
                        </span>
                        <span className="text-xs text-gray-400">배송비 {deal.deliveryFee.toLocaleString()}원</span>
                    </div>

                    {/* 참여 프로그레스 */}
                    <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                <span className="font-bold text-green-600">{deal.currentCount}명</span> / {deal.targetCount}명
                            </span>
                            <span className="font-bold text-green-600">{progress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${progress >= 100
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                        : progress >= 70
                                            ? 'bg-gradient-to-r from-orange-400 to-red-500'
                                            : 'bg-gradient-to-r from-green-400 to-emerald-500'
                                    }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* 하단 안내 */}
                    {deal.status === 'RECRUITING' && remaining > 0 && (
                        <p className="text-xs text-orange-600 font-medium">
                            🚀 {remaining}명만 더 모이면 출발!
                        </p>
                    )}
                    {deal.status === 'GOAL_MET' && (
                        <p className="text-xs text-blue-600 font-bold">
                            ✅ 모집 완료! 사입을 기다리고 있어요
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function GroupBuyListPage() {
    const { deals } = useGroupBuyStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredDeals = selectedCategory === 'all'
        ? deals
        : deals.filter(d => d.categoryId === selectedCategory);

    const recruitingDeals = filteredDeals.filter(d => d.status === 'RECRUITING');
    const otherDeals = filteredDeals.filter(d => d.status !== 'RECRUITING');

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3 p-4">
                    <Link href="/" className="text-gray-600 hover:text-green-600">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">공동구매</h1>
                    <Sparkles className="w-5 h-5 text-green-500" />
                </div>

                {/* 카테고리 필터 */}
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        전체
                    </button>
                    {FLOWER_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.id
                                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* 안내 배너 */}
            <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white">
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">경매장 직거래 공동구매</p>
                        <p className="text-xs text-green-100 mt-1">
                            인원이 모이면 경매장에서 직접 사입! 중간마진 없이 신선한 꽃을 받아보세요 🌸
                        </p>
                    </div>
                </div>
            </div>

            {/* 모집 중인 공구 */}
            {recruitingDeals.length > 0 && (
                <section className="p-4">
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        지금 모집 중
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">{recruitingDeals.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {recruitingDeals.map(deal => (
                            <DealCard key={deal.id} deal={deal} />
                        ))}
                    </div>
                </section>
            )}

            {/* 기타 상태 공구 */}
            {otherDeals.length > 0 && (
                <section className="p-4">
                    <h2 className="font-bold text-gray-800 mb-3">진행 현황</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {otherDeals.map(deal => (
                            <DealCard key={deal.id} deal={deal} />
                        ))}
                    </div>
                </section>
            )}

            {filteredDeals.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">이 카테고리에 진행 중인 공구가 없어요</p>
                    <p className="text-sm mt-1">곧 새로운 공구가 열릴 예정입니다!</p>
                </div>
            )}
        </div>
    );
}
