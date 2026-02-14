'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Home, ShoppingCart, Package, Truck, CheckCircle2,
    MapPin, Phone, Clock, Star, Camera, ChevronRight
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_DELIVERY_TASKS, DEAR_ORCHID_FARM, DEAR_ORCHID_PRODUCTS } from '@greenlink/lib';
import type { OrderStatus } from '@greenlink/lib';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Package }[] = [
    { status: 'ORDERED', label: '주문 접수', icon: Package },
    { status: 'PREPARING', label: '상품 준비', icon: Package },
    { status: 'DISPATCHED', label: '배차 완료', icon: Truck },
    { status: 'DELIVERING', label: '배송 중', icon: Truck },
    { status: 'COMPLETED', label: '배송 완료', icon: CheckCircle2 },
];

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const order = MOCK_ORDERS.find(o => o.id === orderId);
    const task = order?.deliveryTaskId
        ? MOCK_DELIVERY_TASKS.find(t => t.id === order.deliveryTaskId)
        : null;
    const product = order ? DEAR_ORCHID_PRODUCTS.find(p => p.id === order.productId) : null;
    const farm = DEAR_ORCHID_FARM;

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-4xl mb-4">📦</p>
                    <p className="text-gray-600 font-medium">주문을 찾을 수 없습니다</p>
                    <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const currentStepIdx = STATUS_STEPS.findIndex(s => s.status === order.status);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.back()} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">주문 상세</h1>
                    <Link href="/" className="p-1">
                        <Home className="w-6 h-6 text-gray-600" />
                    </Link>
                </div>
            </header>

            {/* 배송 상태 프로그레스 */}
            <div className="bg-white px-6 py-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {order.status === 'COMPLETED' ? '✅ 배송이 완료되었습니다' :
                        order.status === 'DELIVERING' ? '🚚 상품을 배송 중입니다' :
                            order.status === 'DISPATCHED' ? '📦 배차가 완료되었습니다' :
                                order.status === 'PREPARING' ? '🌿 상품을 정성껏 준비하고 있습니다' :
                                    '📋 주문이 접수되었습니다'}
                </h2>

                {/* 프로그레스 바 */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                        {STATUS_STEPS.map((step, idx) => {
                            const isActive = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            const StepIcon = step.icon;

                            return (
                                <div key={step.status} className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCurrent ? 'bg-green-600 shadow-lg shadow-green-200 ring-4 ring-green-100' :
                                            isActive ? 'bg-green-500' : 'bg-gray-200'
                                        }`}>
                                        <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                    </div>
                                    <span className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* 연결 라인 */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" style={{ marginLeft: '20px', marginRight: '20px' }}>
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white mt-2 px-4 py-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    배송 정보
                </h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-500">배송지</p>
                            <p className="text-sm font-medium text-gray-800">{order.buyerAddress}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-500">배송 예정일</p>
                            <p className="text-sm font-medium text-gray-800">{order.deliveryDate}</p>
                        </div>
                    </div>
                    {order.message && (
                        <div className="flex items-start gap-3">
                            <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">배송 메시지</p>
                                <p className="text-sm font-medium text-gray-800">{order.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 배송 기사 (디어 오키드 직배송) */}
            <div className="bg-white mt-2 px-4 py-4">
                <h3 className="font-bold text-gray-800 mb-3">🚛 배송 기사</h3>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-xl">
                        {farm.profileEmoji}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800">{farm.name} 직배송</p>
                        <p className="text-xs text-green-600 mt-0.5">
                            🌱 그린 온도 {farm.greenTemperature.value}°C · PV5 신선 배송
                        </p>
                    </div>
                    {order.status === 'DELIVERING' && (
                        <a href="tel:010-0000-0000" className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <Phone className="w-5 h-5 text-green-600" />
                        </a>
                    )}
                </div>
                {(order.status === 'DELIVERING' || order.status === 'DISPATCHED') && (
                    <p className="text-xs text-center text-green-600 mt-2">
                        🌡️ 최적 온도 18°C로 신선하게 배송 중입니다
                    </p>
                )}
            </div>

            {/* 주문 상품 */}
            {product && (
                <div className="bg-white mt-2 px-4 py-4">
                    <h3 className="font-bold text-gray-800 mb-3">📦 주문 상품</h3>
                    <Link href={`/product/${product.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl border border-gray-100">
                            {product.images[0] || '🌸'}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{order.quantity}개</p>
                            <p className="text-sm font-bold text-green-600 mt-1">{order.totalPrice.toLocaleString()}원</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                    </Link>
                </div>
            )}

            {/* 배송 완료 사진 (POD) */}
            {order.status === 'COMPLETED' && task && task.photoUrls.length > 0 && (
                <div className="bg-white mt-2 px-4 py-4">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-green-600" />
                        배송 완료 사진
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {task.photoUrls.map((url, idx) => (
                            <div key={idx} className="aspect-square bg-green-50 rounded-xl flex items-center justify-center text-4xl border border-green-100">
                                {url}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        {task.deliveredAt?.split('T')[0]} {task.deliveredAt?.split('T')[1]?.slice(0, 5)} 배송 완료
                    </p>
                </div>
            )}

            {/* 주문 정보 */}
            <div className="bg-white mt-2 px-4 py-4">
                <h3 className="font-bold text-gray-800 mb-3">📋 주문 정보</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">주문번호</span>
                        <span className="font-medium text-gray-800">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">주문일시</span>
                        <span className="font-medium text-gray-800">{order.orderedAt.replace('T', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">수령인</span>
                        <span className="font-medium text-gray-800">{order.buyerName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
