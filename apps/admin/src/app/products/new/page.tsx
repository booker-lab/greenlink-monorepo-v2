'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Plus, X } from "lucide-react";

export default function NewProductPage() {
    const [images, setImages] = useState<string[]>([]);
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");

    const handleImageUpload = () => {
        // 사진 업로드 시뮬레이션 (실제 구현시 file input 사용)
        const sampleImages = ["🌷", "🌿", "🌹", "🌻"];
        if (images.length < 3) {
            setImages([...images, sampleImages[images.length]]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        alert("상품이 등록되었습니다!");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 헤더 */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-gray-800">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold">상품 등록</h1>
                    <button
                        onClick={handleSubmit}
                        className="text-green-600 font-semibold"
                    >
                        완료
                    </button>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* 사진 업로드 */}
                <section>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        상품 사진 (최대 3장)
                    </label>
                    <div className="flex gap-3">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl"
                            >
                                {img}
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {images.length < 3 && (
                            <button
                                onClick={handleImageUpload}
                                className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <Camera className="w-6 h-6" />
                                <span className="text-xs">{images.length}/3</span>
                            </button>
                        )}
                    </div>
                </section>

                {/* 상품명 */}
                <section>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        상품명
                    </label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="예: 싱싱한 장미 한 다발"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </section>

                {/* 가격 */}
                <section>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        가격
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            원
                        </span>
                    </div>
                </section>

                {/* 수량 */}
                <section>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        수량
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            개
                        </span>
                    </div>
                </section>

                {/* 상품 설명 */}
                <section>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        상품 설명 (선택)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="상품에 대해 자세히 설명해주세요"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                </section>
            </div>

            {/* 하단 등록 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <button
                    onClick={handleSubmit}
                    disabled={!productName || !price || !quantity}
                    className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                >
                    상품 등록하기
                </button>
            </div>
        </div>
    );
}
