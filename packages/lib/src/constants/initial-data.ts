// 그린링크 v2 - 디어 오키드 초기 데이터 (1호 입점 농가)

import type { Farm, Product, PinkTemperature, Review, Order, DeliveryTask, DailyQuota } from './types';

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

/** Mock 후기 데이터 (팔도감 벤치마킹) */
export const MOCK_REVIEWS: Review[] = [
    {
        id: 'rev-001',
        productId: 'prod-001',
        author: '난초사랑',
        rating: 5,
        content: '재구매입니다. 보세란이 정말 예쁘고 상태가 좋아서 자꾸 생각나요~ 선물용으로도 딱이에요!',
        option: '보세란 (중품) 1분',
        images: ['🌸'],
        createdAt: '2026-02-12',
        helpful: 24,
    },
    {
        id: 'rev-002',
        productId: 'prod-001',
        author: '이천화원',
        rating: 5,
        content: '화원에서 직접 방문하고 주문했는데 배송도 빠르고 포장도 꼼꼼해요. 다음에도 주문할게요!',
        option: '보세란 (중품) 3분',
        images: [],
        createdAt: '2026-02-10',
        helpful: 18,
    },
    {
        id: 'rev-003',
        productId: 'prod-002',
        author: '초보정원사',
        rating: 4,
        content: '풍란 향이 정말 좋아요. 근데 관리가 살짝 어려울 수 있으니 초보분은 석곡부터 추천합니다.',
        option: '풍란 (대품) 1분',
        images: ['🪻'],
        createdAt: '2026-02-08',
        helpful: 12,
    },
    {
        id: 'rev-004',
        productId: 'prod-004',
        author: '꽃선물남',
        rating: 5,
        content: '어머니 생신 선물로 드렸는데 정말 좋아하셨어요! 고급 화분까지 포함이라 가성비 최고입니다.',
        option: '동양란 선물세트 1세트',
        images: ['🎁'],
        createdAt: '2026-02-05',
        helpful: 31,
    },
    {
        id: 'rev-005',
        productId: 'prod-003',
        author: '식물킬러탈출',
        rating: 5,
        content: '석곡은 정말 키우기 쉽네요! 물만 잘 주면 되고, 3개월째 잘 자라고 있어요.',
        option: '석곡 (소품) 2분',
        images: ['🌿'],
        createdAt: '2026-02-03',
        helpful: 15,
    },
    {
        id: 'rev-006',
        productId: 'prod-005',
        author: '난초마스터',
        rating: 4,
        content: '난석 품질 좋습니다. 통기성이 기존에 쓰던 것보다 확실히 나아요. 대용량이라 오래 쓸 수 있어요.',
        option: '난석 (배양토) 5L 1포',
        images: [],
        createdAt: '2026-01-28',
        helpful: 8,
    },
];

// ───────── 배송 시스템 목 데이터 (PV5 MVP) ─────────

/** Mock 주문 데이터 */
export const MOCK_ORDERS: Order[] = [
    {
        id: 'order-001',
        productId: 'prod-001',
        farmId: 'farm-dear-orchid-001',
        buyerName: '김지수',
        buyerPhone: '010-1234-5678',
        buyerAddress: '서울시 강남구 역삼동 123-45 그린아파트 301호',
        quantity: 1,
        totalPrice: 35000,
        status: 'PREPARING',
        deliveryDate: '2026-02-16',
        orderedAt: '2026-02-14T10:30:00',
        message: '부재 시 문 앞에 놓아주세요',
        deliveryTaskId: 'del-001',
    },
    {
        id: 'order-002',
        productId: 'prod-003',
        farmId: 'farm-dear-orchid-001',
        buyerName: '박하늘',
        buyerPhone: '010-9876-5432',
        buyerAddress: '경기도 이천시 마장면 서이천로 456',
        quantity: 2,
        totalPrice: 130000,
        status: 'ORDERED',
        deliveryDate: '2026-02-18',
        orderedAt: '2026-02-14T14:20:00',
        message: '선물용 포장 부탁드립니다',
    },
    {
        id: 'order-003',
        productId: 'prod-002',
        farmId: 'farm-dear-orchid-001',
        buyerName: '이서준',
        buyerPhone: '010-5555-7777',
        buyerAddress: '서울시 송파구 잠실동 789 레이크힐 1205호',
        quantity: 1,
        totalPrice: 80000,
        status: 'COMPLETED',
        deliveryDate: '2026-02-13',
        orderedAt: '2026-02-11T09:00:00',
        deliveryTaskId: 'del-002',
    },
];

/** Mock 배송 태스크 */
export const MOCK_DELIVERY_TASKS: DeliveryTask[] = [
    {
        id: 'del-001',
        orderId: 'order-001',
        farmId: 'farm-dear-orchid-001',
        status: 'PENDING',
        pickupAddress: '경기도 이천시 마장면 디어오키드 농장',
        pickupCoords: { lat: 37.2747, lng: 127.4350 },
        deliveryAddress: '서울시 강남구 역삼동 123-45 그린아파트 301호',
        deliveryCoords: { lat: 37.5000, lng: 127.0365 },
        recipientName: '김지수',
        recipientPhone: '010-1234-5678',
        items: ['보세란 (중품) 1분'],
        priority: 1,
        photoUrls: [],
        notes: '부재 시 문 앞에 놓아주세요',
        createdAt: '2026-02-14T10:30:00',
    },
    {
        id: 'del-002',
        orderId: 'order-003',
        farmId: 'farm-dear-orchid-001',
        status: 'DELIVERED',
        pickupAddress: '경기도 이천시 마장면 디어오키드 농장',
        pickupCoords: { lat: 37.2747, lng: 127.4350 },
        deliveryAddress: '서울시 송파구 잠실동 789 레이크힐 1205호',
        deliveryCoords: { lat: 37.5133, lng: 127.1001 },
        recipientName: '이서준',
        recipientPhone: '010-5555-7777',
        items: ['풍란 (대품) 1분'],
        priority: 1,
        photoUrls: ['📸'],
        pickedUpAt: '2026-02-13T08:00:00',
        deliveredAt: '2026-02-13T14:30:00',
        createdAt: '2026-02-12T16:00:00',
    },
];

/** 기본 일일 배송 쿼터 (2주치 생성 헬퍼) */
export function generateDefaultQuotas(startDate: Date, days: number = 14): DailyQuota[] {
    const quotas: DailyQuota[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dayOfWeek = d.getDay();
        const dateStr = d.toISOString().split('T')[0];
        quotas.push({
            date: dateStr,
            maxOrders: dayOfWeek === 0 ? 0 : dayOfWeek === 6 ? 10 : 15, // 일:휴무, 토:10, 평일:15
            currentOrders: 0,
        });
    }
    return quotas;
}
