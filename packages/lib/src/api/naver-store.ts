// 그린링크 v2 - 네이버 스마트스토어 API 스켈레톤
// 실제 API 키 연동 전까지 인터페이스만 정의

import type { NaverStoreConfig, Product } from '../constants/types';

/** 네이버 커머스 API 응답 타입 */
interface NaverProduct {
    originProductNo: number;
    productName: string;
    salePrice: number;
    stockQuantity: number;
    productImageUrl: string;
    categoryId: string;
    statusType: 'SALE' | 'OUTOFSTOCK' | 'SUSPENSION';
}

interface NaverApiResponse<T> {
    timestamp: string;
    data: T;
}

/** 네이버 스마트스토어 API 클라이언트 스켈레톤 */
export class NaverStoreApi {
    private config: NaverStoreConfig;

    constructor(config: NaverStoreConfig) {
        this.config = config;
    }

    /** 인증 토큰 발급 (스켈레톤) */
    async getAccessToken(): Promise<string> {
        // TODO: 실제 OAuth 인증 구현
        // POST https://api.commerce.naver.com/external/v1/oauth2/token
        console.log('[NaverStoreApi] getAccessToken - 스켈레톤');
        return 'mock-access-token';
    }

    /** 상품 목록 조회 (스켈레톤) */
    async getProducts(): Promise<NaverApiResponse<NaverProduct[]>> {
        // TODO: 실제 API 호출 구현
        // GET https://api.commerce.naver.com/external/v2/products
        console.log('[NaverStoreApi] getProducts - 스켈레톤');
        return {
            timestamp: new Date().toISOString(),
            data: [],
        };
    }

    /** 네이버 상품 → 그린링크 상품 변환 */
    convertToGreenLinkProduct(naverProduct: NaverProduct, farmId: string): Omit<Product, 'id' | 'createdAt'> {
        return {
            farmId,
            name: naverProduct.productName,
            price: naverProduct.salePrice,
            quantity: naverProduct.stockQuantity,
            unit: '개',
            description: `네이버 스마트스토어에서 동기화된 상품 (원본 번호: ${naverProduct.originProductNo})`,
            images: [naverProduct.productImageUrl],
            category: '네이버 동기화',
            status: naverProduct.statusType === 'SALE' ? 'active' : 'soldout',
        };
    }

    /** 전체 동기화 (스켈레톤) */
    async syncAllProducts(farmId: string): Promise<Product[]> {
        // TODO: 실제 동기화 로직 구현
        console.log(`[NaverStoreApi] syncAllProducts for farm: ${farmId} - 스켈레톤`);
        return [];
    }
}

/** 네이버 스토어 API 인스턴스 생성 헬퍼 */
export const createNaverStoreApi = (config: NaverStoreConfig) => {
    return new NaverStoreApi(config);
};
