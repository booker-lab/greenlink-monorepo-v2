'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Package, Truck, CheckCircle2, ExternalLink,
    MapPin, Clock, AlertCircle, Settings,
    Home, MessageSquare, Star
} from 'lucide-react';
import { useDeliveryStore } from '@greenlink/lib';
import { DEAR_ORCHID_PRODUCTS } from '@greenlink/lib';
import type { DeliveryStatus } from '@greenlink/lib';

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bgColor: string; icon: typeof Package }> = {
    PENDING: { label: '픽업 대기', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', icon: Package },
    PICKED_UP: { label: '픽업 완료', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: Package },
    IN_TRANSIT: { label: '배송 중', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', icon: Truck },
    DELIVERED: { label: '배송 완료', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle2 },
};

export default function AdminDeliveryPage() {
    const router = useRouter();
    const { tasks } = useDeliveryStore();

    const activeTasks = tasks.filter(t => t.status !== 'DELIVERED');
    const completedTasks = tasks.filter(t => t.status === 'DELIVERED');

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.push('/dashboard')} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">📋 배송 현황</h1>
                    <Link href="/delivery/settings" className="p-2 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-5 h-5 text-gray-600" />
                    </Link>
                </div>
            </header>

            {/* 기사 앱 연결 안내 */}
            <div className="px-4 pt-4">
                <a
                    href="http://localhost:3002"
                    target="_blank"
                    className="block bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-200 hover:shadow-md transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">배송 기사 앱 열기</p>
                                <p className="text-[10px] text-sky-600 mt-0.5">상태 전환, 사진 업로드는 기사 앱에서</p>
                            </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-sky-400" />
                    </div>
                </a>
            </div>

            {/* 오늘의 배송 현황 요약 */}
            <div className="px-4 py-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                        <p className="text-2xl font-black text-orange-500">{activeTasks.filter(t => t.status === 'PENDING').length}</p>
                        <p className="text-xs text-gray-500 mt-1">픽업 대기</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                        <p className="text-2xl font-black text-purple-500">{activeTasks.filter(t => t.status === 'IN_TRANSIT' || t.status === 'PICKED_UP').length}</p>
                        <p className="text-xs text-gray-500 mt-1">배송 중</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                        <p className="text-2xl font-black text-green-500">{completedTasks.length}</p>
                        <p className="text-xs text-gray-500 mt-1">완료</p>
                    </div>
                </div>
            </div>

            {/* 진행 중인 배송 (읽기 전용) */}
            {activeTasks.length > 0 && (
                <div className="px-4 mb-4">
                    <h2 className="text-sm font-bold text-gray-700 mb-3">진행 중인 배송</h2>
                    <div className="space-y-3">
                        {activeTasks.sort((a, b) => a.priority - b.priority).map(task => {
                            const config = STATUS_CONFIG[task.status];
                            const StatusIcon = config.icon;
                            const product = DEAR_ORCHID_PRODUCTS.find(p => task.items.some(i => i.includes(p.name.split(' ')[0])));

                            return (
                                <div key={task.id} className={`bg-white rounded-2xl border ${config.bgColor} shadow-sm overflow-hidden`}>
                                    {/* 상태 뱃지 */}
                                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className={`w-5 h-5 ${config.color}`} />
                                            <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                                            <span className="text-xs text-gray-400">우선순위 {task.priority}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{task.createdAt.split('T')[0]}</span>
                                    </div>

                                    {/* 상품 정보 */}
                                    <div className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                                                {product?.images[0] || '📦'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 text-sm">{task.items.join(', ')}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">→ {task.recipientName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 주소 */}
                                    <div className="px-4 py-2 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-600">{task.deliveryAddress}</p>
                                    </div>

                                    {/* 메모 */}
                                    {task.notes && (
                                        <div className="px-4 pb-3 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-amber-700 font-medium">{task.notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 빈 상태 */}
            {activeTasks.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-5xl mb-4">🎉</p>
                    <p className="text-gray-700 font-bold text-lg">오늘 배송을 모두 완료했어요!</p>
                    <p className="text-gray-400 text-sm mt-1">수고하셨습니다, 사장님 ☘️</p>
                </div>
            )}

            {/* 완료된 배송 */}
            {completedTasks.length > 0 && (
                <div className="px-4">
                    <h2 className="text-sm font-bold text-gray-700 mb-3">완료된 배송</h2>
                    <div className="space-y-2">
                        {completedTasks.map(task => (
                            <div key={task.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">{task.items.join(', ')}</p>
                                    <p className="text-xs text-gray-400">{task.recipientName} · {task.deliveredAt?.split('T')[0]}</p>
                                </div>
                                {task.photoUrls.length > 0 && (
                                    <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-lg font-medium">
                                        📸 사진 {task.photoUrls.length}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 하단 네비게이션 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="max-w-lg mx-auto grid grid-cols-4 gap-1">
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 py-3 text-gray-400">
                        <Home className="w-5 h-5" />
                        <span className="text-[10px]">홈</span>
                    </Link>
                    <Link href="/delivery" className="flex flex-col items-center gap-1 py-3 text-green-600">
                        <Truck className="w-5 h-5" />
                        <span className="text-[10px] font-bold">배송</span>
                    </Link>
                    <button className="flex flex-col items-center gap-1 py-3 text-gray-400">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-[10px]">채팅</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 py-3 text-gray-400">
                        <Star className="w-5 h-5" />
                        <span className="text-[10px]">후기</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
