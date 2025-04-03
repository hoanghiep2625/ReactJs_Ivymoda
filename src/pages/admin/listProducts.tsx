import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AdminFooter from '../../layouts/adminFooter';
import AdminHeader from '../../layouts/adminHeader';
import AdminMenu from '../../layouts/adminMenu';
import { deleteById, getList } from '../../api/provider';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';

const ListProduct: React.FC = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => getList({ namespace: 'products' }),
    });
    const products = data?.docs || [];
    console.log(products);

    const deleteMutation = useMutation({
        mutationFn: deleteById,
        onSuccess: () => {
            toast.success('Xóa sản phẩm thành công');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: Error) => {
            console.error('Lỗi khi xóa danh mục:', error);
            toast.error(error.message || 'Xóa sản phẩm thất bại');
        },
    });

    const handleDelete = (id: string) => {
        deleteMutation.mutate({ id, namespace: 'admin/products' });
    };

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {(error as Error).message}</div>;
    if (!products.length) return <div>Không có sản phẩm nào</div>;

    return (
        <div className="flex flex-col h-screen bg-white">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminMenu className="w-64 bg-black p-6" />
                <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow px-4 py-2 flex justify-between items-center fixed w-full"></header>
                    <main className="p-4 flex-grow bg-gray-100 pt-16">
                        <div className="bg-white p-6 shadow rounded">
                            <table
                                id="export-table"
                                className="table-auto w-full text-left border-collapse"
                            >
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border">Tên sản phẩm</th>
                                        <th className="px-4 py-2 border">Mã SKU</th>
                                        <th className="px-4 py-2 border">Màu sắc</th>
                                        <th className="px-4 py-2 border">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product: any) => (
                                        <tr
                                            key={product._id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-4 py-2 border">{product.name}</td>
                                            <td className="px-4 py-2 border">{product.sku}</td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex flex-wrap gap-2">
                                                    {product.colors?.map((color: any) => (
                                                        <div
                                                            key={color._id}
                                                            className="flex items-center"
                                                        >
                                                            <div
                                                                className="w-6 h-6 rounded"
                                                                style={{
                                                                    backgroundColor:
                                                                        color.actualColor,
                                                                }}
                                                            />
                                                            <span className="ml-2">
                                                                {color.colorName}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <Link
                                                    to={`/admin/edit-product/${product._id}`}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Chỉnh sửa
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)} // Sửa ở đây
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-4"
                                                >
                                                    Xóa
                                                </button>
                                                <Link
                                                    to={`/admin/add-color/${product._id}`}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Thêm màu
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
            <AdminFooter />
        </div>
    );
};

export default ListProduct;
