'use client';

import { useState } from 'react';
import {
    Package, Truck, CheckCircle2, Camera, Phone, Navigation,
    MapPin, ChevronRight, AlertCircle, User, Clock,
    Image as ImageIcon, LogOut
} from 'lucide-react';
import { useDeliveryStore, useOrderStore } from '@greenlink/lib';
import { DEAR_ORCHID_PRODUCTS } from '@greenlink/lib';
import type { DeliveryTask, DeliveryStatus } from '@greenlink/lib';

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: typeof Package }> = {
    PENDING: { label: '픽업 대기', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', icon: Package },
    PICKED_UP: { label: '픽업 완료', color: 'text-sky-400', bgColor: 'bg-sky-500/10', borderColor: 'border-sky-500/30', icon: Package },
    IN_TRANSIT: { label: '배송 중', color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30', icon: Truck },
    DELIVERED: { label: '배송 완료', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', icon: CheckCircle2 },
};

const NEXT_STATUS: Record<DeliveryStatus, DeliveryStatus | null> = {
    PENDING: 'PICKED_UP',
    PICKED_UP: 'IN_TRANSIT',
    IN_TRANSIT: 'DELIVERED',
    DELIVERED: null,
};

const NEXT_ACTION: Record<DeliveryStatus, { label: string; gradient: string }> = {
    PENDING: { label: '📦 픽업 완료', gradient: 'from-sky-500 to-blue-600' },
    PICKED_UP: { label: '🚚 배송 출발', gradient: 'from-violet-500 to-purple-600' },
    IN_TRANSIT: { label: '✅ 배송 완료', gradient: 'from-emerald-500 to-green-600' },
    DELIVERED: { label: '', gradient: '' },
};

export default function DriverDeliveryPage() {
    const { tasks, updateTaskStatus, addPhotoToTask } = useDeliveryStore();
    const { orders, updateOrderStatus } = useOrderStore();
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);

    const activeTasks = tasks.filter(t => t.status !== 'DELIVERED');
    const completedTasks = tasks.filter(t => t.status === 'DELIVERED');
    const totalTasks = tasks.length;

    const handleStatusChange = (task: DeliveryTask) => {
        const nextStatus = NEXT_STATUS[task.status];
        if (!nextStatus) return;

        updateTaskStatus(task.id, nextStatus);

        // 주문 상태 동기화
        const order = orders.find(o => o.id === task.orderId);
        if (order) {
            if (nextStatus === 'PICKED_UP') updateOrderStatus(order.id, 'DISPATCHED');
            if (nextStatus === 'IN_TRANSIT') updateOrderStatus(order.id, 'DELIVERING');
            if (nextStatus === 'DELIVERED') updateOrderStatus(order.id, 'COMPLETED');
        }

        if (nextStatus === 'DELIVERED') {
            setSelectedTask(task.id);
            setShowPhotoUpload(true);
        }
    };

    const handlePhotoUpload = (taskId: string) => {
        addPhotoToTask(taskId, '📸');
        setShowPhotoUpload(false);
        setSelectedTask(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-6">
            {/* ───── 헤더 ───── */}
            <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">그린링크 드라이버</h1>
                            <p className="text-[10px] text-gray-500">PV5 · 디어 오키드</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] text-emerald-400 font-medium">운행 중</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ───── 오늘의 현황 ───── */}
            <div className="px-4 py-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-800/50 rounded-2xl p-3 text-center border border-gray-700/50">
                        <p className="text-2xl font-black text-orange-400">{activeTasks.filter(t => t.status === 'PENDING').length}</p>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">픽업 대기</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-3 text-center border border-gray-700/50">
                        <p className="text-2xl font-black text-violet-400">{activeTasks.filter(t => t.status === 'IN_TRANSIT' || t.status === 'PICKED_UP').length}</p>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">배송 중</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-3 text-center border border-gray-700/50">
                        <p className="text-2xl font-black text-emerald-400">{completedTasks.length}<span className="text-sm text-gray-600">/{totalTasks}</span></p>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">완료</p>
                    </div>
                </div>
            </div>

            {/* ───── 진행 중인 배송 ───── */}
            {activeTasks.length > 0 && (
                <div className="px-4 mb-4">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">진행 중 ({activeTasks.length})</h2>
                    <div className="space-y-3">
                        {activeTasks.sort((a, b) => a.priority - b.priority).map((task, idx) => {
                            const config = STATUS_CONFIG[task.status];
                            const StatusIcon = config.icon;
                            const action = NEXT_ACTION[task.status];
                            const product = DEAR_ORCHID_PRODUCTS.find(p => task.items.some(i => i.includes(p.name.split(' ')[0])));

                            return (
                                <div key={task.id} className={`bg-gray-800/60 rounded-2xl border ${config.borderColor} overflow-hidden`}>
                                    {/* 우선순위 & 상태 */}
                                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-600">#{idx + 1}</span>
                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.bgColor}`}>
                                                <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                                                <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-600">{task.createdAt.split('T')[0]}</span>
                                    </div>

                                    {/* 상품 */}
                                    <div className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl">
                                                {product?.images[0] || '📦'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-white text-sm">{task.items.join(', ')}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <User className="w-3 h-3 text-gray-500" />
                                                    <p className="text-xs text-gray-400">{task.recipientName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 주소 */}
                                    <div className="px-4 py-2 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-300">{task.deliveryAddress}</p>
                                    </div>

                                    {/* 메모 */}
                                    {task.notes && (
                                        <div className="mx-4 mb-2 px-3 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-amber-300 font-medium">{task.notes}</p>
                                        </div>
                                    )}

                                    {/* 액션 버튼 (운전 중 쉽게 누르기 위해 매우 큰 사이즈) */}
                                    <div className="p-4 pt-2 flex gap-2">
                                        {/* 전화 */}
                                        <a
                                            href={`tel:${task.recipientPhone}`}
                                            className="flex items-center justify-center gap-1 px-4 py-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-gray-300 font-medium text-sm transition-colors border border-gray-600/30"
                                        >
                                            <Phone className="w-5 h-5" />
                                        </a>

                                        {/* 네비게이션 */}
                                        <a
                                            href={`https://map.kakao.com/link/to/${encodeURIComponent(task.deliveryAddress)},0,0`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-1 px-4 py-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-sky-400 font-medium text-sm transition-colors border border-gray-600/30"
                                        >
                                            <Navigation className="w-5 h-5" />
                                        </a>

                                        {/* 상태 전환 (메인 CTA) */}
                                        {NEXT_STATUS[task.status] && (
                                            <button
                                                onClick={() => handleStatusChange(task)}
                                                className={`flex-1 py-4 bg-gradient-to-r ${action.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg text-center text-lg active:scale-95`}
                                            >
                                                {action.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ───── 빈 상태 ───── */}
            {activeTasks.length === 0 && (
                <div className="text-center py-20 px-6">
                    <p className="text-6xl mb-4">🎉</p>
                    <p className="text-white font-bold text-xl">오늘 배송 완료!</p>
                    <p className="text-gray-500 text-sm mt-2">수고하셨습니다 ☘️</p>
                    <div className="mt-6 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <p className="text-emerald-400 text-sm font-medium">
                            총 {completedTasks.length}건 배송 완료
                        </p>
                    </div>
                </div>
            )}

            {/* ───── 완료된 배송 ───── */}
            {completedTasks.length > 0 && (
                <div className="px-4">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">완료 ({completedTasks.length})</h2>
                    <div className="space-y-2">
                        {completedTasks.map(task => (
                            <div key={task.id} className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30 flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-300">{task.items.join(', ')}</p>
                                    <p className="text-[10px] text-gray-600">{task.recipientName} · {task.deliveredAt?.split('T')[1]?.slice(0, 5)}</p>
                                </div>
                                {task.photoUrls.length > 0 && (
                                    <span className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg font-medium border border-emerald-500/20">
                                        📸 {task.photoUrls.length}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ───── 사진 업로드 모달 ───── */}
            {showPhotoUpload && selectedTask && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-end">
                    <div className="bg-gray-800 w-full rounded-t-3xl p-6 border-t border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-2">📸 배송 완료 사진</h3>
                        <p className="text-sm text-gray-400 mb-4">문 앞 사진을 촬영해주세요. 고객에게 자동 전송됩니다.</p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => handlePhotoUpload(selectedTask)}
                                className="aspect-square border-2 border-dashed border-sky-500/50 rounded-2xl flex flex-col items-center justify-center text-sky-400 hover:bg-sky-500/10 transition-colors"
                            >
                                <Camera className="w-10 h-10 mb-2" />
                                <span className="text-sm font-bold">촬영하기</span>
                            </button>
                            <button
                                onClick={() => handlePhotoUpload(selectedTask)}
                                className="aspect-square border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 transition-colors"
                            >
                                <ImageIcon className="w-10 h-10 mb-2" />
                                <span className="text-sm font-bold">갤러리</span>
                            </button>
                        </div>

                        <button
                            onClick={() => { setShowPhotoUpload(false); setSelectedTask(null); }}
                            className="w-full py-3.5 border border-gray-600 rounded-xl text-gray-400 font-medium hover:bg-gray-700/50 transition-colors"
                        >
                            나중에 하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
