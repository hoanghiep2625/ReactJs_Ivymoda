import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminFooter from '../../layouts/adminFooter';
import AdminHeader from '../../layouts/adminHeader';
import AdminMenu from '../../layouts/adminMenu';
import CategorySelector from './CategorySelector';
import { IProduct } from '../../types/product';
import { IProductVariant, IColor, ISize, IImages } from '../../types/productVariant';
import { AxiosError } from 'axios';
import { Upload, message, Modal } from 'antd';
import type { UploadFile, UploadProps, UploadChangeParam } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { postItem } from '../../api/provider';

const AddProduct: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const generateRandomSKU = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = [
        { name: 'Đen', code: '#000000' },
        { name: 'Trắng', code: '#FFFFFF' },
        { name: 'Xanh dương', code: '#0000FF' },
        { name: 'Vàng', code: '#FFFF00' },
        { name: 'Hồng', code: '#FF69B4' },
        { name: 'Đỏ', code: '#FF0000' },
        { name: 'Xám', code: '#808080' },
        { name: 'Be', code: '#F5F5DC' },
        { name: 'Nâu', code: '#8B4513' },
        { name: 'Xanh lá', code: '#008000' },
        { name: 'Cam', code: '#FFA500' },
        { name: 'Tím', code: '#800080' },
    ];

    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [sku] = useState<string>(generateRandomSKU());
    const [categoryId, setCategoryId] = useState<string>('');
    const [categoryAncestors, setCategoryAncestors] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [hexColor, setHexColor] = useState<string>('#000000');
    const [colorName, setColorName] = useState<string>('');
    const [productColors, setProductColors] = useState<IColor[]>([]);
    const [sizeStocks, setSizeStocks] = useState<{ [key: string]: number }>(
        sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
    );
    const [fileList, setFileList] = useState<{
        main: UploadFile[];
        hover: UploadFile[];
        product: UploadFile[];
    }>({
        main: [],
        hover: [],
        product: [],
    });
    const [shortDescription, setShortDescription] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    interface ErrorResponse {
        errors?: string[];
    }

    const mutation = useMutation<IProduct, Error, FormData>({
        mutationFn: (formData: FormData) =>
            postItem({ namespace: 'admin/products', values: formData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate('/admin/products');
        },
        onError: error => {
            const axiosError = error as AxiosError;
            const errorData = axiosError.response?.data as { errors?: string[] } | undefined;
            console.error('Lỗi từ server:', errorData);
            if (errorData?.errors) {
                alert('Lỗi validation: ' + errorData.errors.join(', '));
            } else {
                alert('Có lỗi xảy ra khi thêm sản phẩm!');
            }
        },
    });

    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        setSelectedColor(selectedCode);
        setHexColor(selectedCode);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHexColor(e.target.value);
    };

    const handleAddColor = () => {
        if (productColors.length > 0) {
            alert('Chỉ được thêm một màu!');
            return;
        }
        if (colorName && hexColor) {
            const newColor: IColor = {
                baseColor: selectedColor || hexColor,
                actualColor: hexColor,
                colorName,
            };
            setProductColors([newColor]);
            setColorName('');
            console.log('Màu đã thêm:', newColor);
        }
    };

    const handleStockChange = (size: string, value: string) => {
        setSizeStocks(prev => ({
            ...prev,
            [size]: value === '' ? 0 : Number(value),
        }));
    };

    const handleImageChange =
        (type: 'main' | 'hover' | 'product') => (info: UploadChangeParam<UploadFile>) => {
            let newFileList = [...info.fileList];

            // Chỉ cắt xuống 1 ảnh cho main và hover
            if (type !== 'product') {
                newFileList = newFileList.slice(-1);
            }

            newFileList = newFileList.map(file => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });

            setFileList(prev => ({
                ...prev,
                [type]: newFileList,
            }));

            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewOpen(false);

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (productColors.length === 0) {
            alert('Vui lòng thêm ít nhất một màu!');
            return;
        }

        const sizesArray: ISize[] = sizes.map(size => ({
            size: size as 'S' | 'M' | 'L' | 'XL' | 'XXL',
            stock: sizeStocks[size],
        }));

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('sku', sku);
        formData.append('categoryId', categoryId);
        formData.append('categoryAncestors', JSON.stringify(categoryAncestors));
        formData.append('colors', JSON.stringify(productColors));
        formData.append('sizes', JSON.stringify(sizesArray));
        formData.append('shortDescription', shortDescription);
        formData.append('description', description);

        if (fileList.main.length > 0 && fileList.main[0].originFileObj) {
            formData.append('mainImage', fileList.main[0].originFileObj);
        }
        if (fileList.hover.length > 0 && fileList.hover[0].originFileObj) {
            formData.append('hoverImage', fileList.hover[0].originFileObj);
        }
        fileList.product.forEach(file => {
            if (file.originFileObj) {
                formData.append('productImages', file.originFileObj);
            }
        });

        mutation.mutate(formData);
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminMenu className="w-64 bg-black p-6" />
                <main className="flex-1 overflow-auto p-8 bg-white text-black">
                    <div className="flex-1 flex flex-col">
                        <div className="bg-white p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Thêm Sản Phẩm Mới
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Tên sản phẩm
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Giá
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={price}
                                            onChange={e => setPrice(Number(e.target.value))}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <CategorySelector
                                    onChange={(id: string, ancestors: string[]) => {
                                        setCategoryId(id);
                                        setCategoryAncestors(ancestors);
                                    }}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label
                                            htmlFor="colorSelect"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Chọn màu sắc
                                        </label>
                                        <select
                                            id="colorSelect"
                                            value={selectedColor}
                                            onChange={handleColorChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="">Chọn màu</option>
                                            {colors.map(color => (
                                                <option key={color.code} value={color.code}>
                                                    {color.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="colorHex"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Tông màu (Hex)
                                        </label>
                                        <input
                                            type="color"
                                            id="colorHex"
                                            value={hexColor}
                                            onChange={handleHexChange}
                                            className="w-full h-10 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="hexInput"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Mã màu (Hex)
                                        </label>
                                        <input
                                            type="text"
                                            id="hexInput"
                                            value={hexColor}
                                            onChange={handleHexChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="#000000"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="colorName"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Tên màu sắc
                                        </label>
                                        <input
                                            type="text"
                                            id="colorName"
                                            value={colorName}
                                            onChange={e => setColorName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Nhập tên màu"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddColor}
                                            disabled={productColors.length > 0}
                                            className={`mt-2 px-4 py-2 ${
                                                productColors.length > 0
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-black'
                                            } text-white rounded-md`}
                                        >
                                            Thêm màu
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <ul>
                                        {productColors.map(color => (
                                            <li
                                                key={color.colorName}
                                            >{`${color.colorName} (${color.actualColor})`}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Phần còn lại của form giữ nguyên */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kích cỡ & Số lượng tồn kho
                                    </label>
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                {sizes.map(size => (
                                                    <th
                                                        key={size}
                                                        className="border border-gray-300 px-4 py-2 text-center"
                                                    >
                                                        {size}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {sizes.map(size => (
                                                    <td
                                                        key={size}
                                                        className="border border-gray-300 px-4 py-2"
                                                    >
                                                        <input
                                                            type="number"
                                                            value={
                                                                sizeStocks[size] === 0
                                                                    ? ''
                                                                    : sizeStocks[size]
                                                            }
                                                            onChange={e =>
                                                                handleStockChange(
                                                                    size,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="0"
                                                            className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="grid grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_3fr] gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ảnh chính
                                        </label>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList.main}
                                            onChange={handleImageChange('main')}
                                            onPreview={handlePreview}
                                            maxCount={1}
                                            beforeUpload={() => false}
                                        >
                                            {fileList.main.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ảnh hover
                                        </label>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList.hover}
                                            onChange={handleImageChange('hover')}
                                            onPreview={handlePreview}
                                            maxCount={1}
                                            beforeUpload={() => false}
                                        >
                                            {fileList.hover.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ảnh sản phẩm (nhiều ảnh)
                                        </label>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList.product}
                                            onChange={handleImageChange('product')}
                                            onPreview={handlePreview}
                                            multiple
                                            beforeUpload={() => false}
                                        >
                                            {fileList.product.length >= 8 ? null : uploadButton}
                                        </Upload>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="shortDescription"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Mô tả ngắn
                                    </label>
                                    <textarea
                                        id="shortDescription"
                                        value={shortDescription}
                                        onChange={e => setShortDescription(e.target.value)}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Chi tiết sản phẩm
                                    </label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={6}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow-sm transition-colors"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-md shadow-sm transition-colors"
                                    >
                                        {mutation.isPending ? 'Đang thêm...' : 'Thêm sản phẩm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                        width={800}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </main>
            </div>
            <AdminFooter />
        </div>
    );
};

export default AddProduct;
