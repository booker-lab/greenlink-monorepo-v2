'use client';

import { useRouter } from "next/navigation";
import { MapPin, Store, ChevronRight } from "lucide-react";

export default function AdminLandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 헤더 */}
            <header className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">G</span>
                    </div>
                    <span className="font-bold text-gray-900">그린링크 비즈</span>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex flex-col">
                {/* 히어로 섹션 */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-green-50 to-white">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-green-200">
                        <Store className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        내가 찾던 손님<br />모두 그린링크에 있어요
                    </h1>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-4">
                        <MapPin className="w-4 h-4" />
                        <span>내 동네 근처 이웃</span>
                    </div>
                    <p className="text-4xl font-bold text-green-600 mt-2">152,847명</p>
                    <p className="text-gray-500 mt-4">
                        비즈프로필은 등록부터 사용까지 <span className="text-green-600 font-bold">무료예요!</span>
                    </p>
                </div>

                {/* CTA 버튼들 */}
                <div className="p-6 space-y-3">
                    <button
                        onClick={() => router.push('/register')}
                        className="w-full py-4 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                    >
                        비즈프로필 만들기
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>이미 프로필이 있어요</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* 하단 안내 */}
                <div className="p-6 pt-0">
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-600 font-medium mb-2">그린링크 비즈로 할 수 있는 것</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>✓ 동네 이웃에게 내 가게 홍보하기</li>
                            <li>✓ 쿠폰/예약으로 단골 고객 늘리기</li>
                            <li>✓ 소식 작성으로 신메뉴/이벤트 알리기</li>
                            <li>✓ 후기 관리로 신뢰도 높이기</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
