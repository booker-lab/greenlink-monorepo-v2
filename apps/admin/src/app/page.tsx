'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft, ChevronRight, ChevronDown, Share, Menu,
    Megaphone, FileText, Ticket, Calendar, Camera, Clock,
    Globe, Shield, Users, Tag, Bell, User, Film, Newspaper,
    Home, MessageSquare, Star, Image
} from "lucide-react";

type Tab = 'home' | 'news' | 'reviews' | 'photos';

export default function AdminHomePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('home');

    // Mock business data
    const business = {
        name: '초록농장',
        location: '증포동',
        category: '채소/과일',
        createdAt: '2026년 02월',
        recentPhotos: ['/placeholder-farm.jpg'],
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => router.back()} className="text-gray-600">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="text-gray-600">
                            <Share className="w-6 h-6" />
                        </button>
                        <button className="text-gray-600">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* 비즈니스 정보 */}
                <div className="px-4 pb-4 flex items-start justify-between">
                    <div>
                        <button className="flex items-center gap-1">
                            <h1 className="text-xl font-bold text-gray-900">{business.name}</h1>
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        </button>
                        <p className="text-sm text-gray-500 mt-1">{business.location} · {business.category}</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        단골 관리
                    </button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex border-b border-gray-200">
                    {[
                        { id: 'home', label: '홈' },
                        { id: 'news', label: '소식' },
                        { id: 'reviews', label: '후기' },
                        { id: 'photos', label: '사진' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === tab.id
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* 홈 탭 콘텐츠 */}
            {activeTab === 'home' && (
                <div className="p-4 space-y-4">

                    {/* 홍보 시작하기 카드 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-900">홍보 시작하기</h2>
                                <p className="text-sm text-gray-500 mt-1">동네 이웃 3천명에게 내 업체를 홍보할 수 있어요</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🔥</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200">
                            이어서 하기
                        </button>
                    </div>

                    {/* 퀵 액션 버튼들 */}
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { icon: Megaphone, label: '광고' },
                            { icon: FileText, label: '소식 작성' },
                            { icon: Ticket, label: '쿠폰' },
                            { icon: Calendar, label: '예약 관리' },
                        ].map((action, idx) => (
                            <button key={idx} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-gray-50">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <action.icon className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-xs text-gray-700">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 최근 사진 */}
                    <div className="flex gap-3">
                        <div className="relative w-40 h-40 bg-gray-200 rounded-xl overflow-hidden">
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                                방금 전
                            </div>
                            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                <span className="text-4xl">🥬</span>
                            </div>
                        </div>
                        <button className="flex-1 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500">
                            <Camera className="w-8 h-8" />
                            <span className="text-sm mt-2">사진 추가</span>
                        </button>
                    </div>

                    {/* 사업자 인증하기 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">사업자 인증 완료하기</h3>
                                <p className="text-sm text-gray-500 mt-1">인증을 완료하면 지금보다 더 많은 고객에게 노출돼요.</p>
                                <button className="text-green-600 font-medium text-sm mt-2">지금 인증하기</button>
                            </div>
                        </div>
                    </div>

                    {/* 업체 정보 누락 안내 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm">영업 시간을 입력해주세요.</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                            <Globe className="w-5 h-5" />
                            <span className="text-sm">홈페이지, SNS를 추가해주세요.</span>
                        </div>
                        <button className="w-full py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200">
                            업체 정보 관리
                        </button>
                    </div>

                    {/* 예약 섹션 */}
                    <SectionCard
                        title="예약"
                        description="예약을 등록하고 고객 예약을 받아보세요."
                        buttons={[{ label: '예약 관리', full: true }]}
                    />

                    {/* 가격 섹션 */}
                    <SectionCard
                        title="가격"
                        description="서비스나 메뉴 가격을 등록해보세요."
                        buttons={[
                            { label: '가격 관리' },
                            { label: '가격 사진 설정' },
                        ]}
                    />

                    {/* 쿠폰 섹션 */}
                    <SectionCard
                        title="쿠폰"
                        description="쿠폰을 만들고 단골 고객을 4배 더 많이 모아보세요."
                        buttons={[{ label: '쿠폰 관리', full: true }]}
                    />

                    {/* 공지 섹션 */}
                    <SectionCard
                        title="공지"
                        description="이벤트나 휴무 안내를 작성해보세요."
                        buttons={[{ label: '공지 관리', full: true }]}
                    />

                    {/* 소개 섹션 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900">소개</h3>
                                <p className="text-xs text-gray-400 mt-1">생성일: {business.createdAt}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">🌱</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">사장님 또는 업체 소개를 작성해보세요.</p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 text-sm">
                                사업자 정보 관리
                            </button>
                            <button className="flex-1 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 text-sm">
                                소개 관리
                            </button>
                        </div>
                    </div>

                    {/* 스토리 섹션 */}
                    <SectionCard
                        title="스토리"
                        description="업체를 소개하는 짧은 영상을 올려보세요."
                        buttons={[{ label: '스토리 올리기', full: true }]}
                    />

                    {/* 소식 섹션 */}
                    <SectionCard
                        title="소식"
                        description="소식을 작성하고 고객에게 가게를 알려보세요."
                        buttons={[{ label: '소식 작성', full: true }]}
                    />

                    {/* 초보 사장님 배너 */}
                    <button className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📚</span>
                            <span className="text-blue-700 font-medium text-sm">초보 사장님을 위한 무료 학습지 신청하기</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-blue-500" />
                    </button>

                    {/* 푸터 안내문 */}
                    <div className="text-xs text-gray-400 leading-relaxed mt-6">
                        <p className="font-medium text-gray-500 mb-2">마지막 수정일 2026년 2월 6일</p>
                        <p>
                            그린링크를 통해 홍보되는 게시글에는, 개별 판매자가 직접 입점하거나
                            채팅 기능을 통해 상품을 판매하는 경우가 포함되어 있습니다. 이
                            경우 그린링크는 통신판매중개자로서 통신판매의 당사자가 아니며, 해당
                            상품 및 품질, 거래 및 관련 정보, 교환 및 환불 등 의무와 책임을
                            부담하지 않습니다.
                        </p>
                    </div>
                </div>
            )}

            {/* 소식 탭 */}
            {activeTab === 'news' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Newspaper className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">아직 작성된 소식이 없어요</h3>
                    <p className="text-sm text-gray-500 mb-6">첫 소식을 작성해보세요!</p>
                    <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700">
                        소식 작성하기
                    </button>
                </div>
            )}

            {/* 후기 탭 */}
            {activeTab === 'reviews' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Star className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">아직 받은 후기가 없어요</h3>
                    <p className="text-sm text-gray-500">고객이 후기를 남기면 여기에 표시됩니다.</p>
                </div>
            )}

            {/* 사진 탭 */}
            {activeTab === 'photos' && (
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-1">
                        <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-3xl">🥬</span>
                        </div>
                        <button className="aspect-square border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500">
                            <Camera className="w-6 h-6" />
                            <span className="text-xs mt-1">추가</span>
                        </button>
                    </div>
                </div>
            )}

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                    {[
                        { icon: Home, label: '홈', active: true },
                        { icon: MessageSquare, label: '소식', active: false },
                        { icon: Star, label: '후기', active: false },
                        { icon: Image, label: '사진', active: false },
                    ].map((item, idx) => (
                        <button key={idx} className={`flex flex-col items-center ${item.active ? 'text-green-600' : 'text-gray-400'}`}>
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}

// 재사용 섹션 카드 컴포넌트
function SectionCard({
    title,
    description,
    buttons
}: {
    title: string;
    description: string;
    buttons: { label: string; full?: boolean }[];
}) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div className={`flex gap-2 ${buttons.length === 1 ? '' : ''}`}>
                {buttons.map((btn, idx) => (
                    <button
                        key={idx}
                        className={`${btn.full ? 'w-full' : 'flex-1'} py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 text-sm`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
