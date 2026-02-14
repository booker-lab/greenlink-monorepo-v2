// 그린링크 v2 - Zustand 주문 스토어

import { create } from 'zustand';
import type { Order, OrderStatus } from '../constants/types';
import { MOCK_ORDERS } from '../constants/initial-data';

interface OrderStore {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'orderedAt'>) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    getOrdersByFarm: (farmId: string) => Order[];
    getOrdersByDate: (date: string) => Order[];
    getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [...MOCK_ORDERS],

    addOrder: (orderData) => {
        const newOrder: Order = {
            ...orderData,
            id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            orderedAt: new Date().toISOString(),
        };
        set((state) => ({
            orders: [newOrder, ...state.orders],
        }));
    },

    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orders: state.orders.map((o) =>
                o.id === orderId ? { ...o, status } : o
            ),
        }));
    },

    getOrdersByFarm: (farmId) => {
        return get().orders.filter((o) => o.farmId === farmId);
    },

    getOrdersByDate: (date) => {
        return get().orders.filter((o) => o.deliveryDate === date);
    },

    getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
    },
}));
