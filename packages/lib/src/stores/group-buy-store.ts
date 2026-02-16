import { create } from 'zustand';
import type { GroupBuyDeal, GroupBuyParticipant, GroupBuyStatus } from '../constants/types';

/** 공구 목 데이터 (진행 중인 공구 3건) */
const INITIAL_DEALS: GroupBuyDeal[] = [
    {
        id: 'gb-001',
        title: '🌹 프리미엄 장미 레드나오미 20본',
        description: '경기 양재 화훼공판장 기준 상등급 레드나오미. 60cm 이상 긴 줄기, 선명한 적색. 생화 택배 불가 품목으로 신선하게 직접 배송해드립니다.',
        image: '🌹',
        categoryId: 'cat-cut',
        auctionRef: {
            id: 'auc-001',
            settlementDate: '2026-02-14',
            flowerType: '절화',
            itemName: '장미',
            varietyName: '레드나오미',
            grade: '상',
            maxPrice: 1200,
            minPrice: 800,
            avgPrice: 950,
            totalQuantity: 5000,
            totalAmount: 4750000,
            unitSize: 20,
        },
        estimatedCost: 19000,       // 20본 × 950원
        sellingPrice: 29900,        // 관리자 설정가
        deliveryFee: 3000,
        targetCount: 10,
        currentCount: 7,
        status: 'RECRUITING',
        deadline: '2026-02-20T23:59:59',
        deliveryDate: '2026-02-22',
        participants: [
            { id: 'p1', name: '김꽃순', phone: '010-1111-1111', address: '서울 강남구 역삼동', joinedAt: '2026-02-15T10:00:00', quantity: 1 },
            { id: 'p2', name: '이봄이', phone: '010-2222-2222', address: '서울 서초구 반포동', joinedAt: '2026-02-15T11:30:00', quantity: 1 },
            { id: 'p3', name: '박장미', phone: '010-3333-3333', address: '경기 성남시 판교', joinedAt: '2026-02-15T14:00:00', quantity: 1 },
            { id: 'p4', name: '최향기', phone: '010-4444-4444', address: '서울 송파구 잠실동', joinedAt: '2026-02-16T09:00:00', quantity: 1 },
            { id: 'p5', name: '정가든', phone: '010-5555-5555', address: '서울 강동구 천호동', joinedAt: '2026-02-16T10:15:00', quantity: 1 },
            { id: 'p6', name: '한미나', phone: '010-6666-6666', address: '경기 하남시 미사동', joinedAt: '2026-02-16T13:30:00', quantity: 1 },
            { id: 'p7', name: '윤새벽', phone: '010-7777-7777', address: '서울 성동구 성수동', joinedAt: '2026-02-16T16:00:00', quantity: 1 },
        ],
        createdAt: '2026-02-15T09:00:00',
    },
    {
        id: 'gb-002',
        title: '🪴 호접란 아마빌리스 (3대)',
        description: '순백의 호접란 3대 세트. 선물용/경조사에 최적. 개업 축하, 어버이날 선물로 인기 만점. 고급 화분 포함.',
        image: '🪴',
        categoryId: 'cat-potted',
        auctionRef: {
            id: 'auc-009',
            settlementDate: '2026-02-14',
            flowerType: '분화',
            itemName: '호접란',
            varietyName: '아마빌리스',
            grade: '특',
            maxPrice: 15000,
            minPrice: 10000,
            avgPrice: 12000,
            totalQuantity: 500,
            totalAmount: 6000000,
            unitSize: 6,
        },
        estimatedCost: 36000,
        sellingPrice: 59000,
        deliveryFee: 5000,
        targetCount: 6,
        currentCount: 6,
        status: 'GOAL_MET',
        deadline: '2026-02-19T23:59:59',
        deliveryDate: '2026-02-21',
        participants: [
            { id: 'p8', name: '송란화', phone: '010-8888-8888', address: '서울 강남구 논현동', joinedAt: '2026-02-14T10:00:00', quantity: 1 },
            { id: 'p9', name: '장오키드', phone: '010-9999-9999', address: '서울 서초구 서초동', joinedAt: '2026-02-14T12:00:00', quantity: 1 },
            { id: 'p10', name: '김화분', phone: '010-1010-1010', address: '경기 과천시', joinedAt: '2026-02-14T14:30:00', quantity: 1 },
            { id: 'p11', name: '이봄날', phone: '010-1111-2222', address: '경기 용인시 수지구', joinedAt: '2026-02-15T08:00:00', quantity: 1 },
            { id: 'p12', name: '박미소', phone: '010-1212-1212', address: '서울 송파구 문정동', joinedAt: '2026-02-15T10:00:00', quantity: 1 },
            { id: 'p13', name: '최선물', phone: '010-1313-1313', address: '서울 강동구 길동', joinedAt: '2026-02-15T14:00:00', quantity: 1 },
        ],
        createdAt: '2026-02-14T09:00:00',
    },
    {
        id: 'gb-003',
        title: '💐 스프링 튤립 믹스 20본',
        description: '봄을 미리 만나세요! 스트롱골드(노랑)+핑크다이아몬드(분홍) 튤립 믹스 20본. 따뜻한 실내에서 3~5일 내 활짝 핍니다.',
        image: '🌷',
        categoryId: 'cat-cut',
        auctionRef: {
            id: 'auc-007',
            settlementDate: '2026-02-14',
            flowerType: '절화',
            itemName: '튤립',
            varietyName: '스트롱골드',
            grade: '상',
            maxPrice: 1800,
            minPrice: 1200,
            avgPrice: 1500,
            totalQuantity: 3000,
            totalAmount: 4500000,
            unitSize: 20,
        },
        estimatedCost: 30000,
        sellingPrice: 44900,
        deliveryFee: 3000,
        targetCount: 12,
        currentCount: 3,
        status: 'RECRUITING',
        deadline: '2026-02-22T23:59:59',
        deliveryDate: '2026-02-24',
        participants: [
            { id: 'p14', name: '김튤립', phone: '010-1414-1414', address: '서울 마포구 서교동', joinedAt: '2026-02-16T11:00:00', quantity: 1 },
            { id: 'p15', name: '이스프링', phone: '010-1515-1515', address: '서울 용산구 이태원', joinedAt: '2026-02-16T15:00:00', quantity: 1 },
            { id: 'p16', name: '박봄꽃', phone: '010-1616-1616', address: '경기 고양시 일산', joinedAt: '2026-02-17T09:00:00', quantity: 1 },
        ],
        createdAt: '2026-02-16T10:00:00',
    },
];

