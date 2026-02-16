'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface LongPressButtonProps {
    onConfirm: () => void;
    label: string;
    gradient: string;
    duration?: number; // ms, default 2000 (2초)
    disabled?: boolean;
    className?: string;
}

export default function LongPressButton({
    onConfirm,
    label,
    gradient,
    duration = 2000,
    disabled = false,
    className = '',
}: LongPressButtonProps) {
    const [pressing, setPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const startTimeRef = useRef<number>(0);
    const animFrameRef = useRef<number>(0);
    const confirmedRef = useRef(false);

    const updateProgress = useCallback(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.min(elapsed / duration, 1);
        setProgress(pct);

        if (pct >= 1 && !confirmedRef.current) {
            confirmedRef.current = true;
            setCompleted(true);
            setPressing(false);

            // 진동 피드백 (PWA에서 지원 시)
            if (navigator.vibrate) {
                navigator.vibrate([50, 30, 100]);
            }

            setTimeout(() => {
                onConfirm();
                setProgress(0);
                setCompleted(false);
                confirmedRef.current = false;
            }, 400);
            return;
        }

        if (pct < 1) {
            animFrameRef.current = requestAnimationFrame(updateProgress);
        }
    }, [duration, onConfirm]);

    const handleStart = useCallback(() => {
        if (disabled || confirmedRef.current) return;
        confirmedRef.current = false;
        startTimeRef.current = Date.now();
        setPressing(true);
        setProgress(0);
        setCompleted(false);

        // 시작 진동
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }

        animFrameRef.current = requestAnimationFrame(updateProgress);
    }, [disabled, updateProgress]);

    const handleEnd = useCallback(() => {
        if (confirmedRef.current) return;
        setPressing(false);
        setProgress(0);
        cancelAnimationFrame(animFrameRef.current);
    }, []);

    useEffect(() => {
        return () => cancelAnimationFrame(animFrameRef.current);
    }, []);

    const progressPct = Math.round(progress * 100);

    return (
        <button
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            disabled={disabled}
            className={`relative overflow-hidden rounded-xl font-bold transition-all select-none touch-none ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98] cursor-pointer'
                } ${completed ? 'scale-[0.96]' : ''}`}
        >
            {/* 배경 그라데이션 */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} transition-opacity ${pressing ? 'opacity-40' : 'opacity-100'}`} />

            {/* 프로그레스 오버레이 */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
                style={{
                    clipPath: `inset(0 ${100 - progressPct}% 0 0)`,
                    transition: pressing ? 'none' : 'clip-path 0.2s ease-out',
                }}
            />

            {/* 완료 플래시 */}
            {completed && (
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
            )}

            {/* 텍스트 */}
            <div className="relative z-10 flex items-center justify-center gap-2 py-4 px-4">
                {pressing ? (
                    <>
                        <span className="text-white/90 text-base">
                            {progressPct < 100 ? `${progressPct}%` : '✅'}
                        </span>
                        {/* 원형 프로그레스 */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                            <circle
                                cx="12" cy="12" r="10"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray={`${progressPct * 0.628} 62.8`}
                                strokeLinecap="round"
                                transform="rotate(-90 12 12)"
                            />
                        </svg>
                    </>
                ) : completed ? (
                    <span className="text-white text-lg">✅ 완료!</span>
                ) : (
                    <span className="text-white text-base">{label}</span>
                )}
            </div>

            {/* 하단 힌트 */}
            {!pressing && !completed && !disabled && (
                <div className="absolute bottom-0.5 left-0 right-0 text-center">
                    <span className="text-[8px] text-white/40">꾹 눌러서 확인</span>
                </div>
            )}
        </button>
    );
}
