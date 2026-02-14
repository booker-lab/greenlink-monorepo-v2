'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Package, Truck, CheckCircle2, Clock,
    ChevronRight, Home, ShoppingCart
} from 'lucide-react';
import { MOCK_ORDERS, DEAR_ORCHID_PRODUCTS, DEAR_ORCHID_FARM } from '@greenlink/lib';
import type { OrderStatus } from '@greenlink/lib';

const STATUS_LABEL: Record<OrderStatus, { text: string; color: string; bg: string }> = {
    ORDERED: { text: '주문접수', color: 'text-blue-600', bg: 'bg-blue-50' },
    PREPARING: { text: '상품준비', color: 'text-orange-600', bg: 'bg-orange-50' },
    DISPATCHED: { text: '배차완료', color: 'text-purple-600', bg: 'bg-purple-50' },
    DELIVERING: { text: '배송중', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    COMPLETED: { text: '배송완료', color: 'text-green-600', bg: 'bg-green-50' },
    CANCELLED: { text: '취소됨', color: 'text-red-600', bg: 'bg-red-50' },
};

export default function OrdersPage() {
    const router = useRouter();
    const farm = DEAR_ORCHID_FARM;

    // 최신 주문 순으로 정렬
    const orders = [...MOCK_ORDERS].sort((a, b) =>
        new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
    );

    const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
    const pastOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.push('/mypage')} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">나의 주문 내역</h1>
                    <Link href="/" className="p-1">
                        <Home className="w-6 h-6 text-gray-600" />
                    </Link>
                </div>
            </header>

            {/* 진행 중인 주문 */}
            {activeOrders.length > 0 && (
                <div className="px-4 pt-4">
                    <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        진행 중인 주문 <span className="text-green-600">{activeOrders.length}</span>
                    </h2>
                    <div className="space-y-3">
                        {activeOrders.map(order => {
                            const product = DEAR_ORCHID_PRODUCTS.find(p => p.id === order.productId);
                            const status = STATUS_LABEL[order.status];

                            return (
                                <Link
                                    key={order.id}
                                    href={`/order/${order.id}`}
                                    className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                                >
                                    {/* 상태 바 */}
                                    <div className={`px-4 py-2 ${status.bg} flex items-center justify-between`}>
                                        <span className={`text-xs font-bold ${status.color}`}>{status.text}</span>
                                        <span className="text-[10px] text-gray-400">배송 예정: {order.deliveryDate}</span>
                                    </div>

                                    {/* 상품 정보 */}
                                    <div className="px-4 py-3 flex items-center gap-3">
                                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                                            {product?.images[0] || '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm truncate">{product?.name || '상품'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{farm.name} · {order.quantity}개</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">{order.totalPrice.toLocaleString()}원</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 완료된 주문 */}
            {pastOrders.length > 0 && (
                <div className="px-4 pt-6">
                    <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        지난 주문
                    </h2>
                    <div className="space-y-2">
                        {pastOrders.map(order => {
                            const product = DEAR_ORCHID_PRODUCTS.find(p => p.id === order.productId);
                            const status = STATUS_LABEL[order.status];

                            return (
                                <Link
                                    key={order.id}
                                    href={`/order/${order.id}`}
                                    className="block bg-white rounded-xl p-3 border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                                            {product?.images[0] || '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-700 text-sm truncate">{product?.name || '상품'}</p>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.bg} ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {order.orderedAt.split('T')[0]} · {order.totalPrice.toLocaleString()}원
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 주문 없음 */}
            {orders.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🌿</p>
                    <p className="text-gray-700 font-bold text-lg">주문 내역이 없어요</p>
                    <p className="text-gray-400 text-sm mt-1">예쁜 식물들을 구경해보세요!</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        쇼핑하러 가기
                    </Link>
                </div>
            )}
        </div>
    );
}
