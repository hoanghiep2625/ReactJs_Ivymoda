import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, deleteCategory } from '../../services/categoryService';
import { Category } from '../../types/categories';
import AdminHeader from '../../layouts/adminHeader';
import AdminMenu from '../../layouts/adminMenu';
import AddCategoryForm from './addCategory';
import Loading from '../../components/loading';

interface CategoryResponse {
    docs: Category[];
}

interface TableRowProps {
    category: Category;
    categories: Category[];
    level: number;
    onDelete: (id: string) => void;
}

const TableRow: React.FC<TableRowProps> = ({ category, categories, level, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const children = categories.filter(cat => cat.parentId === category._id);

    return (
        <>
            <tr className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                    <div className="flex items-center" style={{ marginLeft: level * 20 }}>
                        {children.length > 0 && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="mr-2 bg-gray-200 text-black hover:bg-gray-300 px-2 py-1 rounded"
                            >
                                {expanded ? '–' : '+'}
                            </button>
                        )}
                        <span className="font-semibold text-gray-800">{category.name}</span>
                    </div>
                </td>
                <td className="border px-4 py-2 text-center">{category.level}</td>
                <td className="border px-4 py-2">
                    {category.parentId
                        ? categories.find(cat => cat._id === category.parentId)?.name ||
                          'Không xác định'
                        : 'Không có'}
                </td>
                <td className="border px-4 py-2 text-center">
                    {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 text-center">
                    {new Date(category.updatedAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                    <button
                        className="bg-black text-white hover:bg-gray-800 px-2 py-1 rounded mr-2"
                        onClick={() => alert(`Chỉnh sửa: ${category.name}`)}
                    >
                        Sửa
                    </button>
                    <button
                        className="bg-black text-white hover:bg-gray-800 px-2 py-1 rounded"
                        onClick={() => {
                            if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
                                onDelete(category._id);
                            }
                        }}
                    >
                        Xóa
                    </button>
                </td>
            </tr>
            {expanded &&
                children.map(child => (
                    <TableRow
                        key={child._id}
                        category={child}
                        categories={categories}
                        level={level + 1}
                        onDelete={onDelete}
                    />
                ))}
        </>
    );
};

const Categories: React.FC = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<CategoryResponse>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: error => {
            console.error('Lỗi khi xóa danh mục:', error);
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <Loading />;
    if (isError) return <div>Lỗi: {(error as Error).message}</div>;

    const categoriesData: Category[] = data?.docs || [];
    const rootCategories = categoriesData.filter(cat => !cat.parentId);

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminMenu className="w-64 bg-black p-6" />
                <main className="flex-1 overflow-auto p-8 bg-white text-gray-900">
                    <div className="flex-1 flex flex-col">
                        {/* Nút mở popup thêm danh mục */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                            >
                                Thêm danh mục
                            </button>
                        </div>
                        <div className="max-w-6xl p-4">
                            <h2 className="text-2xl font-bold mb-4 text-center">
                                Quản Lý Danh Mục
                            </h2>
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Tên danh mục</th>
                                        <th className="border px-4 py-2 text-center">Cấp độ</th>
                                        <th className="border px-4 py-2 text-left">Danh mục cha</th>
                                        <th className="border px-4 py-2 text-center">Ngày tạo</th>
                                        <th className="border px-4 py-2 text-center">
                                            Ngày cập nhật
                                        </th>
                                        <th className="border px-4 py-2 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rootCategories.length > 0 ? (
                                        rootCategories.map(cat => (
                                            <TableRow
                                                key={cat._id}
                                                category={cat}
                                                categories={categoriesData}
                                                level={0}
                                                onDelete={handleDelete}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="border px-4 py-2 text-center"
                                            >
                                                Không có danh mục nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Popup thêm danh mục */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Thêm Danh Mục</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-black hover:text-gray-700 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <AddCategoryForm />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
