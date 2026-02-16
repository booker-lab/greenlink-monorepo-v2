// 화훼 카테고리 데이터
// 기존 하드코딩 → lib으로 분리, 화훼 중심 재구성

import type { FlowerCategory } from './types';

/** 화훼 카테고리 (경매장 구분 기반) */
export const FLOWER_CATEGORIES: FlowerCategory[] = [
    {
        id: 'cat-cut',
        name: '절화',
        icon: '🌹',
        description: '꺾은 꽃 — 꽃다발, 꽃바구니, 화환 등에 사용',
        subcategories: ['장미', '국화', '백합', '카네이션', '튤립', '안개꽃', '거베라', '프리지아', '리시안셔스', '작약'],
    },
    {
        id: 'cat-potted',
        name: '분화',
        icon: '🪴',
        description: '화분에 심긴 꽃 — 선물용, 인테리어용',
        subcategories: ['호접란', '시클라멘', '칼랑코에', '제라늄', '베고니아', '국화분', '장미분'],
    },
    {
        id: 'cat-foliage',
        name: '관엽',
        icon: '🌿',
        description: '잎이 아름다운 실내 식물',
        subcategories: ['몬스테라', '스투키', '산세베리아', '고무나무', '아레카야자', '스파티필름', '아이비'],
    },
    {
        id: 'cat-orchid',
        name: '난류',
        icon: '🌸',
        description: '동양란, 서양란 등 난초류',
        subcategories: ['보세란', '풍란', '석곡', '심비디움', '덴드로비움', '동양란 선물세트'],
    },
    {
        id: 'cat-succulent',
        name: '다육/선인장',
        icon: '🌵',
        description: '관리가 쉬운 다육식물과 선인장',
        subcategories: ['다육식물', '선인장', '에케베리아', '하월시아', '리톱스'],
    },
    {
        id: 'cat-supplies',
        name: '자재/용품',
        icon: '🧰',
        description: '화분, 배양토, 비료 등 원예 자재',
        subcategories: ['난석', '배양토', '화분', '비료', '원예도구', '포장재'],
    },
];
