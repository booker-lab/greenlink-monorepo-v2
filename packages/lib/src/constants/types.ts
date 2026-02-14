// 그린링크 v2 - 공용 타입 정의

/** 농가/판매자 정보 */
export interface Farm {
    id: string;
    name: string;
    owner: string;
    category: string;
    subcategory: string;
    location: {
        address: string;
        city: string;
        district: string;
        coordinates?: { lat: number; lng: number };
    };
    phone: string;
    description: string;
    certifications: Certification[];
    greenTemperature: GreenTemperature;
    followers: number;
    createdAt: string;
    profileEmoji: string;
    tags: string[];
}

/** 농업경영체 인증 등 */
export interface Certification {
    type: 'farming_business' | 'organic' | 'gap' | 'haccp';
    name: string;
    issuedAt: string;
    verified: boolean;
}

/** 판매자 그린 온도 (신뢰 지표) */
export interface GreenTemperature {
    value: number;        // 예: 42.5
    level: string;        // 예: '새싹', '줄기', '꽃', '열매'
    emoji: string;        // 예: '🌱'
    description: string;  // 예: '신뢰할 수 있는 판매자'
}

/** 소비자 핑크 온도 (구매자 신뢰 지표) */
export interface PinkTemperature {
    value: number;        // 예: 36.5
    level: string;        // 예: '첫눈', '봄바람', '한여름'
    emoji: string;        // 예: '♥'
    description: string;
}

/** 상품 */
export interface Product {
    id: string;
    farmId: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    unit: string;         // 예: '분', '포기', '송이'
    description: string;
    images: string[];     // emoji 또는 URL
    category: string;
    status: 'active' | 'soldout' | 'hidden';
    createdAt: string;
}

/** 네이버 스마트스토어 연동 정보 */
export interface NaverStoreConfig {
    clientId: string;
    clientSecret: string;
    storeId: string;
    isConnected: boolean;
}

/** 상품 후기 (팔도감 벤치마킹) */
export interface Review {
    id: string;
    productId: string;
    author: string;
    rating: number;         // 1~5
    content: string;
    option?: string;        // 구매 옵션 (예: '500g*3팩')
    images: string[];       // emoji 또는 URL
    createdAt: string;
    helpful: number;        // 도움이 됐어요 수
}
