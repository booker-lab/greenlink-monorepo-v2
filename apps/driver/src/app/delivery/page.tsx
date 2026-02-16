'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package, Truck, CheckCircle2, Camera, Phone, Navigation,
    MapPin, AlertCircle, User, LogOut, ChevronUp, ChevronDown,
    Image as ImageIcon, Route, List, Map as MapIcon, Clock,
    ArrowDown, Zap
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

/* ── 거리 계산 (Haversine, km) ── */
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/* ── 최단경로 최적화 (Nearest Neighbor TSP) ── */
function optimizeRoute(startCoords: { lat: number; lng: number }, tasks: DeliveryTask[]): DeliveryTask[] {
    if (tasks.length <= 1) return tasks;

    const remaining = [...tasks];
    const result: DeliveryTask[] = [];
    let current = startCoords;

    while (remaining.length > 0) {
        let nearestIdx = 0;
        let nearestDist = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const dist = haversineKm(current, remaining[i].deliveryCoords);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestIdx = i;
            }
        }

        result.push(remaining[nearestIdx]);
        current = remaining[nearestIdx].deliveryCoords;
        remaining.splice(nearestIdx, 1);
    }

    return result;
}

/* ── 총 거리 계산 ── */
function totalDistance(start: { lat: number; lng: number }, tasks: DeliveryTask[]): number {
    let dist = 0;
    let current = start;
    for (const t of tasks) {
        dist += haversineKm(current, t.deliveryCoords);
        current = t.deliveryCoords;
    }
    return dist;
}

