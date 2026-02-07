'use client';

import { useState } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const recentSearches = ['장미', '유기농 상추', '튤립', '허브'];
    const popularSearches = ['제철 딸기', '다육이', '로즈마리', '해바라기', '카네이션'];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* 검색 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-gray-600">
                        <X className="w-6 h-6" />
                    </Link>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="상품명, 농장, 카테고리 검색"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* 최근 검색어 */}
            <section className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        최근 검색어
                    </h2>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                        전체 삭제
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                        <button
                            key={idx}
                            className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </section>

            {/* 인기 검색어 */}
            <section className="p-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    인기 검색어
                </h2>
                <div className="space-y-3">
                    {popularSearches.map((term, idx) => (
                        <button
                            key={idx}
                            className="flex items-center gap-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg"
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${idx < 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {idx + 1}
                            </span>
                            <span className="text-gray-700">{term}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
