'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin, Check, ChevronRight } from "lucide-react";

type Step = 'landing' | 'terms' | 'name' | 'category';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('landing');
    const [termsAgreed, setTermsAgreed] = useState({
        all: false,
        required: false,
        marketing: false,
    });
    const [businessName, setBusinessName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // 약관 전체 동의 처리
    const handleAllAgree = () => {
        const newValue = !termsAgreed.all;
        setTermsAgreed({
            all: newValue,
            required: newValue,
            marketing: newValue,
        });
    };

    // 다음 단계로
    const handleNext = () => {
        if (step === 'landing') setStep('terms');
        else if (step === 'terms') setStep('name');
        else if (step === 'name') setStep('category');
        else if (step === 'category') {
            // 등록 완료
            alert('비즈프로필이 생성되었습니다!');
            router.push('/');
        }
    };

    // 이전 단계로
    const handlePrev = () => {
        if (step === 'terms') setStep('landing');
        else if (step === 'name') setStep('terms');
        else if (step === 'category') setStep('name');
    };

    const categories = [
        { id: 'flower', name: '꽃/화훼', emoji: '💐' },
        { id: 'vegetable', name: '채소', emoji: '🥬' },
        { id: 'fruit', name: '과일', emoji: '🍎' },
        { id: 'grain', name: '곡물/잡곡', emoji: '🌾' },
        { id: 'dairy', name: '유제품/계란', emoji: '🥛' },
        { id: 'meat', name: '축산물', emoji: '🥩' },
        { id: 'seafood', name: '수산물', emoji: '🐟' },
        { id: 'organic', name: '유기농', emoji: '🌱' },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 헤더 - 닫기 버튼 */}
            {step !== 'landing' && (
                <header className="p-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>
            )}

            {/* Step 1: 랜딩 페이지 */}
            {step === 'landing' && (
                <div className="flex-1 flex flex-col">
                    <header className="p-4">
                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            내가 찾던 손님<br />모두 그린링크에 있어요
                        </h1>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-4">
                            <MapPin className="w-4 h-4" />
                            <span>내 동네 근처 이웃</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-900 mt-2">
                            152,847명
                        </p>

                        {/* 지도 일러스트 */}
                        <div className="w-full max-w-sm mt-8 bg-amber-100 rounded-2xl p-8 relative">
                            <div className="bg-white/50 rounded-xl p-6 border-2 border-dashed border-amber-200">
                                <div className="flex justify-center">
                                    <div className="bg-orange-500 text-white rounded-full p-3 shadow-lg">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 mt-8">
                            비즈프로필은 등록부터 사용까지 <span className="text-green-600 font-bold">무료예요!</span>
                        </p>
                    </div>

                    <div className="p-4 pb-8">
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            비즈프로필 만들기
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: 약관 동의 */}
            {step === 'terms' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            약관에 동의해주세요
                        </h1>
                        <p className="text-gray-500 text-sm mb-8">
                            비즈프로필과 광고 서비스 이용에 필요해요.
                        </p>

                        {/* 전체 동의 */}
                        <button
                            onClick={handleAllAgree}
                            className="flex items-center gap-3 w-full py-4 border-b border-gray-100"
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${termsAgreed.all ? 'bg-green-600 border-green-600' : 'border-gray-300'
                                }`}>
                                {termsAgreed.all && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <span className="font-semibold text-gray-900">전체동의</span>
                        </button>

                        {/* 필수 약관 */}
                        <button
                            onClick={() => setTermsAgreed(prev => ({
                                ...prev,
                                required: !prev.required,
                                all: !prev.required && prev.marketing,
                            }))}
                            className="flex items-center justify-between w-full py-4 border-b border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <Check className={`w-5 h-5 ${termsAgreed.required ? 'text-green-600' : 'text-gray-300'}`} />
                                <span className="text-gray-700">(필수) 그린링크 비즈니스 이용약관</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* 선택 약관 */}
                        <button
                            onClick={() => setTermsAgreed(prev => ({
                                ...prev,
                                marketing: !prev.marketing,
                                all: prev.required && !prev.marketing,
                            }))}
                            className="flex items-center justify-between w-full py-4"
                        >
                            <div className="flex items-center gap-3">
                                <Check className={`w-5 h-5 ${termsAgreed.marketing ? 'text-green-600' : 'text-gray-300'}`} />
                                <span className="text-gray-700">(선택) 마케팅 이메일 수신 동의</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-4 pb-8">
                        <button
                            onClick={handleNext}
                            disabled={!termsAgreed.required}
                            className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl disabled:bg-gray-200 disabled:text-gray-400 hover:bg-green-700 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: 이름 입력 */}
            {step === 'name' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            비즈프로필 이름을 입력해주세요
                        </h1>
                        <p className="text-gray-500 text-sm mb-6">
                            그린링크 안에서 고객이 검색하거나 동네지도에서 보게 될 이름이에요.
                        </p>

                        <div className="relative">
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value.slice(0, 30))}
                                placeholder="예) 초록농장, 행복한꽃집"
                                className="w-full px-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                {businessName.length}/30
                            </span>
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-xl p-4">
                            <p className="text-green-600 font-medium text-sm mb-3">TIP 이름 가이드</p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                업체명 또는 간판명으로 입력하거나, 명함에 적힌 이름과 직함으로 입력해주세요.
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed mt-2">
                                비즈프로필 이름 기준을 준수해 주세요. <span className="text-gray-400 underline">운영 정책</span>에 따라 임의로 수정되거나 제재될 수 있어요.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 pb-8 flex gap-3">
                        <button
                            onClick={handlePrev}
                            className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            이전
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={businessName.length < 2}
                            className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl disabled:bg-gray-200 disabled:text-gray-400 hover:bg-gray-800 transition-colors"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: 업종 선택 */}
            {step === 'category' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            업종을 알려주세요
                        </h1>
                        <p className="text-gray-500 text-sm mb-6">
                            어떤 상품을 판매하는지 고객에게 알릴 수 있어요.
                        </p>

                        {/* 카테고리 그리드 */}
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedCategory === cat.id
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <p className="mt-2 font-medium text-gray-800">{cat.name}</p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-xl p-4">
                            <p className="text-green-600 font-medium text-sm mb-3">TIP 이렇게 검색해보세요</p>
                            <p className="text-gray-600 text-sm">
                                <span className="font-medium">1</span> 사업자등록증에 기재된 [종목]으로 검색해 보세요.
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                <span className="font-medium">2</span> 업체를 대표하는 단어로 검색해 보세요.<br />
                                <span className="text-gray-400 ml-4">예) 화훼, 채소, 과일</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 pb-8 flex gap-3">
                        <button
                            onClick={handlePrev}
                            className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            이전
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!selectedCategory}
                            className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl disabled:bg-gray-200 disabled:text-gray-400 hover:bg-gray-800 transition-colors"
                        >
                            완료
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
