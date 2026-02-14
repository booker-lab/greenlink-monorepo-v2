'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, ChevronLeft, ChevronRight, Save,
} from 'lucide-react';
import { useDeliveryStore } from '@greenlink/lib';

export default function DeliverySettingsPage() {
    const router = useRouter();
    const { dailyQuotas, setDailyQuota } = useDeliveryStore();

    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saved, setSaved] = useState(false);

    // 달력 데이터 생성
    const calendarDays = useMemo(() => {
        const { year, month } = currentMonth;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: (number | null)[] = [];

        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return days;
    }, [currentMonth]);

    const getDateStr = (day: number) => {
        const { year, month } = currentMonth;
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getQuota = (dateStr: string) => {
        return dailyQuotas.find(q => q.date === dateStr);
    };

    const handleDateClick = (day: number) => {
        const dateStr = getDateStr(day);
        setSelectedDate(dateStr);
        const quota = getQuota(dateStr);
        setEditValue(quota ? String(quota.maxOrders) : '15');
    };

    const handleSave = () => {
        if (selectedDate && editValue) {
            setDailyQuota(selectedDate, parseInt(editValue));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleBulkSet = (weekday: number, max: number) => {
        const { year, month } = currentMonth;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            if (date.getDay() === weekday) {
                setDailyQuota(getDateStr(d), max);
            }
        }
    };

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.push('/delivery')} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">📅 일일 배송 수량 설정</h1>
                    <div className="w-8" />
                </div>
            </header>

            {/* 월 네비게이션 */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <button
                    onClick={() => setCurrentMonth(p => ({ ...p, month: p.month - 1 < 0 ? 11 : p.month - 1, year: p.month - 1 < 0 ? p.year - 1 : p.year }))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-base font-bold text-gray-800">
                    {currentMonth.year}년 {monthNames[currentMonth.month]}
                </h2>
                <button
                    onClick={() => setCurrentMonth(p => ({ ...p, month: p.month + 1 > 11 ? 0 : p.month + 1, year: p.month + 1 > 11 ? p.year + 1 : p.year }))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* 달력 */}
            <div className="bg-white mx-4 mt-4 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7">
                    {dayNames.map((name, i) => (
                        <div key={name} className={`py-2 text-center text-xs font-medium ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
                            {name}
                        </div>
                    ))}
                </div>

                {/* 날짜 */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        if (day === null) return <div key={`empty-${idx}`} className="h-16" />;

                        const dateStr = getDateStr(day);
                        const quota = getQuota(dateStr);
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === new Date().toISOString().split('T')[0];
                        const dayOfWeek = new Date(currentMonth.year, currentMonth.month, day).getDay();

                        return (
                            <button
                                key={dateStr}
                                onClick={() => handleDateClick(day)}
                                className={`h-16 flex flex-col items-center justify-center gap-0.5 transition-colors relative
                                    ${isSelected ? 'bg-green-50 ring-2 ring-green-500 ring-inset' : 'hover:bg-gray-50'}
                                    ${isToday ? 'font-bold' : ''}`}
                            >
                                <span className={`text-sm ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'} ${isToday ? 'bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''}`}>
                                    {day}
                                </span>
                                {quota && (
                                    <span className={`text-[10px] font-medium ${quota.maxOrders === 0 ? 'text-red-400' : quota.currentOrders >= quota.maxOrders ? 'text-red-500' : 'text-green-600'}`}>
                                        {quota.maxOrders === 0 ? '휴무' : `${quota.currentOrders}/${quota.maxOrders}`}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 선택된 날짜 편집 */}
            {selectedDate && (
                <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <h3 className="font-bold text-gray-800 mb-3">{selectedDate} 설정</h3>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 flex-shrink-0">최대 배송 수량</label>
                        <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            min="0"
                            max="50"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                            <Save className="w-4 h-4" />
                            저장
                        </button>
                    </div>
                    {saved && (
                        <p className="text-sm text-green-600 font-medium mt-2 text-center">✅ 저장 완료!</p>
                    )}
                </div>
            )}

            {/* 빠른 설정 */}
            <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-bold text-gray-800 mb-3">⚡ 빠른 설정 (이번 달 일괄)</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => { [1, 2, 3, 4, 5].forEach(d => handleBulkSet(d, 15)); handleBulkSet(6, 10); handleBulkSet(0, 0); }}
                        className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
                    >
                        기본: 평일 15건 · 토 10건 · 일 휴무
                    </button>
                    <button
                        onClick={() => { [1, 2, 3, 4, 5].forEach(d => handleBulkSet(d, 10)); handleBulkSet(6, 5); handleBulkSet(0, 0); }}
                        className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                        소량: 평일 10건 · 토 5건 · 일 휴무
                    </button>
                    <button
                        onClick={() => { [0, 1, 2, 3, 4, 5, 6].forEach(d => handleBulkSet(d, 20)); }}
                        className="w-full py-3 bg-orange-50 text-orange-700 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors border border-orange-200"
                    >
                        성수기: 매일 20건
                    </button>
                </div>
            </div>
        </div>
    );
}
