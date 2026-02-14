// 그린링크 v2 - Zustand 상품 스토어

import { create } from 'zustand';
import type { Product } from '../constants/types';
import { DEAR_ORCHID_PRODUCTS } from '../constants/initial-data';

interface ProductStore {
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
    removeProduct: (id: string) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    getProductsByFarm: (farmId: string) => Product[];
    getActiveProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
    // 초기 상태: 디어 오키드 상품으로 시딩
    products: [...DEAR_ORCHID_PRODUCTS],

    addProduct: (productData) => {
        const newProduct: Product = {
            ...productData,
            id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
            products: [newProduct, ...state.products],
        }));
    },

    removeProduct: (id) => {
        set((state) => ({
            products: state.products.filter((p) => p.id !== id),
        }));
    },

    updateProduct: (id, updates) => {
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            ),
        }));
    },

    getProductsByFarm: (farmId) => {
        return get().products.filter((p) => p.farmId === farmId);
    },

    getActiveProducts: () => {
        return get().products.filter((p) => p.status === 'active');
    },
}));
