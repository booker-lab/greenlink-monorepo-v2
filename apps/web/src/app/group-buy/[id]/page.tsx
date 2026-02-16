'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Users, Clock, TrendingUp, Share2,
    CheckCircle2, Truck, Package, Info, ChevronDown,
    ChevronUp, MapPin, Shield
} from 'lucide-react';
import { useGroupBuyStore, FLOWER_CATEGORIES } from '@greenlink/lib';

/* ── 상태별 UI 설정 ── */
const STATUS_UI: Record<string, { label: string; color: string; bg: string; icon: typeof Package }> = {
    RECRUITING: { label: '모집 중', color: 'text-green-600', bg: 'bg-green-50', icon: Users },
    GOAL_MET: { label: '모집 완료! 사입 대기 중', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 },
    PURCHASING: { label: '경매장서 사입 중', color: 'text-amber-600', bg: 'bg-amber-50', icon: Package },
    DELIVERING: { label: '배송 중', color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck },
    COMPLETED: { label: '배송 완료', color: 'text-gray-500', bg: 'bg-gray-50', icon: CheckCircle2 },
    CANCELLED: { label: '취소/불발', color: 'text-red-500', bg: 'bg-red-50', icon: Info },
};

export default function GroupBuyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { getDealById, joinDeal } = useGroupBuyStore();
    const [showAuctionInfo, setShowAuctionInfo] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [joined, setJoined] = useState(false);

    const deal = getDealById(params.id as string);

    if (!deal) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg">공구를 찾을 수 없어요</p>
                    <Link href="/group-buy" className="text-green-600 text-sm underline mt-2 inline-block">
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const progress = Math.round((deal.currentCount / deal.targetCount) * 100);
    const remaining = deal.targetCount - deal.currentCount;
    const statusUI = STATUS_UI[deal.status];
    const StatusIcon = statusUI.icon;
    const category = FLOWER_CATEGORIES.find(c => c.id === deal.categoryId);
    const deadlineDate = new Date(deal.deadline);
    const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

    const handleJoin = () => {
        if (joined || deal.status !== 'RECRUITING') return;

        joinDeal(deal.id, {
            id: `p-${Date.now()}`,
            name: '나',
            phone: '010-0000-0000',
            address: '서울 강남구',
            joinedAt: new Date().toISOString(),
            quantity: 1,
        });
        setJoined(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => router.back()} className="text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-base font-bold text-gray-800 truncate mx-4">공구 상세</h1>
                    <button className="text-gray-500">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* 상품 이미지 */}
            <div className="relative h-56 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <span className="text-8xl">{deal.image}</span>
                {category && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600">
                        {category.icon} {category.name}
                    </div>
                )}
            </div>

            {/* 상태 배너 */}
            <div className={`mx-4 -mt-4 relative z-10 px-4 py-3 rounded-xl border ${statusUI.bg} flex items-center gap-3`}>
                <StatusIcon className={`w-5 h-5 ${statusUI.color}`} />
                <span className={`font-bold text-sm ${statusUI.color}`}>{statusUI.label}</span>
                {deal.status === 'RECRUITING' && (
                    <span className="ml-auto text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> D-{daysLeft}
                    </span>
                )}
            </div>

            {/* 상품 정보 */}
            <div className="p-4">
                <h2 className="text-xl font-black text-gray-900 mb-2">{deal.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{deal.description}</p>
            </div>

            {/* 가격 카드 */}
            <div className="mx-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">판매가</span>
                    <span className="text-2xl font-black text-green-600">
                        {deal.sellingPrice.toLocaleString()}원
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>배송비</span>
                    <span>+{deal.deliveryFee.toLocaleString()}원</span>
                </div>
                <hr className="my-3 border-gray-100" />
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">1인 결제 금액</span>
                    <span className="text-lg font-black text-gray-900">
                        {(deal.sellingPrice + deal.deliveryFee).toLocaleString()}원
                    </span>
                </div>
            </div>

            {/* 참여 프로그레스 */}
            <div className="mx-4 mt-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        참여 현황
                    </span>
                    <span className="text-sm">
                        <span className="font-black text-green-600 text-lg">{deal.currentCount}</span>
                        <span className="text-gray-400"> / {deal.targetCount}명</span>
                    </span>
                </div>

                {/* 프로그레스 바 (큰 버전) */}
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${progress >= 100
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                : progress >= 70
                                    ? 'bg-gradient-to-r from-orange-400 to-red-500 animate-pulse'
                                    : 'bg-gradient-to-r from-green-400 to-emerald-500'
                            }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                {deal.status === 'RECRUITING' && remaining > 0 && (
                    <p className="text-center text-sm font-bold text-orange-600">
                        🚀 {remaining}명만 더 모이면 구매가 시작됩니다!
                    </p>
                )}
                {deal.status === 'GOAL_MET' && (
                    <p className="text-center text-sm font-bold text-blue-600">
                        ✅ 목표 인원 달성! 경매장 사입을 진행합니다
                    </p>
                )}

                {/* 참여자 목록 토글 */}
                <button
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="w-full mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                >
                    참여자 목록 {showParticipants ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showParticipants && (
                    <div className="mt-2 space-y-2">
                        {deal.participants.map((p, idx) => (
                            <div key={p.id} className="flex items-center gap-3 text-xs text-gray-500 py-1">
                                <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                                    {idx + 1}
                                </div>
                                <span className="font-medium text-gray-700">{p.name}</span>
                                <span className="flex items-center gap-1 ml-auto">
                                    <MapPin className="w-3 h-3" />
                                    {p.address.split(' ').slice(0, 2).join(' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 경매 시세 정보 */}
            {deal.auctionRef && (
                <div className="mx-4 mt-4">
                    <button
                        onClick={() => setShowAuctionInfo(!showAuctionInfo)}
                        className="w-full p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
                    >
                        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            경매 시세 정보
                        </span>
                        {showAuctionInfo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {showAuctionInfo && (
                        <div className="mt-2 p-4 bg-white rounded-2xl border border-gray-100">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-400 text-xs">정산일자</span>
                                    <p className="font-medium text-gray-700">{deal.auctionRef.settlementDate}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">구분</span>
                                    <p className="font-medium text-gray-700">{deal.auctionRef.flowerType}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">품목/품종</span>
                                    <p className="font-medium text-gray-700">{deal.auctionRef.itemName} · {deal.auctionRef.varietyName}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">등급</span>
                                    <p className="font-medium text-gray-700">{deal.auctionRef.grade}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">평균 단가</span>
                                    <p className="font-bold text-green-600">{deal.auctionRef.avgPrice.toLocaleString()}원</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">단가 범위</span>
                                    <p className="font-medium text-gray-700">
                                        {deal.auctionRef.minPrice.toLocaleString()} ~ {deal.auctionRef.maxPrice.toLocaleString()}원
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">1박스 수량</span>
                                    <p className="font-medium text-gray-700">{deal.auctionRef.unitSize}본</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">일일 거래량</span>
                                    <p className="font-medium text-gray-700">{deal.auctionRef.totalQuantity.toLocaleString()}본</p>
                                </div>
                            </div>
                            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                                <p className="text-[10px] text-gray-400 text-center">
                                    출처: 한국농수산식품유통공사 화훼 경매 시세 (data.go.kr)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 안내사항 */}
            <div className="mx-4 mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-green-800">공동구매 안내</p>
                        <ul className="text-xs text-green-700 mt-2 space-y-1.5 leading-relaxed">
                            <li>• 목표 인원이 모이면 경매장에서 직접 사입합니다</li>
                            <li>• 인원이 모이지 않으면 자동 취소되며 결제되지 않습니다</li>
                            <li>• 사입 후 PV5 차량으로 당일~익일 배송됩니다</li>
                            <li>• 참여 취소는 모집 마감 전까지 가능합니다</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 예상 배송일 */}
            {deal.deliveryDate && (
                <div className="mx-4 mt-4 p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-purple-500" />
                    <div>
                        <p className="text-xs text-gray-400">예상 배송일</p>
                        <p className="font-bold text-sm text-gray-700">{deal.deliveryDate}</p>
                    </div>
                </div>
            )}

            {/* 하단 고정 참여 버튼 */}
            {deal.status === 'RECRUITING' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
                    <div className="max-w-lg mx-auto flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <p className="text-xs text-gray-400">1인 결제금</p>
                            <p className="font-black text-lg text-gray-900">
                                {(deal.sellingPrice + deal.deliveryFee).toLocaleString()}원
                            </p>
                        </div>
                        <button
                            onClick={handleJoin}
                            disabled={joined}
                            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.97] ${joined
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-300'
                                }`}
                        >
                            {joined ? '✅ 참여 완료!' : `공구 참여하기 (${remaining}자리 남음)`}
                        </button>
                    </div>
                </div>
            )}

            {deal.status === 'GOAL_MET' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-blue-50 border-t border-blue-200 z-50">
                    <p className="text-center font-bold text-blue-700">
                        ✅ 모집 완료! 경매장 사입을 기다리고 있어요
                    </p>
                </div>
            )}
        </div>
    );
}
