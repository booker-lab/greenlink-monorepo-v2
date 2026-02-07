'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, User, ShoppingCart } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/', icon: Home, label: '홈' },
        { href: '/category', icon: LayoutGrid, label: '카테고리' },
        { href: '/search', icon: Search, label: '검색' },
        { href: '/cart', icon: ShoppingCart, label: '장바구니' },
        { href: '/mypage', icon: User, label: '마이' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive(item.href)
                                    ? 'text-green-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <IconComponent className={`w-6 h-6 ${isActive(item.href) ? 'fill-green-100' : ''}`} />
                            <span className={`text-[10px] mt-1 ${isActive(item.href) ? 'font-medium' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
