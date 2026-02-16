'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package, Truck, CheckCircle2, Camera, Phone, Navigation,
    MapPin, AlertCircle, User, LogOut, ChevronUp, ChevronDown,
    Image as ImageIcon, Locate, Route
} from 'lucide-react';
import { useDeliveryStore, useOrderStore, useAuthStore } from '@greenlink/lib';
import { DEAR_ORCHID_PRODUCTS } from '@greenlink/lib';
import type { DeliveryTask, DeliveryStatus } from '@greenlink/lib';

/* ── 상태별 설정 ── */
const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bgColor: string; borderColor: string; markerColor: string; icon: typeof Package }> = {
    PENDING: { label: '픽업 대기', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', markerColor: '#fb923c', icon: Package },
    PICKED_UP: { label: '픽업 완료', color: 'text-sky-400', bgColor: 'bg-sky-500/10', borderColor: 'border-sky-500/30', markerColor: '#38bdf8', icon: Package },
    IN_TRANSIT: { label: '배송 중', color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30', markerColor: '#a78bfa', icon: Truck },
    DELIVERED: { label: '배송 완료', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', markerColor: '#34d399', icon: CheckCircle2 },
};

const NEXT_STATUS: Record<DeliveryStatus, DeliveryStatus | null> = {
    PENDING: 'PICKED_UP', PICKED_UP: 'IN_TRANSIT', IN_TRANSIT: 'DELIVERED', DELIVERED: null,
};

const NEXT_ACTION: Record<DeliveryStatus, { label: string; gradient: string }> = {
    PENDING: { label: '📦 픽업 완료', gradient: 'from-sky-500 to-blue-600' },
    PICKED_UP: { label: '🚚 배송 출발', gradient: 'from-violet-500 to-purple-600' },
    IN_TRANSIT: { label: '✅ 배송 완료', gradient: 'from-emerald-500 to-green-600' },
    DELIVERED: { label: '', gradient: '' },
};

/* ── 지도 좌표 → SVG 변환 (간이 메르카토르) ── */
function coordsToSvg(lat: number, lng: number, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
    const padding = 40;
    const width = 400;
    const height = 500;
    const x = padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - padding * 2);
    const y = padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - padding * 2);
    return { x, y };
}

export default function DriverDeliveryPage() {
    const router = useRouter();
    const { driver, isAuthenticated, logout } = useAuthStore();
    const { tasks, updateTaskStatus, addPhotoToTask } = useDeliveryStore();
    const { orders, updateOrderStatus } = useOrderStore();
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);
    const [expandedPanel, setExpandedPanel] = useState(true);
    const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

    // 인증 가드
    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    const handleLogout = () => { logout(); router.replace('/login'); };

    if (!isAuthenticated || !driver) return null;

    const activeTasks = tasks.filter(t => t.status !== 'DELIVERED');
    const completedTasks = tasks.filter(t => t.status === 'DELIVERED');
    const totalTasks = tasks.length;

    // 지도 영역 계산
    const bounds = useMemo(() => {
        const allCoords = tasks.flatMap(t => [
            t.pickupCoords,
            t.deliveryCoords,
        ]);
        if (allCoords.length === 0) return { minLat: 37.2, maxLat: 37.6, minLng: 126.9, maxLng: 127.5 };

        const lats = allCoords.map(c => c.lat);
        const lngs = allCoords.map(c => c.lng);
        const pad = 0.02;
        return {
            minLat: Math.min(...lats) - pad,
            maxLat: Math.max(...lats) + pad,
            minLng: Math.min(...lngs) - pad,
            maxLng: Math.max(...lngs) + pad,
        };
    }, [tasks]);

    const handleStatusChange = (task: DeliveryTask) => {
        const nextStatus = NEXT_STATUS[task.status];
        if (!nextStatus) return;
        updateTaskStatus(task.id, nextStatus);
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
        <div className="h-screen bg-gray-900 flex flex-col overflow-hidden relative">
            {/* ═══════ 헤더 (카카오T 스타일 미니멀) ═══════ */}
            <header className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-gray-900 via-gray-900/90 to-transparent">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white">{driver.name} 기사님</h1>
                            <p className="text-[10px] text-gray-500">{driver.vehicleInfo}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* 현황 뱃지 */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-800/80 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                            <span className="text-[10px] text-orange-400 font-bold">{activeTasks.filter(t => t.status === 'PENDING').length}</span>
                            <span className="text-[10px] text-gray-600">/</span>
                            <span className="text-[10px] text-violet-400 font-bold">{activeTasks.filter(t => t.status !== 'PENDING').length}</span>
                            <span className="text-[10px] text-gray-600">/</span>
                            <span className="text-[10px] text-emerald-400 font-bold">{completedTasks.length}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] text-emerald-400 font-medium">운행</span>
                        </div>
                        <button onClick={handleLogout} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ═══════ 지도 영역 (SVG 인터랙티브 지도) ═══════ */}
            <div className="flex-1 relative bg-gray-900">
                <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    {/* 그리드 */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(75,85,99,0.15)" strokeWidth="0.5" />
                        </pattern>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect width="400" height="500" fill="url(#grid)" />

                    {/* 경로 라인 */}
                    {activeTasks.map(task => {
                        const pickup = coordsToSvg(task.pickupCoords.lat, task.pickupCoords.lng, bounds);
                        const delivery = coordsToSvg(task.deliveryCoords.lat, task.deliveryCoords.lng, bounds);
                        const config = STATUS_CONFIG[task.status];
                        return (
                            <g key={`route-${task.id}`}>
                                <line
                                    x1={pickup.x} y1={pickup.y}
                                    x2={delivery.x} y2={delivery.y}
                                    stroke={config.markerColor}
                                    strokeWidth="2"
                                    strokeDasharray="6 4"
                                    opacity="0.4"
                                />
                                {/* 화살표 */}
                                <circle
                                    cx={(pickup.x + delivery.x) / 2}
                                    cy={(pickup.y + delivery.y) / 2}
                                    r="3"
                                    fill={config.markerColor}
                                    opacity="0.6"
                                />
                            </g>
                        );
                    })}

                    {/* 픽업지 마커 (농장) */}
                    {(() => {
                        const farm = tasks[0];
                        if (!farm) return null;
                        const pos = coordsToSvg(farm.pickupCoords.lat, farm.pickupCoords.lng, bounds);
                        return (
                            <g transform={`translate(${pos.x}, ${pos.y})`}>
                                <circle r="20" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                                <circle r="12" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
                                <circle r="6" fill="#22c55e" filter="url(#glow)" />
                                <text y="-24" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="bold">🌸 디어 오키드</text>
                            </g>
                        );
                    })()}

                    {/* 배송지 마커 */}
                    {activeTasks.map((task, idx) => {
                        const pos = coordsToSvg(task.deliveryCoords.lat, task.deliveryCoords.lng, bounds);
                        const config = STATUS_CONFIG[task.status];
                        const isFocused = focusedTaskId === task.id;
                        return (
                            <g
                                key={`marker-${task.id}`}
                                transform={`translate(${pos.x}, ${pos.y})`}
                                onClick={() => setFocusedTaskId(task.id === focusedTaskId ? null : task.id)}
                                className="cursor-pointer"
                            >
                                {isFocused && <circle r="22" fill="none" stroke={config.markerColor} strokeWidth="2" opacity="0.5">
                                    <animate attributeName="r" values="18;24;18" dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
                                </circle>}
                                <circle r="14" fill={`${config.markerColor}15`} stroke={`${config.markerColor}40`} strokeWidth="1" />
                                <circle r="8" fill={config.markerColor} filter="url(#glow)" />
                                <text y="1" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{idx + 1}</text>
                                <text y="-20" textAnchor="middle" fill={config.markerColor} fontSize="8" fontWeight="bold">
                                    {task.recipientName}
                                </text>
                            </g>
                        );
                    })}

                    {/* 완료 마커 (흐리게) */}
                    {completedTasks.map(task => {
                        const pos = coordsToSvg(task.deliveryCoords.lat, task.deliveryCoords.lng, bounds);
                        return (
                            <g key={`done-${task.id}`} transform={`translate(${pos.x}, ${pos.y})`} opacity="0.3">
                                <circle r="6" fill="#34d399" />
                                <text y="1" textAnchor="middle" fill="white" fontSize="7">✓</text>
                            </g>
                        );
                    })}
                </svg>

                {/* 범례 */}
                <div className="absolute top-16 right-3 flex flex-col gap-1.5 bg-gray-800/80 backdrop-blur-sm rounded-xl p-2.5 border border-gray-700/50">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-[9px] text-gray-400">농장</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                        <span className="text-[9px] text-gray-400">대기</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                        <span className="text-[9px] text-gray-400">배송중</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-30" />
                        <span className="text-[9px] text-gray-400">완료</span>
                    </div>
                </div>
            </div>

            {/* ═══════ 하단 플로팅 패널 (카카오T 스타일) ═══════ */}
            <div className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${expandedPanel ? 'max-h-[55vh]' : 'max-h-[140px]'}`}>
                {/* 핸들 */}
                <div
                    className="flex justify-center py-2 cursor-pointer"
                    onClick={() => setExpandedPanel(!expandedPanel)}
                >
                    <div className="w-10 h-1 bg-gray-600 rounded-full" />
                </div>

                <div className="bg-gray-800/95 backdrop-blur-xl rounded-t-3xl border-t border-gray-700/50 overflow-hidden">
                    {/* 패널 헤더 */}
                    <div className="flex items-center justify-between px-5 py-3" onClick={() => setExpandedPanel(!expandedPanel)}>
                        <div className="flex items-center gap-2">
                            <Route className="w-4 h-4 text-sky-400" />
                            <h2 className="text-sm font-bold text-white">
                                오늘 배송 <span className="text-sky-400">{activeTasks.length}건</span>
                            </h2>
                        </div>
                        {expandedPanel
                            ? <ChevronDown className="w-4 h-4 text-gray-500" />
                            : <ChevronUp className="w-4 h-4 text-gray-500" />
                        }
                    </div>

                    {/* 배송 카드 목록 */}
                    <div className={`overflow-y-auto px-4 pb-6 space-y-3 ${expandedPanel ? 'max-h-[40vh]' : 'max-h-0 overflow-hidden'}`}>
                        {activeTasks.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-4xl mb-3">🎉</p>
                                <p className="text-white font-bold">오늘 배송 완료!</p>
                                <p className="text-gray-500 text-xs mt-1">수고하셨습니다 ☘️</p>
                            </div>
                        )}

                        {activeTasks.sort((a, b) => a.priority - b.priority).map((task, idx) => {
                            const config = STATUS_CONFIG[task.status];
                            const StatusIcon = config.icon;
                            const action = NEXT_ACTION[task.status];
                            const isFocused = focusedTaskId === task.id;

                            return (
                                <div
                                    key={task.id}
                                    className={`bg-gray-700/40 rounded-2xl border overflow-hidden transition-all ${isFocused ? `${config.borderColor} ring-1 ring-${config.markerColor}/20` : 'border-gray-700/30'
                                        }`}
                                    onClick={() => setFocusedTaskId(task.id === focusedTaskId ? null : task.id)}
                                >
                                    {/* 카드 상단: 번호 + 상태 + 수령인 */}
                                    <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-gray-600/50 flex items-center justify-center text-[10px] font-bold text-white">{idx + 1}</span>
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bgColor}`}>
                                                <StatusIcon className={`w-3 h-3 ${config.color}`} />
                                                <span className={`text-[10px] font-bold ${config.color}`}>{config.label}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white font-medium">{task.recipientName}</p>
                                    </div>

                                    {/* 상품 + 주소 */}
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-bold text-white">{task.items.join(', ')}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                            <p className="text-[11px] text-gray-400 truncate">{task.deliveryAddress}</p>
                                        </div>
                                    </div>

                                    {/* 메모 */}
                                    {task.notes && (
                                        <div className="mx-4 mb-2 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                                            <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                            <p className="text-[10px] text-amber-300">{task.notes}</p>
                                        </div>
                                    )}

                                    {/* 액션 바 */}
                                    <div className="px-3 pb-3 flex gap-2">
                                        <a href={`tel:${task.recipientPhone}`}
                                            className="flex items-center justify-center w-12 h-12 bg-gray-600/30 hover:bg-gray-600/50 rounded-xl border border-gray-600/30 transition-colors">
                                            <Phone className="w-5 h-5 text-gray-300" />
                                        </a>
                                        <a href={`https://map.kakao.com/link/to/${encodeURIComponent(task.deliveryAddress)},${task.deliveryCoords.lat},${task.deliveryCoords.lng}`}
                                            target="_blank"
                                            className="flex items-center justify-center w-12 h-12 bg-sky-500/10 hover:bg-sky-500/20 rounded-xl border border-sky-500/20 transition-colors">
                                            <Navigation className="w-5 h-5 text-sky-400" />
                                        </a>
                                        {NEXT_STATUS[task.status] && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleStatusChange(task); }}
                                                className={`flex-1 h-12 bg-gradient-to-r ${action.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg text-center text-base active:scale-[0.97]`}
                                            >
                                                {action.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* 완료 건수 */}
                        {completedTasks.length > 0 && (
                            <div className="flex items-center justify-center gap-2 py-3 bg-gray-700/20 rounded-xl border border-gray-700/30">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-gray-400">완료 {completedTasks.length}건</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════ 사진 업로드 모달 ═══════ */}
            {showPhotoUpload && selectedTask && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-end">
                    <div className="bg-gray-800 w-full rounded-t-3xl p-6 border-t border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-2">📸 배송 완료 사진</h3>
                        <p className="text-sm text-gray-400 mb-4">문 앞 사진을 촬영해주세요. 고객에게 자동 전송됩니다.</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button onClick={() => handlePhotoUpload(selectedTask)}
                                className="aspect-square border-2 border-dashed border-sky-500/50 rounded-2xl flex flex-col items-center justify-center text-sky-400 hover:bg-sky-500/10 transition-colors">
                                <Camera className="w-10 h-10 mb-2" />
                                <span className="text-sm font-bold">촬영하기</span>
                            </button>
                            <button onClick={() => handlePhotoUpload(selectedTask)}
                                className="aspect-square border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 transition-colors">
                                <ImageIcon className="w-10 h-10 mb-2" />
                                <span className="text-sm font-bold">갤러리</span>
                            </button>
                        </div>
                        <button onClick={() => { setShowPhotoUpload(false); setSelectedTask(null); }}
                            className="w-full py-3.5 border border-gray-600 rounded-xl text-gray-400 font-medium hover:bg-gray-700/50 transition-colors">
                            나중에 하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
