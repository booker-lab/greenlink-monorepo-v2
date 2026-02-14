// 그린링크 v2 - 디어 오키드 초기 데이터 (1호 입점 농가)

import type { Farm, Product, PinkTemperature } from './types';

/** 디어 오키드 - 1호 입점 농가 */
export const DEAR_ORCHID_FARM: Farm = {
    id: 'farm-dear-orchid-001',
    name: '디어 오키드',
    owner: '정의',
    category: '화훼',
    subcategory: '동양란',
    location: {
        address: '경기도 이천시 마장면',
        city: '이천',
        district: '마장면',
        coordinates: { lat: 37.2747, lng: 127.4350 },
    },
    phone: '031-000-0000',
    description: '30년 전통의 동양란 전문 농장입니다. 보세란, 풍란, 석곡 등 다양한 동양란을 직접 재배하며, 화원(B2B) 및 개인(B2C) 직거래를 진행합니다.',
    certifications: [
        {
            type: 'farming_business',
            name: '농업경영체 등록증',
            issuedAt: '2020-03-15',
            verified: true,
        },
    ],
    greenTemperature: {
        value: 42.5,
        level: '줄기',
        emoji: '🌱',
        description: '신뢰할 수 있는 판매자',
    },
    followers: 28,
    createdAt: '2026-02-14',
    profileEmoji: '🌸',
    tags: ['동양란', '보세란', '풍란', '난초', '이천', '직거래', 'B2B'],
};

/** 디어 오키드 초기 상품 목록 */
export const DEAR_ORCHID_PRODUCTS: Product[] = [
    {
        id: 'prod-001',
        farmId: 'farm-dear-orchid-001',
        name: '보세란 (중품)',
        price: 35000,
        originalPrice: 45000,
        quantity: 12,
        unit: '분',
        description: '잎이 단정하고 꽃대가 올라온 보세란 중품입니다. 실내 인테리어용으로 인기가 높습니다.',
        images: ['🌸'],
        category: '동양란',
        status: 'active',
        createdAt: '2026-02-14',
    },
    {
        id: 'prod-002',
        farmId: 'farm-dear-orchid-001',
        name: '풍란 (대품)',
        price: 80000,
        quantity: 5,
        unit: '분',
        description: '향기가 뛰어난 풍란 대품. 여름에 은은한 향을 즐길 수 있습니다.',
        images: ['🪻'],
        category: '동양란',
        status: 'active',
        createdAt: '2026-02-14',
    },
    {
        id: 'prod-003',
        farmId: 'farm-dear-orchid-001',
        name: '석곡 (소품)',
        price: 15000,
        quantity: 30,
        unit: '분',
        description: '돌에 붙여 키우는 석곡. 초보자도 쉽게 관리할 수 있는 입문용 난초입니다.',
        images: ['🌿'],
        category: '동양란',
        status: 'active',
        createdAt: '2026-02-14',
    },
    {
        id: 'prod-004',
        farmId: 'farm-dear-orchid-001',
        name: '동양란 선물세트',
        price: 120000,
        originalPrice: 150000,
        quantity: 8,
        unit: '세트',
        description: '보세란 + 풍란 조합 선물세트. 고급 화분 포함. 명절/경조사 선물로 추천드립니다.',
        images: ['🎁'],
        category: '동양란',
        status: 'active',
        createdAt: '2026-02-14',
    },
    {
        id: 'prod-005',
        farmId: 'farm-dear-orchid-001',
        name: '난석 (배양토) 5L',
        price: 8000,
        quantity: 50,
        unit: '포',
        description: '동양란 전용 배양토. 통기성과 배수성이 뛰어납니다.',
        images: ['🪨'],
        category: '자재',
        status: 'active',
        createdAt: '2026-02-14',
    },
];

/** 기본 소비자 핑크 온도 */
export const DEFAULT_PINK_TEMPERATURE: PinkTemperature = {
    value: 36.5,
    level: '첫눈',
    emoji: '♥',
    description: '그린링크를 시작한 새 회원',
};
