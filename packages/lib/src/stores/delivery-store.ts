// 그린링크 v2 - Zustand 배송 스토어

import { create } from 'zustand';
import type { DeliveryTask, DeliveryStatus, DailyQuota } from '../constants/types';
import { MOCK_DELIVERY_TASKS, generateDefaultQuotas } from '../constants/initial-data';

interface DeliveryStore {
    tasks: DeliveryTask[];
    dailyQuotas: DailyQuota[];

    // 배송 태스크
    addTask: (task: Omit<DeliveryTask, 'id' | 'createdAt'>) => void;
    updateTaskStatus: (taskId: string, status: DeliveryStatus) => void;
    addPhotoToTask: (taskId: string, photoUrl: string) => void;
    getTasksByDate: (date: string) => DeliveryTask[];
    getTodayTasks: () => DeliveryTask[];

    // 일일 쿼터
    setDailyQuota: (date: string, maxOrders: number) => void;
    getQuotaByDate: (date: string) => DailyQuota | undefined;
    isDateAvailable: (date: string) => boolean;
    incrementDateOrders: (date: string) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
    tasks: [...MOCK_DELIVERY_TASKS],
    dailyQuotas: generateDefaultQuotas(new Date()),

    // ───── 배송 태스크 ─────

    addTask: (taskData) => {
        const newTask: DeliveryTask = {
            ...taskData,
            id: `del-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({
            tasks: [newTask, ...state.tasks],
        }));
    },

    updateTaskStatus: (taskId, status) => {
        set((state) => ({
            tasks: state.tasks.map((t) => {
                if (t.id !== taskId) return t;
                const updates: Partial<DeliveryTask> = { status };
                if (status === 'PICKED_UP') updates.pickedUpAt = new Date().toISOString();
                if (status === 'DELIVERED') updates.deliveredAt = new Date().toISOString();
                return { ...t, ...updates };
            }),
        }));
    },

    addPhotoToTask: (taskId, photoUrl) => {
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === taskId
                    ? { ...t, photoUrls: [...t.photoUrls, photoUrl] }
                    : t
            ),
        }));
    },

    getTasksByDate: (date) => {
        return get().tasks.filter((t) => t.createdAt.startsWith(date));
    },

    getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter((t) =>
            t.createdAt.startsWith(today) || t.status !== 'DELIVERED'
        );
    },

    // ───── 일일 쿼터 ─────

    setDailyQuota: (date, maxOrders) => {
        set((state) => {
            const existing = state.dailyQuotas.find((q) => q.date === date);
            if (existing) {
                return {
                    dailyQuotas: state.dailyQuotas.map((q) =>
                        q.date === date ? { ...q, maxOrders } : q
                    ),
                };
            }
            return {
                dailyQuotas: [...state.dailyQuotas, { date, maxOrders, currentOrders: 0 }],
            };
        });
    },

    getQuotaByDate: (date) => {
        return get().dailyQuotas.find((q) => q.date === date);
    },

    isDateAvailable: (date) => {
        const quota = get().dailyQuotas.find((q) => q.date === date);
        if (!quota) return true; // 쿼터가 설정되지 않은 날은 기본 허용
        return quota.currentOrders < quota.maxOrders;
    },

    incrementDateOrders: (date) => {
        set((state) => ({
            dailyQuotas: state.dailyQuotas.map((q) =>
                q.date === date ? { ...q, currentOrders: q.currentOrders + 1 } : q
            ),
        }));
    },
}));
