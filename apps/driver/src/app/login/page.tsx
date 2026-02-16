'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Phone, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { useAuthStore } from '@greenlink/lib';

export default function DriverLoginPage() {
    const router = useRouter();
    const { isAuthenticated, isOtpSent, sendOtp, verifyOtp } = useAuthStore();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // 이미 인증된 경우 배송 페이지로 이동
    useEffect(() => {
        if (isAuthenticated) router.replace('/delivery');
    }, [isAuthenticated, router]);

    // 전화번호 포맷팅 (010-1234-5678)
    const formatPhone = (value: string) => {
        const nums = value.replace(/\D/g, '').slice(0, 11);
        if (nums.length <= 3) return nums;
        if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
        return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
        setError('');
    };

    const handleSendOtp = async () => {
        if (phone.replace(/-/g, '').length < 10) {
            setError('올바른 전화번호를 입력해주세요');
            return;
        }
        setLoading(true);
        const success = await sendOtp(phone);
        setLoading(false);

        if (!success) {
            setError('등록되지 않은 기사입니다. 관리자에게 문의하세요');
            return;
        }
        setError('');
        // OTP 첫 번째 입력란 포커스
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
    };

    // OTP 입력 핸들링
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        // 다음 칸으로 이동
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // 6자리 모두 입력하면 자동 검증
        const code = newOtp.join('');
        if (code.length === 6) {
            handleVerify(code);
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (code: string) => {
        setLoading(true);
        const success = await verifyOtp(code);
        setLoading(false);

        if (!success) {
            setError('인증번호가 일치하지 않습니다');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
            return;
        }
        router.replace('/delivery');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* 상단 로고 영역 */}
            <div className="flex-shrink-0 pt-16 pb-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/30">
                    <Truck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-black text-white mt-6">그린링크 드라이버</h1>
                <p className="text-sm text-gray-500 mt-1">배송기사 전용 앱</p>
            </div>

            {/* 메인 카드 */}
            <div className="flex-1 bg-gray-800/50 rounded-t-3xl px-6 pt-8 pb-6 mt-4">
                {!isOtpSent ? (
                    /* ─── 전화번호 입력 ─── */
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">로그인</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                등록된 전화번호로 인증번호를 보내드려요
                            </p>
                        </div>

                        {/* 전화번호 입력 */}
                        <div className="relative mb-4">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Phone className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-0000-0000"
                                className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white text-lg font-medium placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all"
                                autoFocus
                            />
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <p className="text-red-400 text-sm mb-4 px-1">{error}</p>
                        )}

                        {/* 인증번호 요청 버튼 */}
                        <button
                            onClick={handleSendOtp}
                            disabled={loading || phone.replace(/-/g, '').length < 10}
                            className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl text-lg shadow-lg shadow-sky-500/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    인증번호 받기
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* 안내 */}
                        <div className="mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-700/50">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300 font-medium">기사 등록 안내</p>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        배송기사 등록은 농장 관리자(사장님)가 Admin 앱에서 진행합니다.
                                        등록 후 안내받은 전화번호로 로그인해주세요.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* MVP 힌트 */}
                        <p className="text-center text-[10px] text-gray-600 mt-6">
                            테스트: 010-0000-0000 / OTP: 000000
                        </p>
                    </>
                ) : (
                    /* ─── OTP 인증 ─── */
                    <>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white">인증번호 입력</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                <span className="text-sky-400 font-medium">{phone}</span>으로 전송된 6자리 코드
                            </p>
                        </div>

                        {/* OTP 6자리 입력 */}
                        <div className="flex gap-2.5 justify-center mb-6">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => { otpRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-gray-700/50 text-white focus:outline-none transition-all ${digit
                                            ? 'border-sky-500/50 shadow-lg shadow-sky-500/10'
                                            : 'border-gray-600/50 focus:border-sky-500/50'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* 에러 */}
                        {error && (
                            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                        )}

                        {/* 로딩 */}
                        {loading && (
                            <div className="flex items-center justify-center gap-2 text-sky-400 mb-4">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">확인 중...</span>
                            </div>
                        )}

                        {/* 재전송 */}
                        <div className="text-center mt-4">
                            <button
                                onClick={() => {
                                    setOtp(['', '', '', '', '', '']);
                                    handleSendOtp();
                                }}
                                className="text-sm text-gray-500 underline hover:text-gray-300 transition-colors"
                            >
                                인증번호 다시 받기
                            </button>
                        </div>

                        {/* 번호 변경 */}
                        <button
                            onClick={() => {
                                useAuthStore.setState({ isOtpSent: false });
                                setOtp(['', '', '', '', '', '']);
                                setError('');
                            }}
                            className="w-full mt-6 py-3 border border-gray-600/50 text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-700/30 transition-colors"
                        >
                            다른 번호로 로그인
                        </button>

                        {/* MVP 힌트 */}
                        <p className="text-center text-[10px] text-gray-600 mt-4">
                            테스트 OTP: 000000
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
