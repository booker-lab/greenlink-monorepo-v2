import CategoryAccordion from '@/components/category/CategoryAccordion';

export default function CategoryPage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* 헤더 */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-gray-800">카테고리</h1>
                </div>
            </header>

            {/* 카테고리 목록 */}
            <CategoryAccordion />
        </div>
    );
}
