'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, TrendingUp, Package, Leaf, Info, Clock, Droplets, CheckCircle2 } from 'lucide-react';
import { FLOWER_CATEGORIES, CATALOG_ITEMS, AVAILABILITY_LABEL } from '@greenlink/lib';
import type { CatalogItem } from '@greenlink/lib';

/* ── 품목별 이모지 맵 (이미지 대체) ── */
const ITEM_EMOJI: Record<string, string> = {
    '장미': '🌹',
    '국화': '🌼',
    '백합': '🤍',
    '카네이션': '💐',
    '튤립': '🌷',
    '안개꽃': '☁️',
    '호접란': '🦋',
    '시클라멘': '🌺',
    '몬스테라': '🪴',
    '스투키': '🌵',
};

function ItemDetailCard({ item, onClose }: { item: CatalogItem; onClose: () => void }) {
    const avail = AVAILABILITY_LABEL[item.availability];
    const emoji = ITEM_EMOJI[item.itemName] || '🌸';

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* 헤더 이미지 */}
                <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center rounded-t-3xl sm:rounded-t-3xl">
                    <span className="text-7xl">{emoji}</span>
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white">
                        ✕
                    </button>
                    <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold border bg-white/90 ${avail.color}`}>
                        {avail.emoji} {avail.label}
                    </div>
                </div>

                <div className="p-5">
                    {/* 제목 */}
                    <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.varietyName} 품종</p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* 구매 안정성 */}
                    <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-green-800">안정적 공급 품목</p>
                            <p className="text-xs text-green-600 mt-0.5">전국 화훼공판장에서 꾸준히 거래되는 검증된 품목입니다</p>
                        </div>
                    </div>

                    {/* 상세 설명 */}
                    <div className="mt-4">
                        <h4 className="font-bold text-sm text-gray-700 flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-green-600" /> 상세 설명
                        </h4>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.detailDescription}</p>
                    </div>

                    {/* 출하 시기 */}
                    <div className="mt-4 flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                        <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-amber-700">출하 시기</p>
                            <p className="text-xs text-amber-600 mt-0.5">{item.season}</p>
                        </div>
                    </div>

                    {/* 관리 팁 */}
                    <div className="mt-3 flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                        <Droplets className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-blue-700">관리 팁</p>
                            <p className="text-xs text-blue-600 mt-0.5">{item.care}</p>
                        </div>
                    </div>



                    {/* 공구 페이지로 이동 */}
                    <Link
                        href="/group-buy"
                        className="block mt-4 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl text-center shadow-lg shadow-green-200 hover:opacity-90 transition-all active:scale-[0.97]"
                    >
                        🛒 이 품목 공구 보러가기
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ItemCard({ item, onClick }: { item: CatalogItem; onClick: () => void }) {
    const avail = AVAILABILITY_LABEL[item.availability];
    const emoji = ITEM_EMOJI[item.itemName] || '🌸';

    return (
        <button onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden text-left active:scale-[0.97] w-full">
            {/* 이미지 */}
            <div className="relative h-32 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <span className="text-5xl">{emoji}</span>
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-white/90 ${avail.color}`}>
                    {avail.emoji}
                </div>
            </div>
            {/* 정보 */}
            <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                <div className="flex items-center mt-2">
                    <span className={`text-[10px] font-medium ${avail.color}`}>{avail.emoji} {avail.label}</span>
                </div>
            </div>
        </button>
    );
}

export default function CategoryPage() {
    const [selectedCat, setSelectedCat] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

    const filteredItems = selectedCat === 'all'
        ? CATALOG_ITEMS
        : CATALOG_ITEMS.filter(i => i.categoryId === selectedCat);

    const selectedCategory = FLOWER_CATEGORIES.find(c => c.id === selectedCat);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3 p-4">
                    <Link href="/" className="text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">구매 가능 품목</h1>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                {/* 카테고리 탭 */}
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setSelectedCat('all')}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCat === 'all'
                            ? 'bg-green-600 text-white shadow-md shadow-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        전체 ({CATALOG_ITEMS.length})
                    </button>
                    {FLOWER_CATEGORIES.filter(c => c.id !== 'cat-succulent' && c.id !== 'cat-supplies').map(cat => {
                        const count = CATALOG_ITEMS.filter(i => i.categoryId === cat.id).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCat(cat.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCat === cat.id
                                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.icon} {cat.name} ({count})
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* 안내 배너 */}
            <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white">
                <div className="flex items-start gap-3">
                    <Leaf className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">경매장 시세 기반 품목</p>
                        <p className="text-xs text-green-100 mt-1 leading-relaxed">
                            전국 5대 화훼공판장 실거래 데이터 기반으로 출하량이 안정적인 품목만 선별했습니다.
                            공동구매를 통해 경매 가격에 구매하세요! 🌸
                        </p>
                    </div>
                </div>
            </div>

            {/* 가용성 범례 */}
            <div className="mx-4 mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">🟢 구매 쉬움</span>
                <span className="flex items-center gap-1">🟡 시즌 한정</span>
                <span className="flex items-center gap-1">🔴 희소</span>
            </div>

            {/* 카테고리 설명 */}
            {selectedCategory && (
                <div className="mx-4 mt-3 p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-3">
                    <span className="text-2xl">{selectedCategory.icon}</span>
                    <div>
                        <p className="font-bold text-sm text-gray-800">{selectedCategory.name}</p>
                        <p className="text-xs text-gray-500">{selectedCategory.description}</p>
                    </div>
                </div>
            )}

            {/* 상품 그리드 */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                    {filteredItems.map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                        />
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">이 카테고리에 품목이 없어요</p>
                    </div>
                )}
            </div>

            {/* 상세 모달 */}
            {selectedItem && (
                <ItemDetailCard
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
