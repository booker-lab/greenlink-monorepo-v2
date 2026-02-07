'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, ChevronRight, Search, Camera, Image, FileText, Phone, ChevronLeft } from "lucide-react";

type Step =
    | 'terms'
    | 'name'
    | 'category'
    | 'location'
    | 'info-prompt'
    | 'profile-photo'
    | 'gallery'
    | 'intro'
    | 'phone'
    | 'additional';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('terms');

    // Form states
    const [termsAgreed, setTermsAgreed] = useState({ all: false, required: false, marketing: false });
    const [businessName, setBusinessName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [location, setLocation] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
    const [introduction, setIntroduction] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState({
        open24h: false,
        yearRound: false,
        easyPay: false,
        paidParking: false,
        restroom: false,
        freeParking: false,
        delivery: false,
    });

    const categories = [
        { id: 'flower', name: '꽃집/꽃배달', emoji: '💐' },
        { id: 'vegetable', name: '채소', emoji: '🥬' },
        { id: 'fruit', name: '과일', emoji: '🍎' },
        { id: 'grain', name: '곡물/잡곡', emoji: '🌾' },
        { id: 'dairy', name: '유제품/계란', emoji: '🥛' },
        { id: 'meat', name: '축산물', emoji: '🥩' },
        { id: 'seafood', name: '수산물', emoji: '🐟' },
        { id: 'organic', name: '유기농', emoji: '🌱' },
    ];

    const categoryChips = ['의류판매', '통신판매', '뷰티', '꽃집/꽃배달'];

    const handleAllAgree = () => {
        const newValue = !termsAgreed.all;
        setTermsAgreed({ all: newValue, required: newValue, marketing: newValue });
    };

    const stepOrder: Step[] = [
        'terms', 'name', 'category', 'location',
        'info-prompt', 'profile-photo', 'gallery', 'intro', 'phone', 'additional'
    ];

    const handleNext = () => {
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex < stepOrder.length - 1) {
            setStep(stepOrder[currentIndex + 1]);
        } else {
            // 등록 완료 - 대시보드로 이동
            router.push('/dashboard');
        }
    };

    const handlePrev = () => {
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex > 0) {
            setStep(stepOrder[currentIndex - 1]);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 'terms': return termsAgreed.required;
            case 'name': return businessName.length >= 2;
            case 'category': return selectedCategory !== '';
            case 'location': return location !== '';
            default: return true;
        }
    };

    const getProgress = () => {
        const currentIndex = stepOrder.indexOf(step);
        return ((currentIndex) / (stepOrder.length - 1)) * 100;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 헤더 */}
            <header className="flex items-center justify-between p-4 border-b border-gray-100">
                <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-800">
                    <X className="w-6 h-6" />
                </button>
                {/* Progress bar */}
                <div className="flex-1 mx-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${getProgress()}%` }}
                    />
                </div>
            </header>


            {/* Step 1: 약관 동의 */}
            {step === 'terms' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">약관에 동의해주세요</h1>
                        <p className="text-gray-500 text-sm mb-8">비즈프로필과 광고 서비스 이용에 필요해요.</p>
                        <button onClick={handleAllAgree} className="flex items-center gap-3 w-full py-4 border-b border-gray-100">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${termsAgreed.all ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                                {termsAgreed.all && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <span className="font-semibold text-gray-900">전체동의</span>
                        </button>
                        <button onClick={() => setTermsAgreed(prev => ({ ...prev, required: !prev.required, all: !prev.required && prev.marketing }))} className="flex items-center justify-between w-full py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <Check className={`w-5 h-5 ${termsAgreed.required ? 'text-green-600' : 'text-gray-300'}`} />
                                <span className="text-gray-700">(필수) 그린링크 비즈니스 이용약관</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button onClick={() => setTermsAgreed(prev => ({ ...prev, marketing: !prev.marketing, all: prev.required && !prev.marketing }))} className="flex items-center justify-between w-full py-4">
                            <div className="flex items-center gap-3">
                                <Check className={`w-5 h-5 ${termsAgreed.marketing ? 'text-green-600' : 'text-gray-300'}`} />
                                <span className="text-gray-700">(선택) 마케팅 이메일 수신 동의</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    <div className="p-4 pb-8">
                        <button onClick={handleNext} disabled={!canProceed()} className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl disabled:bg-gray-200 disabled:text-gray-400">
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: 이름 입력 */}
            {step === 'name' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">비즈프로필 이름을 입력해주세요</h1>
                        <p className="text-gray-500 text-sm mb-6">그린링크 안에서 고객이 검색하거나 동네지도에서 보게 될 이름이에요.</p>
                        <div className="relative">
                            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value.slice(0, 30))} placeholder="예) 초록농장, 행복한꽃집" className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{businessName.length}/30</span>
                        </div>
                        <div className="mt-6 bg-gray-50 rounded-xl p-4">
                            <p className="text-green-600 font-medium text-sm mb-3">TIP 이름 가이드</p>
                            <p className="text-gray-600 text-sm">업체명 또는 간판명으로 입력하거나, 명함에 적힌 이름과 직함으로 입력해주세요.</p>
                        </div>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} disabled={!canProceed()} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl disabled:bg-gray-200 disabled:text-gray-400">다음</button>
                    </div>
                </div>
            )}

            {/* Step 4: 업종 선택 */}
            {step === 'category' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">업종을 알려주세요</h1>
                        <p className="text-gray-500 text-sm mb-6">어떤 서비스를 제공하는지 고객에게 알릴 수 있어요.</p>
                        <div className="relative mb-4">
                            <input type="text" value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} placeholder="업종을 검색해주세요. (예: 카페, 헬스)" className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">검색 제안</p>
                            <div className="flex flex-wrap gap-2">
                                {categoryChips.map((chip) => (
                                    <button key={chip} onClick={() => setSelectedCategory(chip)} className={`px-4 py-2 rounded-full border text-sm ${selectedCategory === chip ? 'border-green-600 bg-green-50 text-green-600' : 'border-gray-200 text-gray-600'}`}>
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`p-4 rounded-xl border-2 text-left ${selectedCategory === cat.id ? 'border-green-600 bg-green-50' : 'border-gray-100'}`}>
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <p className="mt-2 font-medium text-gray-800">{cat.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} disabled={!canProceed()} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl disabled:bg-gray-200 disabled:text-gray-400">다음</button>
                    </div>
                </div>
            )}

            {/* Step 5: 지역 검색 */}
            {step === 'location' && (
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                        <button onClick={handlePrev}><ChevronLeft className="w-6 h-6 text-gray-600" /></button>
                        <h1 className="text-lg font-bold">지역 검색</h1>
                    </div>
                    <div className="flex-1 px-6 pt-4">
                        <div className="relative mb-4">
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="동명(읍, 면)으로 검색 (예: 증포동)" className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                            {location && (
                                <button onClick={() => setLocation('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            )}
                        </div>
                        {location && (
                            <button onClick={handleNext} className="w-full text-left p-4 hover:bg-gray-50 rounded-lg">
                                <p className="text-gray-800">경기도 이천시 {location}</p>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Step 6: 정보 입력 안내 */}
            {step === 'info-prompt' && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">사진과 소개 등<br />업체 정보를 채워보세요</h1>
                    <p className="text-gray-500">정보를 채워야 고객에게 비즈프로필이 보여요.</p>
                    <div className="flex gap-4 mt-12">
                        <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <Camera className="w-8 h-8 text-amber-600" />
                        </div>
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 -mt-4">
                            <Image className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 mt-2">
                            <FileText className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                        <button onClick={handleNext} className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl">다음</button>
                    </div>
                </div>
            )}

            {/* Step 7: 프로필 사진 */}
            {step === 'profile-photo' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">프로필 사진을 등록해주세요</h1>
                        <p className="text-gray-500 text-sm mb-8">고객은 사진이 있는 프로필을 더 신뢰해요. 등록한 사진은 나중에 변경할 수 있어요.</p>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="프로필" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="text-gray-300">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                                    </div>
                                )}
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                                <Camera className="w-4 h-4" />
                                <span>사진 등록</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl">다음</button>
                    </div>
                </div>
            )}

            {/* Step 8: 갤러리 사진 */}
            {step === 'gallery' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">사진을 등록해주세요</h1>
                        <p className="text-gray-500 text-sm mb-6">고객은 사진을 보고 서비스와 매장 분위기를 파악해요. 사진은 나중에 추가하거나 변경할 수 있어요.</p>
                        <div className="flex gap-3 flex-wrap">
                            <button className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500">
                                <Camera className="w-6 h-6" />
                                <span className="text-xs mt-1">{galleryPhotos.length}/20</span>
                            </button>
                            {galleryPhotos.map((photo, idx) => (
                                <div key={idx} className="relative w-20 h-20">
                                    <img src={photo} alt="" className="w-full h-full object-cover rounded-xl" />
                                    <button onClick={() => setGalleryPhotos(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-gray-50 rounded-xl p-4">
                            <p className="text-green-600 font-medium text-sm">TIP 등록한 사진은 비즈프로필 사진 탭에서 모아볼 수 있어요.</p>
                        </div>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl">다음</button>
                    </div>
                </div>
            )}

            {/* Step 9: 소개글 */}
            {step === 'intro' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900">
                            소개글을 작성해주세요 <span className="text-gray-400 font-normal text-base">(선택)</span>
                        </h1>
                        <p className="text-gray-500 text-sm mb-6 mt-2">나중에 언제든지 변경할 수 있으니, 걱정하지 마세요.</p>
                        <textarea value={introduction} onChange={(e) => setIntroduction(e.target.value)} placeholder="특징과 강점을 간단히 소개해주세요." className="w-full h-32 px-4 py-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <div className="mt-6 bg-gray-50 rounded-xl p-4">
                            <p className="text-green-600 font-medium text-sm mb-3">TIP 입력한 소개는 프로필 사진과 함께 보여요</p>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                <p className="font-medium text-gray-800">소개</p>
                                <p className="text-xs text-gray-400 mb-2">2일 이내 활동</p>
                                <p className="text-sm text-gray-600">{introduction || "신선한 농산물을 직접 재배하여 판매합니다..."}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl">다음</button>
                    </div>
                </div>
            )}

            {/* Step 10: 전화번호 */}
            {step === 'phone' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900">
                            전화번호를 입력해주세요 <span className="text-gray-400 font-normal text-base">(선택)</span>
                        </h1>
                        <p className="text-gray-500 text-sm mb-6 mt-2">고객이 직접 연락할 수 있어요.</p>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="전화번호를 입력해주세요." className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <button className="text-green-600 text-sm mt-3 flex items-center gap-1">
                            안심 번호를 지원해 드려요 <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl">다음</button>
                    </div>
                </div>
            )}

            {/* Step 11: 부가 정보 */}
            {step === 'additional' && (
                <div className="flex-1 flex flex-col px-6">
                    <div className="flex-1 pt-4">
                        <h1 className="text-xl font-bold text-gray-900">
                            부가 정보를 선택해주세요 <span className="text-gray-400 font-normal text-base">(선택)</span>
                        </h1>
                        <p className="text-gray-500 text-sm mb-6 mt-2">비즈프로필을 등록하고 난 후에도 언제든지 추가하거나 수정할 수 있어요.</p>

                        <div className="space-y-6">
                            <div>
                                <p className="font-medium text-gray-800 mb-3">서비스</p>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.open24h} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, open24h: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">24시간 영업</span>
                                </label>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.yearRound} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, yearRound: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">연중무휴</span>
                                </label>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.delivery} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, delivery: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">배달 가능</span>
                                </label>
                            </div>

                            <div>
                                <p className="font-medium text-gray-800 mb-3">결제 수단</p>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.easyPay} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, easyPay: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">간편결제</span>
                                </label>
                            </div>

                            <div>
                                <p className="font-medium text-gray-800 mb-3">시설</p>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.freeParking} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, freeParking: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">무료 주차</span>
                                </label>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.paidParking} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, paidParking: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">유료주차</span>
                                </label>
                                <label className="flex items-center gap-3 py-2">
                                    <input type="checkbox" checked={additionalInfo.restroom} onChange={(e) => setAdditionalInfo(prev => ({ ...prev, restroom: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">내부 화장실</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 pb-8 flex gap-3">
                        <button onClick={handlePrev} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl">이전</button>
                        <button onClick={handleNext} className="flex-1 py-4 bg-gray-900 text-white font-semibold rounded-xl">완료</button>
                    </div>
                </div>
            )}
        </div>
    );
}