/* ── 좌표→SVG 변환 ── */
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
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    const handleLogout = () => { logout(); router.replace('/login'); };

    if (!isAuthenticated || !driver) return null;

    const activeTasks = tasks.filter(t => t.status !== 'DELIVERED');
    const completedTasks = tasks.filter(t => t.status === 'DELIVERED');

    // 농장(출발지) 좌표
    const farmCoords = tasks[0]?.pickupCoords || { lat: 37.2747, lng: 127.4350 };

    // 🚀 최단경로 최적화
    const optimizedTasks = useMemo(() => optimizeRoute(farmCoords, activeTasks), [activeTasks, farmCoords]);
    const originalDist = useMemo(() => totalDistance(farmCoords, activeTasks), [activeTasks, farmCoords]);
    const optimizedDist = useMemo(() => totalDistance(farmCoords, optimizedTasks), [optimizedTasks, farmCoords]);
    const savedDist = originalDist - optimizedDist;

    // 지도 영역 계산
    const bounds = useMemo(() => {
        const allCoords = tasks.flatMap(t => [t.pickupCoords, t.deliveryCoords]);
        if (allCoords.length === 0) return { minLat: 37.2, maxLat: 37.6, minLng: 126.9, maxLng: 127.5 };
        const lats = allCoords.map(c => c.lat);
        const lngs = allCoords.map(c => c.lng);
        const pad = 0.03;
        return { minLat: Math.min(...lats) - pad, maxLat: Math.max(...lats) + pad, minLng: Math.min(...lngs) - pad, maxLng: Math.max(...lngs) + pad };
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
        if (nextStatus === 'DELIVERED') { setSelectedTask(task.id); setShowPhotoUpload(true); }
    };

    const handlePhotoUpload = (taskId: string) => {
        addPhotoToTask(taskId, '📸');
        setShowPhotoUpload(false);
        setSelectedTask(null);
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col overflow-hidden relative">
            {/* ═══ 헤더 ═══ */}
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
                        {/* 뷰 토글 */}
                        <div className="flex bg-gray-800/80 rounded-lg border border-gray-700/50 p-0.5">
                            <button
                                onClick={() => setViewMode('map')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-sky-500/20 text-sky-400' : 'text-gray-500'}`}
                            >
                                <MapIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-sky-500/20 text-sky-400' : 'text-gray-500'}`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
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

            {/* ═══ 지도 뷰 ═══ */}
            {viewMode === 'map' && (
                <div className="flex-1 relative bg-gray-900">
                    <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(75,85,99,0.15)" strokeWidth="0.5" />
                            </pattern>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" opacity="0.7" />
                            </marker>
                        </defs>
                        <rect width="400" height="500" fill="url(#grid)" />

                        {/* 최적 경로 라인 (연결된 순서대로) */}
                        {optimizedTasks.length > 0 && (() => {
                            const farmSvg = coordsToSvg(farmCoords.lat, farmCoords.lng, bounds);
                            const points = [farmSvg, ...optimizedTasks.map(t => coordsToSvg(t.deliveryCoords.lat, t.deliveryCoords.lng, bounds))];
                            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                            return (
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth="2"
                                    strokeDasharray="8 4"
                                    opacity="0.5"
                                    markerMid="url(#arrow)"
                                />
                            );
                        })()}

                        {/* 농장 마커 */}
                        {(() => {
                            const pos = coordsToSvg(farmCoords.lat, farmCoords.lng, bounds);
                            return (
                                <g transform={`translate(${pos.x}, ${pos.y})`}>
                                    <circle r="20" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                                    <circle r="12" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
                                    <circle r="6" fill="#22c55e" filter="url(#glow)" />
                                    <text y="-24" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="bold">🌸 출발</text>
                                </g>
                            );
                        })()}

                        {/* 배송지 마커 (최적 순서대로 번호 부여) */}
                        {optimizedTasks.map((task, idx) => {
                            const pos = coordsToSvg(task.deliveryCoords.lat, task.deliveryCoords.lng, bounds);
                            const config = STATUS_CONFIG[task.status];
                            const isFocused = focusedTaskId === task.id;
                            return (
                                <g key={`marker-${task.id}`} transform={`translate(${pos.x}, ${pos.y})`}
                                    onClick={() => setFocusedTaskId(task.id === focusedTaskId ? null : task.id)}
                                    className="cursor-pointer">
                                    {isFocused && <circle r="22" fill="none" stroke={config.markerColor} strokeWidth="2" opacity="0.5">
                                        <animate attributeName="r" values="18;24;18" dur="1.5s" repeatCount="indefinite" />
                                    </circle>}
                                    <circle r="14" fill={`${config.markerColor}15`} stroke={`${config.markerColor}40`} strokeWidth="1" />
                                    <circle r="8" fill={config.markerColor} filter="url(#glow)" />
                                    <text y="1" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{idx + 1}</text>
                                    <text y="-20" textAnchor="middle" fill={config.markerColor} fontSize="8" fontWeight="bold">{task.recipientName}</text>
                                </g>
                            );
                        })}

                        {/* 완료 마커 */}
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

                    {/* 경로 최적화 뱃지 */}
                    {savedDist > 0 && (
                        <div className="absolute top-16 left-3 bg-sky-500/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-sky-500/20">
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-sky-400" />
                                <span className="text-[10px] text-sky-400 font-bold">최단거리 최적화</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                총 {optimizedDist.toFixed(1)}km · <span className="text-emerald-400">{savedDist.toFixed(1)}km 절약</span>
                            </p>
                        </div>
                    )}

                    {/* 범례 */}
                    <div className="absolute top-16 right-3 flex flex-col gap-1.5 bg-gray-800/80 backdrop-blur-sm rounded-xl p-2.5 border border-gray-700/50">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-[9px] text-gray-400">출발</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-400" /><span className="text-[9px] text-gray-400">대기</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-400" /><span className="text-[9px] text-gray-400">배송중</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-30" /><span className="text-[9px] text-gray-400">완료</span></div>
                    </div>
                </div>
            )}

            {/* ═══ 배송 목차 뷰 (리스트) ═══ */}
            {viewMode === 'list' && (
                <div className="flex-1 overflow-y-auto pt-16 pb-4 px-4">
                    {/* 경로 요약 */}
                    <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-2xl p-4 border border-sky-500/20 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Route className="w-4 h-4 text-sky-400" />
                                <h2 className="text-sm font-bold text-white">최적 배송 순서</h2>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                <Zap className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">{savedDist.toFixed(1)}km 절약</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-gray-400">
                            <span>총 {optimizedDist.toFixed(1)}km</span>
                            <span>·</span>
                            <span>{optimizedTasks.length}건</span>
                            <span>·</span>
                            <span>예상 {Math.ceil(optimizedDist / 40 * 60)}분</span>
                        </div>
                    </div>

                    {/* 출발지 */}
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                <span className="text-sm">🌸</span>
                            </div>
                            <div className="w-0.5 flex-1 bg-gradient-to-b from-green-500/30 to-sky-500/30 my-1" />
                        </div>
                        <div className="flex-1 pb-4">
                            <p className="text-sm font-bold text-white">디어 오키드 농장</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">경기도 이천시 마장면</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20 font-medium">출발지</span>
                            </div>
                        </div>
                    </div>

                    {/* 배송지 목차 (최적 순서) */}
                    {optimizedTasks.map((task, idx) => {
                        const config = STATUS_CONFIG[task.status];
                        const StatusIcon = config.icon;
                        const action = NEXT_ACTION[task.status];
                        const prevCoords = idx === 0 ? farmCoords : optimizedTasks[idx - 1].deliveryCoords;
                        const distFromPrev = haversineKm(prevCoords, task.deliveryCoords);
                        const isLast = idx === optimizedTasks.length - 1;

                        return (
                            <div key={task.id} className="flex gap-3">
                                {/* 타임라인 */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white border ${config.borderColor}`}
                                        style={{ background: `${config.markerColor}20` }}>
                                        {idx + 1}
                                    </div>
                                    {!isLast && <div className="w-0.5 flex-1 bg-gray-700/50 my-1" />}
                                </div>

                                {/* 카드 */}
                                <div className={`flex-1 ${isLast ? '' : 'pb-3'}`}>
                                    {/* 거리 표시 */}
                                    <div className="flex items-center gap-1 mb-1">
                                        <ArrowDown className="w-3 h-3 text-gray-600" />
                                        <span className="text-[10px] text-gray-600">{distFromPrev.toFixed(1)}km · 약 {Math.ceil(distFromPrev / 40 * 60)}분</span>
                                    </div>

                                    <div className={`bg-gray-800/50 rounded-xl p-3 border ${config.borderColor}`}>
                                        {/* 상태 + 수령인 */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.bgColor}`}>
                                                <StatusIcon className={`w-3 h-3 ${config.color}`} />
                                                <span className={`text-[10px] font-bold ${config.color}`}>{config.label}</span>
                                            </div>
                                            <span className="text-xs font-medium text-white">{task.recipientName}</span>
                                        </div>

                                        {/* 상품 */}
                                        <p className="text-sm font-bold text-white mb-1">{task.items.join(', ')}</p>

                                        {/* 주소 */}
                                        <div className="flex items-start gap-1.5 mb-2">
                                            <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-[11px] text-gray-400">{task.deliveryAddress}</p>
                                        </div>

                                        {/* 메모 */}
                                        {task.notes && (
                                            <div className="px-2.5 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center gap-1.5 mb-2">
                                                <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                                <p className="text-[10px] text-amber-300">{task.notes}</p>
                                            </div>
                                        )}

                                        {/* 액션 */}
                                        <div className="flex gap-2">
                                            <a href={`tel:${task.recipientPhone}`}
                                                className="flex items-center justify-center w-10 h-10 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl border border-gray-600/30 transition-colors">
                                                <Phone className="w-4 h-4 text-gray-300" />
                                            </a>
                                            <a href={`https://map.kakao.com/link/to/${encodeURIComponent(task.deliveryAddress)},${task.deliveryCoords.lat},${task.deliveryCoords.lng}`}
                                                target="_blank"
                                                className="flex items-center justify-center w-10 h-10 bg-sky-500/10 hover:bg-sky-500/20 rounded-xl border border-sky-500/20 transition-colors">
                                                <Navigation className="w-4 h-4 text-sky-400" />
                                            </a>
                                            {NEXT_STATUS[task.status] && (
                                                <button
                                                    onClick={() => handleStatusChange(task)}
                                                    className={`flex-1 h-10 bg-gradient-to-r ${action.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg text-sm active:scale-[0.97]`}
                                                >
                                                    {action.label}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* 완료 요약 */}
                    {completedTasks.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700/30 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-sm text-gray-300 font-medium">오늘 완료: {completedTasks.length}건</p>
                                <p className="text-[10px] text-gray-500">{completedTasks.map(t => t.recipientName).join(', ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ 하단 플로팅 패널 (지도 뷰일 때만) ═══ */}
            {viewMode === 'map' && (
                <div className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${expandedPanel ? 'max-h-[50vh]' : 'max-h-[120px]'}`}>
                    <div className="flex justify-center py-2 cursor-pointer" onClick={() => setExpandedPanel(!expandedPanel)}>
                        <div className="w-10 h-1 bg-gray-600 rounded-full" />
                    </div>

                    <div className="bg-gray-800/95 backdrop-blur-xl rounded-t-3xl border-t border-gray-700/50 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3" onClick={() => setExpandedPanel(!expandedPanel)}>
                            <div className="flex items-center gap-2">
                                <Route className="w-4 h-4 text-sky-400" />
                                <h2 className="text-sm font-bold text-white">
                                    배송 {optimizedTasks.length}건 <span className="text-[10px] text-gray-500 font-normal">· {optimizedDist.toFixed(1)}km</span>
                                </h2>
                            </div>
                            {expandedPanel ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
                        </div>

                        <div className={`overflow-y-auto px-4 pb-6 space-y-2.5 ${expandedPanel ? 'max-h-[38vh]' : 'max-h-0 overflow-hidden'}`}>
                            {optimizedTasks.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-4xl mb-3">🎉</p>
                                    <p className="text-white font-bold">오늘 배송 완료!</p>
                                    <p className="text-gray-500 text-xs mt-1">수고하셨습니다 ☘️</p>
                                </div>
                            )}

                            {optimizedTasks.map((task, idx) => {
                                const config = STATUS_CONFIG[task.status];
                                const StatusIcon = config.icon;
                                const action = NEXT_ACTION[task.status];
                                const prevCoords = idx === 0 ? farmCoords : optimizedTasks[idx - 1].deliveryCoords;
                                const distFromPrev = haversineKm(prevCoords, task.deliveryCoords);
                                const isFocused = focusedTaskId === task.id;

                                return (
                                    <div key={task.id}
                                        className={`bg-gray-700/40 rounded-2xl border overflow-hidden transition-all ${isFocused ? config.borderColor : 'border-gray-700/30'}`}
                                        onClick={() => setFocusedTaskId(task.id === focusedTaskId ? null : task.id)}>
                                        <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-gray-600/50 flex items-center justify-center text-[10px] font-bold text-white">{idx + 1}</span>
                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bgColor}`}>
                                                    <StatusIcon className={`w-3 h-3 ${config.color}`} />
                                                    <span className={`text-[10px] font-bold ${config.color}`}>{config.label}</span>
                                                </div>
                                                <span className="text-[9px] text-gray-600">{distFromPrev.toFixed(1)}km</span>
                                            </div>
                                            <p className="text-xs text-white font-medium">{task.recipientName}</p>
                                        </div>
                                        <div className="px-4 py-1.5">
                                            <p className="text-sm font-bold text-white">{task.items.join(', ')}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                                <p className="text-[10px] text-gray-400 truncate">{task.deliveryAddress}</p>
                                            </div>
                                        </div>
                                        {task.notes && (
                                            <div className="mx-4 mb-2 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                                                <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                                <p className="text-[10px] text-amber-300">{task.notes}</p>
                                            </div>
                                        )}
                                        <div className="px-3 pb-3 flex gap-2">
                                            <a href={`tel:${task.recipientPhone}`}
                                                className="flex items-center justify-center w-11 h-11 bg-gray-600/30 hover:bg-gray-600/50 rounded-xl border border-gray-600/30 transition-colors">
                                                <Phone className="w-5 h-5 text-gray-300" />
                                            </a>
                                            <a href={`https://map.kakao.com/link/to/${encodeURIComponent(task.deliveryAddress)},${task.deliveryCoords.lat},${task.deliveryCoords.lng}`}
                                                target="_blank"
                                                className="flex items-center justify-center w-11 h-11 bg-sky-500/10 hover:bg-sky-500/20 rounded-xl border border-sky-500/20 transition-colors">
                                                <Navigation className="w-5 h-5 text-sky-400" />
                                            </a>
                                            {NEXT_STATUS[task.status] && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(task); }}
                                                    className={`flex-1 h-11 bg-gradient-to-r ${action.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg text-base active:scale-[0.97]`}
                                                >
                                                    {action.label}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {completedTasks.length > 0 && (
                                <div className="flex items-center justify-center gap-2 py-3 bg-gray-700/20 rounded-xl border border-gray-700/30">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs text-gray-400">완료 {completedTasks.length}건</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ 사진 업로드 모달 ═══ */}
            {showPhotoUpload && selectedTask && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-end">
                    <div className="bg-gray-800 w-full rounded-t-3xl p-6 border-t border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-2">📸 배송 완료 사진</h3>
                        <p className="text-sm text-gray-400 mb-4">문 앞 사진을 촬영해주세요.</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button onClick={() => handlePhotoUpload(selectedTask)}
                                className="aspect-square border-2 border-dashed border-sky-500/50 rounded-2xl flex flex-col items-center justify-center text-sky-400 hover:bg-sky-500/10 transition-colors">
                                <Camera className="w-10 h-10 mb-2" /><span className="text-sm font-bold">촬영하기</span>
                            </button>
                            <button onClick={() => handlePhotoUpload(selectedTask)}
                                className="aspect-square border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 transition-colors">
                                <ImageIcon className="w-10 h-10 mb-2" /><span className="text-sm font-bold">갤러리</span>
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