interface GroupBuyState {
    deals: GroupBuyDeal[];

    /** 공구 참여 */
    joinDeal: (dealId: string, participant: GroupBuyParticipant) => void;

    /** 공구 참여 취소 */
    leaveDeal: (dealId: string, participantId: string) => void;

    /** 공구 상태 변경 (관리자용) */
    updateDealStatus: (dealId: string, status: GroupBuyStatus) => void;

    /** 특정 공구 조회 */
    getDealById: (dealId: string) => GroupBuyDeal | undefined;

    /** 카테고리별 공구 조회 */
    getDealsByCategory: (categoryId: string) => GroupBuyDeal[];
}

export const useGroupBuyStore = create<GroupBuyState>((set, get) => ({
    deals: INITIAL_DEALS,

    joinDeal: (dealId, participant) => set((state) => ({
        deals: state.deals.map(deal => {
            if (deal.id !== dealId) return deal;
            if (deal.status !== 'RECRUITING') return deal;

            const newParticipants = [...deal.participants, participant];
            const newCount = newParticipants.length;
            const isGoalMet = newCount >= deal.targetCount;

            return {
                ...deal,
                participants: newParticipants,
                currentCount: newCount,
                status: isGoalMet ? 'GOAL_MET' as GroupBuyStatus : deal.status,
            };
        }),
    })),

    leaveDeal: (dealId, participantId) => set((state) => ({
        deals: state.deals.map(deal => {
            if (deal.id !== dealId) return deal;
            if (deal.status !== 'RECRUITING') return deal;

            const newParticipants = deal.participants.filter(p => p.id !== participantId);
            return {
                ...deal,
                participants: newParticipants,
                currentCount: newParticipants.length,
            };
        }),
    })),

    updateDealStatus: (dealId, status) => set((state) => ({
        deals: state.deals.map(deal =>
            deal.id === dealId ? { ...deal, status } : deal
        ),
    })),

    getDealById: (dealId) => get().deals.find(d => d.id === dealId),

    getDealsByCategory: (categoryId) => get().deals.filter(d => d.categoryId === categoryId),
}));
