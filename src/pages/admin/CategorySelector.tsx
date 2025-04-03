import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/categories';
import Loading from '../../components/loading';

interface CategoryResponse {
    docs: Category[];
}
interface CategorySelectorProps {
    onChange: (id: string, ancestors: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onChange }) => {
    const { data, isLoading } = useQuery<CategoryResponse>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const categoriesData: Category[] = data?.docs || [];
    const level1Categories = categoriesData.filter(cat => cat.level === 1);

    const [selectedLevel1, setSelectedLevel1] = React.useState<string | null>(null);
    const [selectedLevel2, setSelectedLevel2] = React.useState<string | null>(null);
    const [selectedLevel3, setSelectedLevel3] = React.useState<string | null>(null);

    const level2Categories = selectedLevel1
        ? categoriesData.filter(cat => cat.parentId === selectedLevel1)
        : [];
    const level3Categories = selectedLevel2
        ? categoriesData.filter(cat => cat.parentId === selectedLevel2)
        : [];
    React.useEffect(() => {
        if (selectedLevel3) {
            const selectedCategory = categoriesData.find(cat => cat._id === selectedLevel3);
            if (selectedCategory) {
                onChange(selectedCategory._id, selectedCategory.ancestors);
            }
        } else if (selectedLevel2) {
            const selectedCategory = categoriesData.find(cat => cat._id === selectedLevel2);
            if (selectedCategory) {
                onChange(selectedCategory._id, selectedCategory.ancestors);
            }
        } else if (selectedLevel1) {
            const selectedCategory = categoriesData.find(cat => cat._id === selectedLevel1);
            if (selectedCategory) {
                onChange(selectedCategory._id, selectedCategory.ancestors);
            }
        }
    }, [selectedLevel1, selectedLevel2, selectedLevel3, categoriesData, onChange]);

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-4">
            {/* Dropdown cấp 1 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục cấp 1
                </label>
                <select
                    value={selectedLevel1 || ''}
                    onChange={e => {
                        setSelectedLevel1(e.target.value);
                        setSelectedLevel2(null);
                        setSelectedLevel3(null);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Chọn danh mục</option>
                    {level1Categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropdown cấp 2 */}
            {selectedLevel1 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục cấp 2
                    </label>
                    <select
                        value={selectedLevel2 || ''}
                        onChange={e => {
                            setSelectedLevel2(e.target.value);
                            setSelectedLevel3(null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Chọn danh mục con</option>
                        {level2Categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Dropdown cấp 3 */}
            {selectedLevel2 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục cấp 3
                    </label>
                    <select
                        value={selectedLevel3 || ''}
                        onChange={e => setSelectedLevel3(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Chọn danh mục con con</option>
                        {level3Categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;
