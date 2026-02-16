import { create } from 'zustand';

export interface Driver {
    id: string;
    name: string;
    phone: string;
    vehicleInfo: string;        // 차량 정보 (예: 'Kia PV5')
    farmId: string;             // 소속 농장
}

interface AuthStore {
    // 상태
    driver: Driver | null;
    isAuthenticated: boolean;
    isOtpSent: boolean;
    phoneNumber: string;

    // 액션
    setPhoneNumber: (phone: string) => void;
    sendOtp: (phone: string) => Promise<boolean>;
    verifyOtp: (code: string) => Promise<boolean>;
    logout: () => void;
}

// MVP: 등록된 기사 목록 (추후 DB 연동)
const REGISTERED_DRIVERS: Driver[] = [
    {
        id: 'driver-001',
        name: '정의',
        phone: '010-0000-0000',
        vehicleInfo: 'Kia PV5',
        farmId: 'farm-dear-orchid-001',
    },
];

// MVP: 고정 OTP 코드
const MOCK_OTP = '000000';

export const useAuthStore = create<AuthStore>((set, get) => ({
    driver: null,
    isAuthenticated: false,
    isOtpSent: false,
    phoneNumber: '',

    setPhoneNumber: (phone) => set({ phoneNumber: phone }),

    sendOtp: async (phone) => {
        // MVP: 등록된 기사인지 확인
        const normalizedPhone = phone.replace(/-/g, '');
        const found = REGISTERED_DRIVERS.find(
            d => d.phone.replace(/-/g, '') === normalizedPhone
        );

        if (!found) return false;

        // 실제로는 여기서 SMS/카카오알림톡 API 호출
        // MVP에서는 즉시 성공 처리
        set({ isOtpSent: true, phoneNumber: phone });
        return true;
    },

    verifyOtp: async (code) => {
        const { phoneNumber } = get();
        const normalizedPhone = phoneNumber.replace(/-/g, '');

        // MVP: 고정 코드 검증
        if (code !== MOCK_OTP) return false;

        const driver = REGISTERED_DRIVERS.find(
            d => d.phone.replace(/-/g, '') === normalizedPhone
        );

        if (!driver) return false;

        set({
            driver,
            isAuthenticated: true,
            isOtpSent: false,
        });
        return true;
    },

    logout: () => set({
        driver: null,
        isAuthenticated: false,
        isOtpSent: false,
        phoneNumber: '',
    }),
}));
