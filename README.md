# 🌿 그린링크 모노레포 v2

**하이퍼로컬 화훼·농수산 직거래 플랫폼** — Kia PV5 직배송 시스템 포함

> ⚠️ 이 저장소는 `greenlink v1`의 후속 버전입니다. v1과 별개의 멀티앱 모노레포 구조입니다.

---

## 📁 프로젝트 구조

```
greenlink-monorepo/
├── apps/
│   ├── web/                    # 소비자용 PWA (포트 3000)
│   │   └── src/app/
│   │       ├── page.tsx            # 홈 (배너, 추천 상품, 농장 프로필)
│   │       ├── category/           # 카테고리 탐색
│   │       ├── search/             # 검색
│   │       ├── product/[id]/       # 상품 상세 (배송일 피커)
│   │       ├── farm/[id]/          # 농장 프로필 (상품/후기 탭)
│   │       ├── cart/               # 장바구니
│   │       ├── orders/             # 나의 주문 내역
│   │       ├── order/[id]/         # 주문 상세 + 배송 추적
│   │       └── mypage/             # 마이페이지
│   │
│   └── admin/                  # 농가/판매자 대시보드 (포트 3001)
│       └── src/app/
│           ├── dashboard/          # 비즈프로필 홈 (그린 온도, 배송 요약)
│           ├── delivery/           # 🚚 배송 관리 (상태 전환, 사진 업로드)
│           ├── delivery/settings/  # 📅 일일 배송 쿼터 설정
│           ├── products/new/       # 상품 등록
│           └── register/           # 사업자 등록
│
├── packages/
│   ├── ui/             # 공용 UI 컴포넌트 (Button, Card, Input)
│   └── lib/            # 공용 유틸리티
│       ├── constants/      # 타입 정의 + 초기 데이터
│       ├── stores/         # Zustand 스토어 (상품, 주문, 배송)
│       ├── api/            # API 클라이언트
│       └── payment/        # Toss Payments 연동
│
├── turbo.json          # Turborepo 빌드 파이프라인
├── pnpm-workspace.yaml
└── package.json
```

---

## 🚀 시작하기

### 설치
```bash
pnpm install
```

### 개발 서버 실행
```bash
# 전체 앱 실행 (Web + Admin 동시)
pnpm dev

# 소비자 앱만 (포트 3000)
pnpm --filter @greenlink/web dev

# 농가 대시보드만 (포트 3001)
pnpm --filter @greenlink/admin dev
```

### 빌드
```bash
pnpm build
```

---

## 📱 소비자 앱 (`apps/web`, 포트 3000)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 홈 | 배너, 추천 상품, 농장 프로필 카드 |
| `/category` | 카테고리 | 동양란, 보세란, 풍란 등 탐색 |
| `/search` | 검색 | 상품 검색 |
| `/product/[id]` | 상품 상세 | 팔도감 벤치마킹 · **배송일 피커** (D+2~10일) |
| `/farm/[id]` | 농장 프로필 | 판매자 정보 · 상품/후기 탭 |
| `/cart` | 장바구니 | 상품 담기/수량 변경 |
| `/orders` | 주문 내역 | 진행 중/지난 주문 리스트 |
| `/order/[id]` | 주문 상세 | **5단계 배송 추적** · PV5 기사 정보 · POD 사진 |
| `/mypage` | 마이페이지 | 핑크 온도, 적립금, 쿠폰, 주문 내역 |

---

## 🏢 농가 대시보드 (`apps/admin`, 포트 3001)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/dashboard` | 홈 | 그린 온도, 오늘의 배송, 상품 관리 |
| `/delivery` | 🚚 배송 관리 | 배송 목록 · 상태 전환 (큰 버튼) · 사진 업로드 |
| `/delivery/settings` | 📅 쿼터 설정 | 일일 배송 수량 캘린더 · 빠른 설정 |
| `/products/new` | 상품 등록 | 사진 + 가격 + 수량 간편 등록 |
| `/register` | 사업자 등록 | 농업경영체 인증 |

---

## 📦 공용 패키지 (`packages/`)

### `@greenlink/ui`
| 컴포넌트 | 설명 |
|----------|------|
| `Button` | primary / secondary / outline 변형 |
| `Card` | 카드 레이아웃 |
| `Input` | 라벨, 에러, suffix 지원 |

### `@greenlink/lib`
| 모듈 | 내용 |
|------|------|
| `constants/types.ts` | Farm, Product, Order, DeliveryTask, DailyQuota 등 타입 |
| `constants/initial-data.ts` | 디어 오키드 농장 · 상품 · 후기 · 주문 · 배송 목 데이터 |
| `stores/product-store.ts` | 상품 CRUD Zustand 스토어 |
| `stores/order-store.ts` | 주문 관리 Zustand 스토어 |
| `stores/delivery-store.ts` | 배송 태스크 + 일일 쿼터 Zustand 스토어 |
| `api/` | Axios API 클라이언트 · 네이버 스마트스토어 스켈레톤 |
| `payment/` | Toss Payments 연동 모듈 |

---

## 🚚 직배송 시스템 (PV5 MVP)

Kia PV5 직배송 차량 기반의 실시간 물류 관리 시스템입니다.

### 주문 흐름
```
소비자 주문 → 상품 준비 → 배차 완료 → PV5 배송 중 → 배송 완료 (사진)
  ORDERED     PREPARING    DISPATCHED    DELIVERING     COMPLETED
```

### 핵심 기능
- **배송일 예약**: D+2 ~ D+10, 일요일 휴무 자동 비활성화
- **일일 쿼터**: 평일 15건, 토요일 10건, 일요일 휴무 (농장주 설정)
- **기사용 배송 관리**: 큰 상태 전환 버튼 (운전 중 사용), 전화 연락
- **배송 완료 사진(POD)**: 문앞 촬영 → 소비자 주문 상세에 표시
- **PV5 신선 배송**: "최적 온도 18°C로 배송 중" 소비자 노출

---

## 🌡️ 신뢰 지표 시스템

| 지표 | 대상 | 설명 |
|------|------|------|
| 🌱 **그린 온도** | 판매자 | 인증, 배송 성공률, 후기 등으로 산출 |
| ♥ **핑크 온도** | 소비자 | 구매 활동, 리뷰 작성 등으로 산출 |

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Monorepo | Turborepo + pnpm |
| Styling | Tailwind CSS |
| State | Zustand |
| Payment | Toss Payments |
| Icons | Lucide React |

---

## 📊 서비스 벤치마킹

| 플랫폼 | 참고 요소 |
|--------|----------|
| **팔도감** | 판매자 페이지, 상품 상세, 후기 시스템 |
| **당근마켓** | 비즈프로필, 하이퍼로컬 구조 |
| **네이버 스마트스토어** | 주문 API 연동 |

---

## 📄 라이선스

MIT License
