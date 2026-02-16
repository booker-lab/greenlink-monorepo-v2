'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@greenlink/lib';

export default function DriverHome() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/delivery');
        } else {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
