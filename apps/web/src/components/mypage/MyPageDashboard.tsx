import React from 'react';
import { ChevronRight, Package, MapPin, CreditCard, Headphones, Settings, Bell, Store } from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_PINK_TEMPERATURE } from '@greenlink/lib';

export default function MyPageDashboard() {
    const pinkTemp = DEFAULT_PINK_TEMPERATURE;

    const recentProducts = [
        { id: 1, name: '보세란 (중품)', image: '🌸' },
        { id: 2, name: '풍란 (대품)', image: '🪻' },
        { id: 3, name: '석곡 (소품)', image: '🌿' },
        { id: 4, name: '동양란 선물세트', image: '🎁' },
    ];

    const menuSections = [
        {
            title: '주문 내역',
            items: [
                { name: '나의 주문 내역', icon: Package, href: '/orders' },
                { name: '배송지 관리', icon: MapPin, href: '/addresses' },
            ],
        },
        {
            title: '고객 지원',
            items: [
                { name: '고객센터 / 도움말', icon: Headphones, href: '/support' },
                { name: '공지사항', icon: Bell, href: '/notices' },
            ],
        },
        {
            title: '나의 소식',
            items: [
                { name: '결제 수단 관리', icon: CreditCard, href: '/payment' },
                { name: '설정', icon: Settings, href: '/settings' },
            ],
        },
    ];

    return (
        <div className="pb-20">
            {/* Profile Section */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-2xl">
                        J
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">정의</h2>
                        <p className="text-sm opacity-90">그린 등급 🌱 새싹</p>
                    </div>
                </div>

                {/* 핑크 온도 (소비자 신뢰 지표) */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium opacity-90">내 핑크 온도</span>
                        <div className="flex items-center gap-1">
                            <span className="text-lg">{pinkTemp.emoji}</span>
                            <span className="text-xl font-black">{pinkTemp.value}°C</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-300 to-pink-400 rounded-full transition-all"
                            style={{ width: `${pinkTemp.value}%` }}
                        />
                    </div>
                    <p className="text-xs opacity-70 mt-1.5">{pinkTemp.level} 단계 · {pinkTemp.description}</p>
                </div>

                {/* Points/Coupon Card */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex justify-around">
                        <div className="text-center">
                            <div className="text-2xl font-bold">3,000원</div>
                            <div className="text-xs opacity-90">적립금</div>
                        </div>
                        <div className="w-px bg-white/30"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-xs opacity-90">쿠폰</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="p-4 bg-white border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">최근 본 상품</h3>
                    <Link href="/recent" className="text-sm text-green-600">
                        전체보기 →
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto">
                    {recentProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl"
                        >
                            {product.image}
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            {menuSections.map((section, index) => (
                <div key={index} className="bg-white border-b-8 border-gray-100">
                    <h3 className="px-4 pt-4 pb-2 font-bold text-gray-800">{section.title}</h3>
                    {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <IconComponent className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">{item.name}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        );
                    })}
                </div>
            ))}

            {/* 그린링크 비즈 홍보 배너 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 mx-4 mt-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                        <Store className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800">내가 찾던 손님</h3>
                        <p className="text-sm text-gray-600">모두 그린링크에 있어요</p>
                        <p className="text-xs text-green-600 mt-1">내 동네 근처 이웃 152,847명</p>
                    </div>
                </div>
                <a
                    href="http://localhost:3001"
                    className="mt-4 w-full py-3 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                    <Store className="w-5 h-5" />
                    그린링크 비즈 시작하기
                    <ChevronRight className="w-5 h-5" />
                </a>
            </div>

            {/* 비즈프로필 관리 메뉴 */}
            <div className="bg-white border-b-8 border-gray-100 mt-4">
                <h3 className="px-4 pt-4 pb-2 font-bold text-gray-800">비즈니스</h3>
                <a
                    href="http://localhost:3001"
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">비즈프로필 관리</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">NEW</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </a>
            </div>
        </div>
    );
}
