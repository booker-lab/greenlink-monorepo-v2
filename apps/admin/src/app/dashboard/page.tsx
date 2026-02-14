'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft, ChevronRight, ChevronDown, Share, Menu,
    Megaphone, FileText, Ticket, Calendar, Camera, Clock,
    Globe, Shield, Home, MessageSquare, Star, Image, Plus, Package, Trash2,
    ExternalLink, Eye, Truck
} from "lucide-react";
import Link from "next/link";
import { DEAR_ORCHID_FARM } from "@greenlink/lib";
import { useProductStore } from "@greenlink/lib";

type Tab = 'home' | 'news' | 'reviews' | 'photos';

export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('home');

    // 디어 오키드 실제 데이터 사용
    const business = {
        name: DEAR_ORCHID_FARM.name,
        location: DEAR_ORCHID_FARM.location.district,
        category: `${DEAR_ORCHID_FARM.category}/${DEAR_ORCHID_FARM.subcategory}`,
        createdAt: '2026년 02월',
        greenTemp: DEAR_ORCHID_FARM.greenTemperature,
        certifications: DEAR_ORCHID_FARM.certifications,
        followers: DEAR_ORCHID_FARM.followers,
        description: DEAR_ORCHID_FARM.description,
    };

    // Zustand 스토어에서 상품 가져오기
    const products = useProductStore((state) => state.products);
    const removeProduct = useProductStore((state) => state.removeProduct);
    const farmProducts = products.filter(p => p.farmId === DEAR_ORCHID_FARM.id);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => router.push('/')} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Share className="w-5 h-5 text-gray-700" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* 비즈니스 정보 */}
                <div className="px-4 pb-4 flex items-start justify-between">
                    <div>
                        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                            <h1 className="text-xl font-bold text-gray-900">{business.name}</h1>
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        </button>
                        <p className="text-sm text-gray-500 mt-1">{business.location} · {business.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-center">
                            <span className="text-xs text-gray-500">단골</span>
                            <p className="font-bold text-green-600">{business.followers}</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                            단골 관리
                        </button>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex">
                    {[
                        { id: 'home', label: '홈' },
                        { id: 'news', label: '소식' },
                        { id: 'reviews', label: '후기' },
                        { id: 'photos', label: '사진' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-gray-900 text-gray-900'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* 홈 탭 콘텐츠 */}
            {activeTab === 'home' && (
                <div className="flex-1 overflow-y-auto pb-20">
                    <div className="p-4 space-y-4">

                        {/* 🌡️ 그린 온도 카드 */}
                        <GreenTemperatureCard
                            value={business.greenTemp.value}
                            level={business.greenTemp.level}
                            emoji={business.greenTemp.emoji}
                            description={business.greenTemp.description}
                        />

                        {/* 🚚 오늘의 배송 */}
                        <Link href="/delivery" className="block bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Truck className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">오늘의 배송</h2>
                                        <p className="text-sm text-emerald-600 mt-0.5">배송 관리 바로가기</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        </Link>

                        {/* 농업경영체 인증 */}
                        {business.certifications.filter(c => c.verified).length > 0 && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-800">농업경영체 인증 완료 ✓</p>
                                        <p className="text-xs text-green-600 mt-0.5">
                                            {business.certifications[0].name} · {business.certifications[0].issuedAt}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 홍보 시작하기 카드 */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="font-bold text-gray-900 text-lg">홍보 시작하기</h2>
                                    <p className="text-sm text-gray-600 mt-1">동네 이웃 3천명에게 내 업체를 홍보할 수 있어요</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">🔥</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-3.5 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                                이어서 하기
                            </button>
                        </div>

                        {/* 📱 내 스토어 미리보기 (Web 앱 연동) */}
                        <a
                            href={`http://localhost:3000/farm/${DEAR_ORCHID_FARM.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white text-lg">내 스토어 미리보기</h2>
                                        <p className="text-green-100 text-sm mt-0.5">소비자 앱에서 내 상품이 어떻게 보이는지 확인</p>
                                    </div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                            </div>
                        </a>

                        {/* 퀵 액션 버튼들 */}
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { icon: Megaphone, label: '광고', color: 'bg-blue-50 text-blue-600' },
                                { icon: FileText, label: '소식 작성', color: 'bg-green-50 text-green-600' },
                                { icon: Ticket, label: '쿠폰', color: 'bg-purple-50 text-purple-600' },
                                { icon: Calendar, label: '예약 관리', color: 'bg-pink-50 text-pink-600' },
                            ].map((action, idx) => (
                                <button key={idx} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* 최근 사진 */}
                        <div className="flex gap-3">
                            <div className="relative w-40 h-40 bg-gradient-to-br from-pink-300 to-pink-500 rounded-2xl overflow-hidden shadow-lg">
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                                    방금 전
                                </div>
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-5xl">🌸</span>
                                </div>
                            </div>
                            <button className="flex-1 h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50/50 transition-all">
                                <Camera className="w-8 h-8" />
                                <span className="text-sm font-medium mt-2">사진 추가</span>
                            </button>
                        </div>

                        {/* 🛒 등록 상품 리스트 */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 pb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">내 상품</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">등록된 상품 {farmProducts.length}개</p>
                                </div>
                                <button
                                    onClick={() => router.push('/products/new')}
                                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    상품 등록
                                </button>
                            </div>
                            {farmProducts.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">아직 등록된 상품이 없어요</p>
                                    <p className="text-gray-400 text-xs mt-1">첫 상품을 등록해보세요!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {farmProducts.map((product) => (
                                        <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                                {product.images[0] || '📦'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-green-600 font-bold text-sm">
                                                        {product.price.toLocaleString()}원
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span className="text-gray-400 text-xs line-through">
                                                            {product.originalPrice.toLocaleString()}원
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    재고 {product.quantity}{product.unit}
                                                    {product.status === 'soldout' && (
                                                        <span className="ml-1 text-red-500">· 품절</span>
                                                    )}
                                                </p>
                                            </div>
                                            <a
                                                href={`http://localhost:3000/product/${product.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="소비자 앱에서 보기"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => removeProduct(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 업체 정보 누락 안내 */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="text-sm text-gray-600">영업 시간을 입력해주세요.</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Globe className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="text-sm text-gray-600">홈페이지, SNS를 추가해주세요.</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                                업체 정보 관리
                            </button>
                        </div>

                        {/* 관리 섹션들 */}
                        <SectionCard
                            title="예약"
                            description="예약을 등록하고 고객 예약을 받아보세요."
                            buttons={['예약 관리']}
                        />

                        <SectionCard
                            title="가격"
                            description="서비스나 메뉴 가격을 등록해보세요."
                            buttons={['가격 관리', '가격 사진 설정']}
                        />

                        <SectionCard
                            title="쿠폰"
                            description="쿠폰을 만들고 단골 고객을 4배 더 많이 모아보세요."
                            buttons={['쿠폰 관리']}
                        />

                        <SectionCard
                            title="공지"
                            description="이벤트나 휴무 안내를 작성해보세요."
                            buttons={['공지 관리']}
                        />

                        {/* 소개 섹션 */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">소개</h3>
                                    <p className="text-xs text-gray-400 mt-1">생성일: {business.createdAt}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-xl">{DEAR_ORCHID_FARM.profileEmoji}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{business.description}</p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm">
                                    사업자 정보 관리
                                </button>
                                <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm">
                                    소개 관리
                                </button>
                            </div>
                        </div>

                        <SectionCard
                            title="스토리"
                            description="업체를 소개하는 짧은 영상을 올려보세요."
                            buttons={['스토리 올리기']}
                        />

                        <SectionCard
                            title="소식"
                            description="소식을 작성하고 고객에게 가게를 알려보세요."
                            buttons={['소식 작성']}
                        />

                        {/* 초보 사장님 배너 */}
                        <button className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📚</span>
                                <span className="text-blue-700 font-semibold text-sm">초보 사장님을 위한 무료 학습지 신청하기</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-400" />
                        </button>

                        {/* 푸터 안내문 */}
                        <div className="text-xs text-gray-400 leading-relaxed pt-4 pb-8">
                            <p className="font-medium text-gray-500 mb-2">마지막 수정일 2026년 2월 14일</p>
                            <p>
                                그린링크를 통해 홍보되는 게시글에는, 개별 판매자가 직접 입점하거나
                                채팅 기능을 통해 상품을 판매하는 경우가 포함되어 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 소식 탭 */}
            {activeTab === 'news' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">아직 작성된 소식이 없어요</h3>
                    <p className="text-sm text-gray-500 mb-6">첫 소식을 작성해보세요!</p>
                    <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                        소식 작성하기
                    </button>
                </div>
            )}

            {/* 후기 탭 */}
            {activeTab === 'reviews' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-full flex items-center justify-center mb-4">
                        <Star className="w-10 h-10 text-amber-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">아직 받은 후기가 없어요</h3>
                    <p className="text-sm text-gray-500">고객이 후기를 남기면 여기에 표시됩니다.</p>
                </div>
            )}

            {/* 사진 탭 */}
            {activeTab === 'photos' && (
                <div className="flex-1 p-4">
                    <div className="grid grid-cols-3 gap-1">
                        <div className="aspect-square bg-gradient-to-br from-pink-300 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-3xl">🌸</span>
                        </div>
                        <button className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50 transition-all">
                            <Camera className="w-6 h-6" />
                            <span className="text-xs mt-1 font-medium">추가</span>
                        </button>
                    </div>
                </div>
            )}

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                    {[
                        { icon: Home, label: '홈', active: true },
                        { icon: MessageSquare, label: '채팅', active: false },
                        { icon: Star, label: '리뷰', active: false },
                        { icon: Image, label: '사진', active: false },
                    ].map((item, idx) => (
                        <button key={idx} className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${item.active ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
                            <item.icon className={`w-6 h-6 ${item.active ? 'stroke-[2.5]' : ''}`} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}

// 🌡️ 그린 온도 게이지 컴포넌트
function GreenTemperatureCard({ value, level, emoji, description }: {
    value: number;
    level: string;
    emoji: string;
    description: string;
}) {
    // 온도 게이지: 0~100 범위에서 비율 계산
    const percentage = Math.min(Math.max(value, 0), 100);

    // 온도에 따른 색상
    const getGaugeColor = (temp: number) => {
        if (temp < 30) return 'from-blue-400 to-blue-500';
        if (temp < 40) return 'from-green-400 to-green-500';
        if (temp < 50) return 'from-green-500 to-emerald-500';
        if (temp < 60) return 'from-yellow-400 to-orange-400';
        return 'from-orange-500 to-red-500';
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">그린 온도</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <div className="text-right">
                        <p className="text-2xl font-black text-green-600">{value}°C</p>
                        <p className="text-xs text-gray-500">{level} 단계</p>
                    </div>
                </div>
            </div>
            {/* 온도 게이지 바 */}
            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getGaugeColor(value)} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                <span>0°C</span>
                <span>50°C</span>
                <span>100°C</span>
            </div>
        </div>
    );
}

// 재사용 섹션 카드 컴포넌트
function SectionCard({ title, description, buttons }: {
    title: string;
    description: string;
    buttons: string[];
}) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div className="flex gap-2">
                {buttons.map((label, idx) => (
                    <button
                        key={idx}
                        className={`${buttons.length === 1 ? 'w-full' : 'flex-1'} py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
